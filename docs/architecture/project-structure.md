# Project Structure

Cette section définit l'organisation du code source, la configuration des builds, et le pipeline CI/CD.

## Directory Structure

```
climbing-app/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, type-check, tests
│       └── eas-build.yml             # EAS Build triggers
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_storage_buckets.sql
│   │   ├── 003_rls_helpers.sql
│   │   └── 004_storage_policies.sql
│   ├── seed.sql                      # Dev data
│   └── config.toml                   # Local dev config
│
├── src/
│   ├── app/                          # Expo Router (si utilisé) ou entry
│   │   └── _layout.tsx
│   │
│   ├── components/
│   │   ├── ui/                       # Primitives design system
│   │   │   ├── Button.tsx
│   │   │   ├── Text.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── IconButton.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   │
│   │   ├── boulder/                  # Domain: boulders
│   │   │   ├── BoulderCard.tsx
│   │   │   ├── BoulderGrid.tsx
│   │   │   ├── DifficultyBadge.tsx
│   │   │   ├── ValidationButton.tsx
│   │   │   ├── FavoriteButton.tsx
│   │   │   └── CommentList.tsx
│   │   │
│   │   ├── gym/                      # Domain: gyms
│   │   │   ├── GymCard.tsx
│   │   │   ├── GymMarker.tsx
│   │   │   ├── WallCard.tsx
│   │   │   └── WallSection.tsx
│   │   │
│   │   ├── user/                     # User domain components
│   │   │   ├── UserAvatar.tsx
│   │   │   ├── UserStats.tsx
│   │   │   ├── LeaderboardRow.tsx
│   │   │   └── ProfileHeader.tsx
│   │   │
│   │   └── layout/                   # Layout components
│   │       ├── Screen.tsx
│   │       ├── Header.tsx
│   │       ├── EmptyState.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── screens/                      # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   │
│   │   ├── explore/
│   │   │   ├── GymMapScreen.tsx
│   │   │   ├── GymDetailScreen.tsx
│   │   │   ├── WallDetailScreen.tsx
│   │   │   └── BoulderDetailScreen.tsx
│   │   │
│   │   ├── boulders/
│   │   │   └── BoulderListScreen.tsx
│   │   │
│   │   ├── leaderboard/
│   │   │   ├── LeaderboardScreen.tsx
│   │   │   └── UserProfileScreen.tsx
│   │   │
│   │   └── profile/
│   │       ├── MyProfileScreen.tsx
│   │       ├── EditProfileScreen.tsx
│   │       ├── MyValidationsScreen.tsx
│   │       ├── MyFavoritesScreen.tsx
│   │       └── SettingsScreen.tsx
│   │
│   ├── navigation/
│   │   ├── types.ts                  # Navigation types
│   │   ├── RootNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   ├── MainTabs.tsx
│   │   ├── ExploreStack.tsx
│   │   ├── BouldersStack.tsx
│   │   ├── LeaderboardStack.tsx
│   │   └── ProfileStack.tsx
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useGyms.ts
│   │   ├── useBoulders.ts
│   │   ├── useLeaderboard.ts
│   │   └── useUserProfile.ts
│   │
│   ├── services/                     # API layer
│   │   └── api/
│   │       ├── auth.ts
│   │       ├── gyms.ts
│   │       ├── boulders.ts
│   │       ├── users.ts
│   │       └── storage.ts
│   │
│   ├── stores/                       # Zustand stores
│   │   └── gymStore.ts
│   │
│   ├── providers/                    # React context providers
│   │   ├── AuthProvider.tsx
│   │   └── QueryProvider.tsx
│   │
│   ├── lib/                          # Utilities & config
│   │   ├── supabase.ts               # Supabase client
│   │   ├── queryClient.ts            # React Query config
│   │   ├── haptics.ts                # Haptic feedback
│   │   └── schemas/                  # Zod schemas
│   │       ├── auth.ts
│   │       └── user.ts
│   │
│   ├── theme/                        # Design system tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── shadows.ts
│   │   ├── animations.ts
│   │   ├── components.ts
│   │   └── layouts.ts
│   │
│   └── types/                        # TypeScript types
│       ├── database.ts               # Generated from Supabase
│       ├── models/
│       │   ├── user.ts
│       │   ├── gym.ts
│       │   ├── wall.ts
│       │   ├── boulder.ts
│       │   └── photo.ts
│       └── api.ts
│
├── assets/
│   ├── fonts/
│   │   ├── Inter-Regular.ttf
│   │   ├── Inter-Medium.ttf
│   │   ├── Inter-SemiBold.ttf
│   │   ├── Inter-Bold.ttf
│   │   └── JetBrainsMono-Regular.ttf
│   ├── images/
│   │   ├── splash.png
│   │   └── icon.png
│   └── adaptive-icon.png
│
├── __tests__/                        # Test files
│   ├── components/
│   ├── hooks/
│   └── services/
│
├── app.json                          # Expo config
├── eas.json                          # EAS Build config
├── babel.config.js
├── metro.config.js
├── tsconfig.json
├── .env.example
├── .env.local                        # Local dev (gitignored)
├── .eslintrc.js
├── .prettierrc
└── package.json
```

## Environment Configuration

```typescript
// .env.example
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

```json
// app.json
{
  "expo": {
    "name": "Climbing App",
    "slug": "climbing-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FF6B35"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.yourcompany.climbingapp",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Pour afficher les salles proches de vous"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FF6B35"
      },
      "package": "com.yourcompany.climbingapp",
      "permissions": ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"]
    },
    "plugins": [
      "expo-font",
      "expo-image",
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Pour afficher les salles proches de vous"
        }
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/crashlytics"
    ],
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

---
