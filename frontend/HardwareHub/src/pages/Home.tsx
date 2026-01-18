import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Home.css';

/**
 * Home Page Component - Infinite Scroll with Animated Circuits
 * 
 * Key Features:
 * - Infinite scroll experience
 * - Animated circuit connections with flowing electricity to IF MAGIC hardware
 * - About content integrated into the home page
 */
function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="home">
      {/* Hero Section with Circuit Connections */}
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
            <Link to={isLoggedIn ? "/learning" : "/signup"} className="cta-button primary">
              Start Learning
              <span className="arrow">→</span>
            </Link>
            <Link to="/profile" className="cta-button secondary">
              View Profile
            </Link>
          </div>
        </div>
        
        {/* Visual Element - Hardware with Animated Circuits */}
        <div className="hero-visual">
          {/* SVG Circuit Connections */}
          <svg className="circuit-svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid meet">
            {/* Gradient for electricity flow */}
            <defs>
              <linearGradient id="electricFlow1">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="20%" stopColor="#00ff87" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#00ff87" stopOpacity="1" />
                <stop offset="80%" stopColor="#64ffda" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" />
                <animate attributeName="x1" values="0%;100%" dur="2.3s" repeatCount="indefinite" />
                <animate attributeName="x2" values="0%;100%" dur="2.3s" repeatCount="indefinite" />
              </linearGradient>
              
              <linearGradient id="electricFlow2">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="20%" stopColor="#00ff87" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#64ffda" stopOpacity="1" />
                <stop offset="80%" stopColor="#00ff87" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" />
                <animate attributeName="x1" values="0%;100%" dur="1.7s" repeatCount="indefinite" />
                <animate attributeName="x2" values="0%;100%" dur="1.7s" repeatCount="indefinite" />
              </linearGradient>
              
              <linearGradient id="electricFlow3">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="20%" stopColor="#64ffda" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#00ff87" stopOpacity="1" />
                <stop offset="80%" stopColor="#64ffda" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" />
                <animate attributeName="x1" values="0%;100%" dur="1.4s" repeatCount="indefinite" />
                <animate attributeName="x2" values="0%;100%" dur="1.4s" repeatCount="indefinite" />
              </linearGradient>
            </defs>
            
            {/* Circuit trace paths - straight horizontal/vertical lines only */}
            {/* Top trace - offset left */}
            <path d="M 350 15 L 350 80 L 380 80 L 380 150 L 365 150 L 365 255" className="circuit-trace" />
            {/* Top-right trace - long stepped path */}
            <path d="M 680 65 L 620 65 L 620 120 L 560 120 L 560 180 L 520 180 L 520 240 L 505 240 L 505 300" className="circuit-trace" />
            {/* Right trace - stepped horizontal */}
            <path d="M 770 420 L 690 420 L 690 400 L 620 400 L 620 425 L 560 425 L 560 420 L 530 420" className="circuit-trace" />
            {/* Bottom-right trace - stepped diagonal */}
            <path d="M 620 745 L 620 680 L 580 680 L 580 620 L 540 620 L 540 580 L 490 580 L 490 550 L 465 550 L 465 540" className="circuit-trace" />
            {/* Bottom trace - offset right */}
            <path d="M 430 780 L 430 720 L 450 720 L 450 660 L 425 660 L 425 600 L 435 600 L 435 530" className="circuit-trace" />
            {/* Bottom-left trace - long stepped path */}
            <path d="M 140 735 L 140 680 L 190 680 L 190 630 L 240 630 L 240 590 L 280 590 L 280 550 L 320 550 L 320 525 L 335 525" className="circuit-trace" />
            {/* Left trace - very long stepped */}
            <path d="M 25 370 L 90 370 L 90 390 L 150 390 L 150 375 L 210 375 L 210 385 L 270 385 L 270 380 L 315 380" className="circuit-trace" />
            {/* Top-left trace - stepped at steep angle */}
            <path d="M 165 95 L 165 140 L 210 140 L 210 180 L 250 180 L 250 220 L 290 220 L 290 260 L 330 260 L 330 290 L 365 290 L 365 305" className="circuit-trace" />
            
            {/* Electricity flow layer - animated pulses on straight paths */}
            <path d="M 350 15 L 350 80 L 380 80 L 380 150 L 365 150 L 365 255" stroke="url(#electricFlow1)" strokeWidth="5" strokeLinecap="round" fill="none" className="electric-flow" />
            <path d="M 680 65 L 620 65 L 620 120 L 560 120 L 560 180 L 520 180 L 520 240 L 505 240 L 505 300" stroke="url(#electricFlow2)" strokeWidth="5" strokeLinecap="round" fill="none" className="electric-flow" />
            <path d="M 770 420 L 690 420 L 690 400 L 620 400 L 620 425 L 560 425 L 560 420 L 530 420" stroke="url(#electricFlow3)" strokeWidth="5" strokeLinecap="round" fill="none" className="electric-flow" />
            <path d="M 620 745 L 620 680 L 580 680 L 580 620 L 540 620 L 540 580 L 490 580 L 490 550 L 465 550 L 465 540" stroke="url(#electricFlow1)" strokeWidth="5" strokeLinecap="round" fill="none" className="electric-flow" />
            <path d="M 430 780 L 430 720 L 450 720 L 450 660 L 425 660 L 425 600 L 435 600 L 435 530" stroke="url(#electricFlow2)" strokeWidth="5" strokeLinecap="round" fill="none" className="electric-flow" />
            <path d="M 140 735 L 140 680 L 190 680 L 190 630 L 240 630 L 240 590 L 280 590 L 280 550 L 320 550 L 320 525 L 335 525" stroke="url(#electricFlow3)" strokeWidth="5" strokeLinecap="round" fill="none" className="electric-flow" />
            <path d="M 25 370 L 90 370 L 90 390 L 150 390 L 150 375 L 210 375 L 210 385 L 270 385 L 270 380 L 315 380" stroke="url(#electricFlow1)" strokeWidth="5" strokeLinecap="round" fill="none" className="electric-flow" />
            <path d="M 165 95 L 165 140 L 210 140 L 210 180 L 250 180 L 250 220 L 290 220 L 290 260 L 330 260 L 330 290 L 365 290 L 365 305" stroke="url(#electricFlow2)" strokeWidth="5" strokeLinecap="round" fill="none" className="electric-flow" />
            
            {/* Connection nodes at the outer ends - asymmetric placement */}
            <circle cx="350" cy="15" r="8" className="circuit-node-end" />
            <circle cx="680" cy="65" r="8" className="circuit-node-end" />
            <circle cx="770" cy="420" r="8" className="circuit-node-end" />
            <circle cx="620" cy="745" r="8" className="circuit-node-end" />
            <circle cx="430" cy="780" r="8" className="circuit-node-end" />
            <circle cx="140" cy="735" r="8" className="circuit-node-end" />
            <circle cx="25" cy="370" r="8" className="circuit-node-end" />
            <circle cx="165" cy="95" r="8" className="circuit-node-end" />
            
            {/* Connection points at the center (hardware card) - asymmetric */}
            <circle cx="365" cy="255" r="5" className="circuit-node-center" />
            <circle cx="505" cy="300" r="5" className="circuit-node-center" />
            <circle cx="530" cy="420" r="5" className="circuit-node-center" />
            <circle cx="465" cy="540" r="5" className="circuit-node-center" />
            <circle cx="430" cy="530" r="5" className="circuit-node-center" />
            <circle cx="335" cy="525" r="5" className="circuit-node-center" />
            <circle cx="315" cy="380" r="5" className="circuit-node-center" />
            <circle cx="365" cy="305" r="5" className="circuit-node-center" />
          </svg>
          
          {/* Hardware Card in Center */}
          <div className="hardware-card">
            <div className="chip-icon">◆</div>
            <div className="connection-status">
              <span className="status-dot"></span>
              <span>System Online</span>
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

      {/* About Section (formerly separate page) */}
      <section className="about-section-home">
        <div className="about-hero">
          <h2 className="section-title">
            <span className="title-icon">◆</span>
            About HardwareHub
          </h2>
          <p className="section-tagline">
            Empowering the next generation of embedded systems developers
          </p>
        </div>

        <div className="about-content">
          <div className="content-block">
            <h3 className="block-title">▸ Our Mission</h3>
            <p className="block-text">
              HardwareHub is an educational platform designed to make embedded programming 
              accessible and engaging. We believe that learning hardware development shouldn't 
              require expensive equipment or complex setups - just curiosity and creativity.
            </p>
          </div>

          <div className="content-block">
            <h3 className="block-title">▸ What We Offer</h3>
            <div className="mini-features-grid">
              <div className="mini-feature">
                <div className="mini-icon">▣</div>
                <h4>Structured Learning</h4>
                <p>27 comprehensive lessons covering all IF MAGIC modules, from beginner to advanced topics.</p>
              </div>
              <div className="mini-feature">
                <div className="mini-icon">◆</div>
                <h4>Visual Project Builder</h4>
                <p>KiCad-style interface to wireframe and design your hardware projects before building.</p>
              </div>
              <div className="mini-feature">
                <div className="mini-icon">◈</div>
                <h4>Integrated Notes</h4>
                <p>Take notes as you learn with OpenNotes integration for better knowledge retention.</p>
              </div>
              <div className="mini-feature">
                <div className="mini-icon">◉</div>
                <h4>Skill-Based Learning</h4>
                <p>Personalized lesson access based on your experience level - beginner, intermediate, or advanced.</p>
              </div>
            </div>
          </div>

          <div className="content-block">
            <h3 className="block-title">▸ IF MAGIC Integration</h3>
            <p className="block-text">
              HardwareHub is built around the IF MAGIC platform - a revolutionary modular 
              hardware system that makes embedded programming tangible and fun. With 20 different 
              sensor and output modules, you can create everything from simple LED projects to 
              complex gesture-controlled systems.
            </p>
            <a 
              href="https://docs.ifmagic.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="external-link"
            >
              Learn more about IF MAGIC →
            </a>
          </div>

          <div className="content-block">
            <h3 className="block-title">▸ Who We Are</h3>
            <p className="block-text">
              HardwareHub was created for CruzHacks 2026 by a team passionate about making 
              embedded systems education more accessible. We're students, hackers, and educators 
              who believe that everyone should have the opportunity to learn hardware development.
            </p>
          </div>

          <div className="content-block cta-block">
            <h3 className="block-title">▸ Get Started</h3>
            <p className="block-text">
              Ready to begin your embedded programming journey? Sign up today and get immediate 
              access to lessons tailored to your skill level. Whether you're a complete beginner 
              or an experienced developer, HardwareHub has something for you.
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="cta-btn primary">
                Start Learning
              </Link>
              <Link to="/projects" className="cta-btn secondary">
                Explore Projects
              </Link>
            </div>
          </div>

          <div className="content-block contact-block">
            <h3 className="block-title">▸ Contact</h3>
            <p className="block-text">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="contact-info">
              <a href="mailto:hello@hardwarehub.dev" className="contact-link">
                ▸ hello@hardwarehub.dev
              </a>
              <a href="https://github.com/hardwarehub" target="_blank" rel="noopener noreferrer" className="contact-link">
                ▸ GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
