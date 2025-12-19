import { RestaurantTable, Booking } from '../lib/api';

interface TableGridProps {
  tables: RestaurantTable[];
  bookings: Booking[];
  selectedDate: string;
  onTableSelect: (table: RestaurantTable) => void;
}

export default function TableGrid({ tables, bookings, selectedDate, onTableSelect }: TableGridProps) {
  // Define all time slots
  const TIME_SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
  
  // Check if a time slot is booked for a specific table
  const isTimeSlotBooked = (tableId: string, timeSlot: string) => {
    return bookings.some(booking => 
      booking.table_id === tableId && 
      booking.booking_date === selectedDate && 
      booking.booking_time === timeSlot &&
      booking.status !== 'completed'
    );
  };
  
  // Check if a table has any available time slots
  const hasAvailableSlots = (tableId: string) => {
    return TIME_SLOTS.some(timeSlot => !isTimeSlotBooked(tableId, timeSlot));
  };

  return (
    <div className="space-y-6">
      {tables.map((table) => {
        const available = hasAvailableSlots(table.id);
        
        return (
          <div key={table.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Table {table.table_number}</h3>
                <p className="text-sm text-gray-600">{table.capacity} seats</p>
              </div>
              <button
                onClick={() => onTableSelect(table)}
                disabled={!available}
                className={`px-4 py-2 rounded-md text-sm sm:text-base ${
                  available 
                    ? 'bg-orange-600 text-white hover:bg-orange-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {available ? 'Book Table' : 'Fully Booked'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {TIME_SLOTS.map(timeSlot => {
                const booked = isTimeSlotBooked(table.id, timeSlot);
                return (
                  <div
                    key={`${table.id}-${timeSlot}`}
                    className={`p-2 sm:p-3 rounded-lg border transition-all duration-200 text-center ${
                      booked 
                        ? 'bg-red-50 border-red-500 text-red-600' 
                        : 'bg-green-50 border-green-500 text-green-600'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-medium">{timeSlot}</div>
                    <div className="text-xs mt-1">{booked ? 'Booked' : 'Available'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}