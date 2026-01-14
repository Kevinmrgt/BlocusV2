import {
  createValidation,
  checkIsValidated,
  getValidationsByUser,
} from '@/services/api/validations';
import { supabase } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('Validations API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createValidation', () => {
    it('creates validation with correct points calculation', async () => {
      const mockValidation = {
        id: 'validation-1',
        user_id: 'user-123',
        boulder_id: 'boulder-1',
        points_earned: 70,
        validated_at: '2024-01-01T00:00:00Z',
      };

      const mockSingle = jest.fn().mockResolvedValue({ data: mockValidation, error: null });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
      (supabase.from as jest.Mock).mockReturnValue({ insert: mockInsert });

      const result = await createValidation('user-123', 'boulder-1', 7);

      expect(supabase.from).toHaveBeenCalledWith('validations');
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'user-123',
        boulder_id: 'boulder-1',
        points_earned: 70, // 7 * 10
      });
      expect(result).toEqual(mockValidation);
    });

    it('calculates points correctly for different difficulties', async () => {
      const mockSingle = jest.fn().mockResolvedValue({ data: { id: 'v1' }, error: null });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
      (supabase.from as jest.Mock).mockReturnValue({ insert: mockInsert });

      await createValidation('user-123', 'boulder-1', 5);
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ points_earned: 50 }));

      await createValidation('user-123', 'boulder-2', 10);
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ points_earned: 100 }));
    });

    it('throws error for already validated boulder', async () => {
      const mockError = { code: '23505', message: 'Unique constraint violation' };
      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
      (supabase.from as jest.Mock).mockReturnValue({ insert: mockInsert });

      await expect(createValidation('user-123', 'boulder-1', 5)).rejects.toThrow(
        'Boulder already validated'
      );
    });

    it('throws other errors normally', async () => {
      const mockError = { code: 'OTHER', message: 'Some error' };
      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
      (supabase.from as jest.Mock).mockReturnValue({ insert: mockInsert });

      await expect(createValidation('user-123', 'boulder-1', 5)).rejects.toEqual(mockError);
    });
  });

  describe('checkIsValidated', () => {
    it('returns true when validated', async () => {
      const mockMaybeSingle = jest
        .fn()
        .mockResolvedValue({ data: { id: 'validation-1' }, error: null });
      const mockEq2 = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await checkIsValidated('user-123', 'boulder-1');

      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('validations');
      expect(mockEq1).toHaveBeenCalledWith('user_id', 'user-123');
      expect(mockEq2).toHaveBeenCalledWith('boulder_id', 'boulder-1');
    });

    it('returns false when not validated', async () => {
      const mockMaybeSingle = jest.fn().mockResolvedValue({ data: null, error: null });
      const mockEq2 = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await checkIsValidated('user-123', 'boulder-1');

      expect(result).toBe(false);
    });

    it('throws error on failure', async () => {
      const mockError = { message: 'Check failed', code: 'ERROR' };
      const mockMaybeSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockEq2 = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      await expect(checkIsValidated('user-123', 'boulder-1')).rejects.toEqual(mockError);
    });
  });

  describe('getValidationsByUser', () => {
    it('returns validations list', async () => {
      const mockValidations = [
        { id: 'v1', boulder_id: 'b1', points_earned: 50 },
        { id: 'v2', boulder_id: 'b2', points_earned: 70 },
      ];

      const mockOrder = jest.fn().mockResolvedValue({ data: mockValidations, error: null });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await getValidationsByUser('user-123');

      expect(result).toEqual(mockValidations);
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
    });

    it('returns empty array when no validations', async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await getValidationsByUser('user-123');

      expect(result).toEqual([]);
    });

    it('throws error on failure', async () => {
      const mockError = { message: 'Fetch failed', code: 'ERROR' };
      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      await expect(getValidationsByUser('user-123')).rejects.toEqual(mockError);
    });
  });
});
