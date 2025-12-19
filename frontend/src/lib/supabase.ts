import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface RestaurantTable {
  id: string;
  table_number: string;
  capacity: number;
  status: 'available' | 'booked';
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  table_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_guests: number;
  booking_date: string;
  booking_time: string;
  special_requests?: string;
  created_at: string;
}

export interface FoodMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  available: boolean;
  created_at: string;
  updated_at: string;
}
