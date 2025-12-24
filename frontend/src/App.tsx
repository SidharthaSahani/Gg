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
    <Routes>
      <Route path="/" element={<CustomerBooking />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;