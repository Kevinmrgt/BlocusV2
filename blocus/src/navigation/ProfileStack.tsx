import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { EditProfileScreen } from '@/screens/profile/EditProfileScreen';
import { MyFavoritesScreen } from '@/screens/profile/MyFavoritesScreen';
import { SettingsScreen } from '@/screens/profile/SettingsScreen';
import { colors } from '@/theme/colors';
import type { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyProfile" component={ProfileScreen} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: true,
          title: 'Modifier le profil',
          headerTintColor: colors.textPrimary,
          headerStyle: { backgroundColor: colors.background },
        }}
      />
      <Stack.Screen name="MyFavorites" component={MyFavoritesScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
