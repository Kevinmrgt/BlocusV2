import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { MainTabs } from './MainTabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useGymStore } from '@/stores/gymStore';
import { colors } from '@/theme/colors';

export function RootNavigator() {
  const hasHydrated = useGymStore((state) => state._hasHydrated);

  // Show loading screen while store is hydrating from AsyncStorage
  if (!hasHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner message="Chargement..." />
      </View>
    );
  }

  // TODO: Add auth state check and AuthStack in future story
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
