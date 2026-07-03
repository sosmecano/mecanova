import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import Button from '../components/Button';
import { api } from '../services/api';

export default function VehiclesScreen({ navigation }: any) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');

  useEffect(() => { loadVehicles(); }, []);

  const loadVehicles = async () => {
    try {
      const data = await api.users.vehicles.list();
      setVehicles(data);
    } catch {}
    setLoading(false);
  };

  const addVehicle = async () => {
    if (!brand || !model) return;
    try {
      await api.users.vehicles.create({ brand, model, year: parseInt(year) || 2024, license_plate: plate });
      setShowForm(false);
      setBrand(''); setModel(''); setYear(''); setPlate('');
      loadVehicles();
    } catch (e: any) { alert(e.message); }
  };

  const removeVehicle = (id: string) => {
    Alert.alert('Supprimer', 'Voulez-vous supprimer ce véhicule ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        setRemovingId(id);
        try {
          await api.users.vehicles.remove(id);
          loadVehicles();
        } catch (e: any) {
          alert(e.message || 'Erreur lors de la suppression');
        } finally {
          setRemovingId(null);
        }
      }},
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes véhicules</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addBtn}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {showForm && (
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Marque (ex: Toyota)" placeholderTextColor={Colors.mediumGray} value={brand} onChangeText={setBrand} />
            <TextInput style={styles.input} placeholder="Modèle (ex: Corolla)" placeholderTextColor={Colors.mediumGray} value={model} onChangeText={setModel} />
            <TextInput style={styles.input} placeholder="Année (ex: 2020)" placeholderTextColor={Colors.mediumGray} value={year} onChangeText={setYear} keyboardType="number-pad" />
            <TextInput style={styles.input} placeholder="Plaque (ex: AB-123-CD)" placeholderTextColor={Colors.mediumGray} value={plate} onChangeText={setPlate} />
            <Button title="Ajouter" onPress={addVehicle} disabled={!brand || !model} />
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: Spacing.xxl }} />
        ) : vehicles.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucun véhicule enregistré</Text>
            <Button title="Ajouter un véhicule" onPress={() => setShowForm(true)} style={{ marginTop: Spacing.md }} />
          </View>
        ) : (
          vehicles.map((v: any) => (
            <View key={v.id} style={styles.vehicleCard}>
              <View style={styles.vehicleIcon}>
                <Text style={styles.vehicleIconText}>🚗</Text>
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>{v.brand} {v.model} {v.year}</Text>
                {v.license_plate && <Text style={styles.vehiclePlate}>{v.license_plate}</Text>}
              </View>
              <TouchableOpacity onPress={() => removeVehicle(v.id)}>
                <Text style={styles.deleteBtn}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  backBtn: { fontSize: FontSize.body, fontWeight: '600', color: Colors.primaryDark },
  headerTitle: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black },
  addBtn: { fontSize: 28, fontWeight: '600', color: Colors.primaryDark },
  content: { padding: Spacing.lg },
  form: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.lg, gap: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.lightGray, borderRadius: BorderRadius.md,
    padding: Spacing.md, fontSize: FontSize.body, color: Colors.black,
  },
  empty: { alignItems: 'center', marginTop: Spacing.xxl },
  emptyText: { fontSize: FontSize.body, color: Colors.mediumGray },
  vehicleCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  vehicleIcon: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: '#E5F0FF',
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  vehicleIconText: { fontSize: 22 },
  vehicleInfo: { flex: 1 },
  vehicleName: { fontSize: FontSize.body, fontWeight: '700', color: Colors.black },
  vehiclePlate: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  deleteBtn: { fontSize: 20, padding: Spacing.sm },
});
