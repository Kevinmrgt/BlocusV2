import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkIsFavorited,
} from '@/services/api/favorites';
import { supabase } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('Favorites API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFavorites', () => {
    it('returns favorites list with boulder details', async () => {
      const mockFavorites = [
        {
          id: 'fav-1',
          created_at: '2024-01-01',
          boulder: {
            id: 'boulder-1',
            title: 'Test Boulder',
            description: 'A test',
            difficulty: 5,
            wall_id: 'wall-1',
            created_at: '2024-01-01',
            boulder_photos: [{ id: 'photo-1', url: 'http://test.jpg', order_index: 0 }],
          },
        },
        {
          id: 'fav-2',
          created_at: '2024-01-02',
          boulder: {
            id: 'boulder-2',
            title: 'Another Boulder',
            description: null,
            difficulty: 7,
            wall_id: 'wall-1',
            created_at: '2024-01-01',
            boulder_photos: [],
          },
        },
      ];

      const mockOrder = jest.fn().mockResolvedValue({ data: mockFavorites, error: null });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await getFavorites('user-123');

      expect(supabase.from).toHaveBeenCalledWith('favorites');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('boulder-1');
      expect(result[0].title).toBe('Test Boulder');
      expect(result[0].photos).toEqual(mockFavorites[0].boulder.boulder_photos);
      expect(result[0].is_favorited).toBe(true);
    });

    it('returns empty array when no favorites', async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await getFavorites('user-123');

      expect(result).toEqual([]);
    });

    it('throws error on failure', async () => {
      const mockError = { message: 'Database error', code: 'ERROR' };
      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      await expect(getFavorites('user-123')).rejects.toEqual(mockError);
    });
  });

  describe('addFavorite', () => {
    it('inserts favorite successfully', async () => {
      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      (supabase.from as jest.Mock).mockReturnValue({ insert: mockInsert });

      await expect(addFavorite('user-123', 'boulder-1')).resolves.toBeUndefined();

      expect(supabase.from).toHaveBeenCalledWith('favorites');
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'user-123',
        boulder_id: 'boulder-1',
      });
    });

    it('throws error on insert failure', async () => {
      const mockError = { message: 'Insert failed', code: 'ERROR' };
      const mockInsert = jest.fn().mockResolvedValue({ error: mockError });
      (supabase.from as jest.Mock).mockReturnValue({ insert: mockInsert });

      await expect(addFavorite('user-123', 'boulder-1')).rejects.toEqual(mockError);
    });
  });

  describe('removeFavorite', () => {
    it('deletes favorite successfully', async () => {
      const mockEq2 = jest.fn().mockResolvedValue({ error: null });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockDelete = jest.fn().mockReturnValue({ eq: mockEq1 });
      (supabase.from as jest.Mock).mockReturnValue({ delete: mockDelete });

      await expect(removeFavorite('user-123', 'boulder-1')).resolves.toBeUndefined();

      expect(supabase.from).toHaveBeenCalledWith('favorites');
      expect(mockEq1).toHaveBeenCalledWith('user_id', 'user-123');
      expect(mockEq2).toHaveBeenCalledWith('boulder_id', 'boulder-1');
    });

    it('throws error on delete failure', async () => {
      const mockError = { message: 'Delete failed', code: 'ERROR' };
      const mockEq2 = jest.fn().mockResolvedValue({ error: mockError });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockDelete = jest.fn().mockReturnValue({ eq: mockEq1 });
      (supabase.from as jest.Mock).mockReturnValue({ delete: mockDelete });

      await expect(removeFavorite('user-123', 'boulder-1')).rejects.toEqual(mockError);
    });
  });

  describe('checkIsFavorited', () => {
    it('returns true when favorited', async () => {
      const mockMaybeSingle = jest.fn().mockResolvedValue({ data: { id: 'fav-1' }, error: null });
      const mockEq2 = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await checkIsFavorited('user-123', 'boulder-1');

      expect(result).toBe(true);
    });

    it('returns false when not favorited', async () => {
      const mockMaybeSingle = jest.fn().mockResolvedValue({ data: null, error: null });
      const mockEq2 = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await checkIsFavorited('user-123', 'boulder-1');

      expect(result).toBe(false);
    });

    it('throws error on check failure', async () => {
      const mockError = { message: 'Check failed', code: 'ERROR' };
      const mockMaybeSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockEq2 = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      await expect(checkIsFavorited('user-123', 'boulder-1')).rejects.toEqual(mockError);
    });
  });
});
