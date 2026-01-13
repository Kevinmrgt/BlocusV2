/**
 * Text Component
 * Custom text component with consistent styling
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

interface TextProps extends RNTextProps {
  children: React.ReactNode;
}

export function Text({ children, style, ...props }: TextProps) {
  return (
    <RNText style={[styles.text, style]} {...props}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.textPrimary,
    fontSize: 14,
  },
});
