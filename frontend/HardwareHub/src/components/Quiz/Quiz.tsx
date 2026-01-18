import { useState, useEffect } from 'react';
import './Quiz.css';

/**
 * Quiz Component - AI-Generated Quiz based on lesson content and notes
 * 
 * This component:
 * 1. Fetches quiz questions from the backend (generated via AI)
 * 2. Displays questions one at a time
 * 3. Tracks user answers and shows results
 * 
 * Powered by OpenNote-style learning approach:
 * - Questions are generated from YOUR notes + lesson content
 * - Personalized to what you wrote down
 */

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
}

interface QuizProps {
  lessonTitle: string;
  lessonSlug: string;
  lessonContent: string;
  userNotes: string;
  onClose: () => void;
  onComplete: (score: number, total: number) => void;
  inline?: boolean; // If true, renders inline instead of modal
}

type QuizState = 'loading' | 'ready' | 'active' | 'results' | 'error';

function Quiz({ lessonTitle, lessonSlug, lessonContent, userNotes, onClose, onComplete, inline = false }: QuizProps) {
  const [state, setState] = useState<QuizState>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [error, setError] = useState('');

  // Generate quiz when component mounts
  useEffect(() => {
    generateQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateQuiz = async () => {
    setState('loading');
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${API_URL}/api/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle,
          lessonSlug,
          lessonContent,
          userNotes,
          questionCount: 5
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      setQuestions(data.questions);
      setAnswers([]);
      setState('ready');
    } catch (err) {
      console.error('Quiz generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
      setState('error');
    }
  };

  const startQuiz = () => {
    setState('active');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const selectAnswer = (index: number) => {
    if (showExplanation) return; // Can't change after submitting
    setSelectedAnswer(index);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    
    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    
    // Show explanation
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Calculate final score
      const finalAnswers = [...answers];
      if (selectedAnswer !== null) {
        finalAnswers[currentQuestion] = selectedAnswer;
      }
      const score = finalAnswers.reduce((acc, answer, idx) => {
        return acc + (answer === questions[idx]?.correctAnswer ? 1 : 0);
      }, 0);
      
      onComplete(score, questions.length);
      setState('results');
    }
  };

  const calculateScore = (): number => {
    return answers.reduce((acc: number, answer: number, idx: number) => {
      return acc + (answer === questions[idx]?.correctAnswer ? 1 : 0);
    }, 0);
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return { emoji: '🎉', message: 'Perfect! You really know your stuff!', passed: true };
    if (percentage >= 80) return { emoji: '⭐', message: 'Great job! You passed!', passed: true };
    if (percentage >= 60) return { emoji: '👍', message: 'Good effort! Need 80% to pass.', passed: false };
    if (percentage >= 40) return { emoji: '📚', message: 'Keep studying! Need 80% to pass.', passed: false };
    return { emoji: '💪', message: "Try again! Need 80% to pass.", passed: false };
  };

  // Wrapper class for inline vs modal
  const wrapperClass = inline ? 'quiz-inline' : 'quiz-overlay';
  const containerClass = inline ? 'quiz-inline-container' : 'quiz-modal';

  // Render based on state
  return (
    <div className={wrapperClass}>
      <div className={containerClass}>
        {/* Header - only show close button in modal mode */}
        <div className="quiz-header">
          <div className="quiz-title-section">
            <span className="quiz-icon">◈</span>
            <h2>Knowledge Check</h2>
          </div>
          {!inline && <button className="quiz-close-btn" onClick={onClose}>✕</button>}
        </div>

        {/* Loading State */}
        {state === 'loading' && (
          <div className="quiz-loading">
            <div className="loading-spinner"></div>
            <p>Generating quiz...</p>
            <small>Powered by OpenNote AI</small>
          </div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <div className="quiz-error">
            <span className="error-icon">⚠</span>
            <p>{error}</p>
            <button className="quiz-btn primary" onClick={generateQuiz}>
              Try Again
            </button>
          </div>
        )}

        {/* Ready State - Quiz intro */}
        {state === 'ready' && (
          <div className="quiz-intro">
            <h3>Ready to test your knowledge?</h3>
            <p className="quiz-lesson-title">Lesson: {lessonTitle}</p>
            <div className="quiz-info">
              <div className="info-item">
                <span className="info-icon">◷</span>
                <span>{questions.length} questions</span>
              </div>
              <div className="info-item">
                <span className="info-icon">▣</span>
                <span>Based on your notes + lesson content</span>
              </div>
            </div>
            {userNotes.length > 0 ? (
              <p className="notes-indicator">
                ✓ Using your {userNotes.length} character notes
              </p>
            ) : (
              <p className="notes-indicator warning">
                ⚠ No notes found - quiz based on lesson content only
              </p>
            )}
            <button className="quiz-btn primary large" onClick={startQuiz}>
              Start Quiz →
            </button>
          </div>
        )}

        {/* Active State - Taking quiz */}
        {state === 'active' && questions[currentQuestion] && (
          <div className="quiz-active">
            <div className="quiz-progress">
              <div className="progress-text">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="question-section">
              <p className="question-text">{questions[currentQuestion].question}</p>
              
              <div className="options-list">
                {questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    className={`option-btn ${selectedAnswer === idx ? 'selected' : ''} ${
                      showExplanation 
                        ? idx === questions[currentQuestion].correctAnswer 
                          ? 'correct' 
                          : selectedAnswer === idx 
                            ? 'incorrect' 
                            : ''
                        : ''
                    }`}
                    onClick={() => selectAnswer(idx)}
                    disabled={showExplanation}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                    <span className="option-text">{option}</span>
                    {showExplanation && idx === questions[currentQuestion].correctAnswer && (
                      <span className="correct-indicator">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {showExplanation && (
              <div className={`explanation-box ${
                selectedAnswer === questions[currentQuestion].correctAnswer ? 'correct' : 'incorrect'
              }`}>
                <p className="explanation-header">
                  {selectedAnswer === questions[currentQuestion].correctAnswer 
                    ? '✓ Correct!' 
                    : '✗ Incorrect'}
                </p>
                <p className="explanation-text">{questions[currentQuestion].explanation}</p>
              </div>
            )}

            <div className="quiz-actions">
              {!showExplanation ? (
                <button 
                  className="quiz-btn primary"
                  onClick={submitAnswer}
                  disabled={selectedAnswer === null}
                >
                  Submit Answer
                </button>
              ) : (
                <button className="quiz-btn primary" onClick={nextQuestion}>
                  {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results State */}
        {state === 'results' && (
          <div className="quiz-results">
            <div className={`results-score ${getScoreMessage(calculateScore(), questions.length).passed ? 'passed' : 'failed'}`}>
              <span className="score-emoji">{getScoreMessage(calculateScore(), questions.length).emoji}</span>
              <div className="score-numbers">
                <span className="score-value">{calculateScore()}</span>
                <span className="score-divider">/</span>
                <span className="score-total">{questions.length}</span>
              </div>
              <p className="score-percentage">
                {Math.round((calculateScore() / questions.length) * 100)}%
              </p>
            </div>

            <p className={`results-message ${getScoreMessage(calculateScore(), questions.length).passed ? 'passed' : 'failed'}`}>
              {getScoreMessage(calculateScore(), questions.length).message}
            </p>
            
            {getScoreMessage(calculateScore(), questions.length).passed && (
              <div className="unlock-message">
                ✓ Next lesson unlocked!
              </div>
            )}

            <div className="results-summary">
              <div className="summary-list">
                {questions.map((q, idx) => (
                  <div 
                    key={idx} 
                    className={`summary-item ${
                      answers[idx] === q.correctAnswer ? 'correct' : 'incorrect'
                    }`}
                  >
                    <span className="summary-num">Q{idx + 1}</span>
                    <span className="summary-status">
                      {answers[idx] === q.correctAnswer ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="results-actions">
              {!getScoreMessage(calculateScore(), questions.length).passed && (
                <button className="quiz-btn primary" onClick={() => {
                  setCurrentQuestion(0);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                  setAnswers([]);
                  generateQuiz();
                }}>
                  ↻ Try Again
                </button>
              )}
              {getScoreMessage(calculateScore(), questions.length).passed && (
                <button className="quiz-btn primary" onClick={onClose}>
                  ← Back to Notes
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
