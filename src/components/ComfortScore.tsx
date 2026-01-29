// Star Rating / Comfort Score Component

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComfortScoreProps {
  score: number; // 1-5, supports half stars
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ComfortScore = ({ 
  score, 
  maxScore = 5, 
  size = 'md',
  showLabel = true 
}: ComfortScoreProps) => {
  const sizeClasses = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  const starSize = sizeClasses[size];

  const renderStar = (index: number) => {
    const filled = index < Math.floor(score);
    const halfFilled = !filled && index < score;

    return (
      <div key={index} className="relative">
        {/* Background star (empty) */}
        <Star 
          size={starSize} 
          className="text-gray-300 dark:text-gray-600" 
        />
        
        {/* Foreground star (filled or half) */}
        {(filled || halfFilled) && (
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ width: halfFilled ? '50%' : '100%' }}
          >
            <Star 
              size={starSize} 
              className="text-yellow-400 fill-yellow-400" 
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: maxScore }).map((_, i) => renderStar(i))}
      </div>
      {showLabel && (
        <span className={cn(
          'font-medium text-muted-foreground',
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        )}>
          {score.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default ComfortScore;
