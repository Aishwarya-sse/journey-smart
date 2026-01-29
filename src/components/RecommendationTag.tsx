// Recommendation Tag Component

import { Heart, GraduationCap, Moon, Users, Wallet, Sparkles } from 'lucide-react';
import { RecommendationType, recommendationInfo } from '@/types/railway';
import { cn } from '@/lib/utils';

interface RecommendationTagProps {
  type: RecommendationType;
  size?: 'sm' | 'md';
}

const RecommendationTag = ({ type, size = 'md' }: RecommendationTagProps) => {
  const info = recommendationInfo[type];
  
  const icons: Record<RecommendationType, typeof Heart> = {
    seniors: Heart,
    students: GraduationCap,
    night: Moon,
    family: Users,
    budget: Wallet,
    comfort: Sparkles,
  };

  const Icon = icons[type];

  const bgColors: Record<RecommendationType, string> = {
    seniors: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    students: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    night: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
    family: 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800',
    budget: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    comfort: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        bgColors[type],
        sizeClasses[size]
      )}
    >
      <Icon size={size === 'sm' ? 12 : 14} />
      <span>{info.label}</span>
    </div>
  );
};

export default RecommendationTag;
