import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Tables } from '@/types/database';

type Gym = Tables<'gyms'>;

interface GymState {
  selectedGym: Gym | null;
  setSelectedGym: (gym: Gym | null) => void;
  clearSelectedGym: () => void;
}

export const useGymStore = create<GymState>()(
  persist(
    (set) => ({
      selectedGym: null,
      setSelectedGym: (gym) => set({ selectedGym: gym }),
      clearSelectedGym: () => set({ selectedGym: null }),
    }),
    {
      name: 'gym-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
