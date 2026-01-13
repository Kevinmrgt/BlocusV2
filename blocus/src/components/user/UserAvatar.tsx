/**
 * UserAvatar Component
 * Avatar with size variants: small (32px), medium (48px), large (80px)
 * [Source: front-end-spec.md#avatar]
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { User } from 'phosphor-react-native';
import { colors } from '@/theme/colors';

type AvatarSize = 'small' | 'medium' | 'large';

const SIZES: Record<AvatarSize, number> = {
  small: 32,
  medium: 48,
  large: 80,
};

interface UserAvatarProps {
  avatarUrl: string | null;
  size?: AvatarSize;
  testID?: string;
}

export function UserAvatar({ avatarUrl, size = 'medium', testID }: UserAvatarProps) {
  const dimension = SIZES[size];
  const iconSize = dimension * 0.5;

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
        },
      ]}
      testID={testID}
    >
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={[
            styles.image,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
            },
          ]}
          contentFit="cover"
          transition={200}
          testID={testID ? `${testID}-image` : undefined}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
            },
          ]}
          testID={testID ? `${testID}-placeholder` : undefined}
        >
          <User size={iconSize} color={colors.textSecondary} weight="fill" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    backgroundColor: colors.border,
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: colors.border,
    justifyContent: 'center',
  },
});
