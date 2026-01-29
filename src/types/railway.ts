// Railway Booking Application Types

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Station {
  code: string;
  name: string;
  city: string;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  from: Station;
  to: Station;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: TrainClass[];
  daysOfOperation: string[];
}

export interface TrainClass {
  type: ClassType;
  fare: number;
  availableSeats: number;
  totalSeats: number;
}

export type ClassType = 'SL' | '3A' | '2A' | '1A' | 'CC' | '2S' | 'EC';

export interface CrowdInfo {
  level: 'low' | 'medium' | 'high';
  percentage: number;
  comfortScore: number; // 1-5
  recommendation: RecommendationType;
}

export type RecommendationType = 'seniors' | 'students' | 'night' | 'family' | 'budget' | 'comfort';

export interface SearchFilters {
  from: string;
  to: string;
  date: string;
  classType: ClassType | 'all';
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  berthPreference: 'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'none';
  seatNumber?: string;
}

export interface Booking {
  id: string;
  pnr: string;
  train: Train;
  passengers: Passenger[];
  classType: ClassType;
  journeyDate: string;
  totalFare: number;
  status: 'confirmed' | 'waiting' | 'cancelled';
  bookedAt: string;
  paymentMethod: 'upi' | 'card' | 'wallet';
  seatNumbers: string[];
}

export interface PaymentDetails {
  method: 'upi' | 'card' | 'wallet';
  upiId?: string;
  cardNumber?: string;
  cardExpiry?: string;
  walletType?: 'paytm' | 'phonepe' | 'gpay';
}

// Class type display names
export const classTypeNames: Record<ClassType, string> = {
  'SL': 'Sleeper',
  '3A': 'AC 3 Tier',
  '2A': 'AC 2 Tier',
  '1A': 'First AC',
  'CC': 'Chair Car',
  '2S': 'Second Sitting',
  'EC': 'Executive Chair'
};

// Recommendation display info
export const recommendationInfo: Record<RecommendationType, { label: string; className: string }> = {
  seniors: { label: 'Best for Seniors', className: 'tag-seniors' },
  students: { label: 'Best for Students', className: 'tag-students' },
  night: { label: 'Best for Night Travel', className: 'tag-night' },
  family: { label: 'Family Friendly', className: 'tag-family' },
  budget: { label: 'Budget Friendly', className: 'tag-students' },
  comfort: { label: 'Premium Comfort', className: 'tag-seniors' }
};
