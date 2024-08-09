'use client'

import React, { useState, useEffect } from 'react';

interface ImageGalleryProps {
  images: (string | undefined)[];
}

function ImageGallery({ images }: ImageGalleryProps) {
  const [mainImage, setMainImage] = useState<string | undefined>(images[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setMainImage(images[0]);
    setSelectedIndex(0);
  }, [images]);

  const handleThumbnailClick = (image: string | undefined, index: number) => {
    setMainImage(image);
    setSelectedIndex(index);
  };

  const handleMouseEnter = (image: string | undefined, index: number) => {
    setMainImage(image);
    setSelectedIndex(index);
  };

  return (
    <div className="product-images"> 
    <div className="main-image">
        <img className="cover_image" src={mainImage} alt="Main" />
      </div>
      <div className="thumbnails">
        {images.map((image, index) => (
          <div
            key={index}
            className={`thumbnail-wrapper ${index === selectedIndex ? 'selected' : ''}`}
            onMouseEnter={() => handleMouseEnter(image, index)}
            onClick={() => handleThumbnailClick(image, index)}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="thumbnail-image"
            />
          </div>
        ))}
      </div>
     
    </div>
  );
}

export default ImageGallery;