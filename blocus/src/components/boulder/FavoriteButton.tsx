/**
 * FavoriteButton Component
 * Heart button to toggle favorite status on boulders
 * [Source: architecture/frontend-architecture.md#component-architecture]
 */

import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Heart } from 'phosphor-react-native';
import { useToggleFavorite, useIsFavorited } from '@/hooks/useFavorites';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme/colors';

interface FavoriteButtonProps {
  boulderId: string;
  size?: number;
  disabled?: boolean;
  testID?: string;
}

export function FavoriteButton({
  boulderId,
  size = 28,
  disabled = false,
  testID,
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const { data: isFavorited, isLoading: isCheckingFavorite } = useIsFavorited(boulderId);
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  const handlePress = () => {
    if (!isAuthenticated || disabled || isPending) return;

    // Toggle favorite
    toggleFavorite({ boulderId, isFavorited: !!isFavorited });
  };

  const isDisabled = !isAuthenticated || disabled;
  const isLoading = isPending || isCheckingFavorite;
  const favorited = !!isFavorited;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled || isLoading}
      style={[styles.button, isDisabled && styles.buttonDisabled]}
      testID={testID}
    >
      <View>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} testID={`${testID}-loading`} />
        ) : (
          <Heart
            size={size}
            weight={favorited ? 'fill' : 'regular'}
            color={favorited ? colors.primary : isDisabled ? colors.textSecondary : colors.primary}
            testID={favorited ? `${testID}-filled` : `${testID}-outline`}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
