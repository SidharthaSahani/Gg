import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import CustomerBooking from './pages/CustomerBooking';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AboutUs from './pages/AboutUs';
import { useEffect } from 'react';

function App() {
  return (
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { sessionExpired, setSessionExpired } = useAuth();
  const location = useLocation();

  // Reset session expired flag when navigating away from login page
  useEffect(() => {
    if (location.pathname !== '/admin/login' && sessionExpired) {
      setSessionExpired(false);
    }
  }, [location.pathname, sessionExpired, setSessionExpired]);

  return (
    <div className="relative min-h-screen">
      <Routes>
        <Route path="/" element={<CustomerBooking />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* WhatsApp Icon - Fixed at bottom right (only on home, about, and contact pages) */}
      {(location.pathname === '/' || location.pathname === '/about') && (
        <a 
          href="https://wa.me/984-8675285" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 shadow-lg hover:scale-105 transition-transform duration-300"
          aria-label="Chat on WhatsApp"
        >
          <img 
            src="/whatapplogopng.png" 
            alt="WhatsApp" 
            className="w-16 h-16"
          />
        </a>
      )}
    </div>
  );
}

export default App;