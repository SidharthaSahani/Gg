import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  sessionExpired: boolean;
  setSessionExpired: (expired: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
  email: 'admin@restaurant.com',
  password: 'admin123',
};

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const savedSession = localStorage.getItem('adminSession');
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      const now = Date.now();
      
      // Check if session is still valid (within 15 minutes)
      if (now - sessionData.timestamp < SESSION_TIMEOUT) {
        setIsAdminLoggedIn(true);
        setAdminEmail(sessionData.email);
        resetSessionTimer();
      } else {
        // Session expired, clear it
        localStorage.removeItem('adminSession');
        setSessionExpired(true);
      }
    }
  }, []);

  // Reset the session timer
  const resetSessionTimer = () => {
    // Clear existing timer
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }
    
    // Set new timer
    const timer = setTimeout(() => {
      logout(); // Automatically logout when timer expires
      setSessionExpired(true);
    }, SESSION_TIMEOUT);
    
    setSessionTimer(timer);
  };

  // Reset timer on user activity
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const handleUserActivity = () => {
      resetSessionTimer();
    };

    // Listen for user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    // Set initial timer
    resetSessionTimer();

    return () => {
      // Cleanup event listeners and timer
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
    };
  }, [isAdminLoggedIn]);

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAdminLoggedIn(true);
      setAdminEmail(email);
      setSessionExpired(false);
      localStorage.setItem('adminSession', JSON.stringify({ email, timestamp: Date.now() }));
      resetSessionTimer(); // Start the session timer
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
    localStorage.removeItem('adminSession');
    
    // Clear timer
    if (sessionTimer) {
      clearTimeout(sessionTimer);
      setSessionTimer(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAdminLoggedIn, adminEmail, login, logout, sessionExpired, setSessionExpired }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}