import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, X, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface ImageItem {
  id: string;
  url: string;
  name: string;
}

// Import zdjęć statycznie
import exampleMeme1 from '@/assets/images/example-meme-1.jpg';
import exampleMeme2 from '@/assets/images/example-meme-2.jpg';

// Lista lokalnych zdjęć
const getLocalImages = (): ImageItem[] => {
  const localImages = [
    {
      id: 'local-1',
      url: exampleMeme1,
      name: 'example-meme-1.jpg'
    },
    {
      id: 'local-2', 
      url: exampleMeme2,
      name: 'example-meme-2.jpg'
    }
  ];
  
  return localImages;
};

const ImageGallery = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadLocalImages = () => {
    try {
      setLoading(true);
      const localImages = getLocalImages();
      setImages(localImages);
      setError(null);
      console.log(`Załadowano ${localImages.length} lokalnych zdjęć`);
    } catch (err) {
      console.error('Error loading local images:', err);
      setError('Błąd przy ładowaniu zdjęć z lokalnego folderu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLocalImages();
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    loadLocalImages();
  };

  const openPreview = (index: number) => {
    setPreviewIndex(index);
  };

  const closePreview = () => {
    setPreviewIndex(null);
  };

  const goToPrevious = () => {
    if (previewIndex !== null && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }
  };

  const goToNext = () => {
    if (previewIndex !== null && previewIndex < images.length - 1) {
      setPreviewIndex(previewIndex + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (previewIndex === null) return;
    
    switch (e.key) {
      case 'Escape':
        closePreview();
        break;
      case 'ArrowLeft':
        goToPrevious();
        break;
      case 'ArrowRight':
        goToNext();
        break;
    }
  };

  useEffect(() => {
    if (previewIndex !== null) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [previewIndex]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading images from repository...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Galeria ({images.length} zdjęć)
          </h2>
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
            title="Odśwież galerię"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </button>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <Card 
                key={image.id} 
                className="overflow-hidden group relative cursor-pointer"
                onClick={() => openPreview(index)}
              >
                <div className="aspect-[9/16] relative bg-black flex items-center justify-center">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <p>Nie znaleziono zdjęć w lokalnym folderze.</p>
            <p className="text-sm mt-2">Dodaj zdjęcia do folderu src/assets/images/</p>
            <button
              onClick={handleManualRefresh}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Odśwież
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred Background */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closePreview}
          />
          
          {/* Close Button - Fixed to top-right corner */}
          <button
            onClick={closePreview}
            className="fixed top-6 right-6 z-60 p-3 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors touch-manipulation"
          >
            <X size={32} />
          </button>
          
          {/* Previous Button - Fixed to left side of screen */}
          {previewIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="fixed left-6 top-1/2 -translate-y-1/2 z-60 p-4 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors touch-manipulation"
            >
              <ChevronLeft size={36} />
            </button>
          )}
          
          {/* Next Button - Fixed to right side of screen */}
          {previewIndex < images.length - 1 && (
            <button
              onClick={goToNext}
              className="fixed right-6 top-1/2 -translate-y-1/2 z-60 p-4 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors touch-manipulation"
            >
              <ChevronRight size={36} />
            </button>
          )}
          
          {/* Preview Content */}
          <div className="relative max-w-screen max-h-screen p-4 flex items-center justify-center">
            <img
              src={images[previewIndex].url}
              alt={images[previewIndex].name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
