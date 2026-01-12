import 'react-native-url-polyfill/auto';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from '@/providers/QueryProvider';
import { ErrorBoundary } from '@/providers/ErrorBoundary';
import { AuthProvider } from '@/providers/AuthProvider';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryProvider>
          <AuthProvider>
            <RootNavigator />
            <StatusBar style="auto" />
          </AuthProvider>
        </QueryProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
