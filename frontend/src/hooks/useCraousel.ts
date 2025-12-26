// ============================================
// FILE: hooks/useCarousel.ts
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
      const data = await carouselService.getImages();
      setImages(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch carousel images');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      setIsLoading(true);
      const newImages = await carouselService.uploadImage(file);
      setImages(newImages);
      setError(null);
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
      const newImages = await carouselService.deleteImage(index);
      setImages(newImages);
      setError(null);
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
      const newImages = await carouselService.updateImage(index, file);
      setImages(newImages);
      setError(null);
    } catch (err) {
      setError('Failed to update image');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    isLoading,
    error,
    fetchImages,
    uploadImage,
    deleteImage,
    updateImage
  };
};
