import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

/**
 * Login Page Component - Password + OTP 2FA Authentication
 * 
 * KEY LEARNING CONCEPTS:
 * 
 * 1. TWO-FACTOR AUTH: Password + verification code
 * 2. TWO-STEP FLOW: Verify password → Send OTP → Verify OTP
 * 3. FORM VALIDATION: Checking input before submission
 * 4. ERROR HANDLING: Providing feedback for failed login
 * 5. NAVIGATION: Redirecting after successful login
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type LoginStep = 'credentials' | 'otp';

function Login() {
    const navigate = useNavigate();

    // Current step in login flow
    const [step, setStep] = useState<LoginStep>('credentials');

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    // Error and loading states
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Step 1: Verify password and request OTP
     */
    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!password || password.length < 6) {
            setError('Please enter your password');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid credentials');
            }

            // Move to OTP verification step
            setStep('otp');
        } catch (err: any) {
            setError(err.message || 'Failed to login. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Step 2: Verify OTP and complete login
     */
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!otp || otp.length !== 6) {
            setError('Please enter the 6-digit code');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid verification code');
            }

            // Store user data and token
            localStorage.setItem('hardwareHubUser', JSON.stringify(data.user));
            localStorage.setItem('authToken', data.token);

            // Redirect to learning page
            navigate('/learning');
        } catch (err: any) {
            setError(err.message || 'Failed to verify code. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Log in to continue your embedded programming journey</p>
                </div>

                {step === 'credentials' ? (
                    <form onSubmit={handleRequestOTP} className="login-form">
                        <div className="form-section">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

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
                            {isSubmitting ? 'Verifying...' : 'Continue'}
                        </button>

                        <p className="signup-link">
                            Don't have an account? <a href="/signup">Sign up</a>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="login-form">
                        <div className="form-section">
                            <p className="otp-info">
                                We sent a 6-digit code to <strong>{email}</strong>
                            </p>
                            <div className="form-group">
                                <label htmlFor="otp">Enter Verification Code</label>
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="123456"
                                    maxLength={6}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

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
                            {isSubmitting ? 'Verifying...' : 'Log In'}
                        </button>

                        <button
                            type="button"
                            className="back-button"
                            onClick={() => {
                                setStep('credentials');
                                setOtp('');
                                setError('');
                            }}
                        >
                            ← Back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login;
