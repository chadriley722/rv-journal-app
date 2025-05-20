import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username: string; // Assuming username is part of the User type
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Add loading state
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>; // Assuming registration needs name
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initialize loading as true
  const isAuthenticated = !!user;

  useEffect(() => {
    const checkAuth = async () => {
      // Check if a token exists in local storage
      const token = localStorage.getItem('token');
      console.log('AuthContext useEffect: Checking for token in localStorage', token ? 'Token found' : 'No token');

      if (!token) {
        // No token, user is not logged in. Do not attempt to fetch profile.
        setUser(null);
        setIsLoading(false); // Set loading to false if no token
        return;
      }

      try {
        // Attempt to fetch user profile with the token
        console.log('AuthContext useEffect: Attempting to fetch user profile with token');
        const response = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('AuthContext useEffect: User profile fetch response status:', response.status);
        if (response.ok) {
          const userData = await response.json();
          console.log('AuthContext useEffect: User data fetched successfully', userData);
          setUser(userData);
        } else {
          // Token might be invalid or expired, clear storage and set user to null
          localStorage.removeItem('token');
          setUser(null);
          console.error('Failed to fetch user profile with token', response.status);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // On error, assume not authenticated and clear token
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false); // Set loading to false after check
      }
    };

    checkAuth();
  }, []); // Empty dependency array means this runs once on mount

  const login = async (email: string, password: string) => {
    setIsLoading(true); // Set loading on login attempt
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const result = await response.json();
      localStorage.setItem('token', result.token); // Store the token
      setUser(result.user); // Set user data
    } finally {
      setIsLoading(false); // Set loading to false after login attempt
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true); // Set loading on register attempt
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      localStorage.setItem('token', result.token); // Store the token
      setUser(result.user); // Set user data
    } finally {
      setIsLoading(false); // Set loading to false after register attempt
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove the token
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 