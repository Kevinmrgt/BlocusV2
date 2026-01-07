import crashlytics from '@react-native-firebase/crashlytics';

export const Crashlytics = {
  /**
   * Set user ID for crash context
   */
  setUser: (userId: string) => {
    crashlytics().setUserId(userId);
  },

  /**
   * Log custom message for debugging
   */
  log: (message: string) => {
    crashlytics().log(message);
  },

  /**
   * Record non-fatal error with optional context
   */
  recordError: (error: Error, context?: Record<string, string>) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        crashlytics().setAttribute(key, value);
      });
    }
    crashlytics().recordError(error);
  },

  /**
   * Trigger a test crash (only use in development)
   */
  crash: () => {
    crashlytics().crash();
  },

  /**
   * Set custom attribute for crash reports
   */
  setAttribute: (key: string, value: string) => {
    crashlytics().setAttribute(key, value);
  },

  /**
   * Set multiple attributes at once
   */
  setAttributes: (attributes: Record<string, string>) => {
    crashlytics().setAttributes(attributes);
  },
};
