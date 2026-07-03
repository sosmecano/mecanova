import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import Card from '../components/Card';
import { api } from '../services/api';

export default function AdminPaymentsScreen() {
  const [payments, setPayments] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadPayments();
    }, [])
  );

  const loadPayments = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.admin.payments();
      const list = Array.isArray(res) ? res : res?.payments || [];
      setPayments(list);
      const total = list.reduce((s: number, p: any) => s + (parseFloat(p.amount) || 0), 0);
      const commissions = list.reduce((s: number, p: any) => s + (parseFloat(p.commission) || 0), 0);
      setSummary({ total, commissions, count: list.length });
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Paiements</Text>
      </View>
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : error ? (
        <View style={{ alignItems: 'center', marginTop: Spacing.xl, paddingHorizontal: Spacing.lg }}>
          <Text style={{ color: Colors.mediumGray, textAlign: 'center', marginBottom: Spacing.md }}>{error}</Text>
          <Button title="Réessayer" onPress={loadPayments} variant="outline" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.summaryRow}>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{summary.count}</Text>
              <Text style={styles.summaryLabel}>Transactions</Text>
            </Card>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{Number(summary.total).toLocaleString()} FCFA</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </Card>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{Number(summary.commissions).toLocaleString()} FCFA</Text>
              <Text style={styles.summaryLabel}>Commissions</Text>
            </Card>
          </View>

          {payments.length === 0 ? (
            <Text style={styles.empty}>Aucun paiement</Text>
          ) : (
            payments.map((p: any, i: number) => (
              <Card key={p.id || i} style={styles.paymentCard}>
                <View style={styles.paymentTop}>
                  <Text style={styles.paymentAmount}>{parseFloat(p.amount || 0).toLocaleString()} FCFA</Text>
                  <Text style={styles.paymentStatus}>{p.status || 'completed'}</Text>
                </View>
                <Text style={styles.paymentDetail}>Client : {[p.user_first_name, p.user_last_name].filter(Boolean).join(' ') || p.user_phone || '—'}</Text>
                <Text style={styles.paymentDetail}>Pro : {[p.pro_first_name, p.pro_last_name].filter(Boolean).join(' ') || p.pro_phone || '—'}</Text>
                <Text style={styles.paymentDetail}>Mode : {p.method || '—'}</Text>
                <Text style={styles.paymentDetail}>Commission : {parseFloat(p.commission || 0).toLocaleString()} FCFA</Text>
                <Text style={styles.paymentDate}>
                  🕐 {p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR') : '—'}
                </Text>
              </Card>
            ))
          )}
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
  summaryRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  summaryCard: { flex: 1, padding: Spacing.md, alignItems: 'center' },
  summaryValue: { fontSize: FontSize.body, fontWeight: '800', color: Colors.black, textAlign: 'center' },
  summaryLabel: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 2, textAlign: 'center' },
  empty: { fontSize: FontSize.body, color: Colors.mediumGray, textAlign: 'center', marginTop: Spacing.xl },
  paymentCard: { marginBottom: Spacing.md },
  paymentTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  paymentAmount: { fontSize: FontSize.body, fontWeight: '700', color: Colors.black },
  paymentStatus: { fontSize: FontSize.caption, fontWeight: '600', color: Colors.success },
  paymentDetail: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  paymentDate: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 4 },
});
