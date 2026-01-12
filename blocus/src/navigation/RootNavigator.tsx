import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import { MainTabs } from './MainTabs';
import { AuthStack } from './AuthStack';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useGymStore } from '@/stores/gymStore';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme/colors';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const hasHydrated = useGymStore((state) => state._hasHydrated);
  const { isLoading: isAuthLoading } = useAuth();

  // Show loading screen while store is hydrating or auth is loading
  if (!hasHydrated || isAuthLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner message="Chargement..." />
      </View>
    );
  }

  // Allow guests to browse content (MainTabs always accessible)
  // Auth screens available via navigation from Profile tab
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Auth" component={AuthStack} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
