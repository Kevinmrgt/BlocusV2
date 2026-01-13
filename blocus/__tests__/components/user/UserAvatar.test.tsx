import React from 'react';
import { render } from '@testing-library/react-native';
import { UserAvatar } from '@/components/user/UserAvatar';

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

describe('UserAvatar', () => {
  it('renders with placeholder when no avatar URL', () => {
    const { getByTestId } = render(<UserAvatar avatarUrl={null} size="medium" testID="avatar" />);

    expect(getByTestId('avatar')).toBeTruthy();
    expect(getByTestId('avatar-placeholder')).toBeTruthy();
  });

  it('renders image when avatar URL is provided', () => {
    const { getByTestId, queryByTestId } = render(
      <UserAvatar avatarUrl="https://example.com/avatar.jpg" size="medium" testID="avatar" />
    );

    expect(getByTestId('avatar')).toBeTruthy();
    expect(getByTestId('avatar-image')).toBeTruthy();
    expect(queryByTestId('avatar-placeholder')).toBeNull();
  });

  it('renders with small size (32px)', () => {
    const { getByTestId } = render(<UserAvatar avatarUrl={null} size="small" testID="avatar" />);

    const avatar = getByTestId('avatar');
    expect(avatar.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 32,
          height: 32,
          borderRadius: 16,
        }),
      ])
    );
  });

  it('renders with medium size (48px)', () => {
    const { getByTestId } = render(<UserAvatar avatarUrl={null} size="medium" testID="avatar" />);

    const avatar = getByTestId('avatar');
    expect(avatar.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 48,
          height: 48,
          borderRadius: 24,
        }),
      ])
    );
  });

  it('renders with large size (80px)', () => {
    const { getByTestId } = render(<UserAvatar avatarUrl={null} size="large" testID="avatar" />);

    const avatar = getByTestId('avatar');
    expect(avatar.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 80,
          height: 80,
          borderRadius: 40,
        }),
      ])
    );
  });

  it('defaults to medium size', () => {
    const { getByTestId } = render(<UserAvatar avatarUrl={null} testID="avatar" />);

    const avatar = getByTestId('avatar');
    expect(avatar.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 48,
          height: 48,
        }),
      ])
    );
  });
});
