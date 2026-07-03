import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import Card from '../components/Card';
import Button from '../components/Button';
import { api } from '../services/api';

export default function AdminProfessionalsScreen() {
  const [pros, setPros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useFocusEffect(
    useCallback(() => {
      loadPros();
    }, [filter])
  );

  const loadPros = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.admin.professionals(filter);
      setPros(Array.isArray(res) ? res : res?.professionals || []);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const validatePro = async (id: string, action: 'approve' | 'reject') => {
    try {
      await api.admin.validatePro(id, action);
      loadPros();
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    }
  };

  const filters = [
    { key: 'all', label: 'Tous' },
    { key: 'pending', label: 'En attente' },
    { key: 'active', label: 'Actifs' },
    { key: 'suspended', label: 'Suspendus' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Professionnels</Text>
      </View>
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
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : error ? (
        <View style={{ alignItems: 'center', marginTop: Spacing.xl, paddingHorizontal: Spacing.lg }}>
          <Text style={{ color: Colors.mediumGray, textAlign: 'center', marginBottom: Spacing.md }}>{error}</Text>
          <Button title="Réessayer" onPress={loadPros} variant="outline" />
        </View>
      ) : pros.length === 0 ? (
        <View style={styles.center}><Text style={styles.empty}>Aucun professionnel</Text></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {pros.map((p: any, i: number) => (
            <Card key={p.id || i} style={styles.proCard}>
              <View style={styles.proTop}>
                <View style={styles.proAvatar}>
                  <Text style={styles.proAvatarText}>
                    {((p.first_name || '')[0] || '') + ((p.last_name || '')[0] || '') || '?'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.proName}>{p.business_name || `${p.first_name || ''} ${p.last_name || ''}`}</Text>
                  <Text style={styles.proDetail}>{p.type} · {p.city || ''}</Text>
                  <Text style={styles.proDetail}>{p.phone || ''}</Text>
                </View>
                <View style={[styles.statusBadge, {
                  backgroundColor: p.status === 'active' ? '#E8F8E8' : p.status === 'pending' ? '#FFF3E0' : '#FFEBEE',
                }]}>
                  <Text style={[styles.statusText, {
                    color: p.status === 'active' ? Colors.success : p.status === 'pending' ? '#FF9800' : Colors.sos,
                  }]}>{p.status}</Text>
                </View>
              </View>
              {p.status === 'pending' && (
                <View style={styles.actions}>
                  <Button title="Approuver" onPress={() => validatePro(p.id, 'approve')} style={{ flex: 1 }} />
                  <Button title="Rejeter" onPress={() => validatePro(p.id, 'reject')} variant="sos" style={{ flex: 1 }} />
                </View>
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
  filterRow: {
    flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    gap: Spacing.sm, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
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
  proCard: { marginBottom: Spacing.md },
  proTop: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  proAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  proAvatarText: { fontSize: 16, fontWeight: '700', color: Colors.black },
  proName: { fontSize: FontSize.body, fontWeight: '700', color: Colors.black },
  proDetail: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: FontSize.caption, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
});
