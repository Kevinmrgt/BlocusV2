import { useGymStore } from '@/stores/gymStore';
import type { Tables } from '@/types/database';

const mockGym: Tables<'gyms'> = {
  id: 'gym-1',
  name: 'Bloc Session Paris',
  address: '123 Rue de la Grimpe, 75011 Paris',
  latitude: 48.8566,
  longitude: 2.3522,
  description: 'Une super salle',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('gymStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useGymStore.setState({ selectedGym: null, _hasHydrated: false });
  });

  it('has null selectedGym initially', () => {
    const { selectedGym } = useGymStore.getState();
    expect(selectedGym).toBeNull();
  });

  it('setSelectedGym updates the selected gym', () => {
    const { setSelectedGym } = useGymStore.getState();

    setSelectedGym(mockGym);

    const { selectedGym } = useGymStore.getState();
    expect(selectedGym).toEqual(mockGym);
  });

  it('clearSelectedGym sets selectedGym to null', () => {
    const { setSelectedGym, clearSelectedGym } = useGymStore.getState();

    setSelectedGym(mockGym);
    expect(useGymStore.getState().selectedGym).toEqual(mockGym);

    clearSelectedGym();
    expect(useGymStore.getState().selectedGym).toBeNull();
  });

  it('setSelectedGym can update to a different gym', () => {
    const { setSelectedGym } = useGymStore.getState();

    const anotherGym: Tables<'gyms'> = {
      ...mockGym,
      id: 'gym-2',
      name: 'Arkose Nation',
    };

    setSelectedGym(mockGym);
    expect(useGymStore.getState().selectedGym?.id).toBe('gym-1');

    setSelectedGym(anotherGym);
    expect(useGymStore.getState().selectedGym?.id).toBe('gym-2');
    expect(useGymStore.getState().selectedGym?.name).toBe('Arkose Nation');
  });

  describe('hydration', () => {
    it('has _hasHydrated false initially', () => {
      const { _hasHydrated } = useGymStore.getState();
      expect(_hasHydrated).toBe(false);
    });

    it('setHasHydrated updates hydration state', () => {
      const { setHasHydrated } = useGymStore.getState();

      setHasHydrated(true);

      expect(useGymStore.getState()._hasHydrated).toBe(true);
    });

    it('hydration state does not affect selectedGym operations', () => {
      const { setSelectedGym, setHasHydrated } = useGymStore.getState();

      setHasHydrated(true);
      setSelectedGym(mockGym);

      expect(useGymStore.getState()._hasHydrated).toBe(true);
      expect(useGymStore.getState().selectedGym).toEqual(mockGym);
    });
  });
});
