import React from 'react';
import { render } from '@testing-library/react-native';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';

describe('ProfileScreen', () => {
  it('renders placeholder content', () => {
    const { getByText, getByTestId } = render(<ProfileScreen />);

    expect(getByTestId('profile-screen')).toBeTruthy();
    expect(getByText('Profil')).toBeTruthy();
    expect(getByText('Coming in Epic 4')).toBeTruthy();
  });
});
