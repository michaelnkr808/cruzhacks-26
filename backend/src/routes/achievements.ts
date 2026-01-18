import { Hono } from 'hono';
import { supabase } from '../supabase';
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Metaplex, keypairIdentity, irysStorage } from '@metaplex-foundation/js';

const app = new Hono();

// Achievement definitions with Solana NFT metadata
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
  nftMetadata: {
    name: string;
    symbol: string;
    description: string;
    image: string; // IPFS or Arweave URI
    attributes: Array<{ trait_type: string; value: string | number }>;
  };
  solanaReward?: number; // Optional SOL reward in lamports
}

// All available achievements
export const achievements: Achievement[] = [
  // Learning Achievements
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '★',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 1 },
    nftMetadata: {
      name: 'First Steps Badge',
      symbol: 'EMBFIRST',
      description: 'Awarded for completing your first embedded programming lesson on EmbedPath',
      image: 'https://arweave.net/embedpath-first-steps-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Learning' },
        { trait_type: 'Rarity', value: 'Common' },
        { trait_type: 'Lessons Required', value: 1 }
      ]
    }
  },
  {
    id: 'getting-warmed-up',
    name: 'Getting Warmed Up',
    description: 'Complete 5 lessons',
    icon: '◆',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 5 },
    nftMetadata: {
      name: 'Getting Warmed Up Badge',
      symbol: 'EMBWARM',
      description: 'Awarded for completing 5 embedded programming lessons',
      image: 'https://arweave.net/embedpath-warmed-up-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Learning' },
        { trait_type: 'Rarity', value: 'Common' },
        { trait_type: 'Lessons Required', value: 5 }
      ]
    }
  },
  {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Complete 10 lessons',
    icon: '◈',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 10 },
    nftMetadata: {
      name: 'Dedicated Learner Badge',
      symbol: 'EMBDED',
      description: 'Awarded for completing 10 embedded programming lessons',
      image: 'https://arweave.net/embedpath-dedicated-learner-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Learning' },
        { trait_type: 'Rarity', value: 'Uncommon' },
        { trait_type: 'Lessons Required', value: 10 }
      ]
    }
  },
  {
    id: 'lesson-master',
    name: 'Lesson Master',
    description: 'Complete 25 lessons',
    icon: '▲',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 25 },
    nftMetadata: {
      name: 'Lesson Master Badge',
      symbol: 'EMBMAST',
      description: 'Awarded for completing 25 embedded programming lessons',
      image: 'https://arweave.net/embedpath-lesson-master-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Learning' },
        { trait_type: 'Rarity', value: 'Rare' },
        { trait_type: 'Lessons Required', value: 25 }
      ]
    }
  },
  {
    id: 'embedded-expert',
    name: 'Embedded Expert',
    description: 'Complete all 32 lessons',
    icon: '◉',
    category: 'mastery',
    requirement: { type: 'lessons_completed', value: 32 },
    nftMetadata: {
      name: 'Embedded Expert Badge',
      symbol: 'EMBEXP',
      description: 'Awarded for completing all 32 embedded programming lessons - True mastery!',
      image: 'https://arweave.net/embedpath-embedded-expert-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Mastery' },
        { trait_type: 'Rarity', value: 'Legendary' },
        { trait_type: 'Lessons Required', value: 32 }
      ]
    },
    solanaReward: 10000000 // 0.01 SOL
  },

  // Path Completion Achievements
  {
    id: 'getting-started-complete',
    name: 'Journey Begins',
    description: 'Complete the Getting Started path',
    icon: '★',
    category: 'mastery',
    requirement: { type: 'path_completed', value: 1, pathId: 'getting-started' },
    nftMetadata: {
      name: 'Journey Begins Badge',
      symbol: 'EMBSTART',
      description: 'Awarded for completing the Getting Started learning path',
      image: 'https://arweave.net/embedpath-journey-begins-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Path Completion' },
        { trait_type: 'Rarity', value: 'Uncommon' },
        { trait_type: 'Path', value: 'Getting Started' }
      ]
    }
  },
  {
    id: 'ifmagic-complete',
    name: 'IF MAGIC Master',
    description: 'Complete the IF MAGIC path',
    icon: '◆',
    category: 'mastery',
    requirement: { type: 'path_completed', value: 1, pathId: 'ifmagic' },
    nftMetadata: {
      name: 'IF MAGIC Master Badge',
      symbol: 'EMBMAGIC',
      description: 'Awarded for completing the IF MAGIC learning path',
      image: 'https://arweave.net/embedpath-ifmagic-master-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Path Completion' },
        { trait_type: 'Rarity', value: 'Rare' },
        { trait_type: 'Path', value: 'IF MAGIC' }
      ]
    },
    solanaReward: 5000000 // 0.005 SOL
  },

  // Quiz Achievements
  {
    id: 'quiz-rookie',
    name: 'Quiz Rookie',
    description: 'Pass your first quiz',
    icon: '▣',
    category: 'learning',
    requirement: { type: 'quizzes_passed', value: 1 },
    nftMetadata: {
      name: 'Quiz Rookie Badge',
      symbol: 'EMBQROOK',
      description: 'Awarded for passing your first quiz',
      image: 'https://arweave.net/embedpath-quiz-rookie-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Quiz' },
        { trait_type: 'Rarity', value: 'Common' },
        { trait_type: 'Quizzes Required', value: 1 }
      ]
    }
  },
  {
    id: 'quiz-pro',
    name: 'Quiz Pro',
    description: 'Pass 10 quizzes',
    icon: '▣',
    category: 'learning',
    requirement: { type: 'quizzes_passed', value: 10 },
    nftMetadata: {
      name: 'Quiz Pro Badge',
      symbol: 'EMBQPRO',
      description: 'Awarded for passing 10 quizzes',
      image: 'https://arweave.net/embedpath-quiz-pro-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Quiz' },
        { trait_type: 'Rarity', value: 'Uncommon' },
        { trait_type: 'Quizzes Required', value: 10 }
      ]
    }
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Get 100% on a quiz',
    icon: '★',
    category: 'mastery',
    requirement: { type: 'perfect_quiz', value: 1 },
    nftMetadata: {
      name: 'Perfect Score Badge',
      symbol: 'EMBPERF',
      description: 'Awarded for achieving a perfect 100% score on a quiz',
      image: 'https://arweave.net/embedpath-perfect-score-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Mastery' },
        { trait_type: 'Rarity', value: 'Rare' },
        { trait_type: 'Score Required', value: '100%' }
      ]
    }
  },
  {
    id: 'flawless',
    name: 'Flawless',
    description: 'Get 5 perfect quiz scores',
    icon: '◉',
    category: 'mastery',
    requirement: { type: 'perfect_quiz', value: 5 },
    nftMetadata: {
      name: 'Flawless Badge',
      symbol: 'EMBFLAW',
      description: 'Awarded for achieving 5 perfect quiz scores',
      image: 'https://arweave.net/embedpath-flawless-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Mastery' },
        { trait_type: 'Rarity', value: 'Epic' },
        { trait_type: 'Perfect Scores Required', value: 5 }
      ]
    },
    solanaReward: 5000000 // 0.005 SOL
  },

  // Engagement Achievements
  {
    id: 'note-taker',
    name: 'Note Taker',
    description: 'Write notes in 5 lessons',
    icon: '◈',
    category: 'engagement',
    requirement: { type: 'notes_written', value: 5 },
    nftMetadata: {
      name: 'Note Taker Badge',
      symbol: 'EMBNOTE',
      description: 'Awarded for taking notes in 5 different lessons',
      image: 'https://arweave.net/embedpath-note-taker-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Engagement' },
        { trait_type: 'Rarity', value: 'Common' },
        { trait_type: 'Notes Required', value: 5 }
      ]
    }
  },
  {
    id: 'diligent-note-taker',
    name: 'Diligent Note Taker',
    description: 'Write notes in 15 lessons',
    icon: '◈',
    category: 'engagement',
    requirement: { type: 'notes_written', value: 15 },
    nftMetadata: {
      name: 'Diligent Note Taker Badge',
      symbol: 'EMBDNOTE',
      description: 'Awarded for taking notes in 15 different lessons',
      image: 'https://arweave.net/embedpath-diligent-note-taker-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Engagement' },
        { trait_type: 'Rarity', value: 'Uncommon' },
        { trait_type: 'Notes Required', value: 15 }
      ]
    }
  },
  {
    id: 'on-fire',
    name: 'On Fire!',
    description: 'Maintain a 7-day learning streak',
    icon: '▲',
    category: 'engagement',
    requirement: { type: 'streak_days', value: 7 },
    nftMetadata: {
      name: 'On Fire Badge',
      symbol: 'EMBFIRE',
      description: 'Awarded for maintaining a 7-day learning streak',
      image: 'https://arweave.net/embedpath-on-fire-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Streak' },
        { trait_type: 'Rarity', value: 'Uncommon' },
        { trait_type: 'Days Required', value: 7 }
      ]
    }
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintain a 30-day learning streak',
    icon: '◉',
    category: 'engagement',
    requirement: { type: 'streak_days', value: 30 },
    nftMetadata: {
      name: 'Unstoppable Badge',
      symbol: 'EMBUNSTOP',
      description: 'Awarded for maintaining a 30-day learning streak',
      image: 'https://arweave.net/embedpath-unstoppable-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Streak' },
        { trait_type: 'Rarity', value: 'Epic' },
        { trait_type: 'Days Required', value: 30 }
      ]
    },
    solanaReward: 10000000 // 0.01 SOL
  },

  // Special Achievements
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Join during CruzHacks 2026',
    icon: '★',
    category: 'special',
    requirement: { type: 'first_action', value: 1 },
    nftMetadata: {
      name: 'Early Adopter Badge',
      symbol: 'EMBEARLY',
      description: 'Special badge for early adopters who joined during CruzHacks 2026',
      image: 'https://arweave.net/embedpath-early-adopter-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Special' },
        { trait_type: 'Rarity', value: 'Legendary' },
        { trait_type: 'Event', value: 'CruzHacks 2026' }
      ]
    }
  },
  {
    id: 'hardware-hero',
    name: 'Hardware Hero',
    description: 'Connect IF MAGIC hardware for the first time',
    icon: '◆',
    category: 'special',
    requirement: { type: 'first_action', value: 1 },
    nftMetadata: {
      name: 'Hardware Hero Badge',
      symbol: 'EMBHW',
      description: 'Awarded for connecting IF MAGIC hardware',
      image: 'https://arweave.net/embedpath-hardware-hero-badge',
      attributes: [
        { trait_type: 'Achievement Type', value: 'Special' },
        { trait_type: 'Rarity', value: 'Rare' },
        { trait_type: 'Hardware', value: 'IF MAGIC' }
      ]
    }
  }
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
      earnedAt: data?.find(a => a.achievement_id === achievement.id)?.earned_at,
      nftMinted: data?.find(a => a.achievement_id === achievement.id)?.nft_minted,
      nftAddress: data?.find(a => a.achievement_id === achievement.id)?.nft_address
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
    
    // Get user's current progress
    const progressRes = await fetch(`http://localhost:3000/api/achievements/progress/${userId}`);
    const progressData = await progressRes.json() as { progress: {
      lessons_completed: number;
      quizzes_passed: number;
      perfect_quizzes: number;
      notes_written: number;
      streak_days: number;
    }};
    const progress = progressData.progress;
    
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
        // Path completion requires special handling
        case 'path_completed':
          // TODO: Check if all lessons in path are completed
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

// Mint NFT for earned achievement
app.post('/mint-nft', async (c) => {
  try {
    const body = await c.req.json();
    const { user_id, achievement_id, wallet_address } = body;
    
    // Validate wallet address
    let walletPubkey: PublicKey;
    try {
      walletPubkey = new PublicKey(wallet_address);
    } catch {
      return c.json({ error: 'Invalid Solana wallet address' }, 400);
    }
    
    // Check if achievement is earned
    const { data: userAchievement, error: fetchError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user_id)
      .eq('achievement_id', achievement_id)
      .single();
    
    if (fetchError || !userAchievement) {
      return c.json({ error: 'Achievement not earned yet' }, 400);
    }
    
    if (userAchievement.nft_minted) {
      return c.json({ 
        error: 'NFT already minted for this achievement',
        nftAddress: userAchievement.nft_address 
      }, 400);
    }
    
    // Get achievement details
    const achievement = achievements.find(a => a.id === achievement_id);
    if (!achievement) {
      return c.json({ error: 'Achievement not found' }, 404);
    }
    
    // Connect to Solana devnet (use mainnet for production)
    const connection = new Connection(
      process.env.SOLANA_RPC_URL || clusterApiUrl('devnet'),
      'confirmed'
    );
    
    // Load the minting keypair (store securely in production!)
    const mintingKeypair = process.env.SOLANA_MINTING_KEYPAIR 
      ? Keypair.fromSecretKey(
          Uint8Array.from(JSON.parse(process.env.SOLANA_MINTING_KEYPAIR))
        )
      : Keypair.generate(); // For demo, generate ephemeral
    
    // Initialize Metaplex
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(mintingKeypair))
      .use(irysStorage({
        address: 'https://devnet.irys.xyz',
        providerUrl: clusterApiUrl('devnet'),
        timeout: 60000,
      }));
    
    // Upload metadata to Arweave via Irys
    const { uri } = await metaplex.nfts().uploadMetadata({
      name: achievement.nftMetadata.name,
      symbol: achievement.nftMetadata.symbol,
      description: achievement.nftMetadata.description,
      image: achievement.nftMetadata.image,
      attributes: achievement.nftMetadata.attributes.map(attr => ({
        trait_type: attr.trait_type,
        value: String(attr.value),
      })),
      properties: {
        category: 'image',
        creators: [{ address: mintingKeypair.publicKey.toBase58(), share: 100 }]
      }
    });
    
    // Mint the NFT to user's wallet
    const { nft } = await metaplex.nfts().create({
      uri,
      name: achievement.nftMetadata.name,
      symbol: achievement.nftMetadata.symbol,
      sellerFeeBasisPoints: 0, // No royalties
      tokenOwner: walletPubkey,
    });
    
    // Update database with NFT info
    const { error: updateError } = await supabase
      .from('user_achievements')
      .update({
        nft_minted: true,
        nft_address: nft.address.toBase58(),
        wallet_address: wallet_address,
        minted_at: new Date().toISOString()
      })
      .eq('user_id', user_id)
      .eq('achievement_id', achievement_id);
    
    if (updateError) throw updateError;
    
    return c.json({
      success: true,
      message: `NFT minted successfully!`,
      nft: {
        address: nft.address.toBase58(),
        name: achievement.nftMetadata.name,
        uri
      }
    });
  } catch (error: any) {
    console.error('NFT minting error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get user's Solana wallet (if connected)
app.get('/wallet/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const { data, error } = await supabase
      .from('users')
      .select('wallet_address')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return c.json({ walletAddress: data?.wallet_address || null });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Connect/update user's Solana wallet
app.post('/wallet', async (c) => {
  try {
    const body = await c.req.json();
    const { user_id, wallet_address } = body;
    
    // Validate wallet address
    try {
      new PublicKey(wallet_address);
    } catch {
      return c.json({ error: 'Invalid Solana wallet address' }, 400);
    }
    
    const { data, error } = await supabase
      .from('users')
      .update({ wallet_address })
      .eq('id', user_id)
      .select()
      .single();
    
    if (error) throw error;
    
    return c.json({ 
      success: true, 
      message: 'Wallet connected successfully',
      walletAddress: data.wallet_address 
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
