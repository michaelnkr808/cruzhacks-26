import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';

// Import routes - relative imports within src folder
import authRoutes from './routes/auth';
import lessonsRoutes from './routes/lessons';
import progressRoutes from './routes/progress';
import notesRoutes from './routes/notes';
import usersRoutes from './routes/users';
import projectsRoutes from './routes/projects';
import quizRoutes from './routes/quiz';
import achievementsRoutes from './routes/achievements';
import { authMiddleware } from './middleware/auth';

// Create Hono app for Vercel
const app = new Hono().basePath('/');

// Middleware
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
app.use('/api/achievements/*', authMiddleware);

// Some lessons might be public, others protected
app.use('/api/lessons/protected/*', authMiddleware);

app.route('/api/lessons', lessonsRoutes);
app.route('/api/progress', progressRoutes);
app.route('/api/notes', notesRoutes);
app.route('/api/users', usersRoutes);
app.route('/api/projects', projectsRoutes);
app.route('/api/quiz', quizRoutes);
app.route('/api/achievements', achievementsRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(`Error: ${err.message}`);
  return c.json({
    error: err.message,
  }, 500);
});

// Export for Vercel
export default handle(app);
