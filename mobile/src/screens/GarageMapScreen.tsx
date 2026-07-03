import { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import { api } from '../services/api';

export default function GarageMapScreen({ navigation, route }: any) {
  const p = route.params || {};
  const garage = { name: p.name, address: p.address, lat: p.lat, lng: p.lng, phone: p.phone };
  const [tracking, setTracking] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [heading, setHeading] = useState(0);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const [followMode, setFollowMode] = useState(true);
  const mapRef = useRef<MapView>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const followRef = useRef(true);
  const routeFetchedRef = useRef(false);
  const userLocRef = useRef<{ lat: number; lng: number } | null>(null);
  const routeCoordsRef = useRef<{ latitude: number; longitude: number }[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLoc({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        if (loc.coords.heading != null) setHeading(loc.coords.heading);
      }
    })();
    return () => { if (watchRef.current) watchRef.current.remove(); };
  }, []);

  const recenterMap = useCallback(() => {
    const route = routeCoordsRef.current;
    const user = userLocRef.current;
    if (!user) return;
    if (route.length > 1) {
      mapRef.current?.fitToCoordinates(route, {
        edgePadding: { top: 40, right: 20, bottom: 50, left: 20 },
        animated: true,
      });
    } else {
      mapRef.current?.animateToRegion({
        latitude: user.lat, longitude: user.lng,
        latitudeDelta: 0.005, longitudeDelta: 0.005,
      }, 500);
    }
  }, []);

  const fetchRoute = async (fromLat: number, fromLng: number, toLat: number, toLng: number) => {
    try {
      const data = await api.proxy.route(fromLng, fromLat, toLng, toLat);
      if (data.code === 'Ok' && data.routes?.length > 0) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates.map((c: [number, number]) => ({
          latitude: c[1], longitude: c[0],
        }));
        setRouteCoords(coords);
        routeCoordsRef.current = coords;
        setRouteInfo({
          distance: route.distance / 1000,
          duration: route.duration / 60,
        });
        return coords;
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de calculer l\'itinéraire');
    }
    return null;
  };

  const startTracking = async () => {
    setTrackingLoading(true);
    setTracking(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const loc = await Location.getCurrentPositionAsync({});
    const pos = { lat: loc.coords.latitude, lng: loc.coords.longitude };
    setUserLoc(pos);
    userLocRef.current = pos;
    if (loc.coords.heading != null) setHeading(loc.coords.heading);

    const coords = await fetchRoute(pos.lat, pos.lng, garage.lat, garage.lng);
    routeFetchedRef.current = true;
    setTrackingLoading(false);

    setFollowMode(true);
    followRef.current = true;

    if (coords && coords.length > 1) {
      mapRef.current?.fitToCoordinates(coords, {
        edgePadding: { top: 40, right: 20, bottom: 50, left: 20 },
        animated: true,
      });
    } else {
      mapRef.current?.animateToRegion({
        latitude: pos.lat, longitude: pos.lng,
        latitudeDelta: 0.005, longitudeDelta: 0.005,
      }, 500);
    }

    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
      (loc) => {
        const newPos = { lat: loc.coords.latitude, lng: loc.coords.longitude };
        setUserLoc(newPos);
        userLocRef.current = newPos;
        if (loc.coords.heading != null) setHeading(loc.coords.heading);
        if (followRef.current) recenterMap();
      }
    );
  };

  const toggleFollow = () => {
    const next = !followRef.current;
    setFollowMode(next);
    followRef.current = next;
    if (next && userLoc) {
      recenterMap();
    }
  };

  const stopTracking = () => {
    if (watchRef.current) watchRef.current.remove();
    setTracking(false);
    setRouteCoords([]);
    setRouteInfo(null);
    routeFetchedRef.current = false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (watchRef.current) watchRef.current.remove();
          navigation.goBack();
        }}>
          <Text style={styles.backBtn}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{garage.name}</Text>
        <View style={{ width: 60 }} />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: garage.lat || 5.345,
          longitude: garage.lng || -4.015,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={false}
        showsCompass
        onPanDrag={() => {
          setFollowMode(false);
          followRef.current = false;
        }}
      >
        {garage.lat && garage.lng && (
          <Marker
            coordinate={{ latitude: garage.lat, longitude: garage.lng }}
            title={garage.name}
            description={garage.address}
            pinColor={Colors.primary}
          />
        )}
        {userLoc && tracking && (
          <Marker
            coordinate={{ latitude: userLoc.lat, longitude: userLoc.lng }}
            rotation={heading}
            anchor={{ x: 0.5, y: 0.5 }}
            flat
          >
            <View style={[styles.arrowWrap, { transform: [{ rotate: `${heading}deg` }] }]}>
              <Ionicons name="navigate" size={24} color="#007AFF" />
            </View>
          </Marker>
        )}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        )}
      </MapView>

      {tracking && (
        <View style={styles.mapOverlay} pointerEvents="box-none">
          <TouchableOpacity style={[styles.overlayBtn, followMode && styles.overlayBtnActive]} onPress={toggleFollow}>
            <Ionicons name="locate" size={16} color={followMode ? Colors.primary : '#333'} />
            <Text style={[styles.overlayBtnText, followMode && { color: Colors.primary }]}>Suivre</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomSheet}>
        <Text style={styles.garageName}>{garage.name}</Text>
        <Text style={styles.address}>{garage.address}</Text>
        {routeInfo && (
          <View style={styles.routeInfo}>
            <View style={styles.routeInfoItem}>
              <Ionicons name="map-outline" size={18} color={Colors.primaryDark} />
              <Text style={styles.routeInfoText}>
                {routeInfo.distance < 1
                  ? `${Math.round(routeInfo.distance * 1000)} m`
                  : `${routeInfo.distance.toFixed(1)} km`}
              </Text>
            </View>
            <View style={styles.routeInfoItem}>
              <Ionicons name="time-outline" size={18} color={Colors.primaryDark} />
              <Text style={styles.routeInfoText}>
                {routeInfo.duration < 1
                  ? '< 1 min'
                  : `${Math.round(routeInfo.duration)} min`}
              </Text>
            </View>
          </View>
        )}
        {garage.phone && (
          <TouchableOpacity style={styles.callBtn} onPress={() => { Linking.openURL(`tel:${garage.phone}`).catch(() => {}); }}>
            <Ionicons name="call" size={18} color={Colors.black} style={{ marginRight: 6 }} />
            <Text style={styles.callBtnText}>📞 Appeler</Text>
          </TouchableOpacity>
        )}
        {!tracking ? (
          <TouchableOpacity style={styles.startBtn} onPress={startTracking} disabled={trackingLoading}>
            {trackingLoading ? (
              <ActivityIndicator size="small" color={Colors.black} style={{ marginRight: 8 }} />
            ) : (
              <Ionicons name="navigate" size={20} color={Colors.black} style={{ marginRight: 8 }} />
            )}
            <Text style={styles.startBtnText}>{trackingLoading ? 'Calcul...' : 'Démarrer'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopBtn} onPress={stopTracking}>
            <Ionicons name="stop-circle" size={20} color={Colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.stopBtnText}>Arrêter</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  backBtn: { fontSize: FontSize.body, fontWeight: '600', color: Colors.primaryDark },
  headerTitle: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black, flex: 1, textAlign: 'center' },
  map: { flex: 1 },
  mapOverlay: {
    position: 'absolute', top: 100, right: 12, zIndex: 10,
  },
  overlayBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.white, paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 4,
  },
  overlayBtnActive: {
    borderWidth: 1.5, borderColor: Colors.primary,
  },
  overlayBtnText: { fontSize: 12, fontWeight: '600', color: '#333' },
  bottomSheet: {
    backgroundColor: Colors.white, padding: Spacing.lg,
    borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 6,
  },
  garageName: { fontSize: FontSize.subtitle, fontWeight: '800', color: Colors.black, marginBottom: 4 },
  address: { fontSize: FontSize.body, color: Colors.mediumGray, marginBottom: 4 },
  routeInfo: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.md, marginTop: Spacing.sm },
  routeInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  routeInfoText: { fontSize: FontSize.body, fontWeight: '700', color: Colors.primaryDark },
  callBtn: {
    borderRadius: BorderRadius.md, paddingVertical: Spacing.sm, alignItems: 'center', marginTop: Spacing.sm,
    flexDirection: 'row', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary,
  },
  callBtnText: { fontSize: FontSize.body, fontWeight: '700', color: Colors.black },
  startBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, alignItems: 'center', marginTop: Spacing.sm,
    flexDirection: 'row', justifyContent: 'center',
  },
  startBtnText: { fontSize: FontSize.subtitle, fontWeight: '800', color: Colors.black },
  stopBtn: {
    backgroundColor: '#FF3B30', borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, alignItems: 'center', marginTop: Spacing.sm,
    flexDirection: 'row', justifyContent: 'center',
  },
  stopBtnText: { fontSize: FontSize.subtitle, fontWeight: '800', color: Colors.white },
  arrowWrap: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
});
