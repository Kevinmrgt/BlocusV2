import { getBouldersByWallId, getBoulderById } from '@/services/api/boulders';
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

  describe('getBoulderById', () => {
    it('fetches a single boulder with photos', async () => {
      const mockBoulder = {
        id: 'boulder-1',
        wall_id: 'wall-1',
        title: 'Boulder 1',
        description: 'Test description',
        difficulty: 5,
        boulder_photos: [
          { id: 'p2', url: 'http://photo2.jpg', order_index: 1 },
          { id: 'p1', url: 'http://photo1.jpg', order_index: 0 },
        ],
      };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockBoulder, error: null }),
          }),
        }),
      });

      const result = await getBoulderById('boulder-1');

      expect(supabase.from).toHaveBeenCalledWith('boulders');
      // Photos should be sorted by order_index
      expect(result.boulder_photos[0].order_index).toBe(0);
      expect(result.boulder_photos[1].order_index).toBe(1);
    });

    it('throws error when boulder not found', async () => {
      const mockError = { message: 'Boulder not found', code: 'PGRST116' };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      await expect(getBoulderById('nonexistent')).rejects.toEqual(mockError);
    });

    it('throws error on database failure', async () => {
      const mockError = { message: 'Database error', code: 'PGRST' };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      await expect(getBoulderById('boulder-1')).rejects.toEqual(mockError);
    });
  });
});
