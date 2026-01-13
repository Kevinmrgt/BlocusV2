import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProfileHeader } from '@/components/user/ProfileHeader';

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

describe('ProfileHeader', () => {
  const defaultProps = {
    avatarUrl: null,
    username: 'TestUser',
    email: 'test@example.com',
    bio: 'Test bio',
    onEditPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders avatar, username, and bio', () => {
    const { getByTestId, getByText } = render(
      <ProfileHeader {...defaultProps} testID="profile-header" />
    );

    expect(getByTestId('profile-header')).toBeTruthy();
    expect(getByTestId('profile-avatar')).toBeTruthy();
    expect(getByText('TestUser')).toBeTruthy();
    expect(getByText('Test bio')).toBeTruthy();
  });

  it('displays email prefix when username is null', () => {
    const { getByText } = render(
      <ProfileHeader {...defaultProps} username={null} testID="profile-header" />
    );

    expect(getByText('test')).toBeTruthy(); // 'test' from 'test@example.com'
  });

  it('displays bio placeholder when bio is null', () => {
    const { getByTestId } = render(
      <ProfileHeader {...defaultProps} bio={null} testID="profile-header" />
    );

    expect(getByTestId('profile-bio-placeholder')).toBeTruthy();
  });

  it('renders edit button', () => {
    const { getByTestId } = render(<ProfileHeader {...defaultProps} testID="profile-header" />);

    expect(getByTestId('edit-profile-button')).toBeTruthy();
  });

  it('calls onEditPress when edit button is pressed', () => {
    const mockOnEditPress = jest.fn();
    const { getByTestId } = render(
      <ProfileHeader {...defaultProps} onEditPress={mockOnEditPress} testID="profile-header" />
    );

    fireEvent.press(getByTestId('edit-profile-button'));

    expect(mockOnEditPress).toHaveBeenCalledTimes(1);
  });

  it('renders avatar with provided URL', () => {
    const { getByTestId } = render(
      <ProfileHeader
        {...defaultProps}
        avatarUrl="https://example.com/avatar.jpg"
        testID="profile-header"
      />
    );

    expect(getByTestId('profile-avatar')).toBeTruthy();
  });
});
