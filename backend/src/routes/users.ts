import { Hono } from 'hono';
import { supabase } from '../lib/supabase';

const app = new Hono();

// Get user by ID
app.get('/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!data) return c.json({ error: 'User not found' }, 404);

    return c.json({ user: data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Create new user (from signup)
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('users')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return c.json({ user: data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Update user profile
app.put('/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('users')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return c.json({ user: data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get user by email
app.get('/email/:email', async (c) => {
  try {
    const email = c.req.param('email');
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;

    return c.json({ user: data || null });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
