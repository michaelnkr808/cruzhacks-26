import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getLessonBySlug, lessons, markLessonComplete, isLessonCompleted } from '../data/lessonData';
import Quiz from '../components/Quiz/Quiz';
import Toast from '../components/Toast/Toast';
import './Lesson.css';

function Lesson() {
  // Get the lesson slug from the URL
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // State for notes - React remembers this between re-renders
  const [notes, setNotes] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Quiz state
  const [quizPassed, setQuizPassed] = useState(false);
  
  // Notes panel tab state
  const [activeTab, setActiveTab] = useState<'notes' | 'quiz'>('notes');
  
  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Fetch the lesson data based on slug
  const lessonData = getLessonBySlug(slug || '');
  const lessonId = lessonData?.id || 0;
  
  const [completed, setCompleted] = useState(isLessonCompleted(lessonId));
  
  // Listen for path unlock events
  useEffect(() => {
    const handlePathUnlocked = (event: CustomEvent<{ pathId: string }>) => {
      if (event.detail.pathId === 'getting-started') {
        setToastMessage('🎉 Congratulations! You completed Getting Started! IF MAGIC path is now unlocked!');
        setShowToast(true);
      }
    };
    
    window.addEventListener('pathUnlocked', handlePathUnlocked as EventListener);
    return () => {
      window.removeEventListener('pathUnlocked', handlePathUnlocked as EventListener);
    };
  }, []);
  
  // Load saved notes, completion status, and quiz state when component mounts or slug changes
  useEffect(() => {
    const savedNotes = localStorage.getItem(`lesson-${slug}-notes`);
    if (savedNotes) {
      setNotes(savedNotes);
    } else {
      setNotes(''); // Clear notes if switching to a lesson with no saved notes
    }
    
    // Load quiz pass status for this lesson
    const savedQuizPass = localStorage.getItem(`lesson-${slug}-quiz-passed`);
    setQuizPassed(savedQuizPass === 'true');
    
    // Reset quiz state when changing lessons
    setQuizStarted(false); // Reset quiz started flag for new lesson
    setActiveTab('notes');
    
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
  const handleCompleteAndNext = async () => {
    if (!lessonData) return;
    
    // Mark lesson as complete (now async with backend sync)
    await markLessonComplete(lessonData.id);
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
  
  // Build lesson content string for quiz
  const getLessonContentForQuiz = (): string => {
    if (!lessonData) return '';
    
    const sections = lessonData.content.sections
      .map(s => `${s.title}: ${s.text}`)
      .join('\n\n');
    
    return `${lessonData.content.overview}\n\n${sections}`;
  };
  
  // Handle quiz completion
  const handleQuizComplete = async (score: number, total: number) => {
    // Track perfect scores for achievements
    if (score === total) {
      localStorage.setItem(`lesson-${slug}-quiz-perfect`, 'true');
    }
    
    // If user scores 80% or higher, mark quiz as passed and allow progression
    if (score / total >= 0.8 && lessonData) {
      setQuizPassed(true);
      localStorage.setItem(`lesson-${slug}-quiz-passed`, 'true');
      await markLessonComplete(lessonData.id);
      setCompleted(true);
    }
  };
  
  // Track if quiz has been started (to prevent reset on tab switch)
  const [quizStarted, setQuizStarted] = useState(false);
  
  // Check if user can progress - MUST pass quiz (80%+) for this specific lesson
  const canProgress = quizPassed;
  
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
      {/* Toast notification for path unlock */}
      {showToast && (
        <Toast 
          message={toastMessage} 
          type="success" 
          duration={6000}
          onClose={() => setShowToast(false)} 
        />
      )}
      
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
                className={`nav-btn primary ${!canProgress ? 'locked' : ''}`}
                onClick={canProgress ? handleCompleteAndNext : () => setActiveTab('quiz')}
                title={!canProgress ? 'Complete the quiz with 80%+ to unlock' : ''}
              >
                {!canProgress ? '🔒 Take Quiz to Unlock' : completed ? 'Next Lesson →' : 'Complete & Next →'}
              </button>
            </div>
            
            {/* Quiz requirement notice */}
            {!canProgress && (
              <div className="quiz-required-notice">
                <span className="notice-icon">◈</span>
                <p>Complete the knowledge check quiz with 80% or higher to unlock the next lesson.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Notes panel with tabs */}
        <div className="notes-panel">
          {/* Tab Navigation */}
          <div className="panel-tabs">
            <button 
              className={`panel-tab ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              ◈ Notes
            </button>
            <button 
              className={`panel-tab ${activeTab === 'quiz' ? 'active' : ''} ${!quizPassed ? 'required' : 'passed'}`}
              onClick={() => setActiveTab('quiz')}
            >
              {quizPassed ? '✓ Quiz' : '▶ Quiz'}
              {!quizPassed && <span className="required-badge">Required</span>}
            </button>
          </div>
          
          {/* Notes Tab Content */}
          {activeTab === 'notes' && (
            <>
              <div className="notes-header">
                <h3>Your Notes</h3>
                <small>Powered by OpenNote</small>
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
              
              {/* Prompt to take quiz */}
              {!quizPassed && (
                <div className="quiz-prompt">
                  <p>📝 Ready to test your knowledge?</p>
                  <button 
                    className="take-quiz-btn"
                    onClick={() => setActiveTab('quiz')}
                  >
                    Take Quiz →
                  </button>
                </div>
              )}
            </>
          )}
          
          {/* Quiz Tab Content - Only render once started to prevent reset */}
          {(activeTab === 'quiz' || quizStarted) && lessonData && (
            <div className="quiz-tab-content" style={{ display: activeTab === 'quiz' ? 'block' : 'none' }}>
              <Quiz
                lessonTitle={lessonData.title}
                lessonSlug={lessonData.slug}
                lessonContent={getLessonContentForQuiz()}
                userNotes={notes}
                onClose={() => setActiveTab('notes')}
                onComplete={handleQuizComplete}
                inline={true}
                onStart={() => setQuizStarted(true)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lesson;
