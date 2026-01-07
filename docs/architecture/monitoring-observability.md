# Monitoring & Observability

Cette section définit les outils et stratégies de monitoring pour l'application en production.

## Crash Reporting (Firebase Crashlytics)

```typescript
// src/lib/crashlytics.ts

import crashlytics from "@react-native-firebase/crashlytics";

export const Crashlytics = {
  // Log user for crash context
  setUser: (userId: string) => {
    crashlytics().setUserId(userId);
  },

  // Log custom events
  log: (message: string) => {
    crashlytics().log(message);
  },

  // Record non-fatal errors
  recordError: (error: Error, context?: Record<string, string>) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        crashlytics().setAttribute(key, value);
      });
    }
    crashlytics().recordError(error);
  },
};

// Usage in error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Crashlytics.recordError(error, {
      componentStack: errorInfo.componentStack || "unknown",
    });
  }
}
```

## Error Boundary Implementation

```typescript
// src/providers/ErrorBoundary.tsx

import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Crashlytics } from "@/lib/crashlytics";
import { colors } from "@/theme/colors";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Crashlytics.recordError(error, {
      componentStack: errorInfo.componentStack || "",
      timestamp: new Date().toISOString(),
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oups, une erreur est survenue</Text>
          <Text style={styles.message}>
            Nous avons été notifiés et travaillons à résoudre le problème.
          </Text>
          <Button title="Réessayer" onPress={this.handleRetry} />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: colors.textPrimary,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: colors.textSecondary,
  },
});
```

## Health Monitoring

```typescript
// src/lib/health.ts

import { supabase } from "./supabase";
import NetInfo from "@react-native-community/netinfo";

export const Health = {
  // Check Supabase connectivity
  checkSupabase: async (): Promise<boolean> => {
    try {
      const { error } = await supabase.from("gyms").select("id").limit(1);
      return !error;
    } catch {
      return false;
    }
  },

  // Check network status
  checkNetwork: async (): Promise<boolean> => {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  },

  // Combined health check
  getStatus: async () => ({
    network: await Health.checkNetwork(),
    api: await Health.checkSupabase(),
    timestamp: new Date().toISOString(),
  }),
};
```

## Supabase Dashboard Monitoring

| Metric              | Location                  | Alert Threshold  |
| ------------------- | ------------------------- | ---------------- |
| Database size       | Project > Database > Size | 400MB (80% free) |
| Storage usage       | Project > Storage > Usage | 800MB (80% free) |
| API requests        | Project > API > Usage     | Monitoring only  |
| Auth signups        | Project > Auth > Users    | Monitoring only  |
| RLS policy failures | Project > Logs > Postgres | Any 42501 errors |
| Slow queries        | Project > Logs > Postgres | > 1000ms         |

## Analytics (V2 Placeholder)

```typescript
// src/lib/analytics.ts (V2)

// MVP: Crashlytics only for error tracking
// V2: Add full analytics (Mixpanel, Amplitude, or Firebase Analytics)

export const Analytics = {
  trackScreen: (screenName: string) => {
    // V2: analytics.logScreenView(screenName)
    Crashlytics.log(`Screen: ${screenName}`);
  },

  trackEvent: (eventName: string, params?: Record<string, any>) => {
    // V2: analytics.logEvent(eventName, params)
    Crashlytics.log(`Event: ${eventName} ${JSON.stringify(params)}`);
  },

  trackValidation: (boulderId: string, difficulty: number) => {
    Analytics.trackEvent("boulder_validated", { boulderId, difficulty });
  },
};
```

---
