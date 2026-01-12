import { supabase } from '@/lib/supabase';
import type { AuthError, Session, User } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export interface SignUpParams {
  email: string;
  password: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp({ email, password }: SignUpParams): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn({ email, password }: SignInParams): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get the current session
 */
export async function getSession(): Promise<{
  session: Session | null;
  error: AuthError | null;
}> {
  const { data, error } = await supabase.auth.getSession();
  return {
    session: data.session,
    error,
  };
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<{
  user: User | null;
  error: AuthError | null;
}> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Translate Supabase auth error codes to French messages
 */
export function getAuthErrorMessage(error: AuthError): string {
  const errorMessages: Record<string, string> = {
    invalid_credentials: 'Email ou mot de passe incorrect',
    user_already_exists: 'Cet email est deja utilise',
    invalid_email: 'Email invalide',
    weak_password: 'Mot de passe trop faible (minimum 8 caracteres)',
    email_not_confirmed: 'Veuillez confirmer votre email',
    user_not_found: 'Aucun compte trouve avec cet email',
    too_many_requests: 'Trop de tentatives. Reessayez plus tard.',
  };

  // Check for specific error codes
  if (error.message?.includes('Invalid login credentials')) {
    return errorMessages.invalid_credentials;
  }
  if (error.message?.includes('User already registered')) {
    return errorMessages.user_already_exists;
  }
  if (error.message?.includes('Password should be at least')) {
    return errorMessages.weak_password;
  }

  // Return mapped message or generic error
  return (
    errorMessages[error.name] || error.message || 'Une erreur est survenue. Veuillez reessayer.'
  );
}
