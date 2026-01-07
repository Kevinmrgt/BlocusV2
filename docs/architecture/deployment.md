# Deployment

Cette section couvre la stratégie de build, CI/CD, et déploiement pour iOS et Android.

## EAS Build Configuration

```json
// eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://dev-project.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "dev-anon-key"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://staging-project.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "staging-anon-key"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://prod-project.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "prod-anon-key"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "1234567890"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

## CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript check
        run: npm run type-check

  test:
    runs-on: ubuntu-latest
    needs: lint-and-type-check
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

```yaml
# .github/workflows/eas-build.yml
name: EAS Build

on:
  push:
    branches: [main]
    paths-ignore:
      - "**.md"
      - "docs/**"
  workflow_dispatch:
    inputs:
      platform:
        description: "Platform to build"
        required: true
        default: "all"
        type: choice
        options:
          - all
          - ios
          - android
      profile:
        description: "Build profile"
        required: true
        default: "preview"
        type: choice
        options:
          - development
          - preview
          - production

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Run EAS Build
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            PLATFORM="${{ github.event.inputs.platform }}"
            PROFILE="${{ github.event.inputs.profile }}"
          else
            PLATFORM="all"
            PROFILE="preview"
          fi

          eas build --platform $PLATFORM --profile $PROFILE --non-interactive
```

## Deployment Strategy

| Environment | Supabase Project | Build Profile | Distribution                           |
| ----------- | ---------------- | ------------- | -------------------------------------- |
| Development | dev-project      | development   | Local simulator                        |
| Preview     | staging-project  | preview       | Internal (TestFlight/Internal Testing) |
| Production  | prod-project     | production    | App Store / Play Store                 |

## Database Migration Workflow

```bash
# Local development
supabase start                    # Start local Supabase
supabase db reset                 # Reset with migrations + seed

# Create new migration
supabase migration new add_feature_x

# Push to remote (staging/prod)
supabase db push --linked         # Apply pending migrations

# Generate TypeScript types
supabase gen types typescript --linked > src/types/database.ts
```

## Release Checklist

**Pre-release:**

- [ ] All tests passing
- [ ] Type checking clean
- [ ] Lint errors resolved
- [ ] Manual QA on preview build
- [ ] Database migrations applied to production
- [ ] Environment variables verified

**Release:**

- [ ] Tag version in git
- [ ] Trigger production EAS build
- [ ] Submit to App Store Connect / Google Play Console
- [ ] Monitor Crashlytics for new issues

**Post-release:**

- [ ] Verify app in stores
- [ ] Monitor analytics
- [ ] Document release notes

---
