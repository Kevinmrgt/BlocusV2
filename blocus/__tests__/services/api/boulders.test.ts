import { getBouldersByWallId } from '@/services/api/boulders';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

describe('boulders service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBouldersByWallId', () => {
    it('fetches boulders with photos for a wall', async () => {
      const mockBoulders = [
        {
          id: '1',
          wall_id: 'wall-1',
          title: 'Boulder 1',
          difficulty: 5,
          boulder_photos: [{ id: 'p1', url: 'http://photo1.jpg', order_index: 0 }],
        },
        {
          id: '2',
          wall_id: 'wall-1',
          title: 'Boulder 2',
          difficulty: 7,
          boulder_photos: [],
        },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockBoulders, error: null }),
          }),
        }),
      });

      const result = await getBouldersByWallId('wall-1');

      expect(supabase.from).toHaveBeenCalledWith('boulders');
      expect(result).toEqual(mockBoulders);
    });

    it('returns empty array when no boulders found', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      const result = await getBouldersByWallId('wall-1');

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

      await expect(getBouldersByWallId('wall-1')).rejects.toEqual(mockError);
    });
  });
});
