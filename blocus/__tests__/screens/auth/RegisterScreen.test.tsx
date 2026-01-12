import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';

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
const mockSignUp = jest.fn();
jest.mock('@/providers/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    signUp: mockSignUp,
    isAuthenticated: false,
    isLoading: false,
    user: null,
    session: null,
    signIn: jest.fn(),
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

// Mock Alert - using spyOn instead of full mock
import { Alert } from 'react-native';
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

const renderRegisterScreen = () => {
  return render(
    <NavigationContainer>
      <RegisterScreen />
    </NavigationContainer>
  );
};

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all input fields', () => {
    const { getByPlaceholderText, getByText } = renderRegisterScreen();

    expect(getByPlaceholderText('votre@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Minimum 8 caracteres')).toBeTruthy();
    expect(getByPlaceholderText('Confirmez votre mot de passe')).toBeTruthy();
    expect(getByText('Creer mon compte')).toBeTruthy();
  });

  it('should render register title and subtitle', () => {
    const { getByText } = renderRegisterScreen();

    expect(getByText('Inscription')).toBeTruthy();
    expect(getByText('Creez votre compte pour commencer a grimper')).toBeTruthy();
  });

  it('should render link to login screen', () => {
    const { getByText } = renderRegisterScreen();

    expect(getByText('Deja un compte ?')).toBeTruthy();
    expect(getByText('Connectez-vous')).toBeTruthy();
  });

  it('should navigate to login when link is pressed', () => {
    const { getByText } = renderRegisterScreen();

    fireEvent.press(getByText('Connectez-vous'));

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('should show validation error for empty email', async () => {
    const { getByText, getByPlaceholderText } = renderRegisterScreen();

    fireEvent.changeText(getByPlaceholderText('Minimum 8 caracteres'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirmez votre mot de passe'), 'password123');
    fireEvent.press(getByText('Creer mon compte'));

    await waitFor(() => {
      expect(getByText('Email requis')).toBeTruthy();
    });
  });

  it('should show validation error for password mismatch', async () => {
    const { getByText, getByPlaceholderText } = renderRegisterScreen();

    fireEvent.changeText(getByPlaceholderText('votre@email.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Minimum 8 caracteres'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirmez votre mot de passe'), 'different123');
    fireEvent.press(getByText('Creer mon compte'));

    await waitFor(() => {
      expect(getByText('Les mots de passe ne correspondent pas')).toBeTruthy();
    });
  });

  it('should show validation error for short password', async () => {
    const { getByText, getByPlaceholderText } = renderRegisterScreen();

    fireEvent.changeText(getByPlaceholderText('votre@email.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Minimum 8 caracteres'), 'short');
    fireEvent.changeText(getByPlaceholderText('Confirmez votre mot de passe'), 'short');
    fireEvent.press(getByText('Creer mon compte'));

    await waitFor(() => {
      expect(getByText('Minimum 8 caracteres')).toBeTruthy();
    });
  });

  it('should call signUp with correct credentials', async () => {
    mockSignUp.mockResolvedValue({ error: null });

    const { getByText, getByPlaceholderText } = renderRegisterScreen();

    fireEvent.changeText(getByPlaceholderText('votre@email.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Minimum 8 caracteres'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirmez votre mot de passe'), 'password123');
    fireEvent.press(getByText('Creer mon compte'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should display API error message on registration failure', async () => {
    mockSignUp.mockResolvedValue({ error: 'Cet email est deja utilise' });

    const { getByText, getByPlaceholderText } = renderRegisterScreen();

    fireEvent.changeText(getByPlaceholderText('votre@email.com'), 'existing@example.com');
    fireEvent.changeText(getByPlaceholderText('Minimum 8 caracteres'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirmez votre mot de passe'), 'password123');
    fireEvent.press(getByText('Creer mon compte'));

    await waitFor(() => {
      expect(getByText('Cet email est deja utilise')).toBeTruthy();
    });
  });
});
