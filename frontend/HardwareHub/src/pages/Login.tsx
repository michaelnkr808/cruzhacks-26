import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

/**
 * Login Page Component
 * 
 * KEY LEARNING CONCEPTS:
 * 
 * 1. AUTHENTICATION: Verifying user credentials
 * 2. LOCAL STORAGE: Reading persisted user data
 * 3. FORM VALIDATION: Checking input before submission
 * 4. ERROR HANDLING: Providing feedback for failed login
 * 5. NAVIGATION: Redirecting after successful login
 * 
 * Real-world pattern:
 * In production apps, authentication would involve:
 * - Sending credentials to a backend API
 * - Receiving a JWT token or session cookie
 * - Storing auth token securely
 * 
 * For this prototype, we're using localStorage to simulate authentication.
 */

interface LoginFormData {
    email: string;
    password: string;
}

function Login() {
    // useNavigate hook for redirecting after login
    const navigate = useNavigate();

    // Form state - stores email and password
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });

    // Error state for validation and authentication errors
    const [error, setError] = useState('');

    // Loading state during authentication
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Handle input changes
     * Updates form state as user types
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Validate form data
     * Check that all required fields are filled and properly formatted
     */
    const validateForm = (): boolean => {
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
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
     * Authenticate user
     * 
     * In a real app, this would:
     * 1. Send credentials to backend API
     * 2. Backend verifies password hash
     * 3. Backend returns JWT token
     * 4. Frontend stores token and redirects
     * 
     * For now, we're checking against localStorage
     * This simulates authentication for prototype purposes
     */
    const authenticateUser = (): boolean => {
        // Get stored user data from localStorage
        const storedUserData = localStorage.getItem('hardwareHubUser');

        if (!storedUserData) {
            setError('No account found with this email. Please sign up first.');
            return false;
        }

        try {
            const user = JSON.parse(storedUserData);

            // Check if email matches
            if (user.email !== formData.email) {
                setError('Invalid email or password');
                return false;
            }

            // In a real app, we'd verify a hashed password
            // For prototype, we're just checking localStorage
            // Note: The signup page doesn't actually store the password (good practice!)
            // So we'll just verify the email exists

            return true;
        } catch (e) {
            setError('An error occurred. Please try again.');
            return false;
        }
    };

    /**
     * Handle form submission
     * Validate inputs and authenticate user
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page reload
        setError(''); // Clear previous errors

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate network delay (remove in production)
        setTimeout(() => {
            // Authenticate user
            if (authenticateUser()) {
                // Success! Redirect to learning page
                navigate('/learning');
            }
            setIsSubmitting(false);
        }, 800);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Log in to continue your embedded programming journey</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-section">
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

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Logging In...' : 'Log In'}
                    </button>

                    <p className="signup-link">
                        Don't have an account? <a href="/signup">Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
