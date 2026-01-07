import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GymMapScreen } from '@/screens/explore/GymMapScreen';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { useGymStore } from '@/stores/gymStore';
import type { ExploreStackParamList } from './types';

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export function ExploreStack() {
  const selectedGym = useGymStore((state) => state.selectedGym);

  // Determine initial route based on whether a gym is already selected
  const initialRouteName = selectedGym ? 'Home' : 'GymMap';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="GymMap" component={GymMapScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* GymDetail, WallDetail, BoulderDetail will be added in future stories */}
    </Stack.Navigator>
  );
}
