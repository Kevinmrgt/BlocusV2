/**
 * ValidationButton Component
 * Button to validate a boulder and earn points
 * [Source: architecture/frontend-architecture.md#component-architecture]
 */

import React, { useState, useCallback } from 'react';
import { Pressable, StyleSheet, ActivityIndicator, View } from 'react-native';
import { CheckCircle } from 'phosphor-react-native';
import { Text } from '@/components/ui/Text';
import { useValidateBoulder, useIsValidated } from '@/hooks/useValidations';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme/colors';

interface ValidationButtonProps {
  boulderId: string;
  difficulty: number;
  size?: number;
  disabled?: boolean;
  onSuccess?: (pointsEarned: number) => void;
  testID?: string;
}

export function ValidationButton({
  boulderId,
  difficulty,
  size = 28,
  disabled = false,
  onSuccess,
  testID,
}: ValidationButtonProps) {
  const { isAuthenticated } = useAuth();
  const { data: isValidated, isLoading: isCheckingValidation } = useIsValidated(boulderId);
  const { mutate: validateBoulder, isPending } = useValidateBoulder();
  const [showSuccess, setShowSuccess] = useState(false);

  const pointsToEarn = difficulty * 10;

  const handlePress = useCallback(() => {
    if (!isAuthenticated || disabled || isPending || isValidated) return;

    validateBoulder(
      { boulderId, difficulty },
      {
        onSuccess: (data) => {
          setShowSuccess(true);
          onSuccess?.(data.points_earned);
          // Reset success state after animation
          setTimeout(() => setShowSuccess(false), 2000);
        },
      }
    );
  }, [
    isAuthenticated,
    disabled,
    isPending,
    isValidated,
    boulderId,
    difficulty,
    validateBoulder,
    onSuccess,
  ]);

  const isDisabled = !isAuthenticated || disabled || !!isValidated;
  const isLoading = isPending || isCheckingValidation;
  const validated = !!isValidated || showSuccess;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled || isLoading}
      style={[styles.button, isDisabled && styles.buttonDisabled]}
      testID={testID}
    >
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} testID={`${testID}-loading`} />
        ) : (
          <CheckCircle
            size={size}
            weight={validated ? 'fill' : 'regular'}
            color={validated ? colors.success : isDisabled ? colors.textSecondary : colors.primary}
            testID={validated ? `${testID}-filled` : `${testID}-outline`}
          />
        )}
        <Text
          style={[
            styles.pointsText,
            validated && styles.pointsTextValidated,
            isDisabled && !validated && styles.pointsTextDisabled,
          ]}
          testID={`${testID}-points`}
        >
          {validated ? `+${pointsToEarn} pts` : `${pointsToEarn} pts`}
        </Text>
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
  content: {
    alignItems: 'center',
  },
  pointsText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  pointsTextDisabled: {
    color: colors.textSecondary,
  },
  pointsTextValidated: {
    color: colors.success,
  },
});
