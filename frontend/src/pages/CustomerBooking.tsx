import { useNavigate } from 'react-router-dom';
import UserBooking from '../components/UserBooking';
import { UtensilsCrossed } from 'lucide-react';

export default function CustomerBooking() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* <UtensilsCrossed className="text-orange-600" size={24} /> */}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Grill & Gathering</h1>
            </div>

            {/* <button
              onClick={() => navigate('/admin/login')}
              className="px-3 py-2 sm:px-4 sm:py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition text-sm sm:text-base" > Admin
            </button> */}

          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-4 sm:py-6">
        <UserBooking />
      </main>
    </div>
  );
}
