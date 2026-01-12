import {
  loginSchema,
  registerSchema,
  validateLoginForm,
  validateRegisterForm,
} from '@/lib/schemas/auth';

describe('Auth Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct email and password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty email', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find((i) => i.path[0] === 'email');
        expect(emailError?.message).toBe('Email requis');
      }
    });

    it('should reject invalid email format', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find((i) => i.path[0] === 'email');
        expect(emailError?.message).toBe('Email invalide');
      }
    });

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find((i) => i.path[0] === 'password');
        expect(passwordError?.message).toBe('Mot de passe requis');
      }
    });

    it('should reject password shorter than 8 characters', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'short',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find((i) => i.path[0] === 'password');
        expect(passwordError?.message).toBe('Minimum 8 caracteres');
      }
    });

    it('should accept password with exactly 8 characters', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '12345678',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject when passwords do not match', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find((i) => i.path[0] === 'confirmPassword');
        expect(confirmError?.message).toBe('Les mots de passe ne correspondent pas');
      }
    });

    it('should reject empty confirmPassword', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find((i) => i.path[0] === 'confirmPassword');
        expect(confirmError?.message).toBe('Confirmation requise');
      }
    });
  });

  describe('validateLoginForm', () => {
    it('should return null for valid data', () => {
      const result = validateLoginForm({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toBeNull();
    });

    it('should return errors object for invalid data', () => {
      const result = validateLoginForm({
        email: '',
        password: 'short',
      });
      expect(result).not.toBeNull();
      expect(result?.email).toBe('Email requis');
      expect(result?.password).toBe('Minimum 8 caracteres');
    });
  });

  describe('validateRegisterForm', () => {
    it('should return null for valid data', () => {
      const result = validateRegisterForm({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(result).toBeNull();
    });

    it('should return errors object for password mismatch', () => {
      const result = validateRegisterForm({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different123',
      });
      expect(result).not.toBeNull();
      expect(result?.confirmPassword).toBe('Les mots de passe ne correspondent pas');
    });
  });
});
