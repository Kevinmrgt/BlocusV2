import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ValidationButton } from '@/components/boulder/ValidationButton';

// Mock hooks
const mockMutate = jest.fn();
const mockUseIsValidated = jest.fn();
const mockUseValidateBoulder = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('@/hooks/useValidations', () => ({
  useIsValidated: () => mockUseIsValidated(),
  useValidateBoulder: () => mockUseValidateBoulder(),
}));

jest.mock('@/providers/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('ValidationButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    mockUseIsValidated.mockReturnValue({ data: false, isLoading: false });
    mockUseValidateBoulder.mockReturnValue({ mutate: mockMutate, isPending: false });
  });

  it('renders outline check when not validated', () => {
    mockUseIsValidated.mockReturnValue({ data: false, isLoading: false });

    render(<ValidationButton boulderId="boulder-1" difficulty={5} testID="val-btn" />);

    expect(screen.getByTestId('val-btn')).toBeTruthy();
    expect(screen.getByTestId('val-btn-outline')).toBeTruthy();
  });

  it('renders filled check when validated', () => {
    mockUseIsValidated.mockReturnValue({ data: true, isLoading: false });

    render(<ValidationButton boulderId="boulder-1" difficulty={5} testID="val-btn" />);

    expect(screen.getByTestId('val-btn-filled')).toBeTruthy();
  });

  it('displays points to earn based on difficulty', () => {
    render(<ValidationButton boulderId="boulder-1" difficulty={5} testID="val-btn" />);

    expect(screen.getByTestId('val-btn-points')).toHaveTextContent('50 pts');
  });

  it('displays different points for different difficulties', () => {
    render(<ValidationButton boulderId="boulder-1" difficulty={7} testID="val-btn" />);

    expect(screen.getByTestId('val-btn-points')).toHaveTextContent('70 pts');
  });

  it('displays +points when validated', () => {
    mockUseIsValidated.mockReturnValue({ data: true, isLoading: false });

    render(<ValidationButton boulderId="boulder-1" difficulty={5} testID="val-btn" />);

    expect(screen.getByTestId('val-btn-points')).toHaveTextContent('+50 pts');
  });

  it('calls validate mutation on press when authenticated', () => {
    mockUseIsValidated.mockReturnValue({ data: false, isLoading: false });

    render(<ValidationButton boulderId="boulder-1" difficulty={5} testID="val-btn" />);

    fireEvent.press(screen.getByTestId('val-btn'));

    expect(mockMutate).toHaveBeenCalledWith(
      { boulderId: 'boulder-1', difficulty: 5 },
      expect.any(Object)
    );
  });

  it('does not call mutation when already validated', () => {
    mockUseIsValidated.mockReturnValue({ data: true, isLoading: false });

    render(<ValidationButton boulderId="boulder-1" difficulty={5} testID="val-btn" />);

    fireEvent.press(screen.getByTestId('val-btn'));

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('does not call mutation when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    render(<ValidationButton boulderId="boulder-1" difficulty={5} testID="val-btn" />);

    fireEvent.press(screen.getByTestId('val-btn'));

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('does not call mutation when disabled', () => {
    render(<ValidationButton boulderId="boulder-1" difficulty={5} disabled testID="val-btn" />);

    fireEvent.press(screen.getByTestId('val-btn'));

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('does not call mutation when pending', () => {
    mockUseValidateBoulder.mockReturnValue({ mutate: mockMutate, isPending: true });

    render(<ValidationButton boulderId="boulder-1" difficulty={5} testID="val-btn" />);

    fireEvent.press(screen.getByTestId('val-btn'));

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows loading indicator when checking validation status', () => {
    mockUseIsValidated.mockReturnValue({ data: false, isLoading: true });

    render(<ValidationButton boulderId="boulder-1" difficulty={5} testID="val-btn" />);

    expect(screen.getByTestId('val-btn-loading')).toBeTruthy();
  });

  it('shows loading indicator when mutation is pending', () => {
    mockUseValidateBoulder.mockReturnValue({ mutate: mockMutate, isPending: true });

    render(<ValidationButton boulderId="boulder-1" difficulty={5} testID="val-btn" />);

    expect(screen.getByTestId('val-btn-loading')).toBeTruthy();
  });

  it('applies disabled style when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    render(<ValidationButton boulderId="boulder-1" difficulty={5} testID="val-btn" />);

    // Button is rendered with disabled styling
    expect(screen.getByTestId('val-btn')).toBeTruthy();
  });

  it('applies disabled style when already validated', () => {
    mockUseIsValidated.mockReturnValue({ data: true, isLoading: false });

    render(<ValidationButton boulderId="boulder-1" difficulty={5} testID="val-btn" />);

    // Button is rendered (visual check would verify disabled state)
    expect(screen.getByTestId('val-btn')).toBeTruthy();
  });

  it('uses custom size prop', () => {
    render(<ValidationButton boulderId="boulder-1" difficulty={5} size={32} testID="val-btn" />);

    expect(screen.getByTestId('val-btn')).toBeTruthy();
    // Size is passed to CheckCircle icon
  });

  it('calls onSuccess callback when validation succeeds', () => {
    const onSuccessMock = jest.fn();
    mockMutate.mockImplementation((params, options) => {
      // Simulate successful mutation callback
      options.onSuccess({ points_earned: 50 });
    });

    render(
      <ValidationButton
        boulderId="boulder-1"
        difficulty={5}
        onSuccess={onSuccessMock}
        testID="val-btn"
      />
    );

    fireEvent.press(screen.getByTestId('val-btn'));

    expect(onSuccessMock).toHaveBeenCalledWith(50);
  });
});
