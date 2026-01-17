import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1 className="hero-title">
          <span className="title-icon">◆</span>
          About HardwareHub
        </h1>
        <p className="hero-tagline">
          Empowering the next generation of embedded systems developers
        </p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2 className="section-title">▸ Our Mission</h2>
          <p className="section-text">
            HardwareHub is an educational platform designed to make embedded programming 
            accessible and engaging. We believe that learning hardware development shouldn't 
            require expensive equipment or complex setups - just curiosity and creativity.
          </p>
        </section>

        <section className="about-section">
          <h2 className="section-title">▸ What We Offer</h2>
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">▣</div>
              <h3>Structured Learning</h3>
              <p>27 comprehensive lessons covering all IF MAGIC modules, from beginner to advanced topics.</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">◆</div>
              <h3>Visual Project Builder</h3>
              <p>KiCad-style interface to wireframe and design your hardware projects before building.</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">◈</div>
              <h3>Integrated Notes</h3>
              <p>Take notes as you learn with OpenNotes integration for better knowledge retention.</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">◉</div>
              <h3>Skill-Based Learning</h3>
              <p>Personalized lesson access based on your experience level - beginner, intermediate, or advanced.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2 className="section-title">▸ IF MAGIC Integration</h2>
          <p className="section-text">
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
        </section>

        <section className="about-section">
          <h2 className="section-title">▸ Who We Are</h2>
          <p className="section-text">
            HardwareHub was created for CruzHacks 2026 by a team passionate about making 
            embedded systems education more accessible. We're students, hackers, and educators 
            who believe that everyone should have the opportunity to learn hardware development.
          </p>
        </section>

        <section className="about-section">
          <h2 className="section-title">▸ Get Started</h2>
          <p className="section-text">
            Ready to begin your embedded programming journey? Sign up today and get immediate 
            access to lessons tailored to your skill level. Whether you're a complete beginner 
            or an experienced developer, HardwareHub has something for you.
          </p>
          <div className="cta-buttons">
            <a href="/signup" className="cta-btn primary">
              Start Learning
            </a>
            <a href="/projects" className="cta-btn secondary">
              Explore Projects
            </a>
          </div>
        </section>

        <section className="about-section contact">
          <h2 className="section-title">▸ Contact</h2>
          <p className="section-text">
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
        </section>
      </div>
    </div>
  );
}

export default About;
