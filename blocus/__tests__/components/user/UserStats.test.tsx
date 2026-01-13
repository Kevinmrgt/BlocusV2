import React from 'react';
import { render } from '@testing-library/react-native';
import { UserStats } from '@/components/user/UserStats';

describe('UserStats', () => {
  it('renders 4 stat cards', () => {
    const { getByTestId } = render(
      <UserStats totalPoints={1250} validationsCount={23} favoritesCount={8} rank={42} />
    );

    expect(getByTestId('stat-points')).toBeTruthy();
    expect(getByTestId('stat-validations')).toBeTruthy();
    expect(getByTestId('stat-favorites')).toBeTruthy();
    expect(getByTestId('stat-rank')).toBeTruthy();
  });

  it('displays correct values', () => {
    const { getByText } = render(
      <UserStats totalPoints={1250} validationsCount={23} favoritesCount={8} rank={42} />
    );

    expect(getByText('1250')).toBeTruthy();
    expect(getByText('23')).toBeTruthy();
    expect(getByText('8')).toBeTruthy();
    expect(getByText('#42')).toBeTruthy();
  });

  it('displays rank placeholder when rank is null', () => {
    const { getByText } = render(
      <UserStats totalPoints={0} validationsCount={0} favoritesCount={0} rank={null} />
    );

    expect(getByText('--')).toBeTruthy();
  });

  it('displays labels correctly', () => {
    const { getByText } = render(
      <UserStats totalPoints={100} validationsCount={5} favoritesCount={2} rank={10} />
    );

    expect(getByText('pts')).toBeTruthy();
    expect(getByText('validés')).toBeTruthy();
    expect(getByText('favoris')).toBeTruthy();
    expect(getByText('rang')).toBeTruthy();
  });

  it('handles zero values', () => {
    const { getAllByText } = render(
      <UserStats totalPoints={0} validationsCount={0} favoritesCount={0} rank={null} />
    );

    // At least 3 zeros should be present (points, validations, favorites)
    const zeros = getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(3);
  });
});
