import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { MapPin } from 'phosphor-react-native';
import { View, StyleSheet } from 'react-native';
import { GymCallout } from './GymCallout';
import { colors } from '@/theme/colors';
import type { Tables } from '@/types/database';

interface GymMarkerProps {
  gym: Tables<'gyms'>;
  onSelect: (gym: Tables<'gyms'>) => void;
}

export function GymMarker({ gym, onSelect }: GymMarkerProps) {
  const handleSelect = () => {
    onSelect(gym);
  };

  return (
    <Marker
      coordinate={{
        latitude: gym.latitude,
        longitude: gym.longitude,
      }}
      title={gym.name}
      testID={`gym-marker-${gym.id}`}
    >
      <View style={styles.markerContainer}>
        <MapPin size={32} weight="fill" color={colors.primary} />
      </View>
      <Callout onPress={handleSelect} tooltip>
        <GymCallout gym={gym} onSelect={handleSelect} />
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
