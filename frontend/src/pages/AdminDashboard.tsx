import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminPanel from '../components/AdminPanel';
import { LogOut, Target } from 'lucide-react';
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

      <nav className="bg-white shadow-md border-b-4 border-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-3 sm:py-4">
            <div className="text-xl sm:text-2xl font-bold text-gray-800">
              Restaurant Admin
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Admin:</span> {adminEmail}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm sm:text-base"
              >
                <LogOut size={16} className="sm:size-18" />
                Logout
              </button>

              {/* home button  */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 sm:px-4 sm:py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition text-sm sm:text-base"
              >
                Home
              </a>

            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-4 sm:py-6">
        <AdminPanel />
      </main>
    </div>
  );
}