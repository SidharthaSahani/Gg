// lib/api.ts - FIXED VERSION
// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're running in development mode or production
  if (typeof window !== 'undefined') {
    // Client-side: Use localhost for development, production URL otherwise
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocalhost ? 'http://localhost:8080' : 'https://gg-d25n.onrender.com';
  }
  return 'https://gg-d25n.onrender.com'; // Default to production
};

export const API_BASE_URL = getApiBaseUrl();

// Custom error class
class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

// Standard API response structure from backend
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Helper function to make API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get admin token from localStorage if available
  const adminSession = localStorage.getItem('adminSession');
  let authHeader = {};
  
  if (adminSession) {
    // For demo purposes, we'll use a simple approach
    // In a real application, you would use a proper JWT token
    const sessionData = JSON.parse(adminSession);
    // Create a simple token based on the session
    const token = btoa(encodeURIComponent(sessionData.email));
    authHeader = { 'Authorization': `Bearer ${token}` };
  }
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader, // Include auth header if available
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new HttpError(
        response.status, 
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }
    
    // Handle new backend response format
    const result: ApiResponse<T> = await response.json();
    
    // If backend returns { success, data }, extract data
    if ('data' in result) {
      return result.data as T;
    }
    
    // Otherwise return the whole response (for legacy endpoints)
    return result as T;
  } catch (error) {
    
    throw error;
  }
}

// Helper for multipart form data (file uploads)
async function apiUpload<T>(endpoint: string, formData: FormData): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get admin token from localStorage if available
  const adminSession = localStorage.getItem('adminSession');
  let authHeader = {};
  
  if (adminSession) {
    const sessionData = JSON.parse(adminSession);
    const token = btoa(encodeURIComponent(sessionData.email));
    authHeader = { 'Authorization': `Bearer ${token}` };
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: authHeader, // Include auth header for admin uploads
      body: formData,
      // Don't set Content-Type, browser will set it with boundary
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new HttpError(
        response.status, 
        errorData.error || `Upload failed! status: ${response.status}`
      );
    }
    
    const result: ApiResponse<T> = await response.json();
    return 'data' in result ? (result.data as T) : (result as T);
  } catch (error) {
    
    throw error;
  }
}

// ==================== TABLES API ====================
export const tablesApi = {
  getAll: () => apiRequest<RestaurantTable[]>('/api/tables'),
  
  create: (table: Omit<RestaurantTable, 'id' | 'created_at' | 'updated_at'>) => 
    apiRequest<RestaurantTable>('/api/tables', {
      method: 'POST',
      body: JSON.stringify({
        ...table,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }),
    
  update: (id: string, updates: Partial<RestaurantTable>) => 
    apiRequest<RestaurantTable>(`/api/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...updates,
        updated_at: new Date().toISOString()
      })
    }),
    
  delete: (id: string) => 
    apiRequest<void>(`/api/tables/${id}`, { method: 'DELETE' })
};

// ==================== BOOKINGS API ====================
export const bookingsApi = {
  getAll: () => apiRequest<Booking[]>('/api/bookings'),
  
  create: (booking: Omit<Booking, 'id' | 'created_at'>) => 
    apiRequest<Booking>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        ...booking,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        status: 'confirmed'
      })
    }),
    
  update: (id: string, updates: Partial<Booking>) => 
    apiRequest<Booking>(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...updates,
        updated_at: new Date().toISOString()
      })
    }),
    
  delete: (id: string) => 
    apiRequest<void>(`/api/bookings/${id}`, { method: 'DELETE' }),
    
  deleteByTableId: (tableId: string) => 
    apiRequest<void>(`/api/bookings/table/${tableId}`, { method: 'DELETE' }),
    
  completeByTableId: (tableId: string) => 
    apiRequest<void>(`/api/bookings/table/${tableId}`, { 
      method: 'PUT',
      body: JSON.stringify({ status: 'completed' })
    })
};

// ==================== MENU API ====================
export const menuApi = {
  getAll: () => apiRequest<FoodMenuItem[]>('/api/menu'),
  
  create: (item: Omit<FoodMenuItem, 'id' | 'created_at' | 'updated_at'>) => 
    apiRequest<FoodMenuItem>('/api/menu', {
      method: 'POST',
      body: JSON.stringify({
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }),
    
  update: (id: string, updates: Partial<FoodMenuItem>) => 
    apiRequest<FoodMenuItem>(`/api/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...updates,
        updated_at: new Date().toISOString()
      })
    }),
    
  delete: (id: string) => 
    apiRequest<void>(`/api/menu/${id}`, { method: 'DELETE' })
};

// ==================== CAROUSEL API ====================
export const carouselApi = {
  getAll: () => apiRequest<string[]>('/api/carousel-images'),
  
  updateAll: (images: string[]) => 
    apiRequest<{ images: string[] }>('/api/carousel-images', {
      method: 'POST',
      body: JSON.stringify({ images })
    }),
    
  delete: (index: number) => 
    apiRequest<{ images: string[] }>(`/api/carousel-images/${index}`, {
      method: 'DELETE'
    }),
    
  update: async (index: number, file: File) => {
    // Get admin token from localStorage if available
    const adminSession = localStorage.getItem('adminSession');
    let headers: Record<string, string> = {};
    
    if (adminSession) {
      const sessionData = JSON.parse(adminSession);
      const token = btoa(encodeURIComponent(sessionData.email));
      headers = { 'Authorization': `Bearer ${token}` };
    }
    
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API_BASE_URL}/api/carousel-images/${index}`, {
      method: 'PUT',
      headers: headers, // Include auth header for admin operations
      body: formData
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new HttpError(response.status, errorData.error || 'Update failed');
      }
      const result: ApiResponse<{ images: string[] }> = await response.json();
      return 'data' in result ? result.data : result;
    });
  },
  
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiUpload<{ url: string }>('/api/upload/carousel', formData);
  }
};

// ==================== UPLOAD API ====================
export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiUpload<{ url: string }>('/api/upload', formData);
  }
};

// ==================== DATA INTERFACES ====================
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
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  completed_at?: string;
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

// ==================== CONSTANTS ====================
export const FALLBACK_CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1554679665-f5537f187268?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
];