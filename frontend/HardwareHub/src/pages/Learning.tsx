import { Link, useNavigate, useParams } from 'react-router-dom';
import { lessons, getCurrentUser, canAccessLesson, getCompletedLessons } from '../data/lessonData';
import { useEffect, useState } from 'react';
import './Learning.css';

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
  
  // For now, only IF MAGIC has content. Other paths redirect back.
  useEffect(() => {
    if (pathId && pathId !== 'ifmagic') {
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
  }, [navigate, pathId]);
  
  // If no user yet (during redirect), show loading
  if (!user) {
    return <div className="learning"><p>Loading...</p></div>;
  }
  
  // Calculate progress stats from lesson data
  // This is "derived state" - calculating values from existing data
  const completedCount = completedLessons.length;
  const accessibleLessons = lessons.filter(l => canAccessLesson(user.level, l));
  const availableCount = accessibleLessons.filter(l => !completedLessons.includes(l.id)).length;
  const totalCount = lessons.length;
  const progressPercent = (completedCount / totalCount) * 100;

  // Get category emoji for visual organization
  const getCategoryIcon = (category: string) => {
    switch (category) {
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
            <span className="breadcrumb-current">IF MAGIC Track</span>
          </div>
          <h1 className="page-title">Your IF MAGIC Learning Journey</h1>
          <div className="user-level-badge" style={{ borderColor: levelBadge.color }}>
            <span className="level-emoji">{levelBadge.icon}</span>
            <span className="level-text" style={{ color: levelBadge.color }}>
              {user.level.charAt(0).toUpperCase() + user.level.slice(1)}
            </span>
          </div>
        </div>
        <p className="page-subtitle">
          Master embedded programming with hands-on IF MAGIC modules
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
          {lessons.map((lesson, index) => {
            // Check if user can access this lesson
            const isAccessLocked = !canAccessLesson(user.level, lesson);
            const isCompleted = completedLessons.includes(lesson.id);
            
            return (
              <div key={lesson.id} className="lesson-wrapper">
                {/* Connection line between lessons */}
                {index < lessons.length - 1 && (
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
                  <Link to={`/lesson/${lesson.id}`} className={`lesson-card ${isCompleted ? 'completed' : 'available'}`}>
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
