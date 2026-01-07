import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GymCallout } from '@/components/gym/GymCallout';
import type { Tables } from '@/types/database';

const mockGym: Tables<'gyms'> = {
  id: 'gym-1',
  name: 'Bloc Session Paris',
  address: '123 Rue de la Grimpe, 75011 Paris, France',
  latitude: 48.8566,
  longitude: 2.3522,
  description: 'Une super salle',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('GymCallout', () => {
  it('renders gym name', () => {
    const onSelect = jest.fn();
    const { getByText } = render(<GymCallout gym={mockGym} onSelect={onSelect} />);

    expect(getByText('Bloc Session Paris')).toBeTruthy();
  });

  it('renders gym address', () => {
    const onSelect = jest.fn();
    const { getByText } = render(<GymCallout gym={mockGym} onSelect={onSelect} />);

    expect(getByText('123 Rue de la Grimpe, 75011 Paris, Franc...')).toBeTruthy();
  });

  it('truncates long address', () => {
    const longAddressGym: Tables<'gyms'> = {
      ...mockGym,
      address:
        'This is a very long address that should be truncated because it exceeds 40 characters',
    };
    const onSelect = jest.fn();
    const { getByText } = render(<GymCallout gym={longAddressGym} onSelect={onSelect} />);

    expect(getByText('This is a very long address that should ...')).toBeTruthy();
  });

  it('renders select button', () => {
    const onSelect = jest.fn();
    const { getByText } = render(<GymCallout gym={mockGym} onSelect={onSelect} />);

    expect(getByText('Selectionner')).toBeTruthy();
  });

  it('calls onSelect when button pressed', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(<GymCallout gym={mockGym} onSelect={onSelect} />);

    fireEvent.press(getByTestId('select-gym-button-gym-1'));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
