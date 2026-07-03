import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import Card from '../components/Card';
import { api } from '../services/api';

export default function ProRevenueScreen({ navigation }: any) {
  const [revenue, setRevenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRevenue = async () => {
    setError(null);
    try {
      const data = await api.professionals.earnings();
      setRevenue(data);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.lg }}>
          <Text style={{ color: Colors.mediumGray, textAlign: 'center', marginBottom: Spacing.md }}>{error}</Text>
          <Button title="Réessayer" onPress={loadRevenue} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Revenus</Text>

        <Card style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total des gains</Text>
          <Text style={styles.totalAmount}>
            {revenue?.total_earnings ? `${Number(revenue.total_earnings).toLocaleString()} FCFA` : '0 FCFA'}
          </Text>
        </Card>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statNum}>{revenue?.total_missions || 0}</Text>
            <Text style={styles.statLabel}>Missions</Text>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: Spacing.lg },
  title: { fontSize: FontSize.title, fontWeight: '800', color: Colors.black, marginBottom: Spacing.lg },
  totalCard: { padding: Spacing.xl, marginBottom: Spacing.lg, alignItems: 'center' },
  totalLabel: { fontSize: FontSize.body, color: Colors.mediumGray, marginBottom: Spacing.sm },
  totalAmount: { fontSize: 32, fontWeight: '800', color: Colors.black },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: { flex: 1, padding: Spacing.lg, alignItems: 'center' },
  statNum: { fontSize: FontSize.title, fontWeight: '800', color: Colors.black },
  statLabel: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 2 },
});
