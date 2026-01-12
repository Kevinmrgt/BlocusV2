import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { LoginScreen } from '@/screens/auth/LoginScreen';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

// Mock auth provider
const mockSignIn = jest.fn();
jest.mock('@/providers/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    signIn: mockSignIn,
    isAuthenticated: false,
    isLoading: false,
    user: null,
    session: null,
    signUp: jest.fn(),
    signOut: jest.fn(),
  }),
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  },
}));

const renderLoginScreen = () => {
  return render(
    <NavigationContainer>
      <LoginScreen />
    </NavigationContainer>
  );
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render email and password inputs', () => {
    const { getByPlaceholderText, getByText } = renderLoginScreen();

    expect(getByPlaceholderText('votre@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Votre mot de passe')).toBeTruthy();
    expect(getByText('Se connecter')).toBeTruthy();
  });

  it('should render login title and subtitle', () => {
    const { getByText } = renderLoginScreen();

    expect(getByText('Connexion')).toBeTruthy();
    expect(getByText('Connectez-vous pour acceder a toutes les fonctionnalites')).toBeTruthy();
  });

  it('should render link to register screen', () => {
    const { getByText } = renderLoginScreen();

    expect(getByText('Pas encore de compte ?')).toBeTruthy();
    expect(getByText('Inscrivez-vous')).toBeTruthy();
  });

  it('should navigate to register when link is pressed', () => {
    const { getByText } = renderLoginScreen();

    fireEvent.press(getByText('Inscrivez-vous'));

    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });

  it('should show validation error for empty email', async () => {
    const { getByText, getByPlaceholderText } = renderLoginScreen();

    // Enter valid password but no email
    fireEvent.changeText(getByPlaceholderText('Votre mot de passe'), 'password123');
    fireEvent.press(getByText('Se connecter'));

    await waitFor(() => {
      expect(getByText('Email requis')).toBeTruthy();
    });
  });

  it('should show validation error for invalid email', async () => {
    const { getByText, getByPlaceholderText } = renderLoginScreen();

    fireEvent.changeText(getByPlaceholderText('votre@email.com'), 'invalid');
    fireEvent.changeText(getByPlaceholderText('Votre mot de passe'), 'password123');
    fireEvent.press(getByText('Se connecter'));

    await waitFor(() => {
      expect(getByText('Email invalide')).toBeTruthy();
    });
  });

  it('should show validation error for short password', async () => {
    const { getByText, getByPlaceholderText } = renderLoginScreen();

    fireEvent.changeText(getByPlaceholderText('votre@email.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Votre mot de passe'), 'short');
    fireEvent.press(getByText('Se connecter'));

    await waitFor(() => {
      expect(getByText('Minimum 8 caracteres')).toBeTruthy();
    });
  });

  it('should call signIn with correct credentials', async () => {
    mockSignIn.mockResolvedValue({ error: null });

    const { getByText, getByPlaceholderText } = renderLoginScreen();

    fireEvent.changeText(getByPlaceholderText('votre@email.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Votre mot de passe'), 'password123');
    fireEvent.press(getByText('Se connecter'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should display API error message on login failure', async () => {
    mockSignIn.mockResolvedValue({ error: 'Email ou mot de passe incorrect' });

    const { getByText, getByPlaceholderText } = renderLoginScreen();

    fireEvent.changeText(getByPlaceholderText('votre@email.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Votre mot de passe'), 'wrongpassword');
    fireEvent.press(getByText('Se connecter'));

    await waitFor(() => {
      expect(getByText('Email ou mot de passe incorrect')).toBeTruthy();
    });
  });
});
