import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLocation } from '@/hooks/useLocation';
import { useGyms } from '@/hooks/useGyms';
import { useGymStore } from '@/stores/gymStore';
import { GymMarker } from '@/components/gym/GymMarker';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/layout/ErrorState';
import { colors } from '@/theme/colors';
import type { Tables } from '@/types/database';
import type { ExploreStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<ExploreStackParamList, 'GymMap'>;

const DEFAULT_DELTA = {
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export function GymMapScreen() {
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation<NavigationProp>();
  const { latitude, longitude, isLoading: locationLoading } = useLocation();
  const { data: gyms, isLoading: gymsLoading, error, refetch } = useGyms();
  const setSelectedGym = useGymStore((state) => state.setSelectedGym);

  const initialRegion: Region = {
    latitude,
    longitude,
    ...DEFAULT_DELTA,
  };

  useEffect(() => {
    if (!locationLoading && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        ...DEFAULT_DELTA,
      });
    }
  }, [latitude, longitude, locationLoading]);

  const handleGymSelect = (gym: Tables<'gyms'>) => {
    setSelectedGym(gym);
    // Navigate to Home screen after gym selection
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  if (locationLoading || gymsLoading) {
    return <LoadingSpinner message="Chargement de la carte..." />;
  }

  if (error) {
    return <ErrorState message="Impossible de charger les salles" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        testID="gym-map"
      >
        {gyms?.map((gym) => (
          <GymMarker key={gym.id} gym={gym} onSelect={handleGymSelect} />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
