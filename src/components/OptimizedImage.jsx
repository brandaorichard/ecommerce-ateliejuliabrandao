import React from 'react';

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  priority = false 
}) {
  return (
    <img 
      src={src} 
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
