// Mock react-native-firebase/crashlytics
jest.mock('@react-native-firebase/crashlytics', () => () => ({
  setUserId: jest.fn(),
  log: jest.fn(),
  recordError: jest.fn(),
  crash: jest.fn(),
  setAttribute: jest.fn(),
  setAttributes: jest.fn(),
}));

// Mock @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  addEventListener: jest.fn(),
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
  },
}));

// Mock expo modules that cause issues in tests
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));
