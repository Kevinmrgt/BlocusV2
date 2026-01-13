import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { FavoriteButton } from '@/components/boulder/FavoriteButton';

// Mock hooks
const mockMutate = jest.fn();
const mockUseIsFavorited = jest.fn();
const mockUseToggleFavorite = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('@/hooks/useFavorites', () => ({
  useIsFavorited: () => mockUseIsFavorited(),
  useToggleFavorite: () => mockUseToggleFavorite(),
}));

jest.mock('@/providers/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('FavoriteButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    mockUseIsFavorited.mockReturnValue({ data: false, isLoading: false });
    mockUseToggleFavorite.mockReturnValue({ mutate: mockMutate, isPending: false });
  });

  it('renders outline heart when not favorited', () => {
    mockUseIsFavorited.mockReturnValue({ data: false, isLoading: false });

    render(<FavoriteButton boulderId="boulder-1" testID="fav-btn" />);

    expect(screen.getByTestId('fav-btn')).toBeTruthy();
    expect(screen.getByTestId('fav-btn-outline')).toBeTruthy();
  });

  it('renders filled heart when favorited', () => {
    mockUseIsFavorited.mockReturnValue({ data: true, isLoading: false });

    render(<FavoriteButton boulderId="boulder-1" testID="fav-btn" />);

    expect(screen.getByTestId('fav-btn-filled')).toBeTruthy();
  });

  it('calls toggle mutation on press when authenticated', () => {
    mockUseIsFavorited.mockReturnValue({ data: false, isLoading: false });

    render(<FavoriteButton boulderId="boulder-1" testID="fav-btn" />);

    fireEvent.press(screen.getByTestId('fav-btn'));

    expect(mockMutate).toHaveBeenCalledWith({
      boulderId: 'boulder-1',
      isFavorited: false,
    });
  });

  it('toggles off when currently favorited', () => {
    mockUseIsFavorited.mockReturnValue({ data: true, isLoading: false });

    render(<FavoriteButton boulderId="boulder-1" testID="fav-btn" />);

    fireEvent.press(screen.getByTestId('fav-btn'));

    expect(mockMutate).toHaveBeenCalledWith({
      boulderId: 'boulder-1',
      isFavorited: true,
    });
  });

  it('does not call mutation when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    render(<FavoriteButton boulderId="boulder-1" testID="fav-btn" />);

    fireEvent.press(screen.getByTestId('fav-btn'));

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('does not call mutation when disabled', () => {
    render(<FavoriteButton boulderId="boulder-1" disabled testID="fav-btn" />);

    fireEvent.press(screen.getByTestId('fav-btn'));

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('does not call mutation when pending', () => {
    mockUseToggleFavorite.mockReturnValue({ mutate: mockMutate, isPending: true });

    render(<FavoriteButton boulderId="boulder-1" testID="fav-btn" />);

    fireEvent.press(screen.getByTestId('fav-btn'));

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows loading indicator when checking favorite status', () => {
    mockUseIsFavorited.mockReturnValue({ data: false, isLoading: true });

    render(<FavoriteButton boulderId="boulder-1" testID="fav-btn" />);

    expect(screen.getByTestId('fav-btn-loading')).toBeTruthy();
  });

  it('shows loading indicator when mutation is pending', () => {
    mockUseToggleFavorite.mockReturnValue({ mutate: mockMutate, isPending: true });

    render(<FavoriteButton boulderId="boulder-1" testID="fav-btn" />);

    expect(screen.getByTestId('fav-btn-loading')).toBeTruthy();
  });

  it('applies disabled style when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    render(<FavoriteButton boulderId="boulder-1" testID="fav-btn" />);

    const button = screen.getByTestId('fav-btn');
    // Button should have disabled styling (opacity 0.5)
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });

  it('uses custom size prop', () => {
    render(<FavoriteButton boulderId="boulder-1" size={32} testID="fav-btn" />);

    expect(screen.getByTestId('fav-btn')).toBeTruthy();
    // Size is passed to Heart icon
  });
});
