import { Booking } from '../lib/api';

export const TIME_SLOTS = [
  '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00',
  '22:00', '23:00'
];

export const getTableBookings = (bookings: Booking[], tableId: string) => {
  return bookings.filter(b => b.table_id === tableId && b.status !== 'completed');
};

export const getTimeSlotBookings = (
  bookings: Booking[],
  tableId: string,
  timeSlot: string
) => {
  return bookings.filter(
    b => b.table_id === tableId &&
         b.booking_time === timeSlot &&
         b.status !== 'completed'
  );
};

