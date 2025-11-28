import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface PosterImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  title: string;
}

export const PosterImage: React.FC<PosterImageProps> = ({ src, alt, title, className, ...props }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-800 text-slate-500 p-4 text-center ${className}`}>
        <ImageOff size={24} className="mb-2 opacity-50" />
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || title}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
      {...props}
    />
  );
};