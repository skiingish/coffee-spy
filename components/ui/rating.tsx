'use client';

import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number | null;
  onChange?: (value: number) => void;
  max?: number;
  allowHalf?: boolean;
  className?: string;
  starClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  readOnly?: boolean;
}

const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value = 0,
      onChange,
      max = 5,
      allowHalf = true,
      className,
      starClassName,
      activeClassName,
      inactiveClassName,
      readOnly = false,
      ...props
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    // Create an array of stars based on the max value
    const stars = Array.from({ length: max }, (_, index) => index + 1);

    const handleMouseMove = (
      event: React.MouseEvent<HTMLDivElement>,
      starIndex: number
    ) => {
      if (readOnly) return;

      const { left, width } = event.currentTarget.getBoundingClientRect();
      const percent = (event.clientX - left) / width;

      // If we allow half stars and the cursor is on the left half of the star
      if (allowHalf && percent <= 0.5) {
        setHoverValue(starIndex - 0.5);
      } else {
        setHoverValue(starIndex);
      }
    };

    const handleClick = (value: number) => {
      if (readOnly || !onChange) return;
      onChange(value);
    };

    const displayValue = hoverValue !== null ? hoverValue : value;

    return (
      <div
        className={cn('flex items-center', className)}
        onMouseLeave={() => !readOnly && setHoverValue(null)}
        ref={ref}
        {...props}
      >
        {stars.map((starIndex) => (
          <div
            key={starIndex}
            className={cn(
              'relative cursor-pointer inline-flex items-center justify-center',
              readOnly && 'cursor-default',
              starClassName
            )}
            onMouseMove={(e) => handleMouseMove(e, starIndex)}
            onClick={() => {
              const clickValue =
                allowHalf && hoverValue === starIndex - 0.5
                  ? starIndex - 0.5
                  : starIndex;
              handleClick(clickValue);
            }}
          >
            {/* Background (inactive) star */}
            <Star
              className={cn(
                'h-8 w-8 stroke-1',
                inactiveClassName || 'text-muted-foreground'
              )}
            />

            {/* Overlay for active stars (full or half) */}
            {displayValue && displayValue >= starIndex ? (
              <Star
                className={cn(
                  'absolute top-0 left-0 h-8 w-8 fill-current stroke-1',
                  activeClassName || 'text-amber-400'
                )}
              />
            ) : displayValue &&
              displayValue === starIndex - 0.5 &&
              allowHalf ? (
              <div className='absolute top-0 left-0 w-1/2 h-full overflow-hidden'>
                <Star
                  className={cn(
                    'h-8 w-8 fill-current stroke-1',
                    activeClassName || 'text-amber-400'
                  )}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  }
);

Rating.displayName = 'Rating';

export { Rating };
