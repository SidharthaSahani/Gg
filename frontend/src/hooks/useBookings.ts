import { useState, useEffect, useMemo } from 'react';
import { bookingsApi, Booking } from '../lib/api';

export const useBookings = (selectedDate: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingsApi.getAll();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const releaseBooking = async (bookingId: string) => {
    try {
      setIsLoading(true);
      await bookingsApi.update(bookingId, { status: 'completed' });
      await fetchBookings();
      setError(null);
    } catch (err) {
      setError('Failed to release booking');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => booking.booking_date === selectedDate);
  }, [bookings, selectedDate]);

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    filteredBookings,
    isLoading,
    error,
    fetchBookings,
    releaseBooking
  };
};