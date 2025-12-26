import { API_BASE_URL } from '../lib/api';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1554679665-f5537f187268?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
];

export const carouselService = {
  async getImages(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/carousel-images`);
      if (response.ok) {
        const images = await response.json();
        return Array.isArray(images) ? images : FALLBACK_IMAGES;
      }
      return FALLBACK_IMAGES;
    } catch (error) {
      console.error('Error fetching carousel images:', error);
      return FALLBACK_IMAGES;
    }
  },

  async uploadImage(file: File): Promise<string[]> {
    const formData = new FormData();
    formData.append('image', file);

    const uploadResponse = await fetch(`${API_BASE_URL}/api/upload-carousel`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Image upload failed');
    }

    const { url } = await uploadResponse.json();
    const currentImages = await this.getImages();
    const newImages = [...currentImages, url];

    return this.updateImages(newImages);
  },

  async updateImages(images: string[]): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/api/carousel-images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images }),
    });

    if (!response.ok) {
      throw new Error('Failed to update carousel images');
    }

    const result = await response.json();
    return Array.isArray(result.images) ? result.images : [];
  },

  async deleteImage(index: number): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/api/carousel-images/${index}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete carousel image');
    }

    const result = await response.json();
    return Array.isArray(result.images) ? result.images : [];
  },

  async updateImage(index: number, file: File): Promise<string[]> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/carousel-images/${index}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update carousel image');
    }

    const result = await response.json();
    return Array.isArray(result.images) ? result.images : [];
  }
};