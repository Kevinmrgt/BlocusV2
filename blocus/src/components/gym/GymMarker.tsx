import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { MapPin } from 'phosphor-react-native';
import { View, StyleSheet, Platform, Alert } from 'react-native';
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

  // On Android, Callout onPress doesn't work reliably
  // Use Marker onPress with Alert confirmation instead
  const handleMarkerPress = () => {
    if (Platform.OS === 'android') {
      Alert.alert(gym.name, gym.address, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Sélectionner', onPress: handleSelect },
      ]);
    }
  };

  return (
    <Marker
      coordinate={{
        latitude: gym.latitude,
        longitude: gym.longitude,
      }}
      title={gym.name}
      testID={`gym-marker-${gym.id}`}
      onPress={handleMarkerPress}
    >
      <View style={styles.markerContainer}>
        <MapPin size={32} weight="fill" color={colors.primary} />
      </View>
      {Platform.OS === 'ios' && (
        <Callout onPress={handleSelect} tooltip>
          <GymCallout gym={gym} onSelect={handleSelect} />
        </Callout>
      )}
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
