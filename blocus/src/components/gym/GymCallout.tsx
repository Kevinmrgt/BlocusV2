import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { colors } from '@/theme/colors';
import type { Tables } from '@/types/database';

interface GymCalloutProps {
  gym: Tables<'gyms'>;
  onSelect: () => void;
}

export function GymCallout({ gym, onSelect }: GymCalloutProps) {
  const truncatedAddress =
    gym.address.length > 40 ? `${gym.address.substring(0, 40)}...` : gym.address;

  return (
    <View style={styles.container} testID={`gym-callout-${gym.id}`}>
      <Text style={styles.name} numberOfLines={1}>
        {gym.name}
      </Text>
      <Text style={styles.address} numberOfLines={2}>
        {truncatedAddress}
      </Text>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={onSelect}
        testID={`select-gym-button-${gym.id}`}
      >
        <Text style={styles.buttonText}>Selectionner</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  address: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    maxWidth: 280,
    minWidth: 200,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  name: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
});
