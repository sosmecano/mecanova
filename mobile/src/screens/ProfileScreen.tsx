import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import Button from '../components/Button';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import Card from '../components/Card';
import { api } from '../services/api';

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    setError(null);
    try {
      const [userData, vehData] = await Promise.all([
        api.users.me(),
        api.users.vehicles.list(),
      ]);
      setUser(userData);
      setVehicles(vehData);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
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
          <Button title="Réessayer" onPress={loadProfile} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  const initials = user
    ? `${(user.first_name || '')[0]}${(user.last_name || '')[0]}`
    : '??';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Parametres')}>
            {user?.photo_url ? (
              <Image source={{ uri: user.photo_url }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.name}>
            {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Utilisateur'}
          </Text>
          <View style={styles.phoneRow}>
            <Text style={styles.phone}>{user?.phone || ''}</Text>
          </View>
          {user?.city && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{user.city}</Text>
            </View>
          )}
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Vehicles')}>
            <View style={styles.menuIcon}><Text style={styles.menuIconText}>🚗</Text></View>
            <Text style={styles.menuLabel}>Mes véhicules</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Activite')}>
            <View style={styles.menuIcon}><Text style={styles.menuIconText}>📋</Text></View>
            <Text style={styles.menuLabel}>Mes missions</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Payment')}>
            <View style={styles.menuIcon}><Text style={styles.menuIconText}>💳</Text></View>
            <Text style={styles.menuLabel}>Mes paiements</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Parametres')}>
            <View style={styles.menuIcon}><Text style={styles.menuIconText}>⚙️</Text></View>
            <Text style={styles.menuLabel}>Paramètres</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Aide', 'Contactez-nous au +225 01 01 01 01 01')}>
            <View style={styles.menuIcon}><Text style={styles.menuIconText}>❓</Text></View>
            <Text style={styles.menuLabel}>Aide et support</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Véhicule principal</Text>
        {vehicles.length > 0 ? (
          <Card style={styles.vehicleCard}>
            <View style={styles.vehicleRow}>
              <View style={styles.vehicleIcon}><Text style={styles.vehicleIconText}>🚗</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.vehicleName}>{vehicles[0].brand} {vehicles[0].model} {vehicles[0].year}</Text>
                <Text style={styles.vehiclePlate}>{vehicles[0].license_plate}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
          </Card>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Vehicles')}>
            <Text style={styles.noVehicle}>+ Ajouter un véhicule</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    overflow: 'hidden',
  },
  avatarImg: { width: 88, height: 88, borderRadius: 44 },
  avatarText: { fontSize: 32, fontWeight: '700', color: Colors.black },
  name: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs },
  phone: { fontSize: FontSize.body, color: Colors.mediumGray },
  badge: {
    backgroundColor: Colors.lightGray, borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: 4, marginTop: Spacing.sm,
  },
  badgeText: { fontSize: FontSize.caption, color: Colors.mediumGray, fontWeight: '500' },
  menu: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.lightGray,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  menuIconText: { fontSize: 16 },
  menuLabel: { fontSize: FontSize.body, color: Colors.black, flex: 1, fontWeight: '500' },
  arrow: { fontSize: 24, color: Colors.border, fontWeight: '300' },
  sectionTitle: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black, marginBottom: Spacing.sm },
  vehicleCard: { padding: Spacing.lg },
  vehicleRow: { flexDirection: 'row', alignItems: 'center' },
  vehicleIcon: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: '#E5F0FF',
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  vehicleIconText: { fontSize: 22 },
  vehicleName: { fontSize: FontSize.body, fontWeight: '700', color: Colors.black },
  vehiclePlate: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  noVehicle: { fontSize: FontSize.body, color: Colors.primaryDark, textAlign: 'center', marginTop: Spacing.md, fontWeight: '600' },
  logoutBtn: {
    marginTop: Spacing.xl, paddingVertical: Spacing.md,
    alignItems: 'center', borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: '#FF3B30',
  },
  logoutText: { fontSize: FontSize.body, fontWeight: '600', color: '#FF3B30' },
});
