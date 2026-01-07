import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GymHeader } from '@/components/gym/GymHeader';

describe('GymHeader', () => {
  const mockOnChangeGym = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders gym name when provided', () => {
    const { getByText } = render(<GymHeader gymName="Test Gym" onChangeGym={mockOnChangeGym} />);

    expect(getByText('Test Gym')).toBeTruthy();
  });

  it('renders fallback text when gym name is null', () => {
    const { getByText } = render(<GymHeader gymName={null} onChangeGym={mockOnChangeGym} />);

    expect(getByText('Aucune salle')).toBeTruthy();
  });

  it('renders "Changer" button', () => {
    const { getByText } = render(<GymHeader gymName="Test Gym" onChangeGym={mockOnChangeGym} />);

    expect(getByText('Changer')).toBeTruthy();
  });

  it('calls onChangeGym when pressed', () => {
    const { getByTestId } = render(<GymHeader gymName="Test Gym" onChangeGym={mockOnChangeGym} />);

    fireEvent.press(getByTestId('gym-header'));

    expect(mockOnChangeGym).toHaveBeenCalledTimes(1);
  });

  it('uses custom testID when provided', () => {
    const { getByTestId } = render(
      <GymHeader gymName="Test Gym" onChangeGym={mockOnChangeGym} testID="custom-test-id" />
    );

    expect(getByTestId('custom-test-id')).toBeTruthy();
  });
});
