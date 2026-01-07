import React from 'react';
import { render } from '@testing-library/react-native';
import { LeaderboardScreen } from '@/screens/leaderboard/LeaderboardScreen';

describe('LeaderboardScreen', () => {
  it('renders placeholder content', () => {
    const { getByText, getByTestId } = render(<LeaderboardScreen />);

    expect(getByTestId('leaderboard-screen')).toBeTruthy();
    expect(getByText('Classement')).toBeTruthy();
    expect(getByText('Coming in Epic 5')).toBeTruthy();
  });
});
