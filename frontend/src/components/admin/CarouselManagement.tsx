// FILE: components/admin/CarouselManagement.tsx
// ============================================
import { useRef } from 'react';
import { Upload, RefreshCw } from 'lucide-react';
import { useCarousel } from '../../hooks/useCraousel';

export const CarouselManagement = () => {
  const { images, isLoading, uploadImage, deleteImage, updateImage, fetchImages } = useCarousel();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const replaceIndexRef = useRef<number>(-1);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadImage(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleReplaceImage = (index: number) => {
    replaceIndexRef.current = index;
    replaceFileInputRef.current?.click();
  };

  const handleReplaceImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const index = replaceIndexRef.current;

    if (!file || index < 0) return;

    try {
      await updateImage(index, file);
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
      replaceIndexRef.current = -1;
    } catch (error) {
      alert('Failed to replace image. Please try again.');
    }
  };

  const handleDeleteImage = async (index: number) => {
    try {
      await deleteImage(index);
    } catch (error) {
      alert('Failed to delete image. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white">Carousel Management</h3>
        <div className="flex gap-2">
          <button
            onClick={fetchImages}
            className="flex items-center gap-2 px-3 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-medium disabled:opacity-50"
          >
            <Upload size={18} />
            {isLoading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={replaceFileInputRef}
          onChange={handleReplaceImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images && Array.isArray(images) && images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Carousel ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg shadow"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-2">
                <button
                  onClick={() => handleReplaceImage(index)}
                  className="bg-white text-purple-600 px-2 py-1 rounded text-sm font-medium hover:bg-gray-100"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              Image {index + 1}
            </div>
          </div>
        ))}
        {images && Array.isArray(images) && images.length === 0 && (
          <div className="col-span-full text-center py-8 text-white">
            <p>No carousel images uploaded yet</p>
            <p className="text-sm mt-2">Upload images to showcase your restaurant</p>
          </div>
        )}
        {(!images || !Array.isArray(images)) && (
          <div className="col-span-full text-center py-8 text-white">
            <p>Loading carousel images...</p>
          </div>
        )}
      </div>
    </div>
  );
};