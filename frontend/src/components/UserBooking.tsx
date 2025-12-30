import { useState, useEffect } from 'react';
import { tablesApi, bookingsApi, RestaurantTable, Booking, API_BASE_URL } from '../lib/api';
import { carouselService } from '../services/carouselService';
import TableGrid from './TableGrid';
import BookingForm, { BookingFormData } from './BookingForm';
import FoodMenu from './FoodMenu';
import Carousel from './Carousel';
import { CheckCircle2 } from 'lucide-react';

export default function UserBooking() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
    fetchBookings();
    fetchCarouselImages();
    // For our API, we'll poll for changes every 30 seconds
    const interval = setInterval(() => {
      fetchTables();
      fetchBookings();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedDate]);

  const fetchTables = async () => {
    try {
      const data = await tablesApi.getAll();
      setTables(data);
    } catch (error) {

    }
    setLoading(false);
  };

  const fetchBookings = async () => {
    try {
      const data = await bookingsApi.getAll();
      setBookings(data);
    } catch (error) {

    }
  };

  const fetchCarouselImages = async () => {
    try {
      const images = await carouselService.getImages();
      // Validate that images is an array before setting
      setCarouselImages(Array.isArray(images) ? images : [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1554679665-f5537f187268?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ]);
    } catch (error) {

      // Fallback to sample images if API fails
      setCarouselImages([
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1554679665-f5537f187268?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ]);
    }
  };

  const handleTableSelect = (table: RestaurantTable) => {
    setSelectedTable(table);
    // Reset time slot selection when changing tables
    setSelectedTimeSlot('');
  };

  const handleBookingSubmit = async (bookingData: BookingFormData) => {
    try {
      // Add the booking
      await bookingsApi.create(bookingData);
      
      // Refresh bookings immediately to prevent race conditions
      await fetchBookings();
      
      setSelectedTable(null);
      setSelectedTimeSlot('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error: any) {

      // Handle conflict error (time slot already booked)
      if (error.status === 409) {
        alert('This time slot is already booked for the selected table. Please choose a different time slot.');
        // Refresh bookings to show the current state
        await fetchBookings();
      } else {
        alert('Failed to submit booking. Please try again.');
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Reserve Your Table</h1>
        <p className="text-gray-600 text-sm sm:text-base">Select an available table and time slot to make your reservation</p>
      </div>

      {/* Carousel Section */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl">
          <Carousel images={carouselImages} />
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 sm:p-4 flex items-center gap-3 animate-pulse">
          <CheckCircle2 className="text-green-600" size={20} />
          <div>
            <p className="font-semibold text-green-800 text-sm sm:text-base">Booking Confirmed!</p>
            <p className="text-sm text-green-700">Your table has been successfully reserved.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">Booked</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">Loading tables...</div>
        ) : tables.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
            No tables available at the moment. Please check back later.
          </div>
        ) : (
          <TableGrid 
            tables={tables} 
            bookings={bookings}
            selectedDate={selectedDate}
            onTableSelect={handleTableSelect} 
          />
        )}
      </div>

      <FoodMenu />

      {selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Book Table {selectedTable.table_number}</h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time Slot *
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  <option value="">Choose a time slot</option>
                  {/* Time slots from 10 AM to 11 PM */}
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                  <option value="22:00">10:00 PM</option>
                  <option value="23:00">11:00 PM</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedTable(null);
                    setSelectedTimeSlot('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedTimeSlot) {
                      // Close the modal - the BookingForm will be rendered below with the selected time slot
                      setSelectedTable(null);
                    } else {
                      alert('Please select a time slot');
                      return;
                    }
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTable && selectedTimeSlot && (
        <BookingForm
          table={selectedTable}
          onClose={() => {
            setSelectedTable(null);
            setSelectedTimeSlot('');
          }}
          onSubmit={handleBookingSubmit}
          initialTime={selectedTimeSlot}
          initialDate={selectedDate}
        />
      )}
    </div>
  );
}