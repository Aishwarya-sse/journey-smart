// Mock Data for Railway Booking Application

import { Station, Train, ClassType } from '@/types/railway';

// Popular Railway Stations
export const stations: Station[] = [
  { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi' },
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
  { code: 'SBC', name: 'Bengaluru City Junction', city: 'Bangalore' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur' },
  { code: 'LKO', name: 'Lucknow Junction', city: 'Lucknow' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad' },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur' },
  { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur' },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna' },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra' },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal' },
];

// Generate mock trains based on search
export const generateTrains = (from: string, to: string): Train[] => {
  const fromStation = stations.find(s => s.code === from || s.city.toLowerCase() === from.toLowerCase());
  const toStation = stations.find(s => s.code === to || s.city.toLowerCase() === to.toLowerCase());

  if (!fromStation || !toStation) return [];

  const trainTemplates = [
    { prefix: 'Rajdhani', type: 'premium', classes: ['1A', '2A', '3A'] as ClassType[] },
    { prefix: 'Shatabdi', type: 'fast', classes: ['EC', 'CC'] as ClassType[] },
    { prefix: 'Duronto', type: 'express', classes: ['1A', '2A', '3A', 'SL'] as ClassType[] },
    { prefix: 'Garib Rath', type: 'budget', classes: ['3A'] as ClassType[] },
    { prefix: 'Superfast', type: 'regular', classes: ['1A', '2A', '3A', 'SL', '2S'] as ClassType[] },
    { prefix: 'Express', type: 'regular', classes: ['2A', '3A', 'SL', '2S'] as ClassType[] },
    { prefix: 'Mail', type: 'slow', classes: ['3A', 'SL', '2S'] as ClassType[] },
  ];

  const baseFares: Record<ClassType, number> = {
    '1A': 3500,
    '2A': 2200,
    '3A': 1500,
    'EC': 1800,
    'CC': 900,
    'SL': 500,
    '2S': 250,
  };

  const departureTimes = ['05:30', '08:15', '10:45', '14:20', '17:00', '20:30', '23:15'];
  
  return trainTemplates.map((template, index) => {
    const trainNumber = `${12000 + index * 100 + Math.floor(Math.random() * 50)}`;
    const depTime = departureTimes[index];
    const durationHours = 4 + Math.floor(Math.random() * 12);
    const durationMins = Math.floor(Math.random() * 60);
    
    const depDate = new Date(`2024-01-01T${depTime}:00`);
    const arrDate = new Date(depDate.getTime() + (durationHours * 60 + durationMins) * 60000);
    const arrTime = arrDate.toTimeString().slice(0, 5);

    return {
      id: `train-${trainNumber}`,
      number: trainNumber,
      name: `${fromStation.city} ${template.prefix}`,
      from: fromStation,
      to: toStation,
      departureTime: depTime,
      arrivalTime: arrTime,
      duration: `${durationHours}h ${durationMins}m`,
      daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, 3 + Math.floor(Math.random() * 4)),
      classes: template.classes.map(classType => ({
        type: classType,
        fare: baseFares[classType] + Math.floor(Math.random() * 300),
        availableSeats: Math.floor(Math.random() * 80) + 5,
        totalSeats: 72,
      })),
    };
  });
};

// Generate seat layout for a coach
export const generateSeatLayout = (totalSeats: number): { seatNumber: string; isBooked: boolean }[] => {
  const seats = [];
  const bookedPercentage = Math.random() * 0.6 + 0.2; // 20-80% booked
  
  for (let i = 1; i <= totalSeats; i++) {
    const berthType = i % 8 <= 2 ? 'LB' : i % 8 <= 4 ? 'MB' : i % 8 <= 6 ? 'UB' : 'SL';
    seats.push({
      seatNumber: `${berthType}${i}`,
      isBooked: Math.random() < bookedPercentage,
    });
  }
  
  return seats;
};

// Popular routes for quick selection
export const popularRoutes = [
  { from: 'NDLS', to: 'BCT', label: 'Delhi → Mumbai' },
  { from: 'NDLS', to: 'HWH', label: 'Delhi → Kolkata' },
  { from: 'BCT', to: 'SBC', label: 'Mumbai → Bangalore' },
  { from: 'MAS', to: 'SBC', label: 'Chennai → Bangalore' },
  { from: 'NDLS', to: 'JP', label: 'Delhi → Jaipur' },
  { from: 'BCT', to: 'PUNE', label: 'Mumbai → Pune' },
];
