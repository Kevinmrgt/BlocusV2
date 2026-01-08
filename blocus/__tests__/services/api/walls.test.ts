import { getWallsByGymId } from '@/services/api/walls';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

describe('walls service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWallsByGymId', () => {
    it('fetches walls for a gym ordered by order_index', async () => {
      const mockWalls = [
        { id: '1', gym_id: 'gym-1', name: 'Mur Nord', order_index: 0 },
        { id: '2', gym_id: 'gym-1', name: 'Mur Sud', order_index: 1 },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockWalls, error: null }),
          }),
        }),
      });

      const result = await getWallsByGymId('gym-1');

      expect(supabase.from).toHaveBeenCalledWith('walls');
      expect(result).toEqual(mockWalls);
    });

    it('returns empty array when no walls found', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      const result = await getWallsByGymId('gym-1');

      expect(result).toEqual([]);
    });

    it('throws error on failure', async () => {
      const mockError = { message: 'Database error', code: 'PGRST' };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      await expect(getWallsByGymId('gym-1')).rejects.toEqual(mockError);
    });
  });
});
