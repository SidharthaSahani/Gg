// ============================================
// FILE: hooks/useCraousel.ts (Note: keeping your spelling)
// ============================================
import { useState, useEffect } from 'react';
import { carouselService } from '../services/carouselService';

export const useCarousel = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await carouselService.getImages();

      setImages(data);
    } catch (err) {

      setError('Failed to fetch carousel images');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      const newImages = await carouselService.uploadImage(file);

      setImages(newImages);
    } catch (err) {

      setError('Failed to upload image');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = async (index: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const newImages = await carouselService.deleteImage(index);

      setImages(newImages);
    } catch (err) {

      setError('Failed to delete image');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateImage = async (index: number, file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      const newImages = await carouselService.updateImage(index, file);

      setImages(newImages);
    } catch (err) {

      setError('Failed to update image');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    isLoading,
    error,
    fetchImages, // ✅ Exposed for refresh button
    uploadImage,
    deleteImage,
    updateImage
  };
};