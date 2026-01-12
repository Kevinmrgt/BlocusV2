import {
  signUp,
  signIn,
  signOut,
  getSession,
  getCurrentUser,
  getAuthErrorMessage,
} from '@/services/api/auth';
import { supabase } from '@/lib/supabase';
import type { AuthError } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      getUser: jest.fn(),
    },
  },
}));

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should call supabase.auth.signUp with email and password', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockSession = { access_token: 'token123' };
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await signUp({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });

    it('should return error on failure', async () => {
      const mockError = { message: 'User already registered' };
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      const result = await signUp({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe('signIn', () => {
    it('should call supabase.auth.signInWithPassword with email and password', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockSession = { access_token: 'token123' };
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await signIn({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });

    it('should return error on invalid credentials', async () => {
      const mockError = { message: 'Invalid login credentials' };
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      const result = await signIn({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(result.user).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe('signOut', () => {
    it('should call supabase.auth.signOut', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });

      const result = await signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });
  });

  describe('getSession', () => {
    it('should return current session', async () => {
      const mockSession = { access_token: 'token123' };
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await getSession();

      expect(supabase.auth.getSession).toHaveBeenCalled();
      expect(result.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await getCurrentUser();

      expect(supabase.auth.getUser).toHaveBeenCalled();
      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });
  });

  describe('getAuthErrorMessage', () => {
    it('should return French message for invalid credentials', () => {
      const error = { message: 'Invalid login credentials' } as AuthError;
      expect(getAuthErrorMessage(error)).toBe('Email ou mot de passe incorrect');
    });

    it('should return French message for user already exists', () => {
      const error = { message: 'User already registered' } as AuthError;
      expect(getAuthErrorMessage(error)).toBe('Cet email est deja utilise');
    });

    it('should return French message for weak password', () => {
      const error = { message: 'Password should be at least 8 characters' } as AuthError;
      expect(getAuthErrorMessage(error)).toBe('Mot de passe trop faible (minimum 8 caracteres)');
    });

    it('should return generic message for unknown error', () => {
      const error = { message: 'Some unknown error' } as AuthError;
      expect(getAuthErrorMessage(error)).toBe('Some unknown error');
    });
  });
});
