import { Hono } from 'hono';
import { supabase } from '../lib/supabase';

const app = new Hono();

// Get all notes for a user
app.get('/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const { data, error } = await supabase
      .from('notes')
      .select('*, lessons(*)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return c.json({ notes: data || [] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get notes for specific lesson
app.get('/user/:userId/lesson/:lessonId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const lessonId = parseInt(c.req.param('lessonId'));
    
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    if (error) throw error;

    return c.json({ note: data || null });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Create or update notes
app.post('/save', async (c) => {
  try {
    const body = await c.req.json();
    const { user_id, lesson_id, content } = body;

    // Check if note already exists
    const { data: existing } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user_id)
      .eq('lesson_id', lesson_id)
      .maybeSingle();

    if (existing) {
      // Update existing note
      const { data, error } = await supabase
        .from('notes')
        .update({ 
          content, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return c.json({ note: data });
    } else {
      // Create new note
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          user_id,
          lesson_id,
          content
        }])
        .select()
        .single();

      if (error) throw error;
      return c.json({ note: data }, 201);
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Delete note
app.delete('/:noteId', async (c) => {
  try {
    const noteId = c.req.param('noteId');
    
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) throw error;

    return c.json({ message: 'Note deleted successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
