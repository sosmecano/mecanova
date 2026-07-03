import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Button from '../components/Button';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import Card from '../components/Card';
import { api } from '../services/api';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const loadUsers = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.admin.users();
      setUsers(Array.isArray(res) ? res : res?.users || []);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const suspendUser = (id: string, name: string) => {
    Alert.alert('Suspendre', `Suspendre l'utilisateur ${name} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Suspendre', style: 'destructive', onPress: async () => {
        try {
          await api.admin.suspendUser(id);
          loadUsers();
        } catch (e: any) {
          Alert.alert('Erreur', e.message);
        }
      }},
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Utilisateurs</Text>
      </View>
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : error ? (
        <View style={{ alignItems: 'center', marginTop: Spacing.xl, paddingHorizontal: Spacing.lg }}>
          <Text style={{ color: Colors.mediumGray, textAlign: 'center', marginBottom: Spacing.md }}>{error}</Text>
          <Button title="Réessayer" onPress={loadUsers} variant="outline" />
        </View>
      ) : users.length === 0 ? (
        <View style={styles.center}><Text style={styles.empty}>Aucun utilisateur</Text></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {users.map((u: any, i: number) => (
            <Card key={u.id || i} style={styles.userCard}>
              <View style={styles.userTop}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {((u.first_name || '')[0] || '') + ((u.last_name || '')[0] || '') || '?'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.userName}>{[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}</Text>
                  <Text style={styles.userDetail}>{u.phone || ''}</Text>
                  <Text style={styles.userDetail}>{u.email || ''}</Text>
                  <Text style={styles.userDetail}>{u.city || ''}</Text>
                </View>
                <View style={styles.userActions}>
                  {u.is_suspended ? (
                    <Text style={styles.suspendedLabel}>Suspendu</Text>
                  ) : (
                    <TouchableOpacity onPress={() => suspendUser(u.id, u.first_name || u.phone || '')}>
                      <Text style={styles.suspendBtn}>Suspendre</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              {u.created_at && (
                <Text style={styles.userDate}>Inscrit le {new Date(u.created_at).toLocaleDateString('fr-FR')}</Text>
              )}
            </Card>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black },
  content: { padding: Spacing.lg },
  empty: { fontSize: FontSize.body, color: Colors.mediumGray },
  userCard: { marginBottom: Spacing.md },
  userTop: { flexDirection: 'row', alignItems: 'center' },
  userAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  userAvatarText: { fontSize: 16, fontWeight: '700', color: Colors.black },
  userName: { fontSize: FontSize.body, fontWeight: '700', color: Colors.black },
  userDetail: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  userActions: { alignItems: 'center' },
  suspendedLabel: { fontSize: FontSize.caption, fontWeight: '700', color: Colors.sos },
  suspendBtn: { fontSize: FontSize.caption, fontWeight: '700', color: Colors.sos },
  userDate: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: Spacing.sm },
});
