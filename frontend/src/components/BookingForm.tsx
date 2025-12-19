import { useState } from 'react';
import { RestaurantTable } from '../lib/api';
import { X } from 'lucide-react';

interface BookingFormProps {
  table: RestaurantTable;
  onClose: () => void;
  onSubmit: (bookingData: BookingFormData) => void;
  initialTime?: string;
  initialDate?: string;
}

export interface BookingFormData {
  table_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_guests: number;
  booking_date: string;
  booking_time: string;
  special_requests: string;
}

export default function BookingForm({ table, onClose, onSubmit, initialTime, initialDate }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    table_id: table.id,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    number_of_guests: 1,
    booking_date: initialDate || '',
    booking_time: initialTime || '',
    special_requests: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'number_of_guests' ? parseInt(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Book Table {table.table_number}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Your Email"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="+977 1234567890"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Number of Guests *
            </label>
            <input
              type="number"
              name="number_of_guests"
              value={formData.number_of_guests}
              onChange={handleChange}
              required
              min="1"
              max={table.capacity}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Maximum {table.capacity} guests for this table
            </p>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Booking Date *
            </label>
            <input
              type="date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Booking Time *
            </label>
            <input
              type="time"
              name="booking_time"
              value={formData.booking_time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Special Requests
            </label>
            <textarea
              name="special_requests"
              value={formData.special_requests}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Any dietary restrictions or special requirements..."
            />
          </div>

          <div className="flex gap-2 sm:gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
