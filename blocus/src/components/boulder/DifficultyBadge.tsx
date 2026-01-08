import { View, Text, StyleSheet } from 'react-native';
import { getDifficultyColor, colors } from '@/theme/colors';

interface DifficultyBadgeProps {
  level: number;
  size?: 'small' | 'medium';
}

export function DifficultyBadge({ level, size = 'small' }: DifficultyBadgeProps) {
  const backgroundColor = getDifficultyColor(level);
  const isSmall = size === 'small';

  return (
    <View
      style={[styles.badge, { backgroundColor }, isSmall ? styles.small : styles.medium]}
      testID="difficulty-badge"
    >
      <Text style={[styles.text, isSmall ? styles.textSmall : styles.textMedium]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  medium: {
    borderRadius: 16,
    height: 32,
    width: 32,
  },
  small: {
    borderRadius: 12,
    height: 24,
    width: 24,
  },
  text: {
    color: colors.white,
    fontWeight: '700',
  },
  textMedium: {
    fontSize: 14,
  },
  textSmall: {
    fontSize: 12,
  },
});
