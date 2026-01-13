/**
 * MyFavoritesScreen
 * Displays list of user's favorite boulders
 * [Source: architecture/frontend-architecture.md#screen-architecture]
 */

import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, ArrowLeft } from 'phosphor-react-native';
import { Text } from '@/components/ui/Text';
import { BoulderCard, CARD_GAP, SCREEN_PADDING } from '@/components/boulder/BoulderCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/layout/ErrorState';
import { useFavorites } from '@/hooks/useFavorites';
import { colors } from '@/theme/colors';
import type { ProfileStackParamList } from '@/navigation/types';
import type { BoulderWithDetails } from '@/types/models/boulder';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'MyFavorites'>;

export function MyFavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { data: favorites, isLoading, error, refetch } = useFavorites();

  const handleBoulderPress = (boulderId: string) => {
    // Navigate to BoulderDetail in Explore stack
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Explore',
        params: {
          screen: 'BoulderDetail',
          params: { boulderId },
        },
      })
    );
  };

  const renderBoulder = ({ item }: { item: BoulderWithDetails }) => (
    <BoulderCard
      boulder={{
        ...item,
        boulder_photos: item.photos,
      }}
      onPress={() => handleBoulderPress(item.id)}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.container} testID="my-favorites-screen">
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            testID="back-button"
          >
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Mes Favoris</Text>
          <View style={styles.headerSpacer} />
        </View>
        <LoadingSpinner message="Chargement des favoris..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container} testID="my-favorites-screen">
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            testID="back-button"
          >
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Mes Favoris</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ErrorState message="Impossible de charger vos favoris" onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="my-favorites-screen">
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          testID="back-button"
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Mes Favoris</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Favorites List */}
      {favorites && favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderBoulder}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          testID="favorites-list"
        />
      ) : (
        <View style={styles.emptyState} testID="empty-favorites">
          <Heart size={64} color={colors.textSecondary} weight="light" />
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptySubtitle}>
            Explorez les boulders et ajoutez-les à vos favoris !
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 52,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 12,
    textAlign: 'center',
  },
  listContent: {
    padding: SCREEN_PADDING,
    paddingBottom: 32,
  },
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
});
