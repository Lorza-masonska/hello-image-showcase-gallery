import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, X, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface ImageItem {
  id: string;
  url: string;
  name: string;
}

const ImageGallery = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const fetchImages = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      }
      
      // Dodaj timestamp do URL żeby uniknąć cache
      const timestamp = new Date().getTime();
      const response = await fetch(`https://api.github.com/repos/Lorza-masonska/Zdjecia/contents?t=${timestamp}`);
      
      if (response.status === 403) {
        const errorData = await response.json();
        if (errorData.message.includes('rate limit')) {
          console.log('GitHub API rate limit reached. Waiting...');
          setRateLimited(true);
          setError('Osiągnięto limit API GitHub. Odczekaj chwilę przed odświeżeniem.');
          return;
        }
      }
        
      if (!response.ok) {
        throw new Error('Failed to fetch images from repository');
      }
        
      const files = await response.json();
        
      // Filter for image files and create image items
      const imageFiles = files
        .filter((file: any) => 
          file.type === 'file' && 
          /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name)
        )
        .map((file: any) => ({
          id: file.sha,
          url: file.download_url,
          name: file.name
        }));
        
      setImages(imageFiles);
      setError(null);
      setRateLimited(false);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images from repository');
    } finally {
      setLoading(false);
      if (showRefreshIndicator) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchImages();
    
    // Zmniejsz częstotliwość automatycznego odświeżania z 30s na 5 minut
    const interval = setInterval(() => {
      if (!rateLimited) {
        fetchImages();
      }
    }, 300000); // 5 minut
    
    return () => clearInterval(interval);
  }, [rateLimited]);

  const handleManualRefresh = () => {
    setRateLimited(false);
    fetchImages(true);
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
        {rateLimited && (
          <p className="text-yellow-600 mb-4 text-sm">
            Tip: GitHub API pozwala na 60 żądań na godzinę. Spróbuj ponownie za chwilę.
          </p>
        )}
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
            <p>Nie znaleziono zdjęć w repozytorium.</p>
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
          
          {/* Preview Content */}
          <div className="relative max-w-screen max-h-screen p-4 flex items-center justify-center">
            <img
              src={images[previewIndex].url}
              alt={images[previewIndex].name}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close Button */}
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={24} />
            </button>
            
            {/* Previous Button */}
            {previewIndex > 0 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            {/* Next Button */}
            {previewIndex < images.length - 1 && (
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
