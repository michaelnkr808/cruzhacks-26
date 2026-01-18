import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser, canAccessLesson, getCompletedLessons, lessons as localLessons } from '../data/lessonData';
import { useEffect, useState } from 'react';
import './Learning.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Learning Track Page - The roadmap/track view for a specific hardware platform
 * 
 * KEY LEARNING CONCEPTS:
 * 
 * 1. Data-Driven UI: Lesson content separated from presentation
 * 2. ACCESS CONTROL: Different users see different content
 * 3. User State: Reading from localStorage to determine permissions
 * 4. Progressive Disclosure: Show what's available vs locked
 * 5. Path-Specific Content: Shows lessons for the selected hardware platform
 */

function Learning() {
  const navigate = useNavigate();
  const { pathId } = useParams<{ pathId: string }>();
  const [user, setUser] = useState(getCurrentUser());
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Valid paths that have content
  const validPaths = ['ifmagic', 'getting-started'];
  
  // For now, only IF MAGIC and Getting Started have content. Other paths redirect back.
  useEffect(() => {
    if (pathId && !validPaths.includes(pathId)) {
      navigate('/learning');
      return;
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/signup');
    } else {
      setUser(currentUser);
      setCompletedLessons(getCompletedLessons());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, pathId]);
  
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(`${API_URL}/api/lessons`);
        if (response.ok) {
          const data = await response.json();
          // Use API data if available, otherwise fallback to local
          const apiLessons = data.lessons || [];
          setLessons(apiLessons.length > 0 ? apiLessons : localLessons);
        } else {
          // Fallback to local data if API fails
          setLessons(localLessons);
        }
      } catch (error) {
        console.error('Failed to fetch lessons, using local data:', error);
        // Fallback to local data if API fails
        setLessons(localLessons);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  // If no user yet (during redirect), show loading
  if (!user) {
    return <div className="learning"><p>Loading...</p></div>;
  }

  if (loading) return <div>Loading lessons...</div>;
  
  // Filter lessons by the current path
  const pathLessons = lessons.filter(l => l.path === pathId);
  
  // Calculate progress stats from lesson data
  // This is "derived state" - calculating values from existing data
  const completedCount = completedLessons.filter(id => pathLessons.some(l => l.id === id)).length;
  const accessibleLessons = pathLessons.filter(l => canAccessLesson(user.level, l));
  const availableCount = accessibleLessons.filter(l => !completedLessons.includes(l.id)).length;
  const totalCount = pathLessons.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Get path display info
  const getPathInfo = (id: string) => {
    switch (id) {
      case 'getting-started':
        return { name: 'Getting Started', subtitle: 'Complete this path to unlock other learning tracks!' };
      case 'ifmagic':
        return { name: 'IF MAGIC Track', subtitle: 'Master embedded programming with hands-on IF MAGIC modules' };
      default:
        return { name: 'Learning Track', subtitle: 'Explore embedded programming' };
    }
  };
  
  const pathInfo = getPathInfo(pathId || 'ifmagic');

  // Get category emoji for visual organization
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started': return '★';
      case 'foundation': return '▣';
      case 'sensor': return '◉';
      case 'output': return '◆';
      case 'advanced': return '▲';
      default: return '■';
    }
  };
  
  // Get level badge color
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'beginner': return { icon: '●', color: '#48bb78' };
      case 'intermediate': return { icon: '▲', color: '#ed8936' };
      case 'advanced': return { icon: '★', color: '#667eea' };
      default: return { icon: '■', color: '#718096' };
    }
  };
  
  const levelBadge = getLevelBadge(user.level);

  return (
    <div className="learning">
      <div className="learning-header">
        <div className="header-top">
          <div className="breadcrumb">
            <Link to="/learning" className="breadcrumb-link">Learning Paths</Link>
            <span className="breadcrumb-separator">▸</span>
            <span className="breadcrumb-current">{pathInfo.name}</span>
          </div>
          <h1 className="page-title">Your {pathInfo.name} Learning Journey</h1>
          <div className="user-level-badge" style={{ borderColor: levelBadge.color }}>
            <span className="level-emoji">{levelBadge.icon}</span>
            <span className="level-text" style={{ color: levelBadge.color }}>
              {user.level.charAt(0).toUpperCase() + user.level.slice(1)}
            </span>
          </div>
        </div>
        <p className="page-subtitle">
          {pathInfo.subtitle}
        </p>
        
        {/* Progress indicator - now dynamic and based on access! */}
        <div className="progress-section">
          <div className="progress-stats">
            <div className="stat">
              <span className="stat-number">{completedCount}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat">
              <span className="stat-number">{accessibleLessons.length}</span>
              <span className="stat-label">Accessible</span>
            </div>
            <div className="stat">
              <span className="stat-number">{totalCount}</span>
              <span className="stat-label">Total Lessons</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Lesson cards - the roadmap with access control! */}
      <div className="lessons-container">
        <div className="lessons-track">
          {pathLessons.map((lesson, index) => {
            // Check if user can access this lesson
            const isAccessLocked = !canAccessLesson(user.level, lesson);
            const isCompleted = completedLessons.includes(lesson.id);
            
            return (
              <div key={lesson.id} className="lesson-wrapper">
                {/* Connection line between lessons */}
                {index < pathLessons.length - 1 && (
                  <div className={`connector ${isCompleted ? 'completed' : ''}`}></div>
                )}
                
                {/* Lesson Card */}
                {isAccessLocked ? (
                  // Locked lessons aren't clickable
                  <div className={`lesson-card locked access-locked`}>
                    <div className="lesson-status-badge">
                      <span className="lock-icon">⊗</span>
                    </div>
                    <div className="lesson-content">
                      <div className="lesson-header-row">
                        <span className="category-badge">{getCategoryIcon(lesson.category)}</span>
                        {lesson.module && <span className="module-badge">▣ {lesson.module}</span>}
                        <span className="required-level-badge">
                          {getLevelBadge(lesson.requiredLevel).icon} {lesson.requiredLevel}
                        </span>
                      </div>
                      <h3 className="lesson-title">{lesson.title}</h3>
                      <p className="lesson-description">{lesson.description}</p>
                      <p className="access-message">
                        ⊗ Requires {lesson.requiredLevel} level
                      </p>
                      <div className="lesson-meta">
                        <span className="duration">◷ {lesson.duration}</span>
                        <span className="lesson-number">Lesson {lesson.id}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Available lessons are clickable links
                  <Link to={`/lesson/${lesson.slug}`} className={`lesson-card ${isCompleted ? 'completed' : 'available'}`}>
                    <div className="lesson-status-badge">
                      {isCompleted ? (
                        <span className="check-icon">✓</span>
                      ) : (
                        <span className="play-icon">▶</span>
                      )}
                    </div>
                    <div className="lesson-content">
                      <div className="lesson-header-row">
                        <span className="category-badge">{getCategoryIcon(lesson.category)}</span>
                        {lesson.module && <span className="module-badge">▣ {lesson.module}</span>}
                        <span className="required-level-badge">
                          {getLevelBadge(lesson.requiredLevel).icon} {lesson.requiredLevel}
                        </span>
                      </div>
                      <h3 className="lesson-title">{lesson.title}</h3>
                      <p className="lesson-description">{lesson.description}</p>
                      <div className="lesson-meta">
                        <span className="duration">◷ {lesson.duration}</span>
                        <span className="lesson-number">Lesson {lesson.id}</span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Learning;
