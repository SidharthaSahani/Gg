import { Clock } from 'lucide-react';
import { Booking } from '../../lib/api';
import { useBookings } from '../../hooks/useBookings';
import { useTables } from '../../hooks/useTables';

interface BookingsTableProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const BookingsTable = ({ selectedDate, onDateChange }: BookingsTableProps) => {
  const { filteredBookings, fetchBookings } = useBookings(selectedDate);
  const { tables } = useTables();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 className="text-xl sm:text-xl font-bold text-gray-800">Recent Bookings</h3>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
          />
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm sm:text-base"
          >
            <Clock size={16} className="sm:size-18" />
            Refresh
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Customer</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Email</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Contact No</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Guests</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Time</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Table</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Special Requests</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.filter(booking => booking.status !== 'completed').slice(0, 10).map((booking) => {
              return (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-sm sm:text-base">{booking.customer_name}</td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-sm sm:text-base">{booking.customer_email}</td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-sm sm:text-base">{booking.customer_phone}</td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-sm sm:text-base">{booking.number_of_guests}</td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4">
                    <div className="text-xs sm:text-sm">
                      <div className="text-gray-500">{booking.booking_time}</div>
                    </div>
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 font-medium text-sm sm:text-base">
                    {booking.table_id ? 
                      tables.find(table => table.id === booking.table_id)?.table_number || booking.table_id 
                      : 'N/A'}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 text-sm sm:text-base">
                    {booking.special_requests || '-'}
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status || 'confirmed'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredBookings.filter(booking => booking.status !== 'completed').length === 0 && (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
            No active bookings yet for {selectedDate}.
          </div>
        )}
      </div>
    </div>
  );
};