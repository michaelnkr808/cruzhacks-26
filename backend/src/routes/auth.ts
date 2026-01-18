import { Hono } from 'hono';
import { supabase } from '../lib/supabase';
import { auth0Authentication } from '../lib/auth0';

const app = new Hono();

// OTP Request - send OTP to email via Auth0
app.post('/otp/request', async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    // call Auth0's passwordless API to send OTP
    const sendResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/passwordless/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        connection: 'email',
        email,
        send: 'code',
      }),
    });

    if (!sendResponse.ok) {
      throw new Error('Failed to send OTP');
    }

    console.log(`[AUTH0 OTP] Sent OTP to ${email}`);

    return c.json({
      success: true,
      message: 'OTP sent to email',
    }, 200);
  } catch (error: any) {
    console.error('OTP request error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// OTP Verify - Verify OTP with Auth0 and create/manage user in Supabase
app.post('/otp/verify', async (c) => {
  try {
    const body = await c.req.json();
    const { email, otp, name, level } = body;

    if (!email || !otp) {
      return c.json({ error: 'Email and OTP are required' }, 400);
    }

    // Verify OTP with Auth0's passwordless API
    const verifyResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'passwordless/otp',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        username: email,
        otp,
        realm: 'email',
        scope: 'openid profile email',
        audience: process.env.AUTH0_AUDIENCE || `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      }),
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      throw new Error(errorData.error_description || 'OTP verification failed');
    }

    const tokenResponse = await verifyResponse.json();

    console.log(`[AUTH0 OTP] Verified OTP for ${email}`);

    // Get user info from Auth0 (decode access_token to get user ID)
    const accessToken = tokenResponse.access_token;

    // Decode the access_token to get user ID (sub claim)
    const decoded = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString());
    const auth0UserId = decoded.sub;

    // Check if user already exists in Supabase Auth
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.user_metadata?.auth0_id === auth0UserId || u.email === email);

    if (existingUser) {
      // User exists, return their info with Auth0 token
      return c.json({ 
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.user_metadata?.name || name,
          level: existingUser.user_metadata?.level || level || 'beginner'
        }, 
        token: accessToken,
        message: 'Login successful' 
      }, 200);
    }

    // Create user in Supabase Auth with Auth0 ID
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true, 
      user_metadata: {
        name,
        level: level || 'beginner',
        auth0_id: auth0UserId
      }
    });

    if (authError) {
      console.error('Supabase Auth user creation error:', authError);
      throw authError;
    }

    console.log('User created successfully in Supabase Auth:', authData.user);

    return c.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name,
        level: authData.user.user_metadata?.level
      },
      token: accessToken,
      message: 'OTP verified successfully'
    }, 201);
  } catch (error: any) {
    console.error('OTP verify error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Signup with password - Create user with password in Supabase Auth
app.post('/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, level } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400);
    }

    // Check if user already exists in Supabase Auth
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);

    if (existingUser) {
      return c.json({ error: 'An account with this email already exists' }, 409);
    }

    // Create user in Supabase Auth with password
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for now
      user_metadata: {
        name,
        level: level || 'beginner'
      }
    });

    if (authError) {
      console.error('Supabase Auth user creation error:', authError);
      throw authError;
    }

    console.log('User created successfully in Supabase Auth:', authData.user);

    // Generate session token
    const token = Buffer.from(JSON.stringify({ userId: authData.user.id, email })).toString('base64');

    return c.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name,
        level: authData.user.user_metadata?.level
      },
      token,
      message: 'Account created successfully'
    }, 201);
  } catch (error: any) {
    console.error('Signup error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Login Request - Verify password and send OTP for 2FA
app.post('/login/request', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Verify password with Supabase Auth
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      console.error('Password verification error:', signInError);
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Password verified! Now send OTP for 2FA
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[2FA OTP] Sending verification code ${otp} to ${email}`);

    // In production, send OTP via email service
    // For now, just log it

    return c.json({
      success: true,
      message: 'Verification code sent to email',
    }, 200);
  } catch (error: any) {
    console.error('Login request error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Login OTP Verify - Verify OTP and return user data
app.post('/login/verify', async (c) => {
  try {
    const body = await c.req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return c.json({ error: 'Email and OTP are required' }, 400);
    }

    // In production, verify OTP with Auth0
    console.log(`[AUTH0 OTP] Verifying login OTP ${otp} for ${email}`);

    // Find user in Supabase Auth
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const user = existingUsers?.users?.find(u => u.email === email);

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Generate session token
    const token = Buffer.from(JSON.stringify({ userId: user.id, email })).toString('base64');

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || 'User',
        level: user.user_metadata?.level || 'beginner',
        created_at: user.created_at
      },
      token
    }, 200);
  } catch (error: any) {
    console.error('Login OTP verify error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Legacy Login endpoint - OTP based (deprecated)
app.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return c.json({ error: 'Email and OTP are required' }, 400);
    }

    // Verify OTP with Auth0
    console.log(`[AUTH0 OTP] Verifying login OTP for ${email}`);

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return c.json({ error: 'User not found' }, 401);
    }

    // Generate session token
    const token = Buffer.from(JSON.stringify({ userId: user.id, email })).toString('base64');

    return c.json({ user, token }, 200);
  } catch (error: any) {
    console.error('Login error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/send-otp', async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    // Check if user exists in our database
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    // Demo mode - in production, integrate with Auth0 passwordless
    console.log(`[DEMO] Would send OTP to: ${email}`);
    
    return c.json({ 
      success: true,
      isNewUser: !existingUser,
      message: 'OTP sent successfully (demo mode)'
    }, 200);
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return c.json({ error: error.message || 'Failed to send OTP' }, 500);
  }
});

// Verify OTP endpoint
app.post('/verify-otp', async (c) => {
  try {
    const body = await c.req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return c.json({ error: 'Email and OTP are required' }, 400);
    }

    // Demo mode - in production, verify with Auth0 passwordless
    console.log(`[DEMO] Verifying OTP for: ${email}, code: ${otp}`);

    // For demo purposes, accept any 6-digit OTP
    if (otp.length !== 6) {
      return c.json({ error: 'Invalid OTP format' }, 400);
    }

    // Generate a mock Auth0 user ID for demo purposes
    const mockAuth0Id = `auth0|${Date.now()}`;
    
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    let user;
    if (existingUser) {
      user = existingUser;
    } else {
      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email,
          name: email.split('@')[0], // Default name from email
          level: 'beginner',
          auth0_id: mockAuth0Id,
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }
      user = data;
    }

    // Generate mock JWT token (in production, use Auth0's real tokens)
    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI${mockAuth0Id}In0.${Buffer.from('mock-signature').toString('base64')}`;

    return c.json({
      user,
      token: mockToken,
      expiresIn: 3600, // 1 hour
      message: 'Login successful (demo mode)'
    }, 200);
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return c.json({ error: error.message || 'Failed to verify OTP' }, 500);
  }
});

export default app;
