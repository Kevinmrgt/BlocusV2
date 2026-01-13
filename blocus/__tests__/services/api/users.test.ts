import { getUserProfile, updateUserProfile } from '@/services/api/users';
import { supabase } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('Users API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('returns user profile with computed counts', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        bio: 'Test bio',
        avatar_url: null,
        total_points: 100,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        validations: [{ count: 5 }],
        favorites: [{ count: 3 }],
      };

      const mockSingle = jest.fn().mockResolvedValue({ data: mockUser, error: null });
      const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await getUserProfile('user-123');

      expect(supabase.from).toHaveBeenCalledWith('users');
      expect(result).toEqual({
        ...mockUser,
        validations_count: 5,
        favorites_count: 3,
        rank: null,
      });
    });

    it('returns zero counts when no validations or favorites', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        username: null,
        bio: null,
        avatar_url: null,
        total_points: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        validations: null,
        favorites: null,
      };

      const mockSingle = jest.fn().mockResolvedValue({ data: mockUser, error: null });
      const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await getUserProfile('user-123');

      expect(result.validations_count).toBe(0);
      expect(result.favorites_count).toBe(0);
      expect(result.rank).toBeNull();
    });

    it('throws error on failure', async () => {
      const mockError = { message: 'User not found', code: 'PGRST116' };
      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      await expect(getUserProfile('invalid-id')).rejects.toEqual(mockError);
    });
  });

  describe('updateUserProfile', () => {
    it('updates user profile and returns updated data', async () => {
      const updatedUser = {
        id: 'user-123',
        email: 'test@example.com',
        username: 'newusername',
        bio: 'Updated bio',
        avatar_url: null,
        total_points: 100,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        validations: [{ count: 5 }],
        favorites: [{ count: 3 }],
      };

      // Mock for update chain
      const mockUpdateSingle = jest.fn().mockResolvedValue({ data: updatedUser, error: null });
      const mockUpdateSelect = jest.fn().mockReturnValue({ single: mockUpdateSingle });
      const mockUpdateEq = jest.fn().mockReturnValue({ select: mockUpdateSelect });
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockUpdateEq });

      // Mock for getUserProfile chain (called after update)
      const mockProfileSingle = jest.fn().mockResolvedValue({ data: updatedUser, error: null });
      const mockProfileEq = jest.fn().mockReturnValue({ single: mockProfileSingle });
      const mockProfileSelect = jest.fn().mockReturnValue({ eq: mockProfileEq });

      (supabase.from as jest.Mock)
        .mockReturnValueOnce({ update: mockUpdate })
        .mockReturnValueOnce({ select: mockProfileSelect });

      const result = await updateUserProfile('user-123', {
        username: 'newusername',
        bio: 'Updated bio',
      });

      expect(supabase.from).toHaveBeenCalledWith('users');
      expect(result.username).toBe('newusername');
    });

    it('throws error on update failure', async () => {
      const mockError = { message: 'Update failed', code: 'UNKNOWN' };
      const mockUpdateSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockUpdateSelect = jest.fn().mockReturnValue({ single: mockUpdateSingle });
      const mockUpdateEq = jest.fn().mockReturnValue({ select: mockUpdateSelect });
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockUpdateEq });
      (supabase.from as jest.Mock).mockReturnValue({ update: mockUpdate });

      await expect(updateUserProfile('user-123', { username: 'test' })).rejects.toEqual(mockError);
    });
  });
});
