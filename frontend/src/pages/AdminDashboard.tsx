import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminPanel from '../components/AdminPanel';
import Navbar from '../components/Navbar';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { isAdminLoggedIn, adminEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  // Show session warning 1 minute before expiration
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const warningTimer = setTimeout(() => {
      setShowSessionWarning(true);
    }, 14 * 60 * 1000); // 14 minutes (1 minute before 15-min timeout)

    return () => {
      clearTimeout(warningTimer);
    };
  }, [isAdminLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!isAdminLoggedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {showSessionWarning && (
        <div className="fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg z-50">
          <p className="font-medium">Session Expiring Soon</p>
          <p className="text-sm">Your session will expire in 1 minute due to inactivity.</p>
        </div>
      )}

      <Navbar isAdmin={true} adminEmail={adminEmail || undefined} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto py-4 sm:py-6">
        <AdminPanel />
      </main>
      
      <footer id="contact-footer" className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Grill & Gathering</h3>
              <p className="text-gray-300">Experience the finest dining with our delicious food and excellent service.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-white transition">Home</a></li>
                <li><a href="/about" className="text-gray-300 hover:text-white transition">About Us</a></li>
                <li><a 
                  href="#contact-footer" 
                  onClick={(e) => {
                    e.preventDefault();
                    const footerElement = document.getElementById('contact-footer');
                    if (footerElement) {
                      footerElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-gray-300 hover:text-white transition"
                >
                  Contact
                </a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-300">
                {/* <a href="9840923097"> 📞 9840923097</a> */}
                <li>📞 9840923097 </li>
                <li>📞 9848675285 </li>
                <li>✉️ info@grillandgathering.com</li>
                <li>📍 Grills and Gather ,Balkot </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Grill & Gathering. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}