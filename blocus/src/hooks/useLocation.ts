import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  latitude: number;
  longitude: number;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean | null;
}

const DEFAULT_LOCATION = {
  latitude: 46.603354, // France center
  longitude: 1.888334,
};

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    ...DEFAULT_LOCATION,
    isLoading: true,
    error: null,
    hasPermission: null,
  });

  useEffect(() => {
    let isMounted = true;

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (!isMounted) return;

        if (status !== 'granted') {
          setLocation((prev) => ({
            ...prev,
            isLoading: false,
            hasPermission: false,
          }));
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!isMounted) return;

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isLoading: false,
          error: null,
          hasPermission: true,
        });
      } catch {
        if (!isMounted) return;

        setLocation((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Could not get location',
          hasPermission: true,
        }));
      }
    };

    getLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  return location;
}
