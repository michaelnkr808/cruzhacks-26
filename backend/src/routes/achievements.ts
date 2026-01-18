import { Hono } from 'hono';
import { supabase } from '../supabase';

const app = new Hono();

// Achievement definitions
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'engagement' | 'mastery' | 'special';
  requirement: {
    type: 'lessons_completed' | 'quizzes_passed' | 'notes_written' | 'streak_days' | 'path_completed' | 'perfect_quiz' | 'first_action' | 'total_time';
    value: number;
    pathId?: string; // For path-specific achievements
  };
}

// All available achievements
export const achievements: Achievement[] = [
  // Learning Achievements
  { id: 'first-steps', name: 'First Steps', description: 'Complete your first lesson', icon: '★', category: 'learning', requirement: { type: 'lessons_completed', value: 1 } },
  { id: 'getting-warmed-up', name: 'Getting Warmed Up', description: 'Complete 5 lessons', icon: '◆', category: 'learning', requirement: { type: 'lessons_completed', value: 5 } },
  { id: 'dedicated-learner', name: 'Dedicated Learner', description: 'Complete 10 lessons', icon: '◈', category: 'learning', requirement: { type: 'lessons_completed', value: 10 } },
  { id: 'lesson-master', name: 'Lesson Master', description: 'Complete 25 lessons', icon: '▲', category: 'learning', requirement: { type: 'lessons_completed', value: 25 } },
  { id: 'embedded-expert', name: 'Embedded Expert', description: 'Complete all 32 lessons', icon: '◉', category: 'mastery', requirement: { type: 'lessons_completed', value: 32 } },
  
  // Path Completion Achievements
  { id: 'getting-started-complete', name: 'Journey Begins', description: 'Complete the Getting Started path', icon: '★', category: 'mastery', requirement: { type: 'path_completed', value: 1, pathId: 'getting-started' } },
  { id: 'ifmagic-complete', name: 'IF MAGIC Master', description: 'Complete the IF MAGIC path', icon: '◆', category: 'mastery', requirement: { type: 'path_completed', value: 1, pathId: 'ifmagic' } },
  
  // Quiz Achievements
  { id: 'quiz-rookie', name: 'Quiz Rookie', description: 'Pass your first quiz', icon: '▣', category: 'learning', requirement: { type: 'quizzes_passed', value: 1 } },
  { id: 'quiz-pro', name: 'Quiz Pro', description: 'Pass 10 quizzes', icon: '▣', category: 'learning', requirement: { type: 'quizzes_passed', value: 10 } },
  { id: 'perfect-score', name: 'Perfect Score', description: 'Get 100% on a quiz', icon: '★', category: 'mastery', requirement: { type: 'perfect_quiz', value: 1 } },
  { id: 'flawless', name: 'Flawless', description: 'Get 5 perfect quiz scores', icon: '◉', category: 'mastery', requirement: { type: 'perfect_quiz', value: 5 } },
  
  // Engagement Achievements
  { id: 'note-taker', name: 'Note Taker', description: 'Write notes in 5 lessons', icon: '◈', category: 'engagement', requirement: { type: 'notes_written', value: 5 } },
  { id: 'diligent-note-taker', name: 'Diligent Note Taker', description: 'Write notes in 15 lessons', icon: '◈', category: 'engagement', requirement: { type: 'notes_written', value: 15 } },
  { id: 'on-fire', name: 'On Fire!', description: 'Maintain a 7-day learning streak', icon: '▲', category: 'engagement', requirement: { type: 'streak_days', value: 7 } },
  { id: 'unstoppable', name: 'Unstoppable', description: 'Maintain a 30-day learning streak', icon: '◉', category: 'engagement', requirement: { type: 'streak_days', value: 30 } },
  
  // Special Achievements
  { id: 'early-adopter', name: 'Early Adopter', description: 'Join during CruzHacks 2026', icon: '★', category: 'special', requirement: { type: 'first_action', value: 1 } },
  { id: 'hardware-hero', name: 'Hardware Hero', description: 'Connect IF MAGIC hardware for the first time', icon: '◆', category: 'special', requirement: { type: 'first_action', value: 1 } },
];

// Get all achievements
app.get('/', async (c) => {
  return c.json({ achievements });
});

// Get user's earned achievements
app.get('/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Map earned achievement IDs to full achievement data
    const earnedIds = new Set(data?.map(a => a.achievement_id) || []);
    
    const userAchievements = achievements.map(achievement => ({
      ...achievement,
      earned: earnedIds.has(achievement.id),
      earnedAt: data?.find(a => a.achievement_id === achievement.id)?.earned_at
    }));
    
    return c.json({ achievements: userAchievements });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get user's progress toward achievements
app.get('/progress/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // Get lessons completed count
    const { count: lessonsCount } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true);
    
    // Get quizzes passed count
    const { count: quizzesCount } = await supabase
      .from('quiz_results')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('passed', true);
    
    // Get perfect quizzes count
    const { count: perfectCount } = await supabase
      .from('quiz_results')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('score', 100);
    
    // Get notes count
    const { count: notesCount } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    // Get user streak
    const { data: userData } = await supabase
      .from('users')
      .select('learning_streak')
      .eq('id', userId)
      .single();
    
    return c.json({
      progress: {
        lessons_completed: lessonsCount || 0,
        quizzes_passed: quizzesCount || 0,
        perfect_quizzes: perfectCount || 0,
        notes_written: notesCount || 0,
        streak_days: userData?.learning_streak || 0
      }
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Award achievement to user
app.post('/award', async (c) => {
  try {
    const body = await c.req.json();
    const { user_id, achievement_id } = body;
    
    // Check if achievement exists
    const achievement = achievements.find(a => a.id === achievement_id);
    if (!achievement) {
      return c.json({ error: 'Achievement not found' }, 404);
    }
    
    // Check if already earned
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user_id)
      .eq('achievement_id', achievement_id)
      .maybeSingle();
    
    if (existing) {
      return c.json({ message: 'Achievement already earned', achievement: existing });
    }
    
    // Award the achievement
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id,
        achievement_id,
        earned_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return c.json({ 
      success: true, 
      message: `Achievement "${achievement.name}" unlocked!`,
      achievement: { ...achievement, earned: true, earnedAt: data.earned_at }
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Check and award achievements based on user progress
app.post('/check/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const newlyEarned: Achievement[] = [];
    
    // Get user's current progress directly from database
    const { count: lessonsCount } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true);
    
    const { count: quizzesCount } = await supabase
      .from('quiz_results')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('passed', true);
    
    const { count: perfectCount } = await supabase
      .from('quiz_results')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('score', 100);
    
    const { count: notesCount } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    const { data: userData } = await supabase
      .from('users')
      .select('learning_streak')
      .eq('id', userId)
      .single();
    
    const progress = {
      lessons_completed: lessonsCount || 0,
      quizzes_passed: quizzesCount || 0,
      perfect_quizzes: perfectCount || 0,
      notes_written: notesCount || 0,
      streak_days: userData?.learning_streak || 0
    };
    
    // Get user's current achievements
    const { data: earnedAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);
    
    const earnedIds = new Set(earnedAchievements?.map(a => a.achievement_id) || []);
    
    // Check each achievement
    for (const achievement of achievements) {
      if (earnedIds.has(achievement.id)) continue;
      
      let earned = false;
      
      switch (achievement.requirement.type) {
        case 'lessons_completed':
          earned = progress.lessons_completed >= achievement.requirement.value;
          break;
        case 'quizzes_passed':
          earned = progress.quizzes_passed >= achievement.requirement.value;
          break;
        case 'perfect_quiz':
          earned = progress.perfect_quizzes >= achievement.requirement.value;
          break;
        case 'notes_written':
          earned = progress.notes_written >= achievement.requirement.value;
          break;
        case 'streak_days':
          earned = progress.streak_days >= achievement.requirement.value;
          break;
        case 'path_completed':
          // Path completion handled by frontend
          break;
        case 'first_action':
          // Special achievements handled separately
          break;
      }
      
      if (earned) {
        // Award the achievement
        await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
            earned_at: new Date().toISOString()
          });
        
        newlyEarned.push(achievement);
      }
    }
    
    return c.json({
      success: true,
      newlyEarned,
      message: newlyEarned.length > 0 
        ? `Unlocked ${newlyEarned.length} new achievement(s)!` 
        : 'No new achievements earned'
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
