import { create } from 'zustand';
import { ReservationData, Reservation } from '../types';

interface ReservationStore {
  currentStep: number;
  reservationData: Partial<ReservationData>;
  reservationHistory: Reservation[];
  
  setCurrentStep: (step: number) => void;
  updateReservationData: (data: Partial<ReservationData>) => void;
  completeReservation: (reservation: Reservation) => void;
  resetReservation: () => void;
  getReservationHistory: () => Reservation[];
}

export const useReservationStore = create<ReservationStore>((set, get) => ({
  currentStep: 1,
  reservationData: {},
  reservationHistory: [],

  setCurrentStep: (step) => set({ currentStep: step }),

  updateReservationData: (data) =>
    set((state) => ({
      reservationData: {
        ...state.reservationData,
        ...data,
      },
    })),

  completeReservation: (reservation) =>
    set((state) => ({
      reservationHistory: [...state.reservationHistory, reservation],
      reservationData: {},
      currentStep: 1,
    })),

  resetReservation: () =>
    set({
      reservationData: {},
      currentStep: 1,
    }),

  getReservationHistory: () => get().reservationHistory,
}));
