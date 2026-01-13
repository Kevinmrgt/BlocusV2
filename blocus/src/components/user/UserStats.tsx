/**
 * UserStats Component
 * Displays 4 stat cards: Points, Valides, Favoris, Rang
 * [Source: front-end-spec.md#profil-utilisateur]
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';

interface StatCardProps {
  value: string | number;
  label: string;
  testID?: string;
}

function StatCard({ value, label, testID }: StatCardProps) {
  return (
    <View style={styles.statCard} testID={testID}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface UserStatsProps {
  totalPoints: number;
  validationsCount: number;
  favoritesCount: number;
  rank: number | null;
  testID?: string;
}

export function UserStats({
  totalPoints,
  validationsCount,
  favoritesCount,
  rank,
  testID,
}: UserStatsProps) {
  return (
    <View style={styles.container} testID={testID}>
      <StatCard value={totalPoints} label="pts" testID="stat-points" />
      <StatCard value={validationsCount} label="validés" testID="stat-validations" />
      <StatCard value={favoritesCount} label="favoris" testID="stat-favorites" />
      <StatCard value={rank !== null ? `#${rank}` : '--'} label="rang" testID="stat-rank" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 4,
    paddingHorizontal: 8,
    paddingVertical: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  statValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
});
