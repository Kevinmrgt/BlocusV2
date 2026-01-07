import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { EmptyState } from '@/components/layout/EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items" />);
    expect(screen.getByText('No items')).toBeTruthy();
  });

  it('renders message when provided', () => {
    render(<EmptyState title="No items" message="Please add some items" />);
    expect(screen.getByText('Please add some items')).toBeTruthy();
  });

  it('renders without message by default', () => {
    render(<EmptyState title="No items" />);
    expect(screen.queryByText('Please add some items')).toBeNull();
  });
});
