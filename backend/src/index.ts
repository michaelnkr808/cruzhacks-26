import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { authMiddleware } from './middleware/auth';

// Import routes
import authRoutes from './routes/auth';
import lessonsRoutes from './routes/lessons';
import progressRoutes from './routes/progress';
import notesRoutes from './routes/notes';
import usersRoutes from './routes/users';
import projectsRoutes from './routes/projects';
import quizRoutes from './routes/quiz';

// Create Hono app
const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/', (c) => {
  return c.json({
    message: 'EmbedPath API is running! 🚀',
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.route('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/progress/*', authMiddleware);
app.use('/api/notes/*', authMiddleware);
app.use('/api/users/*', authMiddleware);
app.use('/api/projects/*', authMiddleware);

// Some lessons might be public, others protected
app.use('/api/lessons/protected/*', authMiddleware);

app.route('/api/lessons', lessonsRoutes);
app.route('/api/progress', progressRoutes);
app.route('/api/notes', notesRoutes);
app.route('/api/users', usersRoutes);
app.route('/api/projects', projectsRoutes);
app.route('/api/quiz', quizRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(`Error: ${err.message}`);
  return c.json({
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  }, 500);
});

// Start server
const port = parseInt(process.env.PORT || '3000');
console.log(`🚀 Server starting on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
