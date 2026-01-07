import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Explore: undefined;
  Boulders: undefined;
  Profile: undefined;
};

export type ExploreStackParamList = {
  GymMap: undefined;
  GymDetail: { gymId: string };
  WallDetail: { wallId: string; wallName: string };
  BoulderDetail: { boulderId: string };
};

export type ProfileStackParamList = {
  MyProfile: undefined;
  EditProfile: undefined;
  MyValidations: undefined;
  MyFavorites: undefined;
  Settings: undefined;
};

// React Navigation type augmentation
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
