import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getLessonBySlug, lessons, markLessonComplete, isLessonCompleted } from '../data/lessonData';
import './Lesson.css';

/**
 * Lesson Page - Individual lesson view WITH PERSISTENT NOTES
 * 
 * Key Concepts:
 * - useParams(): Gets the lesson slug from the URL (/lesson/button-module → slug = "button-module")
 * - useState(): Manages the notes that users type
 * - useEffect(): Loads saved notes from localStorage on mount
 * - localStorage: Persists notes across browser sessions
 * - Data fetching: We use getLessonBySlug() to get the right lesson
 * - Two-column layout: Content on left, notes on right
 * 
 * Real-world pattern:
 * In production, notes would be saved to a backend API and database.
 * The pattern is the same - load on mount, save on button click!
 */

function Lesson() {
  // Get the lesson slug from the URL
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // State for notes - React remembers this between re-renders
  const [notes, setNotes] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Fetch the lesson data based on slug
  const lessonData = getLessonBySlug(slug || '');
  const lessonId = lessonData?.id || 0;
  
  const [completed, setCompleted] = useState(isLessonCompleted(lessonId));
  
  // Load saved notes and completion status when component mounts or slug changes
  useEffect(() => {
    const savedNotes = localStorage.getItem(`lesson-${slug}-notes`);
    if (savedNotes) {
      setNotes(savedNotes);
    } else {
      setNotes(''); // Clear notes if switching to a lesson with no saved notes
    }
    if (lessonData) {
      setCompleted(isLessonCompleted(lessonData.id));
    }
  }, [slug, lessonData]);
  
  // Save notes to localStorage
  const saveNotes = () => {
    setSaveStatus('saving');
    localStorage.setItem(`lesson-${slug}-notes`, notes);
    
    // Show "saved" status for 2 seconds
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 300);
  };
  
  // Handle "Mark Complete & Next" button
  const handleCompleteAndNext = () => {
    if (!lessonData) return;
    
    // Mark lesson as complete
    markLessonComplete(lessonData.id);
    setCompleted(true);
    
    // Navigate to next lesson (in same path)
    const pathLessons = lessons.filter(l => l.path === lessonData.path);
    const currentIndex = pathLessons.findIndex(l => l.id === lessonData.id);
    if (currentIndex < pathLessons.length - 1) {
      const nextLesson = pathLessons[currentIndex + 1];
      navigate(`/lesson/${nextLesson.slug}`);
    } else {
      // If last lesson, go back to learning page
      navigate(`/track/${lessonData.path || 'ifmagic'}`);
    }
  };
  
  // Handle case where lesson doesn't exist (good error handling!)
  if (!lessonData) {
    return (
      <div className="lesson-page">
        <div className="error-message">
          <h2>⊗ Lesson not found</h2>
          <p>This lesson doesn't exist yet.</p>
          <Link to="/learning" className="back-button">
            ← Back to Learning Track
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-page">
      {/* Back button */}
      <Link to="/learning" className="back-button">
        ← Back to Learning Track
      </Link>

      {/* Main lesson container - two column layout */}
      <div className="lesson-container">
        {/* Left side - Lesson content */}
        <div className="lesson-main">
          <div className="lesson-header">
            <div className="lesson-title-section">
              <h1 className="lesson-title">{lessonData.title}</h1>
              {lessonData.module && (
                <span className="lesson-module-tag">
                  ▣ IF MAGIC {lessonData.module} Module
                </span>
              )}
            </div>
            <span className="lesson-duration">◷ {lessonData.duration}</span>
          </div>

          {/* Video Section */}
          <div className="video-container">
            <div className="video-placeholder">
              <div className="video-icon">▶</div>
              <p>Video Player Area</p>
              <small>Lesson video will be embedded here</small>
              {/* Future: Embed actual video using lessonData.content.videoUrl */}
            </div>
          </div>

          {/* Text Content Section - Now dynamic! */}
          <div className="lesson-content">
            <h2>▸ {lessonData.content.overview}</h2>
            
            {lessonData.content.sections.map((section, index) => (
              <div key={index} className="content-section">
                <h3>{section.title}</h3>
                <p>{section.text}</p>
                {section.codeExample && (
                  <pre className="code-example">
                    <code>{section.codeExample}</code>
                  </pre>
                )}
              </div>
            ))}
            
            {/* Practice Activity */}
            {lessonData.content.practiceActivity && (
              <div className="practice-section">
                <h3>▸ Practice Activity</h3>
                <p className="practice-text">{lessonData.content.practiceActivity}</p>
              </div>
            )}
            
            {/* Resources */}
            {lessonData.content.resources.length > 0 && (
              <div className="resources-section">
                <h3>▸ Additional Resources</h3>
                <ul className="resources-list">
                  {lessonData.content.resources.map((resource, index) => (
                    <li key={index}>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        {resource.title} →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Hardware Connection Status */}
            <div className="hardware-status">
              <div className="status-indicator">
                <span className="status-dot connected"></span>
                <span>IF MAGIC Hardware Connected</span>
              </div>
              <p className="status-description">
                Your hardware is ready! Follow along with the lesson and try the exercises.
              </p>
              {completed && (
                <div className="completion-badge">
                  ✓ Lesson Completed!
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="lesson-navigation">
              <button 
                className="nav-btn" 
                disabled={!lessonData || (() => {
                  const pathLessons = lessons.filter(l => l.path === lessonData?.path);
                  return pathLessons.findIndex(l => l.id === lessonData?.id) === 0;
                })()}
                onClick={() => {
                  if (!lessonData) return;
                  const pathLessons = lessons.filter(l => l.path === lessonData.path);
                  const currentIndex = pathLessons.findIndex(l => l.id === lessonData.id);
                  if (currentIndex > 0) {
                    navigate(`/lesson/${pathLessons[currentIndex - 1].slug}`);
                  }
                }}
              >
                ← Previous Lesson
              </button>
              <button 
                className="nav-btn primary"
                onClick={handleCompleteAndNext}
              >
                {completed ? 'Next Lesson →' : 'Mark Complete & Next →'}
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Notes panel (OpenNotes simulation) */}
        <div className="notes-panel">
          <div className="notes-header">
            <h3>◈ Your Notes</h3>
            <small>Powered by OpenNotes</small>
          </div>
          <textarea
            className="notes-textarea"
            placeholder="Take notes as you learn...

Tips for effective notes:
• Summarize key concepts
• Write questions you have
• Note things to practice
• Draw connections to other lessons"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="notes-footer">
            <span className="character-count">
              {notes.length} characters
            </span>
            <button 
              className="save-notes-btn"
              onClick={saveNotes}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' && '◷ Saving...'}
              {saveStatus === 'saved' && '✓ Saved!'}
              {saveStatus === 'idle' && '✓ Save Notes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lesson;
