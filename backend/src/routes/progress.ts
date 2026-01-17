import { Hono } from 'hono';
import { supabase } from '../lib/supabase';

const app = new Hono();

// Get user progress
app.get('/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const { data, error } = await supabase
      .from('progress')
      .select('*, lessons(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return c.json({ progress: data || [] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get progress for specific lesson
app.get('/user/:userId/lesson/:lessonId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const lessonId = parseInt(c.req.param('lessonId'));
    
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    if (error) throw error;

    return c.json({ progress: data || null });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Mark lesson as complete
app.post('/complete', async (c) => {
  try {
    const body = await c.req.json();
    const { user_id, lesson_id } = body;

    // Check if progress already exists
    const { data: existing } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', user_id)
      .eq('lesson_id', lesson_id)
      .maybeSingle();

    if (existing) {
      // Update existing progress
      const { data, error } = await supabase
        .from('progress')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return c.json({ progress: data });
    } else {
      // Create new progress
      const { data, error } = await supabase
        .from('progress')
        .insert([{
          user_id,
          lesson_id,
          completed: true,
          completed_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return c.json({ progress: data }, 201);
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get user stats
app.get('/stats/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // Get total completed lessons
    const { count: completedCount, error: completedError } = await supabase
      .from('progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true);

    if (completedError) throw completedError;

    // Get total lessons
    const { count: totalCount, error: totalError } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    return c.json({
      stats: {
        completed: completedCount || 0,
        total: totalCount || 0,
        percentage: totalCount ? Math.round(((completedCount || 0) / totalCount) * 100) : 0
      }
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
