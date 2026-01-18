import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

// TypeScript interface for our form data
// This ensures we handle all the required fields
interface FormData {
  name: string;
  email: string;
  // password: string; // removed for OTP flow
  // Survey questions
  hasEmbeddedExperience: string;
  hasHardwareExperience: string;
  hasProgrammingExperience: string;
  motivationLevel: string;
}

// User level type for classification
export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

function Signup() {
  // useNavigate hook for redirecting after signup
  const navigate = useNavigate();
  
  // Form state - stores all form field values
  // This is a common pattern: one state object for all form data
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    hasEmbeddedExperience: '',
    hasHardwareExperience: '',
    hasProgrammingExperience: '',
    motivationLevel: ''
  });
  const [otp, setOTP] = useState('');
  const [step, setStep] = useState<'info' | 'otp'>('info');
  
  // Error state for validation messages
  const [error, setError] = useState('');
  
  // Loading state for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Handle input changes
   * This is called every time a user types or selects something
   * 
   * The spread operator (...formData) copies existing data,
   * then we update just the changed field. This is called "immutable updates"
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOTP(e.target.value);
  };
  
  /**
   * Classification Algorithm
   * 
   * This function analyzes survey responses and determines user level.
   * Think of it as a "smart sorting hat" for skill level!
   * 
   * Logic:
   * - If user says "yes" to embedded + hardware experience → Advanced
   * - If user has some programming experience → Intermediate
   * - Otherwise → Beginner
   */
  const determineUserLevel = (): UserLevel => {
    const { hasEmbeddedExperience, hasHardwareExperience, hasProgrammingExperience } = formData;
    
    // Advanced: Has both embedded and hardware experience
    if (hasEmbeddedExperience === 'yes' && hasHardwareExperience === 'yes') {
      return 'advanced';
    }
    
    // Intermediate: Has programming experience or some hardware knowledge
    if (hasProgrammingExperience === 'proficient' || 
        hasProgrammingExperience === 'expert' ||
        hasHardwareExperience === 'yes') {
      return 'intermediate';
    }
    
    // Beginner: New to most of this
    return 'beginner';
  };
  
  /**
   * Validate form data
   * Check that all required fields are filled
   * Return true if valid, false if not
   */
  const validateForm = (): boolean => {
    if (!formData.name || !formData.email) {
      setError('Please fill in all account fields');
      return false;
    }
    if (!formData.hasEmbeddedExperience || !formData.hasHardwareExperience || 
        !formData.hasProgrammingExperience || !formData.motivationLevel) {
      setError('Please answer all survey questions');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };
  
  /**
   * Handle form submission
   * 
   * In a real app, this would:
   * 1. Send data to a backend API
   * 2. Create user account in database
   * 3. Return authentication token
   * 
   * For now, we're using localStorage (browser storage)
   * to simulate user accounts. Good for prototypes!
   */
  // Step 1: Request OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      if (!res.ok) throw new Error('Failed to request OTP');
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Error requesting OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP and create user
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const userLevel = determineUserLevel();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp,
          name: formData.name,
          level: userLevel
        })
      });
      if (!res.ok) throw new Error('OTP verification failed');
      const { user, token } = await res.json();
      localStorage.setItem('hardwareHubUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      navigate('/learning');
    } catch (err: any) {
      setError(err.message || 'Error verifying OTP');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1>Join HardwareHub</h1>
          <p>Start your embedded programming journey today!</p>
        </div>
        {step === 'info' ? (
          <form onSubmit={handleRequestOTP} className="signup-form">
            {/* Account Information Section */}
            <div className="form-section">
              <h2>Account Information</h2>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            {/* Experience Survey Section */}
            <div className="form-section survey-section">
              <h2>▣ Quick Experience Survey</h2>
              <p className="survey-description">
                Help us personalize your learning experience by answering a few questions.
                This will determine which modules you can access.
              </p>
              {/* ...existing survey code... */}
              <div className="form-group">
                <label>
                  Have you worked with embedded systems before?
                </label>
                <div className="button-group">
                  <button
                    type="button"
                    className={`option-button ${formData.hasEmbeddedExperience === 'yes' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, hasEmbeddedExperience: 'yes' }))}
                  >
                    <span className="option-icon">✓</span>
                    <span className="option-text">Yes, I have experience</span>
                  </button>
                  <button
                    type="button"
                    className={`option-button ${formData.hasEmbeddedExperience === 'no' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, hasEmbeddedExperience: 'no' }))}
                  >
                    <span className="option-icon">✗</span>
                    <span className="option-text">No, I'm completely new</span>
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>
                  Have you worked with physical hardware (Arduino, Raspberry Pi, etc.)?
                </label>
                <div className="button-group">
                  <button
                    type="button"
                    className={`option-button ${formData.hasHardwareExperience === 'yes' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, hasHardwareExperience: 'yes' }))}
                  >
                    <span className="option-icon">◆</span>
                    <span className="option-text">Yes, built projects</span>
                  </button>
                  <button
                    type="button"
                    className={`option-button ${formData.hasHardwareExperience === 'some' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, hasHardwareExperience: 'some' }))}
                  >
                    <span className="option-icon">◈</span>
                    <span className="option-text">Tinkered a bit</span>
                  </button>
                  <button
                    type="button"
                    className={`option-button ${formData.hasHardwareExperience === 'no' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, hasHardwareExperience: 'no' }))}
                  >
                    <span className="option-icon">○</span>
                    <span className="option-text">Complete beginner</span>
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>
                  How would you rate your programming experience?
                </label>
                <div className="button-group">
                  <button
                    type="button"
                    className={`option-button ${formData.hasProgrammingExperience === 'none' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, hasProgrammingExperience: 'none' }))}
                  >
                    <span className="option-icon">○</span>
                    <span className="option-text">No experience</span>
                  </button>
                  <button
                    type="button"
                    className={`option-button ${formData.hasProgrammingExperience === 'basic' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, hasProgrammingExperience: 'basic' }))}
                  >
                    <span className="option-icon">▣</span>
                    <span className="option-text">Basic</span>
                  </button>
                  <button
                    type="button"
                    className={`option-button ${formData.hasProgrammingExperience === 'proficient' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, hasProgrammingExperience: 'proficient' }))}
                  >
                    <span className="option-icon">◆</span>
                    <span className="option-text">Proficient</span>
                  </button>
                  <button
                    type="button"
                    className={`option-button ${formData.hasProgrammingExperience === 'expert' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, hasProgrammingExperience: 'expert' }))}
                  >
                    <span className="option-icon">★</span>
                    <span className="option-text">Expert</span>
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>
                  What's your main goal with HardwareHub?
                </label>
                <div className="button-group">
                  <button
                    type="button"
                    className={`option-button ${formData.motivationLevel === 'learn' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, motivationLevel: 'learn' }))}
                  >
                    <span className="option-icon">◉</span>
                    <span className="option-text">Learn something new</span>
                  </button>
                  <button
                    type="button"
                    className={`option-button ${formData.motivationLevel === 'project' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, motivationLevel: 'project' }))}
                  >
                    <span className="option-icon">◆</span>
                    <span className="option-text">Build a project</span>
                  </button>
                  <button
                    type="button"
                    className={`option-button ${formData.motivationLevel === 'career' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, motivationLevel: 'career' }))}
                  >
                    <span className="option-icon">▲</span>
                    <span className="option-text">Career development</span>
                  </button>
                  <button
                    type="button"
                    className={`option-button ${formData.motivationLevel === 'hobby' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, motivationLevel: 'hobby' }))}
                  >
                    <span className="option-icon">◈</span>
                    <span className="option-text">Fun hobby</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Error Message */}
            {error && (
              <div className="error-message">
                ⚠ {error}
              </div>
            )}
            {/* Submit Button */}
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
            <p className="login-link">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="signup-form">
            <div className="form-section">
              <h2>Enter OTP</h2>
              <div className="form-group">
                <label htmlFor="otp">OTP Code</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={handleOTPChange}
                  placeholder="Enter the code sent to your email"
                  required
                />
              </div>
            </div>
            {/* Error Message */}
            {error && (
              <div className="error-message">
                ⚠ {error}
              </div>
            )}
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
            <p className="login-link">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;
