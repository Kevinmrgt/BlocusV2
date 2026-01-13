import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';
import { SettingsScreen } from '@/screens/profile/SettingsScreen';

// Mock navigation
const mockDispatch = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      dispatch: mockDispatch,
    }),
  };
});

// Mock auth provider
const mockSignOut = jest.fn();
let mockIsAuthenticated = true;

jest.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({
    signOut: mockSignOut,
    isAuthenticated: mockIsAuthenticated,
    user: { email: 'test@example.com' },
    session: {},
    isLoading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
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

// Spy on Alert
jest.spyOn(Alert, 'alert');

const renderSettingsScreen = () => {
  return render(
    <NavigationContainer>
      <SettingsScreen />
    </NavigationContainer>
  );
};

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated = true;
  });

  it('should render settings screen with title', () => {
    const { getByText, getByTestId } = renderSettingsScreen();

    expect(getByTestId('settings-screen')).toBeTruthy();
    expect(getByText('Parametres')).toBeTruthy();
  });

  it('should render logout button when authenticated', () => {
    const { getByTestId, getByText } = renderSettingsScreen();

    expect(getByTestId('logout-button')).toBeTruthy();
    expect(getByText('Se deconnecter')).toBeTruthy();
  });

  it('should show confirmation dialog when logout button is pressed', () => {
    const { getByTestId } = renderSettingsScreen();

    fireEvent.press(getByTestId('logout-button'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Deconnexion',
      'Etes-vous sur de vouloir vous deconnecter ?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Annuler', style: 'cancel' }),
        expect.objectContaining({ text: 'Deconnexion', style: 'destructive' }),
      ]),
      { cancelable: true }
    );
  });

  it('should call signOut when logout is confirmed', async () => {
    mockSignOut.mockResolvedValue(undefined);
    const { getByTestId } = renderSettingsScreen();

    fireEvent.press(getByTestId('logout-button'));

    // Get the onPress handler from the Alert call
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons = alertCall[2];
    const confirmButton = buttons.find((b: { text: string }) => b.text === 'Deconnexion');

    // Simulate pressing confirm
    await confirmButton.onPress();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it('should navigate to Home after successful logout', async () => {
    mockSignOut.mockResolvedValue(undefined);
    const { getByTestId } = renderSettingsScreen();

    fireEvent.press(getByTestId('logout-button'));

    // Get the onPress handler from the Alert call
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons = alertCall[2];
    const confirmButton = buttons.find((b: { text: string }) => b.text === 'Deconnexion');

    // Simulate pressing confirm
    await confirmButton.onPress();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'RESET',
        })
      );
    });
  });

  it('should show guest message when not authenticated', () => {
    mockIsAuthenticated = false;

    // Need to re-mock with new value
    jest.doMock('@/providers/AuthProvider', () => ({
      useAuth: () => ({
        signOut: mockSignOut,
        isAuthenticated: false,
        user: null,
        session: null,
        isLoading: false,
        signIn: jest.fn(),
        signUp: jest.fn(),
      }),
    }));

    const { getByText } = renderSettingsScreen();

    // Logout button should not be visible for guests
    // Note: Due to how Jest mocking works, we may need to check differently
    expect(getByText(/mode invite|Connectez-vous/i)).toBeTruthy();
  });
});
