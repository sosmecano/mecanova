import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import Button from '../components/Button';
import Input from '../components/Input';
import { api } from '../services/api';

const proTypes = [
  { id: 'mechanic', label: '🔧 Mécanicien' },
  { id: 'tow_truck', label: '🚛 Remorqueur' },
  { id: 'garage', label: '🏪 Garage' },
];

export default function ProRegisterScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '+225 ', type: 'mechanic',
    business_name: '', specialties: [] as string[], mobile_money_number: '',
  });

  const register = async () => {
    setLoading(true);
    try {
      await api.professionals.register(form);
      alert('Inscription envoyée ! Validation sous 24-48h.');
      navigation.goBack();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Devenir partenaire</Text>
        <View style={styles.stepRow}>
          <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
          <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
          <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
          <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
          <View style={[styles.stepDot, step >= 3 && styles.stepDotActive]} />
        </View>

        {step === 1 && (
          <View>
            <Text style={styles.sectionTitle}>Qui êtes-vous ?</Text>
            <Text style={styles.sectionSub}>Choisissez votre activité</Text>
            <View style={styles.typeGrid}>
              {proTypes.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.typeCard, form.type === t.id && styles.typeCardActive]}
                  onPress={() => setForm({ ...form, type: t.id })}
                >
                  <Text style={styles.typeIcon}>{t.label.split(' ')[0]}</Text>
                  <Text style={[styles.typeLabel, form.type === t.id && styles.typeLabelActive]}>
                    {t.label.split(' ').slice(1).join(' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input label="Prénom" value={form.first_name} onChangeText={(t) => setForm({ ...form, first_name: t })} />
            <Input label="Nom" value={form.last_name} onChangeText={(t) => setForm({ ...form, last_name: t })} />
            <Input label="Téléphone" value={form.phone} onChangeText={(t) => setForm({ ...form, phone: t })} keyboardType="phone-pad" maxLength={20} />
            <Button title="Suivant" onPress={() => setStep(2)} disabled={!form.first_name || !form.last_name} />
          </View>
        )}
        {step === 2 && (
          <View>
            <Text style={styles.sectionTitle}>Votre structure</Text>
            <Input label="Nom du garage / entreprise" value={form.business_name} onChangeText={(t) => setForm({ ...form, business_name: t })} />
            <Input label="Numéro Mobile Money" value={form.mobile_money_number} onChangeText={(t) => setForm({ ...form, mobile_money_number: t })} keyboardType="phone-pad" />
            <Button title="Suivant" onPress={() => setStep(3)} />
          </View>
        )}
        {step === 3 && (
          <View>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✅</Text>
            </View>
            <Text style={styles.summaryTitle}>Prêt à être envoyé !</Text>
            <Text style={styles.summary}>Votre inscription sera examinée par notre équipe.</Text>
            <Text style={styles.summaryHighlight}>Délai : 24 - 48 heures</Text>
            <Button title="Envoyer l'inscription" onPress={register} loading={loading} style={{ marginTop: Spacing.lg }} />
            <Button title="Modifier" variant="outline" onPress={() => setStep(1)} style={{ marginTop: Spacing.md }} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: Spacing.lg, flexGrow: 1 },
  title: { fontSize: FontSize.title, fontWeight: '800', color: Colors.black, marginBottom: Spacing.lg },
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.lightGray },
  stepDotActive: { backgroundColor: Colors.primary },
  stepLine: { width: 40, height: 2, backgroundColor: Colors.lightGray, marginHorizontal: 4 },
  stepLineActive: { backgroundColor: Colors.primary },
  sectionTitle: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black, marginBottom: Spacing.xs },
  sectionSub: { fontSize: FontSize.body, color: Colors.mediumGray, marginBottom: Spacing.lg },
  typeGrid: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  typeCard: {
    flex: 1, backgroundColor: Colors.lightGray, borderRadius: BorderRadius.md,
    padding: Spacing.md, alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent',
  },
  typeCardActive: { borderColor: Colors.primary, backgroundColor: '#FFFDE5' },
  typeIcon: { fontSize: 24, marginBottom: Spacing.xs },
  typeLabel: { fontSize: FontSize.caption, fontWeight: '600', color: Colors.mediumGray },
  typeLabelActive: { color: Colors.black },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8F8E8', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: Spacing.lg },
  successIconText: { fontSize: 36 },
  summaryTitle: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black, textAlign: 'center', marginBottom: Spacing.sm },
  summary: { fontSize: FontSize.body, color: Colors.mediumGray, textAlign: 'center' },
  summaryHighlight: { fontSize: FontSize.body, fontWeight: '600', color: Colors.black, textAlign: 'center', marginTop: Spacing.lg },
});
