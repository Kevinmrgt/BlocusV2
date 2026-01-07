// Crashlytics stub - Firebase disabled for development
// Re-enable Firebase and replace this file when ready for production

export const Crashlytics = {
  /**
   * Set user ID for crash context
   */
  setUser: (_userId: string) => {
    // No-op: Firebase disabled
  },

  /**
   * Log custom message for debugging
   */
  log: (message: string) => {
    if (__DEV__) {
      console.log('[Crashlytics]', message);
    }
  },

  /**
   * Record non-fatal error with optional context
   */
  recordError: (error: Error, _context?: Record<string, string>) => {
    if (__DEV__) {
      console.error('[Crashlytics] Error:', error.message);
    }
  },

  /**
   * Trigger a test crash (only use in development)
   */
  crash: () => {
    // No-op: Firebase disabled
  },

  /**
   * Set custom attribute for crash reports
   */
  setAttribute: (_key: string, _value: string) => {
    // No-op: Firebase disabled
  },

  /**
   * Set multiple attributes at once
   */
  setAttributes: (_attributes: Record<string, string>) => {
    // No-op: Firebase disabled
  },
};
