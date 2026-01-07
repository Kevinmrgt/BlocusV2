import { getGyms, getGymById } from '@/services/api/gyms';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('gyms service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGyms', () => {
    it('returns gyms data when successful', async () => {
      const mockGyms = [
        { id: '1', name: 'Gym 1' },
        { id: '2', name: 'Gym 2' },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockGyms, error: null }),
        }),
      });

      const result = await getGyms();
      expect(result).toEqual(mockGyms);
      expect(supabase.from).toHaveBeenCalledWith('gyms');
    });

    it('returns empty array when data is null', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: null, error: null }),
        }),
      });

      const result = await getGyms();
      expect(result).toEqual([]);
    });

    it('throws error when query fails', async () => {
      const error = { message: 'Database error' };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: null, error }),
        }),
      });

      await expect(getGyms()).rejects.toEqual(error);
    });
  });

  describe('getGymById', () => {
    it('returns gym when found', async () => {
      const mockGym = { id: '1', name: 'Gym 1' };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockGym, error: null }),
          }),
        }),
      });

      const result = await getGymById('1');
      expect(result).toEqual(mockGym);
    });

    it('throws error when query fails', async () => {
      const error = { message: 'Not found' };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error }),
          }),
        }),
      });

      await expect(getGymById('999')).rejects.toEqual(error);
    });
  });
});
