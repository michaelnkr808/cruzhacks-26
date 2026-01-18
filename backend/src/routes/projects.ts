import { Hono } from 'hono';
import { supabase } from '../lib/supabase';

const app = new Hono();

// Get all projects for current user (uses userId from auth middleware)
app.get('/', async (c) => {
  try {
    const userId = c.req.header('x-user-id') || (c as any).get('userId');
    
    if (!userId) {
      return c.json({ projects: [] });
    }
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return c.json({ projects: data || [] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get all projects for a user
app.get('/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return c.json({ projects: data || [] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get project by ID
app.get('/:projectId', async (c) => {
  try {
    const projectId = c.req.param('projectId');
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    if (!data) return c.json({ error: 'Project not found' }, 404);

    return c.json({ project: data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Create new project
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('projects')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return c.json({ project: data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Update project
app.put('/:projectId', async (c) => {
  try {
    const projectId = c.req.param('projectId');
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;

    return c.json({ project: data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Delete project
app.delete('/:projectId', async (c) => {
  try {
    const projectId = c.req.param('projectId');
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;

    return c.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
