import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import Card from '../components/Card';
import { api } from '../services/api';

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente', en_route: 'En route', arrived: 'Arrivé',
  in_progress: 'En cours', completed: 'Terminée', cancelled: 'Annulée',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#FF9800', en_route: '#2196F3', arrived: '#4CAF50',
  in_progress: '#9C27B0', completed: '#4CAF50', cancelled: '#F44336',
};

export default function AdminMissionsScreen() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useFocusEffect(
    useCallback(() => {
      loadMissions();
    }, [filter])
  );

  const loadMissions = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.admin.missions(filter);
      setMissions(Array.isArray(res) ? res : res?.missions || []);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { key: 'all', label: 'Toutes' },
    { key: 'pending', label: 'En attente' },
    { key: 'en_route', label: 'En route' },
    { key: 'in_progress', label: 'En cours' },
    { key: 'completed', label: 'Terminées' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Missions</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <View style={styles.filterRow}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : error ? (
        <View style={{ alignItems: 'center', marginTop: Spacing.xl, paddingHorizontal: Spacing.lg }}>
          <Text style={{ color: Colors.mediumGray, textAlign: 'center', marginBottom: Spacing.md }}>{error}</Text>
          <Button title="Réessayer" onPress={loadMissions} variant="outline" />
        </View>
      ) : missions.length === 0 ? (
        <View style={styles.center}><Text style={styles.empty}>Aucune mission</Text></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {missions.map((m: any, i: number) => (
            <Card key={m.id || i} style={styles.missionCard}>
              <View style={styles.missionTop}>
                <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[m.status] || Colors.mediumGray }]} />
                <Text style={styles.missionService}>{m.service_type || m.type || 'Service'}</Text>
                <Text style={[styles.missionStatus, { color: STATUS_COLORS[m.status] || Colors.mediumGray }]}>
                  {STATUS_LABELS[m.status] || m.status}
                </Text>
              </View>
              <Text style={styles.missionClient}>
                Client : {[m.user_first_name, m.user_last_name].filter(Boolean).join(' ') || m.user_phone || '—'}
              </Text>
              {m.pro_first_name && (
                <Text style={styles.missionPro}>
                  Pro : {[m.pro_first_name, m.pro_last_name].filter(Boolean).join(' ') || m.pro_phone || '—'}
                </Text>
              )}
              <Text style={styles.missionAddress}>📍 {m.location_address || m.address || '—'}</Text>
              <Text style={styles.missionDate}>🕐 {m.created_at ? new Date(m.created_at).toLocaleDateString('fr-FR') : '—'}</Text>
              {m.price_estimate && <Text style={styles.missionPrice}>💰 {m.price_estimate} FCFA</Text>}
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
  filterScroll: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterRow: {
    flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterBtn: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full, backgroundColor: Colors.lightGray,
  },
  filterBtnActive: { backgroundColor: Colors.black },
  filterText: { fontSize: FontSize.caption, fontWeight: '600', color: Colors.mediumGray },
  filterTextActive: { color: Colors.white },
  content: { padding: Spacing.lg },
  empty: { fontSize: FontSize.body, color: Colors.mediumGray },
  missionCard: { marginBottom: Spacing.md },
  missionTop: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: Spacing.sm },
  missionService: { fontSize: FontSize.body, fontWeight: '700', color: Colors.black, flex: 1 },
  missionStatus: { fontSize: FontSize.caption, fontWeight: '600' },
  missionClient: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  missionPro: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  missionAddress: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  missionDate: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  missionPrice: { fontSize: FontSize.caption, fontWeight: '600', color: Colors.black, marginTop: 4 },
});
