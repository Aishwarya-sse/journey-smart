// Crowd Level Indicator Component
// Displays crowd level with color-coded badge

import { Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CrowdIndicatorProps {
  level: 'low' | 'medium' | 'high';
  percentage?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CrowdIndicator = ({ 
  level, 
  percentage, 
  showLabel = true,
  size = 'md' 
}: CrowdIndicatorProps) => {
  const config = {
    low: {
      label: 'Low Crowd',
      icon: TrendingDown,
      bgClass: 'bg-green-100 dark:bg-green-900/30',
      textClass: 'text-green-700 dark:text-green-400',
      borderClass: 'border-green-200 dark:border-green-800',
      dotClass: 'bg-green-500',
    },
    medium: {
      label: 'Medium Crowd',
      icon: Minus,
      bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
      textClass: 'text-yellow-700 dark:text-yellow-400',
      borderClass: 'border-yellow-200 dark:border-yellow-800',
      dotClass: 'bg-yellow-500',
    },
    high: {
      label: 'High Crowd',
      icon: TrendingUp,
      bgClass: 'bg-red-100 dark:bg-red-900/30',
      textClass: 'text-red-700 dark:text-red-400',
      borderClass: 'border-red-200 dark:border-red-800',
      dotClass: 'bg-red-500',
    },
  };

  const { label, icon: Icon, bgClass, textClass, borderClass, dotClass } = config[level];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        bgClass,
        textClass,
        borderClass,
        sizeClasses[size]
      )}
    >
      <span className={cn('w-2 h-2 rounded-full animate-pulse', dotClass)} />
      <Icon size={iconSizes[size]} />
      {showLabel && <span>{label}</span>}
      {percentage !== undefined && (
        <span className="opacity-75">({percentage}%)</span>
      )}
    </div>
  );
};

export default CrowdIndicator;
