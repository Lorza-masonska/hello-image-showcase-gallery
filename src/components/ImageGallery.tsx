
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface ImageItem {
  id: string;
  url: string;
  name: string;
}

const ImageGallery = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const newImage: ImageItem = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              url: e.target?.result as string,
              name: file.name
            };
            setImages(prev => [...prev, newImage]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      Array.from(items).forEach(item => {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const newImage: ImageItem = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                url: e.target?.result as string,
                name: `Pasted image ${Date.now()}`
              };
              setImages(prev => [...prev, newImage]);
            };
            reader.readAsDataURL(file);
          }
        }
      });
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8 hover:border-gray-400 transition-colors"
        onPaste={handlePaste}
        tabIndex={0}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg text-gray-600 mb-4">
          Paste images here (Ctrl+V) or click to upload
        </p>
        <Button onClick={triggerFileInput} variant="outline">
          Choose Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map(image => (
            <Card key={image.id} className="overflow-hidden group relative">
              <div className="aspect-square relative">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <Button
                  onClick={() => removeImage(image.id)}
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p>No images yet. Upload or paste some images to get started!</p>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
