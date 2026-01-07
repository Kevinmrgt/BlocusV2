import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapPin, Mountains, User } from 'phosphor-react-native';
import { colors } from '@/theme/colors';
import { ExploreScreen } from '@/screens/explore/ExploreScreen';
import { BouldersScreen } from '@/screens/boulders/BouldersScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Explorer',
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Boulders"
        component={BouldersScreen}
        options={{
          tabBarLabel: 'Blocs',
          tabBarIcon: ({ color, size }) => <Mountains size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
