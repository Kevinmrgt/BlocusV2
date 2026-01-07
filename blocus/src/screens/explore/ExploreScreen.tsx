import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Explorer</Text>
      <Text style={styles.subtitle}>Carte des salles à venir</Text>
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
  text: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '600',
  },
});
