import { Link } from 'react-router-dom';
import './Home.css';

/**
 * Home Page Component
 * This is the landing page users see first.
 * 
 * Key UX Concepts:
 * - Clear Call-to-Action (CTA): Big button to start learning
 * - Visual Hierarchy: Most important info (hero section) at top
 * - Features Section: Shows value proposition
 */
function Home() {
  return (
    <div className="home">
      {/* Hero Section - The main "welcome" area */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Learn Embedded Programming
          </h1>
          <p className="hero-subtitle">
            Master embedded systems through interactive lessons, real hardware projects,
            and a structured learning path designed for beginners.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="cta-button primary">
              Start Learning
              <span className="arrow">→</span>
            </Link>
            <Link to="/profile" className="cta-button secondary">
              View Profile
            </Link>
          </div>
        </div>
        
        {/* Visual Element - Hardware representation */}
        <div className="hero-visual">
          <div className="hardware-card">
            <div className="chip-icon">◆</div>
            <div className="connection-status">
              <span className="status-dot"></span>
              <span>IF MAGIC Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="features-title">What You'll Learn</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">▣</div>
            <h3>Structured Learning Path</h3>
            <p>Progress through carefully designed lessons from basics to advanced topics</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">▶</div>
            <h3>Video & Visual Content</h3>
            <p>Learn through engaging videos and detailed visual explanations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">◆</div>
            <h3>Real Hardware Practice</h3>
            <p>Apply your knowledge with IF MAGIC hardware integration</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">◈</div>
            <h3>Interactive Notes</h3>
            <p>Take notes with OpenNotes while you learn for better retention</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
