import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/colors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  message?: string;
  color?: string;
}

export function LoadingSpinner({
  size = 'large',
  message,
  color = colors.primary,
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator testID="activity-indicator" size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});
