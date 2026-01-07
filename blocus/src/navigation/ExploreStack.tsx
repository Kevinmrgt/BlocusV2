import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GymMapScreen } from '@/screens/explore/GymMapScreen';
import type { ExploreStackParamList } from './types';

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export function ExploreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="GymMap" component={GymMapScreen} />
      {/* GymDetail, WallDetail, BoulderDetail will be added in future stories */}
    </Stack.Navigator>
  );
}
