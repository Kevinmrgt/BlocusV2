import { View, Text, StyleSheet, FlatList } from 'react-native';
import { BoulderCard, CARD_GAP } from '@/components/boulder/BoulderCard';
import { useBouldersByWall } from '@/hooks/useBoulders';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { colors } from '@/theme/colors';
import type { Tables } from '@/types/database';
import type { BoulderWithPhotos } from '@/services/api/boulders';

interface WallSectionProps {
  wall: Tables<'walls'>;
  onBoulderPress?: (boulder: BoulderWithPhotos) => void;
}

export function WallSection({ wall, onBoulderPress }: WallSectionProps) {
  const { data: boulders, isLoading } = useBouldersByWall(wall.id);

  const renderBoulder = ({ item }: { item: BoulderWithPhotos }) => (
    <BoulderCard boulder={item} onPress={() => onBoulderPress?.(item)} />
  );

  return (
    <View style={styles.container} testID={`wall-section-${wall.id}`}>
      <Text style={styles.title}>{wall.name}</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      ) : !boulders || boulders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun boulder dans ce mur</Text>
        </View>
      ) : (
        <FlatList
          data={boulders}
          renderItem={renderBoulder}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 12,
    padding: 24,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});
