import { NavigationContainer } from '@react-navigation/native';
import { MainTabs } from './MainTabs';

export function RootNavigator() {
  // TODO: Add auth state check and AuthStack in future story
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}
