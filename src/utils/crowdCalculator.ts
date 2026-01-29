// Smart Crowd & Seat Comfort Calculator
// Calculates crowd level, comfort score, and travel recommendations

import { CrowdInfo, RecommendationType, TrainClass } from '@/types/railway';

/**
 * Calculate crowd level based on:
 * - Time of journey (peak / non-peak)
 * - Day type (weekday / weekend)
 * - Seat availability percentage
 */
export const calculateCrowdInfo = (
  trainClass: TrainClass,
  departureTime: string,
  journeyDate: string
): CrowdInfo => {
  const availabilityPercentage = (trainClass.availableSeats / trainClass.totalSeats) * 100;
  const isPeakTime = checkPeakTime(departureTime);
  const isWeekend = checkWeekend(journeyDate);
  
  // Calculate crowd score (0-100, higher = more crowded)
  let crowdScore = 100 - availabilityPercentage;
  
  // Adjust for peak time (+15 points)
  if (isPeakTime) {
    crowdScore += 15;
  }
  
  // Adjust for weekend (+10 points)
  if (isWeekend) {
    crowdScore += 10;
  }
  
  // Cap at 100
  crowdScore = Math.min(crowdScore, 100);
  
  // Determine crowd level
  let level: 'low' | 'medium' | 'high';
  if (crowdScore < 40) {
    level = 'low';
  } else if (crowdScore < 70) {
    level = 'medium';
  } else {
    level = 'high';
  }
  
  // Calculate comfort score (1-5 stars)
  const comfortScore = calculateComfortScore(trainClass.type, level, isPeakTime);
  
  // Get recommendation
  const recommendation = getRecommendation(departureTime, trainClass.type, level, comfortScore);
  
  return {
    level,
    percentage: Math.round(crowdScore),
    comfortScore,
    recommendation,
  };
};

/**
 * Check if departure time is during peak hours
 * Peak hours: 7-10 AM and 5-9 PM
 */
const checkPeakTime = (time: string): boolean => {
  const [hours] = time.split(':').map(Number);
  return (hours >= 7 && hours <= 10) || (hours >= 17 && hours <= 21);
};

/**
 * Check if the journey date is a weekend
 */
const checkWeekend = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

/**
 * Calculate comfort score based on class, crowd, and time
 */
const calculateComfortScore = (
  classType: string,
  crowdLevel: 'low' | 'medium' | 'high',
  isPeakTime: boolean
): number => {
  // Base score by class
  const classScores: Record<string, number> = {
    '1A': 5,
    'EC': 4.5,
    '2A': 4,
    '3A': 3.5,
    'CC': 3,
    'SL': 2.5,
    '2S': 2,
  };
  
  let score = classScores[classType] || 3;
  
  // Adjust for crowd level
  if (crowdLevel === 'high') {
    score -= 0.5;
  } else if (crowdLevel === 'low') {
    score += 0.3;
  }
  
  // Slight penalty for peak time
  if (isPeakTime) {
    score -= 0.2;
  }
  
  // Clamp between 1 and 5
  return Math.max(1, Math.min(5, Math.round(score * 2) / 2));
};

/**
 * Get travel recommendation based on journey characteristics
 */
const getRecommendation = (
  departureTime: string,
  classType: string,
  crowdLevel: 'low' | 'medium' | 'high',
  comfortScore: number
): RecommendationType => {
  const [hours] = departureTime.split(':').map(Number);
  const isNight = hours >= 20 || hours <= 5;
  const isMorning = hours >= 5 && hours <= 9;
  
  // Premium classes with high comfort
  if (['1A', 'EC'].includes(classType) && comfortScore >= 4) {
    return 'seniors';
  }
  
  // Night travel in sleeper classes
  if (isNight && ['SL', '3A', '2A'].includes(classType)) {
    return 'night';
  }
  
  // Budget-friendly options
  if (['2S', 'SL'].includes(classType) && crowdLevel !== 'high') {
    return 'students';
  }
  
  // Family-friendly - spacious with moderate crowd
  if (['2A', '3A'].includes(classType) && crowdLevel === 'low') {
    return 'family';
  }
  
  // High comfort score
  if (comfortScore >= 4) {
    return 'comfort';
  }
  
  // Default to budget
  return 'budget';
};

/**
 * Get color class for crowd level badge
 */
export const getCrowdColorClass = (level: 'low' | 'medium' | 'high'): string => {
  switch (level) {
    case 'low':
      return 'crowd-low';
    case 'medium':
      return 'crowd-medium';
    case 'high':
      return 'crowd-high';
    default:
      return 'crowd-medium';
  }
};

/**
 * Get background color for crowd indicator
 */
export const getCrowdBgColor = (level: 'low' | 'medium' | 'high'): string => {
  switch (level) {
    case 'low':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'high':
      return 'bg-red-500';
    default:
      return 'bg-yellow-500';
  }
};
