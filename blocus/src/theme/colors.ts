export const colors = {
  // Primary
  primary: '#FF6B35',
  primaryLight: '#FF8A5C',
  primaryDark: '#E55A2B',

  // Secondary
  secondary: '#2D3047',
  secondaryLight: '#3D4057',
  secondaryDark: '#1D2037',

  // Accent
  accent: '#1B998B',

  // Semantic
  success: '#06D6A0',
  warning: '#FFD166',
  error: '#EF476F',

  // Difficulty Badges
  difficultyEasy: '#06D6A0', // 1-3
  difficultyMedium: '#FFD166', // 4-6
  difficultyHard: '#EF476F', // 7-8
  difficultyExpert: '#7B2CBF', // 9-10

  // Neutrals
  white: '#FFFFFF',
  background: '#F8F9FA',
  border: '#E9ECEF',
  textSecondary: '#6C757D',
  textPrimary: '#212529',
  black: '#000000',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  gradientBottom: 'rgba(0, 0, 0, 0.7)',
} as const;

// Helper function for difficulty color
export const getDifficultyColor = (level: number): string => {
  if (level <= 3) return colors.difficultyEasy;
  if (level <= 6) return colors.difficultyMedium;
  if (level <= 8) return colors.difficultyHard;
  return colors.difficultyExpert;
};
