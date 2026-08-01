import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Switch, Alert, ActivityIndicator, Image } from 'react-native';
import Button from '../components/Button';
import * as ImagePicker from 'expo-image-picker';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import { api } from '../services/api';

export default function ParametresScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [language, setLanguage] = useState('fr');
  const [notifications, setNotifications] = useState(true);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [pickingPhoto, setPickingPhoto] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setError(null);
    try {
      const data = await api.users.me();
      setUser(data);
      setFirstName(data.first_name || '');
      setLastName(data.last_name || '');
      setEmail(data.email || '');
      setCity(data.city || '');
      setLanguage(data.language || 'fr');
      setPhotoUri(data.photo_url || null);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Autorisez l\'accès à la galerie dans les réglages.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setPickingPhoto(true);
      const asset = result.assets[0];
      if (asset.uri) {
        setPhotoUri(asset.uri);
        try {
          const { url } = await api.upload.photo(asset.uri);
          const updated = await api.users.update({ photo_url: url });
          setUser(updated);
        } catch (e: any) {
          Alert.alert('Erreur', 'Impossible d\'enregistrer la photo.');
        }
      }
      setPickingPhoto(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const updated = await api.users.update({
        first_name: firstName,
        last_name: lastName,
        email,
        city,
        language,
      });
      setUser(updated);
      setEditing(false);
      Alert.alert('✅ Enregistré', 'Vos modifications ont été sauvegardées.');
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    } finally {
      setSaving(false);
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <TouchableOpacity style={styles.avatarWrap} onPress={pickPhoto} disabled={pickingPhoto}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                {((user?.first_name || '')[0] || '') + ((user?.last_name || '')[0] || '') || '?'}
              </Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
          {pickingPhoto && <ActivityIndicator size="small" color={Colors.white} style={StyleSheet.absoluteFill} />}
        </TouchableOpacity>

        {/* Profile */}
        <Text style={styles.sectionTitle}>Profil</Text>
        <View style={styles.card}>
          {editing ? (
            <>
              <View style={styles.field}>
                <Text style={styles.label}>Prénom</Text>
                <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Prénom" />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Nom</Text>
                <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Nom" />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="email@exemple.com" keyboardType="email-address" autoCapitalize="none" />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Ville</Text>
                <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Abidjan" />
              </View>
            </>
          ) : (
            <>
              <ProfileRow label="Prénom" value={firstName} />
              <ProfileRow label="Nom" value={lastName} />
              <ProfileRow label="Email" value={email || '—'} />
              <ProfileRow label="Téléphone" value={user?.phone || '—'} last />
            </>
          )}
        </View>

        {editing ? (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setEditing(false); loadProfile(); }}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={save} disabled={saving}>
              <Text style={styles.saveText}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
            <Text style={styles.editBtnText}>✏️ Modifier mes informations</Text>
          </TouchableOpacity>
        )}

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Préférences</Text>
        <View style={styles.card}>
          <View style={styles.prefRow}>
            <Text style={styles.prefLabel}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          <View style={[styles.prefRow, styles.prefRowLast]}>
            <Text style={styles.prefLabel}>Langue</Text>
            <TouchableOpacity onPress={() => setLanguage(language === 'fr' ? 'en' : 'fr')} style={styles.langBtn}>
              <Text style={styles.langText}>{language === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>À propos</Text>
        <View style={styles.card}>
          <ProfileRow label="Version" value="1.0.0" />
          <ProfileRow label="Développeur" value="Mecanova" last />
        </View>

        <TouchableOpacity style={styles.deleteBtn}>
          <Text style={styles.deleteText}>🗑 Supprimer mon compte</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backArrow: { fontSize: 24, color: Colors.black, fontWeight: '600' },
  headerTitle: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black },
  content: { padding: Spacing.lg },
  avatarWrap: {
    alignSelf: 'center', marginBottom: Spacing.lg, position: 'relative',
    width: 100, height: 100, borderRadius: 50,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.lightGray },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarPlaceholderText: { fontSize: 36, fontWeight: '700', color: Colors.black },
  cameraBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.black, justifyContent: 'center', alignItems: 'center',
  },
  cameraIcon: { fontSize: 14 },
  sectionTitle: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black, marginBottom: Spacing.sm, marginTop: Spacing.md },
  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    overflow: 'hidden',
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
  rowValue: { fontSize: FontSize.body, fontWeight: '600', color: Colors.black, maxWidth: '60%', textAlign: 'right' },
  field: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  label: { fontSize: FontSize.caption, color: Colors.mediumGray, marginBottom: 4, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: Colors.lightGray, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, height: 44, fontSize: FontSize.body,
    color: Colors.black,
  },
  editActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  cancelBtn: {
    flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
  },
  cancelText: { fontSize: FontSize.body, fontWeight: '600', color: Colors.mediumGray },
  saveBtn: {
    flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.md,
    backgroundColor: Colors.black, alignItems: 'center',
  },
  saveText: { fontSize: FontSize.body, fontWeight: '600', color: Colors.white },
  editBtn: { marginTop: Spacing.md, alignItems: 'center', paddingVertical: Spacing.sm },
  editBtnText: { fontSize: FontSize.body, fontWeight: '600', color: Colors.primaryDark },
  prefRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  prefRowLast: { borderBottomWidth: 0 },
  prefLabel: { fontSize: FontSize.body, fontWeight: '500', color: Colors.black },
  langBtn: {
    backgroundColor: Colors.lightGray, borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: 6,
  },
  langText: { fontSize: FontSize.body, fontWeight: '600', color: Colors.black },
  deleteBtn: {
    marginTop: Spacing.xl, paddingVertical: Spacing.md,
    alignItems: 'center', borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: '#FF3B30',
  },
  deleteText: { fontSize: FontSize.body, fontWeight: '600', color: '#FF3B30' },
});
