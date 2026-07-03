import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import Button from '../components/Button';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors, FontSize, Spacing } from '../constants/theme';
import BottomSheet from '../components/BottomSheet';
import ServiceCard from '../components/ServiceCard';
import { api } from '../services/api';

const TYPE_COLORS: Record<string, string> = {
  mechanic: '#FFD100',
  tow_truck: '#4A90D9',
  garage: '#34C759',
};

const services = [
  { icon: '🔧', title: 'Mécanicien', subtitle: 'À domicile', screen: 'MechanicService' },
  { icon: '⚡', title: 'Urgence', subtitle: 'SOS panne', screen: 'SOSPanic' },
  { icon: '🚛', title: 'Remorquage', subtitle: 'Vers un garage', screen: 'Towing' },
  { icon: '🏪', title: 'Garages', subtitle: 'À proximité', screen: 'Garages' },
];

export default function HomeScreen({ navigation }: any) {
  const [location, setLocation] = useState<any>(null);
  const [nearbyPros, setNearbyPros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  const loadData = async () => {
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      const pros = await api.missions.nearbyPros(loc.coords.latitude, loc.coords.longitude);
      setNearbyPros(pros.slice(0, 2));
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!location) return;
    mapRef.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 800);
  }, [location]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || 5.345,
          longitude: location?.longitude || -4.015,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {nearbyPros.map((pro: any, i: number) =>
          pro.zone_center_lat && pro.zone_center_lng ? (
            <Marker
              key={pro.id || i}
              coordinate={{ latitude: pro.zone_center_lat, longitude: pro.zone_center_lng }}
              title={`${pro.first_name} ${pro.last_name}`}
              description={`${pro.type || 'Pro'} · ⭐ ${pro.rating?.toFixed(1) || '?'}`}
              pinColor={TYPE_COLORS[pro.type] || Colors.primary}
            />
          ) : null
        )}
      </MapView>

      <SafeAreaView style={styles.topOverlay}>
        <View style={styles.header}>
          <View style={styles.locationPill}>
            <Text style={styles.locationDot}>●</Text>
            <Text style={styles.locationText}>
              {location ? `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}` : 'Cocody, Angré'}
            </Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profil')}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <TouchableOpacity style={styles.sosFab} onPress={() => navigation.navigate('SOSPanic')}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      <BottomSheet>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>Que vous faut-il ?</Text>
          </TouchableOpacity>

          <View style={styles.servicesGrid}>
            {services.map((s, i) => (
              <ServiceCard
                key={s.title || String(i)}
                icon={s.icon}
                title={s.title}
                subtitle={s.subtitle}
                onPress={() => navigation.navigate(s.screen)}
              />
            ))}
          </View>

          <View style={styles.nearbyRow}>
            <Text style={styles.nearbyTitle}>Professionnels proches</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Garages')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.prosList}>
            {loading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : error ? (
              <View style={{ alignItems: 'center', marginTop: Spacing.md }}>
                <Text style={{ color: Colors.mediumGray, textAlign: 'center', marginBottom: Spacing.sm }}>{error}</Text>
                <Button title="Réessayer" onPress={loadData} variant="outline" />
              </View>
            ) : nearbyPros.length === 0 ? (
              <Text style={styles.noPros}>Aucun professionnel disponible</Text>
            ) : (
              nearbyPros.map((pro: any, i: number) => (
                <View key={pro.id || i} style={styles.proItem}>
                  <View style={[styles.proAvatar, { backgroundColor: i === 0 ? Colors.primary : '#E5F0FF' }]}>
                    <Text style={[styles.proAvatarText, { color: i === 0 ? Colors.black : Colors.black }]}>
                      {((pro.first_name?.[0] || '') + (pro.last_name?.[0] || '')) || '?'}
                    </Text>
                  </View>
                  <View style={styles.proInfo}>
                    <Text style={styles.proName}>{pro.first_name} {pro.last_name}</Text>
                    <Text style={styles.proDetail}>
                      ⭐ {pro.rating?.toFixed(1) || '?'} · {pro.type || 'Pro'} · {pro.distance ? `${pro.distance.toFixed(1)} km` : '?'}
                    </Text>
                  </View>
                  <Text style={styles.proPrice}>{pro.estimated_price || ''}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  map: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationDot: {
    color: Colors.primary,
    fontSize: 10,
    marginRight: 6,
  },
  locationText: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.black,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIcon: {
    fontSize: 18,
  },
  sosFab: {
    position: 'absolute',
    bottom: 120,
    right: Spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.sos,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.sos,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  sosText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 50,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchPlaceholder: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: Spacing.lg,
  },
  nearbyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  nearbyTitle: {
    fontSize: FontSize.subtitle,
    fontWeight: '700',
    color: Colors.black,
  },
  seeAll: {
    fontSize: FontSize.body,
    color: Colors.mediumGray,
    fontWeight: '600',
  },
  prosList: {
    gap: Spacing.sm,
  },
  proItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  proAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
  },
  proInfo: {
    flex: 1,
  },
  proName: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.black,
  },
  proDetail: {
    fontSize: FontSize.caption,
    color: Colors.mediumGray,
    marginTop: 1,
  },
  proPrice: {
    fontSize: FontSize.caption,
    fontWeight: '600',
    color: Colors.mediumGray,
  },
  noPros: {
    fontSize: FontSize.body,
    color: Colors.mediumGray,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
});
