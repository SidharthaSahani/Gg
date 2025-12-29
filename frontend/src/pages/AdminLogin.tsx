import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we were redirected due to session expiration
  const sessionExpired = location.state?.sessionExpired;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (login(email, password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          <div className="flex justify-center mb-6 sm:mb-8">
            <img src="/logoHD.png" alt="Grill & Gathering Logo" className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-contain" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">Admin Login</h1>
          <p className="text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Restaurant Management System</p>

          {sessionExpired && (
            <div className="mb-6 bg-yellow-50 border-2 border-yellow-500 rounded-lg p-3 sm:p-4 flex items-center gap-3">
              <AlertCircle className="text-yellow-600" size={20} />
              <p className="text-yellow-700 font-medium text-sm sm:text-base">Your session has expired. Please log in again.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-lg p-3 sm:p-4 flex items-center gap-3">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm sm:text-base"
                placeholder="admin@restaurant.com"
              />
              {/* <p className="text-xs text-gray-500 mt-1">Demo: admin@restaurant.com</p> */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm sm:text-base"
                placeholder="••••••••"
              />
              {/* <p className="text-xs text-gray-500 mt-1">Demo: admin123</p> */}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 sm:px-6 sm:py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold disabled:opacity-50 mt-6 text-sm sm:text-base"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
}