import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { ArrowLeft, CheckCircle, ChatCircle, Mountains } from 'phosphor-react-native';
import { useBoulderById } from '@/hooks/useBoulders';
import { DifficultyBadge } from '@/components/boulder/DifficultyBadge';
import { FavoriteButton } from '@/components/boulder/FavoriteButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/layout/ErrorState';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme/colors';
import type { ExploreStackParamList } from '@/navigation/types';

type BoulderDetailRouteProp = RouteProp<ExploreStackParamList, 'BoulderDetail'>;
type NavigationProp = NativeStackNavigationProp<ExploreStackParamList, 'BoulderDetail'>;

export function BoulderDetailScreen() {
  const route = useRoute<BoulderDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { boulderId } = route.params;
  const { isAuthenticated } = useAuth();

  const { data: boulder, isLoading, error, refetch } = useBoulderById(boulderId);

  if (isLoading) {
    return (
      <View style={styles.container} testID="boulder-detail-screen">
        <LoadingSpinner message="Chargement du boulder..." />
      </View>
    );
  }

  if (error || !boulder) {
    return (
      <View style={styles.container} testID="boulder-detail-screen">
        <ErrorState message="Impossible de charger le boulder" onRetry={refetch} />
      </View>
    );
  }

  const photoUrl = boulder.boulder_photos?.[0]?.url;

  return (
    <View style={styles.container} testID="boulder-detail-screen">
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          testID="back-button"
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {boulder.title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo */}
        <View style={styles.imageContainer}>
          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              style={styles.image}
              contentFit="cover"
              transition={200}
              testID="boulder-image"
            />
          ) : (
            <View style={styles.placeholder}>
              <Mountains size={80} color={colors.textSecondary} weight="thin" />
              <Text style={styles.placeholderText}>Aucune photo</Text>
            </View>
          )}
        </View>

        {/* Info section */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{boulder.title}</Text>
            <DifficultyBadge level={boulder.difficulty} size="medium" />
          </View>

          {boulder.description ? (
            <Text style={styles.description}>{boulder.description}</Text>
          ) : (
            <Text style={styles.noDescription}>Aucune description disponible</Text>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actionsSection}>
          <Text style={styles.actionsTitle}>Actions</Text>
          {!isAuthenticated && (
            <Text style={styles.actionsHint}>Connectez-vous pour interagir</Text>
          )}

          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.actionButton, !isAuthenticated && styles.actionButtonDisabled]}
              disabled={!isAuthenticated}
              testID="validate-button"
            >
              <CheckCircle
                size={28}
                color={isAuthenticated ? colors.primary : colors.textSecondary}
              />
              <Text style={styles.actionLabel}>Valider</Text>
            </Pressable>

            <View
              style={[styles.actionButton, !isAuthenticated && styles.actionButtonDisabled]}
              testID="favorite-button-container"
            >
              <FavoriteButton boulderId={boulderId} testID="favorite-button" />
              <Text style={styles.actionLabel}>Favori</Text>
            </View>

            <Pressable
              style={[styles.actionButton, !isAuthenticated && styles.actionButtonDisabled]}
              disabled={!isAuthenticated}
              testID="comments-button"
            >
              <ChatCircle
                size={28}
                color={isAuthenticated ? colors.primary : colors.textSecondary}
              />
              <Text style={styles.actionLabel}>Commentaires</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 12,
    flex: 1,
    paddingVertical: 16,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  actionsHint: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionsSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginTop: 16,
    padding: 16,
  },
  actionsTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
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
  description: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
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
  image: {
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    aspectRatio: 4 / 3,
    backgroundColor: colors.border,
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
  },
  infoSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginTop: 16,
    padding: 16,
  },
  noDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 12,
  },
  placeholder: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    marginRight: 12,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
