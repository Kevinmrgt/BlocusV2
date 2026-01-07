import { View, Text, StyleSheet } from 'react-native';
import { Trophy } from 'phosphor-react-native';
import { colors } from '@/theme/colors';

export function LeaderboardScreen() {
  return (
    <View style={styles.container} testID="leaderboard-screen">
      <Trophy size={80} color={colors.textSecondary} weight="thin" />
      <Text style={styles.title}>Classement</Text>
      <Text style={styles.subtitle}>Coming in Epic 5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
  },
});
