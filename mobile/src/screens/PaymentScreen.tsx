import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import Button from '../components/Button';
import Card from '../components/Card';
import { api } from '../services/api';

const methods = [
  { id: 'orange_money', label: 'Orange Money', icon: '📱' },
  { id: 'mtn_momo', label: 'MTN MoMo', icon: '📱' },
  { id: 'wave', label: 'Wave', icon: '📱' },
  { id: 'cash', label: 'Espèces', icon: '💵' },
];

export default function PaymentScreen({ route, navigation }: any) {
  const missionId = route?.params?.missionId;
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!selected || !missionId) return;
    setLoading(true);
    try {
      await api.payments.create({
        mission_id: missionId,
        method: selected,
      });
      Alert.alert('Paiement réussi', 'Merci pour votre confiance !');
      navigation.navigate('Home');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Paiement</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Intervention terminée</Text>
          <Text style={styles.amount}>{route?.params?.amount || '12 500'} FCFA</Text>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Montant</Text>
            <Text style={styles.detailValue}>{route?.params?.amount || '12 000'} FCFA</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Commission MecaCI</Text>
            <Text style={styles.detailValue}>{Math.round((route?.params?.amount || 12000) * 0.1)} FCFA</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Moyen de paiement</Text>
        {methods.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.methodCard, selected === m.id && styles.methodSelected]}
            onPress={() => setSelected(m.id)}
          >
            <View style={[styles.methodIcon, selected === m.id && styles.methodIconSelected]}>
              <Text style={styles.methodIconText}>{m.icon}</Text>
            </View>
            <Text style={styles.methodLabel}>{m.label}</Text>
            <View style={[styles.radio, selected === m.id && styles.radioSelected]}>
              {selected === m.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        <Button
          title={`Payer ${route?.params?.amount || '12 500'} FCFA`}
          onPress={handlePayment}
          disabled={!selected}
          loading={loading}
          style={{ marginTop: Spacing.lg }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: Spacing.lg },
  title: { fontSize: FontSize.title, fontWeight: '800', color: Colors.black, marginBottom: Spacing.lg },
  summaryCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  summaryLabel: { fontSize: FontSize.body, color: Colors.mediumGray, textAlign: 'center' },
  amount: { fontSize: 36, fontWeight: '800', color: Colors.black, textAlign: 'center', marginVertical: Spacing.md },
  divider: { height: 1, backgroundColor: Colors.lightGray, marginBottom: Spacing.md },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  detailLabel: { fontSize: FontSize.body, color: Colors.mediumGray },
  detailValue: { fontSize: FontSize.body, fontWeight: '600', color: Colors.black },
  sectionTitle: { fontSize: FontSize.body, fontWeight: '600', color: Colors.black, marginBottom: Spacing.md },
  methodCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  methodSelected: { borderColor: Colors.primary, borderWidth: 2, backgroundColor: '#FFFDE5' },
  methodIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.lightGray,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  methodIconSelected: { backgroundColor: '#FFF5E0' },
  methodIconText: { fontSize: 20 },
  methodLabel: { fontSize: FontSize.body, fontWeight: '600', color: Colors.black, flex: 1 },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  radioSelected: { borderColor: Colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
});
