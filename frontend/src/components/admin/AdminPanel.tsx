// ============================================
// FILE: components/admin/AdminPanel.tsx (Main Component)
// ============================================
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTables } from '../../hooks/useTables';
import { useBookings } from '../../hooks/useBookings';
import { CarouselManagement } from './CarouselManagement';
import { TablesManagement } from './TablesManagement';
import { BookingsTable } from './BookingsTable';
import FoodManagement from '../FoodManagement';

export default function AdminPanel() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  const { fetchTables } = useTables();
  const { fetchBookings } = useBookings(selectedDate);

  const handleRefreshAll = async () => {
    try {
      await fetchTables();
      await fetchBookings();
    } catch (error) {

    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Panel</h2>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
          />
          <button
            onClick={handleRefreshAll}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm sm:text-base"
          >
            <RefreshCw size={16} className="sm:size-18" />
            Refresh All
          </button>
        </div>
      </div>

      <CarouselManagement />
      <TablesManagement selectedDate={selectedDate} />
      <BookingsTable selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <FoodManagement />
    </div>
  );
}