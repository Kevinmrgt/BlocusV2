import { renderHook, waitFor } from '@testing-library/react-native';
import { useLocation } from '@/hooks/useLocation';
import * as Location from 'expo-location';

jest.mock('expo-location');

const mockLocation = Location as jest.Mocked<typeof Location>;

describe('useLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns default location while loading', () => {
    mockLocation.requestForegroundPermissionsAsync.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useLocation());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.latitude).toBe(46.603354);
    expect(result.current.longitude).toBe(1.888334);
    expect(result.current.hasPermission).toBe(null);
  });

  it('returns user location when permission granted', async () => {
    mockLocation.requestForegroundPermissionsAsync.mockResolvedValue({
      status: Location.PermissionStatus.GRANTED,
      granted: true,
      canAskAgain: true,
      expires: 'never',
    });

    mockLocation.getCurrentPositionAsync.mockResolvedValue({
      coords: {
        latitude: 48.8566,
        longitude: 2.3522,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    });

    const { result } = renderHook(() => useLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.latitude).toBe(48.8566);
    expect(result.current.longitude).toBe(2.3522);
    expect(result.current.hasPermission).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('returns default location when permission denied', async () => {
    mockLocation.requestForegroundPermissionsAsync.mockResolvedValue({
      status: Location.PermissionStatus.DENIED,
      granted: false,
      canAskAgain: true,
      expires: 'never',
    });

    const { result } = renderHook(() => useLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.latitude).toBe(46.603354);
    expect(result.current.longitude).toBe(1.888334);
    expect(result.current.hasPermission).toBe(false);
  });

  it('handles location error gracefully', async () => {
    mockLocation.requestForegroundPermissionsAsync.mockResolvedValue({
      status: Location.PermissionStatus.GRANTED,
      granted: true,
      canAskAgain: true,
      expires: 'never',
    });

    mockLocation.getCurrentPositionAsync.mockRejectedValue(new Error('Location unavailable'));

    const { result } = renderHook(() => useLocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.latitude).toBe(46.603354);
    expect(result.current.longitude).toBe(1.888334);
    expect(result.current.hasPermission).toBe(true);
    expect(result.current.error).toBe('Could not get location');
  });
});
