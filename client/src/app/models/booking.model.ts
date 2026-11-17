import { Pet } from './pet.model';

export interface Service {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
  petTypes: ('dog' | 'cat' | 'other')[];
  isActive: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type TimeSlot = '09:00' | '10:30' | '13:00' | '14:30' | '16:00';

export interface Booking {
  _id: string;
  user: string;
  pet: Pet;
  service: Service;
  date: string; // YYYY-MM-DD
  timeSlot: TimeSlot;
  status: BookingStatus;
  price: number;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AvailableSlotsResponse {
  allSlots: TimeSlot[];
  bookedSlots: TimeSlot[];
  availableSlots: TimeSlot[];
}
