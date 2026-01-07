import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MainTabs } from '@/navigation/MainTabs';
import { useGymStore } from '@/stores/gymStore';

// Mock the screens to avoid complex navigation setup
jest.mock('@/screens/leaderboard/LeaderboardScreen', () => ({
  LeaderboardScreen: () => null,
}));
jest.mock('@/screens/profile/ProfileScreen', () => ({
  ProfileScreen: () => null,
}));
jest.mock('@/navigation/ExploreStack', () => ({
  ExploreStack: () => null,
}));

describe('MainTabs', () => {
  beforeEach(() => {
    useGymStore.setState({ selectedGym: null, _hasHydrated: true });
  });

  it('renders 3 tabs with correct labels', () => {
    const { getByText } = render(
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    );

    expect(getByText('Accueil')).toBeTruthy();
    expect(getByText('Classement')).toBeTruthy();
    expect(getByText('Profil')).toBeTruthy();
  });

  it('does not render old tab labels', () => {
    const { queryByText } = render(
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    );

    expect(queryByText('Explorer')).toBeNull();
    expect(queryByText('Blocs')).toBeNull();
  });
});
