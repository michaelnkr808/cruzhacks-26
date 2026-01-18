import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompletedLessons, setUserLevel, getIfMagicLessonsByLevel } from '../data/lessonData';
import './Profile.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Achievement interface matching backend
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'engagement' | 'mastery' | 'special';
  earned: boolean;
  earnedAt?: string;
  requirement: {
    type: string;
    value: number;
  };
}

// Local achievement definitions (fallback if API unavailable)
const localAchievements: Achievement[] = [
  { id: 'first-steps', name: 'First Steps', description: 'Complete your first lesson', icon: '★', category: 'learning', earned: false, requirement: { type: 'lessons_completed', value: 1 } },
  { id: 'getting-warmed-up', name: 'Getting Warmed Up', description: 'Complete 5 lessons', icon: '◆', category: 'learning', earned: false, requirement: { type: 'lessons_completed', value: 5 } },
  { id: 'dedicated-learner', name: 'Dedicated Learner', description: 'Complete 10 lessons', icon: '◈', category: 'learning', earned: false, requirement: { type: 'lessons_completed', value: 10 } },
  { id: 'lesson-master', name: 'Lesson Master', description: 'Complete 25 lessons', icon: '▲', category: 'learning', earned: false, requirement: { type: 'lessons_completed', value: 25 } },
  { id: 'embedded-expert', name: 'Embedded Expert', description: 'Complete all 32 lessons', icon: '◉', category: 'mastery', earned: false, requirement: { type: 'lessons_completed', value: 32 } },
  { id: 'quiz-rookie', name: 'Quiz Rookie', description: 'Pass your first quiz', icon: '▣', category: 'learning', earned: false, requirement: { type: 'quizzes_passed', value: 1 } },
  { id: 'quiz-pro', name: 'Quiz Pro', description: 'Pass 10 quizzes', icon: '▣', category: 'learning', earned: false, requirement: { type: 'quizzes_passed', value: 10 } },
  { id: 'perfect-score', name: 'Perfect Score', description: 'Get 100% on a quiz', icon: '★', category: 'mastery', earned: false, requirement: { type: 'perfect_quiz', value: 1 } },
  { id: 'flawless', name: 'Flawless', description: 'Get 5 perfect quiz scores', icon: '◉', category: 'mastery', earned: false, requirement: { type: 'perfect_quiz', value: 5 } },
  { id: 'note-taker', name: 'Note Taker', description: 'Write notes in 5 lessons', icon: '◈', category: 'engagement', earned: false, requirement: { type: 'notes_written', value: 5 } },
  { id: 'diligent-note-taker', name: 'Diligent Note Taker', description: 'Write notes in 15 lessons', icon: '◈', category: 'engagement', earned: false, requirement: { type: 'notes_written', value: 15 } },
  { id: 'on-fire', name: 'On Fire!', description: 'Maintain a 7-day streak', icon: '▲', category: 'engagement', earned: false, requirement: { type: 'streak_days', value: 7 } },
  { id: 'unstoppable', name: 'Unstoppable', description: 'Maintain a 30-day streak', icon: '◉', category: 'engagement', earned: false, requirement: { type: 'streak_days', value: 30 } },
  { id: 'getting-started-complete', name: 'Journey Begins', description: 'Complete the Getting Started path', icon: '★', category: 'mastery', earned: false, requirement: { type: 'path_completed', value: 1 } },
  { id: 'ifmagic-complete', name: 'IF MAGIC Master', description: 'Complete the IF MAGIC path', icon: '◆', category: 'mastery', earned: false, requirement: { type: 'path_completed', value: 1 } },
  { id: 'early-adopter', name: 'Early Adopter', description: 'Join during CruzHacks 2026', icon: '★', category: 'special', earned: false, requirement: { type: 'first_action', value: 1 } },
  { id: 'hardware-hero', name: 'Hardware Hero', description: 'Connect IF MAGIC hardware', icon: '◆', category: 'special', earned: false, requirement: { type: 'first_action', value: 1 } },
];

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>(localAchievements);
  const [completedCount, setCompletedCount] = useState(0);
  const [quizzesPassed, setQuizzesPassed] = useState(0);
  const [perfectQuizzes, setPerfectQuizzes] = useState(0);
  const [showResetModal, setShowResetModal] = useState(false);
  const [gettingStartedComplete, setGettingStartedComplete] = useState(false);
  const [ifmagicComplete, setIfmagicComplete] = useState(false);
  
  // Dev mode - only show progress management when enabled
  // Enable via: URL ?dev=true OR localStorage.setItem('devMode', 'true')
  const [devMode, setDevMode] = useState(false);

  // Check for dev mode on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const devParam = urlParams.get('dev') === 'true';
    const devStorage = localStorage.getItem('devMode') === 'true';
    
    if (devParam) {
      localStorage.setItem('devMode', 'true');
      setDevMode(true);
    } else if (devStorage) {
      setDevMode(true);
    }
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('hardwareHubUser');
    if (!user) {
      navigate('/signup');
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
      
      // Get local progress data
      const completed = getCompletedLessons();
      setCompletedCount(completed.length);
      
      // Count quizzes passed and perfect scores from localStorage
      let passedQuizzes = 0;
      let perfectScores = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.endsWith('-quiz-passed') && localStorage.getItem(key) === 'true') {
          passedQuizzes++;
        }
        if (key?.endsWith('-quiz-perfect') && localStorage.getItem(key) === 'true') {
          perfectScores++;
        }
      }
      setQuizzesPassed(passedQuizzes);
      setPerfectQuizzes(perfectScores);
      
      // Count notes from localStorage for achievements
      let noteCount = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.endsWith('-notes') && localStorage.getItem(key)?.trim()) {
          noteCount++;
        }
      }
      
      // Check if paths are completed
      // Getting started: IDs 0, -1, -2, -3, -4 (5 lessons)
      const gettingStartedIds = [0, -1, -2, -3, -4];
      const gettingStartedLessons = completed.filter((id: number) => gettingStartedIds.includes(id));
      const ifmagicLessons = completed.filter((id: number) => id >= 1 && id <= 27); // IDs 1-27 are IF MAGIC
      const isGettingStartedComplete = gettingStartedLessons.length >= 5;
      const isIfmagicComplete = ifmagicLessons.length >= 27;
      setGettingStartedComplete(isGettingStartedComplete);
      setIfmagicComplete(isIfmagicComplete);
      const pathsCompleted = (isGettingStartedComplete ? 1 : 0) + (isIfmagicComplete ? 1 : 0);
      
      // Check achievements based on local progress
      checkLocalAchievements(completed.length, passedQuizzes, noteCount, perfectScores, pathsCompleted, parsedUser.id);
      
      // Try to fetch from API as well
      fetchAchievements(parsedUser.id);
    } catch (error) {
      console.error('Failed to parse user data:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Check achievements based on local data and persist to backend
  const checkLocalAchievements = async (
    lessons: number, 
    quizzes: number, 
    notes: number, 
    perfectScores: number, 
    pathsCompleted: number,
    userId: string
  ) => {
    const newlyEarned: string[] = [];
    
    setAchievements(prev => prev.map(achievement => {
      let earned = achievement.earned; // Keep existing earned state by default
      
      switch (achievement.requirement.type) {
        case 'lessons_completed':
          earned = lessons >= achievement.requirement.value;
          break;
        case 'quizzes_passed':
          earned = quizzes >= achievement.requirement.value;
          break;
        case 'notes_written':
          earned = notes >= achievement.requirement.value;
          break;
        case 'perfect_quiz':
          earned = perfectScores >= achievement.requirement.value;
          break;
        case 'path_completed':
          // Check specific path achievements
          if (achievement.id === 'getting-started-complete') {
            earned = pathsCompleted >= 1; // At least getting started completed
          } else if (achievement.id === 'ifmagic-complete') {
            earned = pathsCompleted >= 2; // Both paths completed
          }
          break;
        case 'first_action':
          // Early adopter - just being here during CruzHacks counts!
          if (achievement.id === 'early-adopter') {
            earned = true; // Everyone gets this during CruzHacks 2026
          }
          break;
        case 'streak_days':
          // Would need backend to track properly, keep current state
          break;
      }
      
      // Track newly earned achievements
      if (earned && !achievement.earned) {
        newlyEarned.push(achievement.id);
      }
      
      // If newly earned, save timestamp
      const earnedAt = earned && !achievement.earned 
        ? new Date().toISOString() 
        : achievement.earnedAt;
      
      return { ...achievement, earned, earnedAt };
    }));
    
    // Persist newly earned achievements to backend
    if (newlyEarned.length > 0 && userId) {
      const token = localStorage.getItem('authToken');
      for (const achievementId of newlyEarned) {
        try {
          await fetch(`${API_URL}/api/achievements/award`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_id: userId,
              achievement_id: achievementId,
            }),
          });
        } catch (error) {
          console.error(`Failed to persist achievement ${achievementId}:`, error);
        }
      }
    }
  };

  const fetchAchievements = async (userId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/achievements/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.achievements) {
          setAchievements(data.achievements);
        }
      }
    } catch (error) {
      console.log('Using local achievements (API unavailable)');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('hardwareHubUser');
    localStorage.removeItem('authToken');
    navigate('/');
  };

  // Add Getting Started progress
  const addGettingStartedProgress = () => {
    if (!userData?.email) return;
    
    const gettingStartedIds = [0, -1, -2, -3, -4];
    const key = `completedLessons_${userData.email}`;
    const existingCompleted = JSON.parse(localStorage.getItem(key) || '[]');
    const newCompleted = [...new Set([...existingCompleted, ...gettingStartedIds])];
    localStorage.setItem(key, JSON.stringify(newCompleted));
    
    // Update state
    setCompletedCount(newCompleted.length);
    setGettingStartedComplete(true);
    
    // Refresh achievements
    window.location.reload();
  };

  // Remove Getting Started progress
  const removeGettingStartedProgress = () => {
    if (!userData?.email) return;
    
    const gettingStartedIds = [0, -1, -2, -3, -4];
    const key = `completedLessons_${userData.email}`;
    const existingCompleted = JSON.parse(localStorage.getItem(key) || '[]');
    const newCompleted = existingCompleted.filter((id: number) => !gettingStartedIds.includes(id));
    localStorage.setItem(key, JSON.stringify(newCompleted));
    
    // Update state
    setCompletedCount(newCompleted.length);
    setGettingStartedComplete(false);
    
    // Refresh achievements
    window.location.reload();
  };

  // Add IF MAGIC progress
  const addIfmagicProgress = () => {
    if (!userData?.email) return;
    
    const ifmagicIds = Array.from({ length: 27 }, (_, i) => i + 1); // 1-27
    const key = `completedLessons_${userData.email}`;
    const existingCompleted = JSON.parse(localStorage.getItem(key) || '[]');
    const newCompleted = [...new Set([...existingCompleted, ...ifmagicIds])];
    localStorage.setItem(key, JSON.stringify(newCompleted));
    
    // Update state
    setCompletedCount(newCompleted.length);
    setIfmagicComplete(true);
    
    // Refresh achievements
    window.location.reload();
  };

  // Remove IF MAGIC progress
  const removeIfmagicProgress = () => {
    if (!userData?.email) return;
    
    const ifmagicIds = Array.from({ length: 27 }, (_, i) => i + 1); // 1-27
    const key = `completedLessons_${userData.email}`;
    const existingCompleted = JSON.parse(localStorage.getItem(key) || '[]');
    const newCompleted = existingCompleted.filter((id: number) => !ifmagicIds.includes(id));
    localStorage.setItem(key, JSON.stringify(newCompleted));
    
    // Update state
    setCompletedCount(newCompleted.length);
    setIfmagicComplete(false);
    
    // Refresh achievements
    window.location.reload();
  };

  // Reset all progress - called when user confirms
  const confirmResetProgress = () => {
    // Get all localStorage keys first (can't modify while iterating)
    const allKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) allKeys.push(key);
    }
    
    // Filter keys to delete - match any progress-related patterns
    const keysToDelete = allKeys.filter(key => 
      key.startsWith('lesson-') || 
      key.includes('-notes') || 
      key.includes('-quiz-passed') ||
      key.includes('-quiz-perfect') ||
      key === 'completedLessons' ||
      key === 'learningStreak' ||
      key === 'lastActivityDate'
    );
    
    console.log('[Reset] Deleting keys:', keysToDelete);
    
    // Delete all progress keys
    keysToDelete.forEach(key => localStorage.removeItem(key));
    
    // Reset local state
    setCompletedCount(0);
    setQuizzesPassed(0);
    setPerfectQuizzes(0);
    setGettingStartedComplete(false);
    setIfmagicComplete(false);
    setAchievements(localAchievements.map(a => ({ ...a, earned: false, earnedAt: undefined })));
    
    // Close modal
    setShowResetModal(false);
  };

  // Format member date from either created_at or joinDate
  const getMemberDate = () => {
    const dateStr = userData?.created_at || userData?.joinDate;
    if (!dateStr) return 'Recently';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return '#00ff87';
      case 'engagement': return '#64ffda';
      case 'mastery': return '#ffc107';
      case 'special': return '#667eea';
      default: return '#8892b0';
    }
  };

  // Get earned and locked counts
  const earnedCount = achievements.filter(a => a.earned).length;
  const totalAchievements = achievements.length;

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!userData) return <div className="error-screen">No user data</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            <span>◉</span>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{userData.name}</h1>
            <p className="profile-email">{userData.email}</p>
            <p className="profile-join-date">Member since {getMemberDate()}</p>
          </div>
          <div className="profile-actions">
            <button className="edit-profile-btn">Edit Profile</button>
            <button className="sign-out-btn" onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">▣</div>
            <div className="stat-content">
              <span className="stat-value">{completedCount}</span>
              <span className="stat-label">Lessons Completed</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">◈</div>
            <div className="stat-content">
              <span className="stat-value">{quizzesPassed}</span>
              <span className="stat-label">Quizzes Passed</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">★</div>
            <div className="stat-content">
              <span className="stat-value">{perfectQuizzes}</span>
              <span className="stat-label">Perfect Scores</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">◉</div>
            <div className="stat-content">
              <span className="stat-value">{earnedCount}/{totalAchievements}</span>
              <span className="stat-label">Achievements</span>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">◆ Achievements</h2>
            <span className="achievement-count">{earnedCount} / {totalAchievements} Unlocked</span>
          </div>
          
          <div className="achievements-grid">
            {achievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
                style={{ 
                  '--category-color': getCategoryColor(achievement.category) 
                } as React.CSSProperties}
              >
                <div className="achievement-icon-wrapper">
                  <div className="achievement-icon">{achievement.icon}</div>
                  {achievement.earned && (
                    <div className="earned-badge">✓</div>
                  )}
                </div>
                <div className="achievement-name">{achievement.name}</div>
                <div className="achievement-description">{achievement.description}</div>
                <div className="achievement-category">{achievement.category}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section">
          <h2 className="section-title">▸ Recent Activity</h2>
          <div className="activity-list">
            {completedCount > 0 ? (
              <div className="activity-item">
                <div className="activity-icon">◉</div>
                <div className="activity-content">
                  <p className="activity-text">Completed {completedCount} lesson{completedCount !== 1 ? 's' : ''}!</p>
                  <p className="activity-time">Keep going!</p>
                </div>
              </div>
            ) : (
              <div className="activity-item empty">
                <div className="activity-icon">○</div>
                <div className="activity-content">
                  <p className="activity-text">No recent activity. Start learning to see your progress here!</p>
                </div>
              </div>
            )}
            {quizzesPassed > 0 && (
              <div className="activity-item">
                <div className="activity-icon">▣</div>
                <div className="activity-content">
                  <p className="activity-text">Passed {quizzesPassed} quiz{quizzesPassed !== 1 ? 'zes' : ''}!</p>
                  <p className="activity-time">Great work!</p>
                </div>
              </div>
            )}
            {earnedCount > 0 && (
              <div className="activity-item">
                <div className="activity-icon">★</div>
                <div className="activity-content">
                  <p className="activity-text">Earned {earnedCount} achievement{earnedCount !== 1 ? 's' : ''}!</p>
                  <p className="activity-time">{totalAchievements - earnedCount} more to unlock</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings Section */}
        <div className="section">
          <h2 className="section-title">▸ Settings</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-name">Email Notifications</span>
                <span className="setting-description">Receive updates about your progress</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-name">Hardware Auto-Connect</span>
                <span className="setting-description">Automatically detect IF MAGIC hardware</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Progress Management Section - Dev/Testing Only */}
        {devMode && (
          <div className="section progress-management">
            <h2 className="section-title">▸ Progress Management <span className="dev-badge">DEV</span></h2>
            <p className="section-description">Manually add or remove lesson completion progress for testing or demo purposes.</p>
            <div className="progress-controls">
              <div className="progress-path-card">
                <div className="path-header">
                  <span className="path-icon">★</span>
                  <span className="path-name">Getting Started</span>
                  <span className={`path-status ${gettingStartedComplete ? 'complete' : 'incomplete'}`}>
                    {gettingStartedComplete ? '✓ Complete' : '○ Incomplete'}
                  </span>
                </div>
                <p className="path-info">5 introductory lessons</p>
                <div className="path-actions">
                  <button 
                    className="add-progress-btn" 
                    onClick={addGettingStartedProgress}
                    disabled={gettingStartedComplete}
                  >
                    + Add Progress
                  </button>
                  <button 
                    className="remove-progress-btn" 
                    onClick={removeGettingStartedProgress}
                    disabled={!gettingStartedComplete}
                  >
                    − Remove Progress
                  </button>
                </div>
              </div>
              <div className="progress-path-card">
                <div className="path-header">
                  <span className="path-icon">◆</span>
                  <span className="path-name">IF MAGIC Path</span>
                  <span className={`path-status ${ifmagicComplete ? 'complete' : 'incomplete'}`}>
                    {ifmagicComplete ? '✓ Complete' : '○ Incomplete'}
                  </span>
                </div>
                <p className="path-info">27 comprehensive lessons</p>
                <div className="path-actions">
                  <button 
                    className="add-progress-btn" 
                    onClick={addIfmagicProgress}
                    disabled={ifmagicComplete}
                  >
                    + Add Progress
                  </button>
                  <button 
                    className="remove-progress-btn" 
                    onClick={removeIfmagicProgress}
                    disabled={!ifmagicComplete}
                  >
                    − Remove Progress
                  </button>
                </div>
              </div>
            </div>
            
            {/* Dev Level Selector */}
            <div className="dev-level-section">
              <h3 className="dev-subtitle">Experience Level Override</h3>
              <p className="section-description">
                Manually set your account level. This affects which lessons are unlocked.
                <br />
                <span className="level-info">
                  Beginner: {getIfMagicLessonsByLevel('beginner').length} lessons | 
                  Intermediate: {getIfMagicLessonsByLevel('intermediate').length} lessons | 
                  Advanced: {getIfMagicLessonsByLevel('advanced').length} lessons
                </span>
              </p>
              <div className="level-buttons">
                <button 
                  className={`level-btn ${userData?.level === 'beginner' ? 'active' : ''}`}
                  onClick={() => {
                    setUserLevel('beginner');
                    setUserData({ ...userData, level: 'beginner' });
                  }}
                >
                  🌱 Beginner
                </button>
                <button 
                  className={`level-btn ${userData?.level === 'intermediate' ? 'active' : ''}`}
                  onClick={() => {
                    setUserLevel('intermediate');
                    setUserData({ ...userData, level: 'intermediate' });
                  }}
                >
                  🌿 Intermediate
                </button>
                <button 
                  className={`level-btn ${userData?.level === 'advanced' ? 'active' : ''}`}
                  onClick={() => {
                    setUserLevel('advanced');
                    setUserData({ ...userData, level: 'advanced' });
                  }}
                >
                  🌳 Advanced
                </button>
              </div>
              <p className="current-level-display">
                Current Level: <span className="level-value">{userData?.level || 'beginner'}</span>
              </p>
            </div>
            
            <button 
              className="disable-dev-btn" 
              onClick={() => {
                localStorage.removeItem('devMode');
                setDevMode(false);
              }}
            >
              Disable Dev Mode
            </button>
          </div>
        )}

        {/* Danger Zone */}
        <div className="section danger-zone">
          <h2 className="section-title">▸ Danger Zone</h2>
          <div className="danger-actions">
            <button className="reset-progress-btn" onClick={() => setShowResetModal(true)}>
              ⚠ Reset All Progress
            </button>
            <p className="danger-warning">This will delete all lessons, quizzes, notes, and achievements. Cannot be undone.</p>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-content reset-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">⚠</div>
            <h3 className="modal-title">Reset All Progress?</h3>
            <p className="modal-description">
              This will permanently delete:
            </p>
            <ul className="modal-list">
              <li>◉ All completed lessons</li>
              <li>◉ All quiz passes & perfect scores</li>
              <li>◉ All notes you've written</li>
              <li>◉ All earned achievements</li>
            </ul>
            <p className="modal-warning">This action cannot be undone!</p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowResetModal(false)}>
                Cancel
              </button>
              <button className="modal-btn confirm-danger" onClick={confirmResetProgress}>
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
