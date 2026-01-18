import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface User {
  id: string;
  email: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  avatar_url?: string;
  auth0_id: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  sendOTP: (email: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  isAuthDisabled: boolean; // True when Auth0 is not available (non-HTTPS)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
  skipAuth0?: boolean; 
}

// Provider that uses Auth0
const AuthProviderWithAuth0 = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated: auth0IsAuthenticated, logout: auth0Logout } = useAuth0();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem('hardwareHubUser');
        const storedToken = localStorage.getItem('auth_token');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Clear corrupted data
        localStorage.removeItem('hardwareHubUser');
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Send OTP to user's email via Auth0 passwordless
  const sendOTP = async (email: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/otp/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  };

  // Login with OTP via Auth0 passwordless verification
  const login = async (email: string, otp: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to verify OTP');
      }

      const data = await response.json();
      
      // Store user data and token
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('hardwareHubUser', JSON.stringify(data.user));
      localStorage.setItem('auth_token', data.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hardwareHubUser');
    localStorage.removeItem('auth_token');
    
    // Also logout from Auth0 if using Auth0 provider
    if (auth0IsAuthenticated) {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      if (!token) {
        throw new Error('No token to refresh');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem('auth_token', data.token);
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    sendOTP,
    refreshToken,
    isAuthDisabled: false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Provider for when Auth0 is not available (non-HTTPS origins)
const AuthProviderWithoutAuth0 = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading] = useState(false);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: false,
    login: async () => { throw new Error('Auth not available on this origin'); },
    logout: () => { setUser(null); setToken(null); },
    sendOTP: async () => { throw new Error('Auth not available on this origin'); },
    refreshToken: async () => { throw new Error('Auth not available on this origin'); },
    isAuthDisabled: true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Main provider that chooses which implementation to use
export const AuthProvider = ({ children, skipAuth0 = false }: AuthProviderProps) => {
  if (skipAuth0) {
    return <AuthProviderWithoutAuth0>{children}</AuthProviderWithoutAuth0>;
  }
  return <AuthProviderWithAuth0>{children}</AuthProviderWithAuth0>;
};

// Hook for making authenticated API calls
export const useAuthenticatedFetch = () => {
  const { token, refreshToken } = useAuth();

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // If token is expired, try to refresh
      if (response.status === 401) {
        await refreshToken();
        
        // Retry with new token
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      return response;
    } catch (error) {
      console.error('Authenticated fetch error:', error);
      throw error;
    }
  };

  return authenticatedFetch;
};