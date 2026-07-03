import { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator, TextInput } from 'react-native';
import Button from '../components/Button';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import Card from '../components/Card';
import { api } from '../services/api';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

export default function ProProfileScreen({ navigation }: any) {
  const [pro, setPro] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [available, setAvailable] = useState(true);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState<any>({});
  const mapRef = useRef<MapView>(null);

  const locateMe = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Activez la localisation dans les réglages.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setForm({ ...form, zone_center_lat: latitude, zone_center_lng: longitude });
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 500);
    } catch (e: any) {
      Alert.alert('Erreur', 'Impossible de vous localiser: ' + e.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    setError(null);
    try {
      const data = await api.professionals.me();
      setPro(data);
      setForm({
        business_name: data.business_name || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        city: data.city || '',
        specialties: Array.isArray(data.specialties) ? data.specialties.join(', ') : '',
        zone_center_lat: data.zone_center_lat ?? 5.345,
        zone_center_lng: data.zone_center_lng ?? -4.015,
        zone_radius_km: data.zone_radius_km ?? 10,
      });
      setAvailable(data.is_available === true || data.is_available === 'true');
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (val: boolean) => {
    setAvailable(val);
    try {
      await api.professionals.setAvailability(val);
    } catch (e: any) {
      setAvailable(!val);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const specialties = form.specialties.split(',').map((s: string) => s.trim()).filter(Boolean);
      const updated = await api.professionals.update({
        business_name: form.business_name,
        first_name: form.first_name,
        last_name: form.last_name,
        city: form.city,
        specialties,
        zone_center_lat: form.zone_center_lat,
        zone_center_lng: form.zone_center_lng,
        zone_radius_km: form.zone_radius_km,
      });
      setPro(updated);
      setEditing(false);
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: async () => {
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('refresh_token');
        await SecureStore.deleteItemAsync('userType');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }},
    ]);
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
          <Button title="Réessayer" onPress={loadProfile} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  const initials = pro
    ? `${(pro.first_name || '')[0]}${(pro.last_name || '')[0]}`
    : '??';

  const typeLabel: Record<string, string> = {
    mechanic: 'Mcanicien',
    tow_truck: 'Remorqueur',
    garage: 'Garage',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {editing ? (
            <TextInput
              style={styles.editInputName}
              value={form.business_name}
              onChangeText={(t) => setForm({ ...form, business_name: t })}
              placeholder="Nom de l'entreprise"
              placeholderTextColor={Colors.mediumGray}
            />
          ) : (
            <Text style={styles.businessName}>{pro?.business_name || `${pro?.first_name || ''} ${pro?.last_name || ''}`.trim()}</Text>
          )}
          <Text style={styles.type}>{typeLabel[pro?.type] || pro?.type || 'Pro'}</Text>
          <Text style={styles.phone}>{pro?.phone || ''}</Text>

          <View style={styles.availRow}>
            <View style={[styles.availDot, { backgroundColor: available ? Colors.success : '#ccc' }]} />
            <Text style={[styles.availLabel, { color: available ? Colors.success : Colors.mediumGray }]}>
              {available ? 'Disponible' : 'Indisponible'}
            </Text>
            <Switch
              value={available}
              onValueChange={toggleAvailability}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{pro?.rating?.toFixed(1) || '—'}</Text>
            <Text style={styles.statLabel}>Note</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{pro?.rating_count || 0}</Text>
            <Text style={styles.statLabel}>Avis</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statusBadge, { backgroundColor: pro?.status === 'active' ? '#E8F8E8' : '#FFF3E0' }]}>
              <Text style={[styles.statusText, { color: pro?.status === 'active' ? Colors.success : '#FF9800' }]}>
                {pro?.status === 'active' ? 'Actif' : pro?.status === 'pending' ? 'En attente' : pro?.status}
              </Text>
            </View>
            <Text style={styles.statLabel}>Statut</Text>
          </View>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <TouchableOpacity onPress={() => editing ? saveProfile() : setEditing(true)} disabled={saving}>
            <Text style={[styles.editBtn, saving && { opacity: 0.5 }]}>
              {saving ? 'Enregistrement...' : editing ? 'Enregistrer' : 'Modifier'}
            </Text>
          </TouchableOpacity>
        </View>
        <Card style={styles.infoCard}>
          {editing ? (
            <>
              <EditRow label="Prnom" value={form.first_name} onChange={(t) => setForm({ ...form, first_name: t })} />
              <EditRow label="Nom" value={form.last_name} onChange={(t) => setForm({ ...form, last_name: t })} />
              <EditRow label="Ville" value={form.city} onChange={(t) => setForm({ ...form, city: t })} />
              <EditRow label="Spcialits" value={form.specialties} onChange={(t) => setForm({ ...form, specialties: t })} placeholder="mcanique, batterie, freins" last />
            </>
          ) : (
            <>
              <InfoRow label="Prnom" value={pro?.first_name || '—'} />
              <InfoRow label="Nom" value={pro?.last_name || '—'} />
              <InfoRow label="Ville" value={pro?.city || '—'} />
              <InfoRow label="Spcialits" value={Array.isArray(pro?.specialties) ? pro.specialties.join(', ') : String(pro?.specialties || '—')} last />
            </>
          )}
        </Card>

        <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Zone d'intervention</Text>
        <Card style={[styles.infoCard, { marginTop: Spacing.sm }]}>
          {editing ? (
            <>
              <View style={styles.mapContainer}>
                <MapView
                  ref={mapRef}
                  style={styles.map}
                  initialRegion={{
                    latitude: form.zone_center_lat,
                    longitude: form.zone_center_lng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  onPress={(e) => setForm({ ...form, zone_center_lat: e.nativeEvent.coordinate.latitude, zone_center_lng: e.nativeEvent.coordinate.longitude })}
                >
                  <Marker
                    coordinate={{ latitude: form.zone_center_lat, longitude: form.zone_center_lng }}
                    draggable
                    onDragEnd={(e) => setForm({ ...form, zone_center_lat: e.nativeEvent.coordinate.latitude, zone_center_lng: e.nativeEvent.coordinate.longitude })}
                    title="Ma zone"
                    description="Centre de ma zone d'intervention"
                  />
                  <Circle
                    center={{ latitude: form.zone_center_lat, longitude: form.zone_center_lng }}
                    radius={form.zone_radius_km * 1000}
                    fillColor="rgba(0, 122, 255, 0.1)"
                    strokeColor="rgba(0, 122, 255, 0.4)"
                    strokeWidth={2}
                  />
                </MapView>
                <TouchableOpacity style={styles.locateBtn} onPress={locateMe}>
                  <Text style={styles.locateBtnText}>Me localiser</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.radiusRow}>
                <Text style={styles.radiusLabel}>Rayon: {form.zone_radius_km} km</Text>
              </View>
              <View style={styles.radiusInputs}>
                {[2, 5, 10, 15, 20, 30].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.radiusOption, form.zone_radius_km === r && styles.radiusOptionActive]}
                    onPress={() => setForm({ ...form, zone_radius_km: r })}
                  >
                    <Text style={[styles.radiusOptionText, form.zone_radius_km === r && styles.radiusOptionTextActive]}>{r} km</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <InfoRow label="Latitude" value={form.zone_center_lat.toFixed(4)} />
              <InfoRow label="Longitude" value={form.zone_center_lng.toFixed(4)} last />
            </>
          ) : (
            <>
              <InfoRow label="Latitude" value={typeof pro?.zone_center_lat === 'number' ? pro.zone_center_lat.toFixed(4) : String(pro?.zone_center_lat || '—')} />
              <InfoRow label="Longitude" value={typeof pro?.zone_center_lng === 'number' ? pro.zone_center_lng.toFixed(4) : String(pro?.zone_center_lng || '—')} />
              <InfoRow label="Rayon" value={pro?.zone_radius_km ? `${pro.zone_radius_km} km` : '—'} last />
            </>
          )}
        </Card>

        {editing && (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setEditing(false); loadProfile(); }}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.5 }]} onPress={saveProfile} disabled={saving}>
              <Text style={styles.saveText}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Se dconnecter</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function EditRow({ label, value, onChange, placeholder, last }: { label: string; value: string; onChange: (t: string) => void; placeholder?: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <TextInput
        style={styles.editInput}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || label}
        placeholderTextColor={Colors.mediumGray}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: Spacing.lg },
  profileHeader: { alignItems: 'center', marginBottom: Spacing.xl, paddingVertical: Spacing.lg },
  avatar: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: Colors.black },
  businessName: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black, textAlign: 'center' },
  type: { fontSize: FontSize.body, color: Colors.mediumGray, marginTop: 2 },
  phone: { fontSize: FontSize.body, color: Colors.mediumGray, marginTop: 1 },
  availRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, gap: Spacing.sm },
  availDot: { width: 10, height: 10, borderRadius: 5 },
  availLabel: { fontSize: FontSize.body, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  statNum: { fontSize: FontSize.subtitle, fontWeight: '800', color: Colors.black, marginBottom: 2 },
  statLabel: { fontSize: FontSize.caption, color: Colors.mediumGray },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginBottom: 2 },
  statusText: { fontSize: FontSize.caption, fontWeight: '700' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm, marginTop: Spacing.sm },
  sectionTitle: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black },
  editBtn: { fontSize: FontSize.body, fontWeight: '600', color: Colors.primary },
  infoCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { fontSize: FontSize.body, color: Colors.mediumGray },
  rowValue: { fontSize: FontSize.body, fontWeight: '600', color: Colors.black, maxWidth: '55%', textAlign: 'right' },
  editInput: {
    fontSize: FontSize.body, fontWeight: '600', color: Colors.black,
    maxWidth: '55%', textAlign: 'right', paddingVertical: 0,
    borderBottomWidth: 1, borderBottomColor: Colors.primary,
  },
  editInputName: {
    fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black,
    textAlign: 'center', borderBottomWidth: 1, borderBottomColor: Colors.primary,
    paddingVertical: 2, minWidth: 200,
  },
  mapContainer: { height: 220, marginBottom: Spacing.sm, borderRadius: BorderRadius.md, overflow: 'hidden', position: 'relative' },
  map: { flex: 1 },
  locateBtn: {
    position: 'absolute', bottom: 8, right: 8,
    backgroundColor: Colors.white, paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 4,
  },
  locateBtnText: { fontSize: FontSize.caption, fontWeight: '600', color: Colors.primary },
  radiusRow: { paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  radiusLabel: { fontSize: FontSize.body, fontWeight: '600', color: Colors.black },
  radiusInputs: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  radiusOption: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.lightGray,
  },
  radiusOptionActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  radiusOptionText: { fontSize: FontSize.caption, color: Colors.mediumGray },
  radiusOptionTextActive: { color: Colors.white, fontWeight: '600' },
  editActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg },
  cancelBtn: {
    flex: 1, paddingVertical: Spacing.md, alignItems: 'center',
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.lightGray,
  },
  cancelText: { fontSize: FontSize.body, fontWeight: '600', color: Colors.mediumGray },
  saveBtn: {
    flex: 1, paddingVertical: Spacing.md, alignItems: 'center',
    borderRadius: BorderRadius.md, backgroundColor: Colors.primary,
  },
  saveText: { fontSize: FontSize.body, fontWeight: '600', color: Colors.white },
  logoutBtn: {
    marginTop: Spacing.xl, paddingVertical: Spacing.md,
    alignItems: 'center', borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: '#FF3B30',
  },
  logoutText: { fontSize: FontSize.body, fontWeight: '600', color: '#FF3B30' },
});
