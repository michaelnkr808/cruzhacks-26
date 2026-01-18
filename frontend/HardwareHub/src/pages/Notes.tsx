import { Link } from 'react-router-dom';
import { lessons } from '../data/lessonData';
import { useState, useEffect } from 'react';
import './Notes.css';

/**
 * Notes Review Page - View all your saved notes
 * 
 * This page lists all lessons and shows which ones have notes.
 * Click on a lesson to expand and view its notes.
 * 
 * KEY CONCEPTS:
 * - localStorage: Reading saved notes from browser storage
 * - Array.map(): Transform lesson data into note cards
 * - Conditional rendering: Show different UI for notes vs no notes
 * - Accordion pattern: Expand/collapse to view notes
 */

interface LessonNote {
  lessonId: number;
  lessonSlug: string;
  lessonTitle: string;
  notes: string;
  hasNotes: boolean;
}

function Notes() {
  const [lessonNotes, setLessonNotes] = useState<LessonNote[]>([]);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'with-notes'>('all');

  // Load all notes from localStorage on mount
  useEffect(() => {
    const allNotes: LessonNote[] = lessons.map(lesson => {
      const savedNotes = localStorage.getItem(`lesson-${lesson.slug}-notes`) || '';
      return {
        lessonId: lesson.id,
        lessonSlug: lesson.slug,
        lessonTitle: lesson.title,
        notes: savedNotes,
        hasNotes: savedNotes.length > 0
      };
    });
    setLessonNotes(allNotes);
  }, []);

  // Filter lessons based on search and filter mode
  const filteredNotes = lessonNotes
    .filter(note => {
      // First apply the filter mode
      if (filterMode === 'with-notes' && !note.hasNotes) {
        return false;
      }
      
      // Then apply the search query
      if (searchQuery.trim() === '') {
        return true;
      }
      
      return (
        note.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  // Count lessons with notes
  const notesCount = lessonNotes.filter(n => n.hasNotes).length;

  // Toggle expanded lesson
  const toggleLesson = (lessonId: number) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  // Delete notes for a lesson
  const deleteNotes = (lessonSlug: string) => {
    if (confirm('Are you sure you want to delete these notes?')) {
      localStorage.removeItem(`lesson-${lessonSlug}-notes`);
      setLessonNotes(prev => prev.map(note => 
        note.lessonSlug === lessonSlug ? { ...note, notes: '', hasNotes: false } : note
      ));
    }
  };

  return (
    <div className="notes-page">
      <div className="notes-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">◈</span>
            Your Notes
          </h1>
          <p className="page-subtitle">
            Review and manage your lesson notes • {notesCount} of {lessons.length} lessons have notes
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="notes-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search notes by lesson name or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => setFilterMode('all')}
          >
            All Lessons ({lessonNotes.length})
          </button>
          <button 
            className={`filter-btn ${filterMode === 'with-notes' ? 'active' : ''}`}
            onClick={() => setFilterMode('with-notes')}
          >
            With Notes ({notesCount})
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="notes-container">
        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◇</div>
            {notesCount === 0 ? (
              <>
                <h2>No Notes Yet</h2>
                <p>Start taking notes in your lessons to see them here!</p>
                <Link to="/learning" className="cta-button">
                  Go to Learning Track
                </Link>
              </>
            ) : (
              <>
                <h2>No Results Found</h2>
                <p>Try adjusting your search or filter settings.</p>
                <button 
                  className="cta-button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterMode('all');
                  }}
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="notes-list">
            {filteredNotes.map(note => (
              <div 
                key={note.lessonId} 
                className={`note-card ${!note.hasNotes ? 'no-notes' : ''} ${expandedLesson === note.lessonId ? 'expanded' : ''}`}
              >
                <div 
                  className="note-card-header"
                  onClick={() => note.hasNotes && toggleLesson(note.lessonId)}
                  style={{ cursor: note.hasNotes ? 'pointer' : 'default' }}
                >
                  <div className="lesson-info">
                    <span className="lesson-number">Lesson {note.lessonId}</span>
                    <h3 className="lesson-title">{note.lessonTitle}</h3>
                  </div>
                  <div className="note-actions">
                    {note.hasNotes ? (
                      <>
                        <span className="note-length">
                          {note.notes.length} characters
                        </span>
                        <span className="expand-icon">
                          {expandedLesson === note.lessonId ? '▼' : '▶'}
                        </span>
                      </>
                    ) : (
                      <span className="no-notes-label">No notes</span>
                    )}
                  </div>
                </div>

                {/* Expanded Notes Content */}
                {expandedLesson === note.lessonId && note.hasNotes && (
                  <div className="note-content">
                    <pre className="note-text">{note.notes}</pre>
                    <div className="note-footer">
                      <Link 
                        to={`/lesson/${note.lessonSlug}`}
                        className="edit-btn"
                      >
                        ▸ Edit in Lesson
                      </Link>
                      <button 
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotes(note.lessonSlug);
                        }}
                      >
                        × Delete Notes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notes;
