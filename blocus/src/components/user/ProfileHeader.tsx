/**
 * ProfileHeader Component
 * Avatar + username + bio + edit button
 * [Source: front-end-spec.md#profil-utilisateur]
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { PencilSimple } from 'phosphor-react-native';
import { Text } from '@/components/ui/Text';
import { UserAvatar } from './UserAvatar';
import { colors } from '@/theme/colors';

interface ProfileHeaderProps {
  avatarUrl: string | null;
  username: string | null;
  email: string;
  bio: string | null;
  onEditPress: () => void;
  testID?: string;
}

export function ProfileHeader({
  avatarUrl,
  username,
  email,
  bio,
  onEditPress,
  testID,
}: ProfileHeaderProps) {
  const displayName = username || email.split('@')[0];

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.avatarContainer}>
        <UserAvatar avatarUrl={avatarUrl} size="large" testID="profile-avatar" />
        <Pressable style={styles.editButton} onPress={onEditPress} testID="edit-profile-button">
          <PencilSimple size={16} color={colors.white} weight="bold" />
        </Pressable>
      </View>

      <Text style={styles.username} testID="profile-username">
        {displayName}
      </Text>

      {bio ? (
        <Text style={styles.bio} testID="profile-bio">
          {bio}
        </Text>
      ) : (
        <Text style={styles.bioPlaceholder} testID="profile-bio-placeholder">
          Ajoutez une bio...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  bio: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  bioPlaceholder: {
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
    opacity: 0.6,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    bottom: 0,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: -8,
    width: 28,
  },
  username: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
  },
});
