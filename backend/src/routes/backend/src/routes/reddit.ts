import { Router } from 'express';
import { supabase } from '../lib/supabase'; // Using existing supabase client

const router = Router();

// GET /api/reddit - Fetches filtered help posts
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('reddit_posts') 
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

export default router;