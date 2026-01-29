// LocalStorage and SessionStorage Utilities

import { User, Booking } from '@/types/railway';

const STORAGE_KEYS = {
  USER: 'railway_user',
  SESSION: 'railway_session',
  BOOKINGS: 'railway_bookings',
  SEARCH_HISTORY: 'railway_search_history',
};

// User Authentication
export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  sessionStorage.removeItem(STORAGE_KEYS.SESSION);
};

// Session Management
export const setSession = (userId: string): void => {
  sessionStorage.setItem(STORAGE_KEYS.SESSION, userId);
};

export const getSession = (): string | null => {
  return sessionStorage.getItem(STORAGE_KEYS.SESSION);
};

export const isLoggedIn = (): boolean => {
  return !!getSession() && !!getUser();
};

// Booking Management
export const saveBooking = (booking: Booking): void => {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
};

export const getBookings = (): Booking[] => {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return data ? JSON.parse(data) : [];
};

export const getBookingByPnr = (pnr: string): Booking | null => {
  const bookings = getBookings();
  return bookings.find(b => b.pnr === pnr) || null;
};

export const cancelBooking = (pnr: string): boolean => {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.pnr === pnr);
  if (index !== -1) {
    bookings[index].status = 'cancelled';
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return true;
  }
  return false;
};

// Search History
export const saveSearchHistory = (from: string, to: string): void => {
  const history = getSearchHistory();
  const newSearch = { from, to, date: new Date().toISOString() };
  
  // Keep only last 5 unique searches
  const filtered = history.filter(h => !(h.from === from && h.to === to));
  filtered.unshift(newSearch);
  
  localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(filtered.slice(0, 5)));
};

export const getSearchHistory = (): { from: string; to: string; date: string }[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
  return data ? JSON.parse(data) : [];
};

// Generate unique IDs
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generatePNR = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = '';
  for (let i = 0; i < 10; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
};

// User credentials storage (for demo purposes - in production use proper auth)
const USERS_KEY = 'railway_registered_users';

interface StoredUser {
  username: string;
  email: string;
  password: string; // In production, never store plain passwords!
  id: string;
  createdAt: string;
}

export const registerUser = (username: string, email: string, password: string): { success: boolean; message: string; user?: User } => {
  const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email already registered' };
  }
  
  // Check if username already exists
  if (users.find(u => u.username === username)) {
    return { success: false, message: 'Username already taken' };
  }
  
  const newUser: StoredUser = {
    id: generateId(),
    username,
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  const { password: _, ...userWithoutPassword } = newUser;
  return { success: true, message: 'Registration successful', user: userWithoutPassword };
};

export const loginUser = (email: string, password: string): { success: boolean; message: string; user?: User } => {
  const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }
  
  const { password: _, ...userWithoutPassword } = user;
  return { success: true, message: 'Login successful', user: userWithoutPassword };
};
