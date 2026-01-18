-- Users table (Auth0 handles authentication and passwords)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth0_id TEXT UNIQUE NOT NULL, -- Auth0 user ID
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  avatar_url TEXT,
  wallet_address TEXT, -- Solana wallet address for NFT achievements
  learning_streak INTEGER DEFAULT 0, -- Consecutive days of learning
  last_activity_date DATE, -- For streak calculation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table (your curriculum content)
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
  description TEXT,
  video_url TEXT,
  content TEXT, -- Lesson text/instructions
  order_index INTEGER NOT NULL, -- For sequencing lessons
  path TEXT CHECK (path IN ('getting-started', 'ifmagic', 'esp32', 'arduino', 'raspberrypi', 'stm32')) DEFAULT 'ifmagic',
  category TEXT CHECK (category IN ('getting-started', 'foundation', 'sensor', 'output', 'advanced')) DEFAULT 'foundation',
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_time INTEGER, -- Minutes to complete
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  lesson_slug TEXT, -- Store slug for easier frontend sync
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  quiz_passed BOOLEAN DEFAULT FALSE,
  quiz_score INTEGER, -- Percentage score
  time_spent INTEGER, -- Seconds spent on lesson
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id) -- One progress record per user per lesson
);

-- Quiz results tracking
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  lesson_slug TEXT NOT NULL,
  score INTEGER NOT NULL, -- Percentage (0-100)
  passed BOOLEAN DEFAULT FALSE,
  questions_count INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements tracking
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL, -- Maps to achievement definitions in code
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nft_minted BOOLEAN DEFAULT FALSE,
  nft_address TEXT, -- Solana NFT address if minted
  wallet_address TEXT, -- Wallet that received the NFT
  minted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, achievement_id) -- One achievement per user
);

-- Notes (Opennote integration data)
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  lesson_slug TEXT, -- For easier frontend sync
  content TEXT,
  character_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX idx_user_progress_slug ON user_progress(lesson_slug);
CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_lesson_slug ON quiz_results(lesson_slug);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_lesson_id ON notes(lesson_id);
CREATE INDEX idx_notes_slug ON notes(lesson_slug);