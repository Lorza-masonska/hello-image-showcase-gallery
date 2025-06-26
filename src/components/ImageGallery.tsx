
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ImageItem {
  id: string;
  url: string;
  name: string;
}

const ImageGallery = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // GitHub API endpoint for repository contents
        const response = await fetch('https://api.github.com/repos/Lorza-masonska/Zdjecia/contents');
        
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
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Failed to load images from repository');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

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
      <div className="text-center text-red-500 py-12">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {images.length > 0 ? (
        <div className="grid grid-cols-4 gap-2">
          {images.map(image => (
            <Card key={image.id} className="overflow-hidden group relative">
              <div className="aspect-[9/16] relative">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <p>No images found in the repository.</p>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
