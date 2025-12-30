// ============================================
// FILE: services/carouselService.ts - FIXED
// ============================================
import { API_BASE_URL } from '../lib/api';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1554679665-f5537f187268?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
];

// Helper to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  try {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      const sessionData = JSON.parse(adminSession);
      if (sessionData.email) {
        const token = btoa(encodeURIComponent(sessionData.email));
        return { 'Authorization': `Bearer ${token}` };
      }
    }
  } catch (error) {

  }
  return {};
};

export const carouselService = {
  // Get all carousel images
  async getImages(): Promise<string[]> {
    try {

      const response = await fetch(`${API_BASE_URL}/api/carousel-images`);
      
      if (response.ok) {
        const data = await response.json();
        
        
        // Handle response format: { success: true, data: [...] }
        const images = data.data || data.images || data;
        
        if (Array.isArray(images) && images.length > 0) {
          return images;
        }
      }
      

      return FALLBACK_IMAGES;
    } catch (error) {

      return FALLBACK_IMAGES;
    }
  },

  // ✅ FIXED: Upload single carousel image
  async uploadImage(file: File): Promise<string[]> {
    try {

      
      const formData = new FormData();
      formData.append('image', file);

      // ✅ FIXED URL: /api/upload/carousel
      const response = await fetch(`${API_BASE_URL}/api/upload/carousel`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });



      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        throw new Error(errorData.error || `Upload failed with status: ${response.status}`);
      }

      const result = await response.json();

      
      // Extract images from response
      const images = result.data?.images || result.images || [];
      return Array.isArray(images) && images.length > 0 ? images : await this.getImages();
    } catch (error) {

      throw error;
    }
  },

  // Update all carousel images
  async updateImages(images: string[]): Promise<string[]> {
    try {

      
      const response = await fetch(`${API_BASE_URL}/api/carousel-images`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ images }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Update failed: ${response.status}`);
      }

      const result = await response.json();

      
      const updatedImages = result.data?.images || result.images || [];
      return Array.isArray(updatedImages) ? updatedImages : [];
    } catch (error) {

      throw error;
    }
  },

  // Delete carousel image by index
  async deleteImage(index: number): Promise<string[]> {
    try {

      
      const response = await fetch(`${API_BASE_URL}/api/carousel-images/${index}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Delete failed: ${response.status}`);
      }

      const result = await response.json();

      
      const updatedImages = result.data?.images || result.images || [];
      return Array.isArray(updatedImages) ? updatedImages : [];
    } catch (error) {

      throw error;
    }
  },

  // Update single carousel image by index
  async updateImage(index: number, file: File): Promise<string[]> {
    try {

      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/api/carousel-images/${index}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Update failed: ${response.status}`);
      }

      const result = await response.json();

      
      const updatedImages = result.data?.images || result.images || [];
      return Array.isArray(updatedImages) ? updatedImages : [];
    } catch (error) {

      throw error;
    }
  }
};