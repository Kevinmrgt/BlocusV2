import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Mountains } from 'phosphor-react-native';
import { DifficultyBadge } from './DifficultyBadge';
import { colors } from '@/theme/colors';
import type { BoulderWithPhotos } from '@/services/api/boulders';

const CARD_GAP = 12;
const SCREEN_PADDING = 16;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (Dimensions.get('window').width - SCREEN_PADDING * 2 - CARD_GAP) / NUM_COLUMNS;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

interface BoulderCardProps {
  boulder: BoulderWithPhotos;
  onPress?: () => void;
}

export function BoulderCard({ boulder, onPress }: BoulderCardProps) {
  const photoUrl = boulder.boulder_photos?.[0]?.url;

  return (
    <Pressable style={styles.container} onPress={onPress} testID={`boulder-card-${boulder.id}`}>
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={styles.placeholder}>
          <Mountains size={40} color={colors.textSecondary} weight="thin" />
        </View>
      )}

      <View style={styles.overlay} />

      <View style={styles.badgeContainer}>
        <DifficultyBadge level={boulder.difficulty} />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {boulder.title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    left: 8,
    position: 'absolute',
    top: 8,
  },
  container: {
    backgroundColor: colors.border,
    borderRadius: 12,
    height: CARD_HEIGHT,
    overflow: 'hidden',
    width: CARD_WIDTH,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.gradientBottom,
    opacity: 0.4,
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: colors.border,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  titleContainer: {
    bottom: 8,
    left: 8,
    position: 'absolute',
    right: 8,
  },
});

export { CARD_GAP, SCREEN_PADDING };
