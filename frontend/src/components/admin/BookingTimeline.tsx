import { Clock } from 'lucide-react';
import { Booking } from '../../lib/api';
import { TIME_SLOTS, getTimeSlotBookings } from '../../utils/bookingUtils';

interface BookingTimelineProps {
  tableId: string;
  bookings: Booking[];
  onReleaseBooking: (bookingId: string) => Promise<void>;
}

export const BookingTimeline = ({ tableId, bookings, onReleaseBooking }: BookingTimelineProps) => {
  return (
    <div className="ml-4">
      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <Clock size={16} />
        Time Slot Bookings
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {TIME_SLOTS.map(timeSlot => {
          const slotBookings = getTimeSlotBookings(bookings, tableId, timeSlot);
          return (
            <div key={`${tableId}-${timeSlot}`} className="border rounded-lg p-3 bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{timeSlot}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  slotBookings.length > 0 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {slotBookings.length > 0 ? 'Booked' : 'Available'}
                </span>
              </div>
              {slotBookings.length > 0 ? (
                <div className="space-y-2">
                  {slotBookings.map(booking => (
                    <div key={booking.id} className="border-l-2 border-blue-500 pl-2">
                      <div className="text-sm font-medium">{booking.customer_name}</div>
                      <div className="text-xs text-gray-600">
                        {booking.booking_date} • {booking.number_of_guests} guests
                      </div>
                      {booking.special_requests && (
                        <div className="text-xs text-gray-500 mt-1">
                          Special: {booking.special_requests}
                        </div>
                      )}
                      <button
                        onClick={() => onReleaseBooking(booking.id)}
                        className="mt-2 text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        Release
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500">No bookings</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};