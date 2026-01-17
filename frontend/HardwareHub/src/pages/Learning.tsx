import { Link, useNavigate } from 'react-router-dom';
import { lessons, getCurrentUser, canAccessLesson } from '../data/lessonData';
import { useEffect, useState } from 'react';
import './Learning.css';

/**
 * Learning Page - The roadmap/track view WITH ACCESS CONTROL
 * 
 * KEY LEARNING CONCEPTS:
 * 
 * 1. Data-Driven UI: Lesson content separated from presentation
 * 2. ACCESS CONTROL: Different users see different content
 * 3. User State: Reading from localStorage to determine permissions
 * 4. Progressive Disclosure: Show what's available vs locked
 * 
 * This demonstrates ROLE-BASED ACCESS CONTROL (RBAC)
 * - A security pattern used in real applications
 * - Users have roles (beginner/intermediate/advanced)
 * - Content has requirements (requiredLevel)
 * - System checks: does user role meet content requirement?
 */

function Learning() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  
  // Check if user is logged in, redirect to signup if not
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/signup');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);
  
  // If no user yet (during redirect), show loading
  if (!user) {
    return <div className="learning"><p>Loading...</p></div>;
  }
  
  // Calculate progress stats from lesson data
  // This is "derived state" - calculating values from existing data
  const completedCount = lessons.filter(l => l.status === 'completed').length;
  const accessibleLessons = lessons.filter(l => canAccessLesson(user.level, l));
  const availableCount = accessibleLessons.filter(l => l.status === 'available').length;
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
            const hasAccess = canAccessLesson(user.level, lesson);
            const isAccessLocked = !hasAccess;
            
            return (
              <div key={lesson.id} className="lesson-wrapper">
                {/* Connection line between lessons */}
                {index < lessons.length - 1 && (
                  <div className={`connector ${lesson.status === 'completed' ? 'completed' : ''}`}></div>
                )}
                
                {/* Lesson Card */}
                {lesson.status === 'locked' || isAccessLocked ? (
                  // Locked lessons or lessons without access aren't clickable
                  <div className={`lesson-card ${lesson.status} ${isAccessLocked ? 'access-locked' : ''}`}>
                    <div className="lesson-status-badge">
                      {isAccessLocked ? (
                        <span className="lock-icon">⊗</span>
                      ) : (
                        <span className="lock-icon">○</span>
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
                      {isAccessLocked && (
                        <p className="access-message">
                          ⊗ Requires {lesson.requiredLevel} level
                        </p>
                      )}
                      <div className="lesson-meta">
                        <span className="duration">◷ {lesson.duration}</span>
                        <span className="lesson-number">Lesson {lesson.id}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Available lessons are clickable links
                  <Link to={`/lesson/${lesson.id}`} className={`lesson-card ${lesson.status}`}>
                    <div className="lesson-status-badge">
                      {lesson.status === 'completed' ? (
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
