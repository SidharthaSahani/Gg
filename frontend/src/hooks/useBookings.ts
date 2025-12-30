// ============================================
// FILE: hooks/useBookings.ts
// ============================================
import { useState, useEffect, useMemo } from 'react';
import { bookingsApi, Booking } from '../lib/api';

export const useBookings = (selectedDate: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingsApi.getAll();

      setBookings(data);
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const releaseBooking = async (bookingId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await bookingsApi.update(bookingId, { status: 'completed' });
      await fetchBookings(); // Refresh after updating
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Failed to release booking');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Filter bookings by selected date
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const bookingDate = booking.booking_date;
      return bookingDate === selectedDate;
    });
  }, [bookings, selectedDate]);

  // Fetch bookings when selected date changes
  useEffect(() => {
    fetchBookings();
  }, [selectedDate]);

  return {
    bookings,
    filteredBookings,
    isLoading,
    error,
    fetchBookings, // ✅ Exposed for refresh button
    releaseBooking
  };
};