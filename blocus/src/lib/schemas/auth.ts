import { z } from 'zod';

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis').min(8, 'Minimum 8 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register form validation schema
 */
export const registerSchema = z
  .object({
    email: z.string().min(1, 'Email requis').email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis').min(8, 'Minimum 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmation requise'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Validate login form data
 * Returns errors object or null if valid
 */
export function validateLoginForm(data: LoginFormData): Record<string, string> | null {
  const result = loginSchema.safeParse(data);

  if (result.success) {
    return null;
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as string;
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  });

  return errors;
}

/**
 * Validate register form data
 * Returns errors object or null if valid
 */
export function validateRegisterForm(data: RegisterFormData): Record<string, string> | null {
  const result = registerSchema.safeParse(data);

  if (result.success) {
    return null;
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as string;
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  });

  return errors;
}
