import { Hono } from 'hono';
import { supabase } from '../lib/supabase';

const app = new Hono();

// Get all lessons
app.get('/', async (c) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    return c.json({ lessons: data || [] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get lesson by ID
app.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return c.json({ error: 'Lesson not found' }, 404);

    return c.json({ lesson: data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get lessons by category
app.get('/category/:category', async (c) => {
  try {
    const category = c.req.param('category');
    
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('category', category)
      .order('id', { ascending: true });

    if (error) throw error;

    return c.json({ lessons: data || [] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get lessons by module
app.get('/module/:module', async (c) => {
  try {
    const module = c.req.param('module');
    
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('module', module)
      .order('id', { ascending: true });

    if (error) throw error;

    return c.json({ lessons: data || [] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Create new lesson (admin only - add auth middleware later)
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('lessons')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return c.json({ lesson: data }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Update lesson (admin only - add auth middleware later)
app.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    
    const { data, error } = await supabase
      .from('lessons')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return c.json({ lesson: data });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
