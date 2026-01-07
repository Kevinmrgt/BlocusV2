import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders activity indicator', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('renders with message when provided', () => {
    render(<LoadingSpinner message="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeTruthy();
  });

  it('renders without message by default', () => {
    render(<LoadingSpinner />);
    expect(screen.queryByText(/./)).toBeNull();
  });
});
