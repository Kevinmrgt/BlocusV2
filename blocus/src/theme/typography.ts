import type { TextStyle } from 'react-native';

// Font families - to be loaded via expo-font in future story
export const fontFamily = {
  regular: 'System', // Will be replaced with 'Inter-Regular'
  medium: 'System', // Will be replaced with 'Inter-Medium'
  semiBold: 'System', // Will be replaced with 'Inter-SemiBold'
  bold: 'System', // Will be replaced with 'Inter-Bold'
  mono: 'System', // Will be replaced with 'JetBrainsMono-Regular'
} as const;

export const typography: Record<string, TextStyle> = {
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 38.4, // 1.2
    color: '#212529',
    fontWeight: '700',
  },
  h2: {
    fontFamily: fontFamily.semiBold,
    fontSize: 24,
    lineHeight: 31.2, // 1.3
    color: '#212529',
    fontWeight: '600',
  },
  h3: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 26, // 1.3
    color: '#212529',
    fontWeight: '600',
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24, // 1.5
    color: '#212529',
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 21, // 1.5
    color: '#6C757D',
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16.8, // 1.4
    color: '#6C757D',
  },
  button: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stats: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 24,
    color: '#212529',
    fontWeight: '700',
  },
  statsLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 14.4,
    color: '#6C757D',
  },
};
