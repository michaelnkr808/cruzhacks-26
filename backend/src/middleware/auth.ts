import { Context, Next } from 'hono';
import { jwtVerify, importJWK } from 'jose';

interface JWTPayload {
  sub: string;
  email?: string;
  exp: number;
  iat: number;
}

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Authorization header required' }, 401);
    }

    const token = authHeader.split(' ')[1];
    
    // Try to decode our simple base64 token (from signup/login)
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      if (decoded.userId && decoded.email) {
        c.set('userId', decoded.userId);
        c.set('email', decoded.email);
        await next();
        return;
      }
    } catch {
      // Not a base64 token, continue to JWT verification
    }

    // JWT verification using Auth0's JWKS
    const jwksUrl = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`;
    const jwksResponse = await fetch(jwksUrl);
    const jwks = await jwksResponse.json() as { keys: Array<{ kid: string; [key: string]: any }> };
    
    // Get the key ID from token header
    const tokenHeader = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
    const key = jwks.keys.find((k) => k.kid === tokenHeader.kid);
    
    if (!key) {
      return c.json({ error: 'Invalid token signature' }, 401);
    }

    const publicKey = await importJWK(key);
    const { payload } = await jwtVerify(token, publicKey);
    
    c.set('userId', (payload as JWTPayload).sub);
    await next();
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
};