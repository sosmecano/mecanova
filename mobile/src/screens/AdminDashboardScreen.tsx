import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import Card from '../components/Card';
import { api } from '../services/api';

export default function AdminDashboardScreen({ navigation }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  const loadDashboard = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.admin.dashboard();
      setData(res);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    SecureStore.deleteItemAsync('auth_token');
    SecureStore.deleteItemAsync('refresh_token');
    SecureStore.deleteItemAsync('userType');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.lg }}>
          <Text style={{ color: Colors.mediumGray, textAlign: 'center', marginBottom: Spacing.md }}>{error}</Text>
          <Button title="Réessayer" onPress={loadDashboard} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  const kpis = [
    { label: 'Utilisateurs', value: data?.total_users ?? 0, icon: '👤' },
    { label: 'Pros actifs', value: data?.active_pros ?? 0, icon: '🔧' },
    { label: 'Pros en attente', value: data?.pending_pros ?? 0, icon: '⏳' },
    { label: 'Missions actives', value: data?.active_missions ?? 0, icon: '📋' },
    { label: 'Missions total', value: data?.total_missions ?? 0, icon: '📊' },
    { label: 'Revenus', value: data?.total_revenue ? `${Number(data.total_revenue).toLocaleString()} FCFA` : '0 FCFA', icon: '💰' },
    { label: 'Commissions', value: data?.total_commissions ? `${Number(data.total_commissions).toLocaleString()} FCFA` : '0 FCFA', icon: '💳' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tableau de bord</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutBtn}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {kpis.map((kpi, i) => (
            <Card key={kpi.label || String(i)} style={styles.kpiCard}>
              <Text style={styles.kpiIcon}>{kpi.icon}</Text>
              <Text style={styles.kpiValue}>{kpi.value}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black },
  logoutBtn: { fontSize: FontSize.body, fontWeight: '600', color: Colors.sos },
  content: { padding: Spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  kpiCard: {
    width: '47%', padding: Spacing.md, alignItems: 'center',
  },
  kpiIcon: { fontSize: 28, marginBottom: Spacing.xs },
  kpiValue: { fontSize: FontSize.title, fontWeight: '800', color: Colors.black },
  kpiLabel: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 2, textAlign: 'center' },
});
