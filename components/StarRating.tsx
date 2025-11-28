import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  initialRating?: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  initialRating = 0, 
  onRate, 
  readOnly = false,
  size = 20 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const rating = initialRating;

  const handleMouseEnter = (index: number) => {
    if (!readOnly) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!readOnly) setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (!readOnly && onRate) onRate(index);
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = (hoverRating || rating) >= index;
        return (
          <button
            key={index}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            className={`transition-colors focus:outline-none ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <Star
              size={size}
              className={`${
                isFilled 
                  ? 'fill-vista-accent text-vista-accent' 
                  : 'fill-transparent text-slate-600'
              } transition-all duration-200`}
            />
          </button>
        );
      })}
    </div>
  );
};