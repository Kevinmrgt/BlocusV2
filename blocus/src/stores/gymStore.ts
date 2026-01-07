import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Tables } from '@/types/database';

type Gym = Tables<'gyms'>;

interface GymState {
  selectedGym: Gym | null;
  _hasHydrated: boolean;
  setSelectedGym: (gym: Gym | null) => void;
  clearSelectedGym: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useGymStore = create<GymState>()(
  persist(
    (set) => ({
      selectedGym: null,
      _hasHydrated: false,
      setSelectedGym: (gym) => set({ selectedGym: gym }),
      clearSelectedGym: () => set({ selectedGym: null }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: 'gym-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        selectedGym: state.selectedGym,
      }),
    }
  )
);
