import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { connectSocket, disconnectSocket } from '../services/socket';
import { api } from '../services/api';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente', accepted: 'Acceptée', en_route: 'En route',
  arrived: 'Arrivé', in_progress: 'En cours', completed: 'Terminée', cancelled: 'Annulée',
};
const STATUS_COLORS: Record<string, string> = {
  pending: '#FFA500', accepted: '#4A90D9', en_route: '#4A90D9',
  arrived: '#34C759', in_progress: '#4A90D9', completed: '#34C759', cancelled: '#FF3B30',
};
const TYPE_ICONS: Record<string, string> = {
  emergency: '🚨', mechanic: '🔧', tow_truck: '🚛', garage: '🏪',
};

function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

export default function TrackingScreen({ navigation, route }: any) {
  const paramMissionId = route?.params?.missionId;
  const [activeMission, setActiveMission] = useState<any>(null);
  const [proLocation, setProLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [followMode, setFollowMode] = useState(true);
  const followRef = useRef(true);
  const mapRef = useRef<MapView>(null);

  const recenterPro = () => {
    if (!proLocation) return;
    const mission = activeMission;
    const hasDeparture = mission?.location_lat && mission?.location_lng;
    if (hasDeparture) {
      mapRef.current?.fitToCoordinates([
        { latitude: mission.location_lat, longitude: mission.location_lng },
        { latitude: proLocation.lat, longitude: proLocation.lng },
      ], {
        edgePadding: { top: 40, right: 20, bottom: 50, left: 20 },
        animated: true,
      });
    } else {
      mapRef.current?.animateToRegion({
        latitude: proLocation.lat, longitude: proLocation.lng,
        latitudeDelta: 0.005, longitudeDelta: 0.005,
      }, 500);
    }
  };

  useEffect(() => {
    let socket: any = null;
    (async () => {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) socket = connectSocket(token);

      if (paramMissionId) {
        try {
          const mission = await api.missions.get(paramMissionId);
          setActiveMission(mission);
          if (socket) {
            socket.emit('join:mission', paramMissionId);
            socket.on('tracking:update', (data: { lat: number; lng: number }) => {
              setProLocation(data);
              if (followRef.current) {
                const hasDeparture = mission?.location_lat && mission?.location_lng;
                if (hasDeparture) {
                  mapRef.current?.fitToCoordinates([
                    { latitude: mission.location_lat, longitude: mission.location_lng },
                    { latitude: data.lat, longitude: data.lng },
                  ], {
                    edgePadding: { top: 40, right: 20, bottom: 50, left: 20 },
                    animated: true,
                  });
                } else {
                  mapRef.current?.animateToRegion({
                    latitude: data.lat, longitude: data.lng,
                    latitudeDelta: 0.005, longitudeDelta: 0.005,
                  }, 1000);
                }
              }
            });
            socket.on('mission:status', (data: any) => { setActiveMission((prev: any) => prev ? { ...prev, ...data } : data); });
          }
        } catch {}
        setLoading(false);
        return;
      }

      try {
        const missions = await api.users.missions();
        const active = missions.find((m: any) =>
          ['accepted', 'en_route', 'arrived', 'in_progress'].includes(m.status)
        );
        if (active) {
          setActiveMission(active);
          if (socket) {
            socket.emit('join:mission', active.id);
            socket.on('tracking:update', (data: { lat: number; lng: number }) => {
              setProLocation(data);
              if (followRef.current) {
                const hasDeparture = active?.location_lat && active?.location_lng;
                if (hasDeparture) {
                  mapRef.current?.fitToCoordinates([
                    { latitude: active.location_lat, longitude: active.location_lng },
                    { latitude: data.lat, longitude: data.lng },
                  ], {
                    edgePadding: { top: 40, right: 20, bottom: 50, left: 20 },
                    animated: true,
                  });
                } else {
                  mapRef.current?.animateToRegion({
                    latitude: data.lat, longitude: data.lng,
                    latitudeDelta: 0.005, longitudeDelta: 0.005,
                  }, 1000);
                }
              }
            });
            socket.on('mission:status', (data: any) => { setActiveMission((prev: any) => prev ? { ...prev, ...data } : data); });
          }
        } else {
          setHistory(missions);
        }
      } catch {}
      setLoading(false);
    })();
    return () => {
      if (socket) { socket.off('tracking:update'); socket.off('mission:status'); }
    };
  }, []);

  if (activeMission?.id) {
    const proName = activeMission?.pro_first_name
      ? `${activeMission.pro_first_name} ${activeMission.pro_last_name}`
      : activeMission?.pro_first_name || 'Professionnel';
    const proRating = activeMission?.pro_rating ? activeMission.pro_rating.toFixed(1) : '?';
    const proType = activeMission?.service_type || 'Mécanicien';
    const hasDeparture = activeMission?.location_lat && activeMission?.location_lng;
    const hasDestinationCoords = activeMission?.destination_lat && activeMission?.destination_lng;

    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: activeMission?.location_lat || 5.345,
            longitude: activeMission?.location_lng || -4.015,
            latitudeDelta: 0.015, longitudeDelta: 0.015,
          }}
          showsUserLocation
          showsMyLocationButton={false}
          onPanDrag={() => {
            setFollowMode(false);
            followRef.current = false;
          }}
        >
          {hasDeparture && (
            <Marker coordinate={{ latitude: activeMission.location_lat, longitude: activeMission.location_lng }} title="Départ" pinColor="#4A90D9" />
          )}
          {hasDestinationCoords && (
            <Marker coordinate={{ latitude: activeMission.destination_lat, longitude: activeMission.destination_lng }} title="Destination" pinColor="#FF3B30" />
          )}
          {proLocation && (
            <Marker coordinate={{ latitude: proLocation.lat, longitude: proLocation.lng }} title={proName} pinColor={Colors.primary} />
          )}
        </MapView>

        <SafeAreaView style={styles.overlay} pointerEvents="box-none">
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={Colors.black} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              <TouchableOpacity style={[styles.iconBtn, followMode && styles.iconBtnActive]} onPress={() => {
                const next = !followRef.current;
                setFollowMode(next);
                followRef.current = next;
                if (next) recenterPro();
              }}>
                <Ionicons name="locate" size={22} color={followMode ? Colors.primary : Colors.black} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setShowInfo(!showInfo)}>
                <Ionicons name={showInfo ? 'information-circle' : 'information-circle-outline'} size={22} color={Colors.black} />
              </TouchableOpacity>
            </View>
          </View>

          {activeMission?.status === 'arrived' && (
            <View style={styles.arrivalBanner}>
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
              <Text style={styles.arrivalBannerText}>Le mécanicien est arrivé !</Text>
            </View>
          )}

          {showInfo && (
            <View style={styles.infoCard}>
              <View style={styles.proRow}>
                <View style={[styles.proAvatar, { backgroundColor: Colors.primary }]}>
                  <Text style={styles.proAvatarText}>{proName.split(' ').map((n: string) => n[0]).join('') || '?'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.proName}>{proName}</Text>
                  <Text style={styles.proSub}>⭐ {proRating} · {proType}</Text>
                </View>
                <Text style={styles.eta}>{activeMission?.eta || '8 min'}</Text>
              </View>
              <View style={styles.trackingBar}>
                <View style={[styles.trackingProgress, { width: activeMission?.progress || '60%' }]} />
              </View>
              {activeMission?.destination_address && (
                <Text style={styles.destinationText}>🏁 {activeMission.destination_address}</Text>
              )}
            </View>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => { if (activeMission?.pro_phone) Linking.openURL(`tel:${activeMission.pro_phone}`).catch(() => {}); }}>
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Appeler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
              <Ionicons name="chatbubble" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.sos }]}>
              <Ionicons name="alert-circle" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>SOS</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.historyContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activité</Text>
        <Text style={styles.headerSub}>Vos missions récentes</Text>
      </View>
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : history.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Aucune mission</Text>
          <Text style={styles.emptySub}>Vous n'avez pas encore de mission{'\n'}Utilisez l'accueil pour en créer une</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {history.map((m: any, i: number) => (
            <TouchableOpacity
              key={m.id || i}
              style={styles.missionCard}
              onPress={() => {
                if (['accepted', 'en_route', 'arrived', 'in_progress'].includes(m.status)) {
                  navigation.replace('Tracking', { missionId: m.id });
                }
              }}
              activeOpacity={m.status === 'completed' || m.status === 'cancelled' ? 1 : 0.7}
            >
              <View style={styles.missionLeft}>
                <Text style={styles.missionIcon}>{TYPE_ICONS[m.service_type] || '🔧'}</Text>
              </View>
              <View style={styles.missionInfo}>
                <Text style={styles.missionType}>
                  {m.service_type === 'emergency' ? 'SOS Urgence'
                    : m.service_type === 'mechanic' ? 'Mécanicien'
                    : m.service_type === 'tow_truck' ? 'Remorquage'
                    : m.service_type || 'Mission'}
                </Text>
                {m.pro_first_name && (
                  <Text style={styles.missionPro}>{m.pro_first_name} {m.pro_last_name}</Text>
                )}
                <Text style={styles.missionDate}>{formatDate(m.created_at)}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLORS[m.status] || Colors.mediumGray) + '20' }]}>
                <Text style={[styles.statusText, { color: STATUS_COLORS[m.status] || Colors.mediumGray }]}>
                  {STATUS_LABELS[m.status] || m.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingTop: Spacing.sm,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  iconBtnActive: {
    borderWidth: 2, borderColor: Colors.primary,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    marginHorizontal: Spacing.md, marginTop: Spacing.sm,
    borderRadius: BorderRadius.xl, padding: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  proRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  proAvatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  proAvatarText: { fontSize: 16, fontWeight: '700', color: Colors.black },
  proName: { fontSize: FontSize.body, fontWeight: '700', color: Colors.black },
  proSub: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  eta: { fontSize: FontSize.subtitle, fontWeight: '800', color: Colors.black },
  trackingBar: { height: 6, backgroundColor: Colors.lightGray, borderRadius: 3, overflow: 'hidden' },
  trackingProgress: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  destinationText: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: Spacing.sm },
  actionRow: {
    position: 'absolute', bottom: 40, left: Spacing.md, right: Spacing.md,
    flexDirection: 'row', gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 14, borderRadius: BorderRadius.xl,
  },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.body },
  historyContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm, backgroundColor: Colors.white },
  headerTitle: { fontSize: FontSize.title, fontWeight: '800', color: Colors.black },
  headerSub: { fontSize: FontSize.body, color: Colors.mediumGray, marginTop: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  emptyIcon: { fontSize: 60, marginBottom: Spacing.lg },
  emptyTitle: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black, marginBottom: Spacing.sm },
  emptySub: { fontSize: FontSize.body, color: Colors.mediumGray, textAlign: 'center', lineHeight: 22 },
  list: { padding: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.xxl },
  missionCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginBottom: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  missionLeft: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF5E0',
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  missionIcon: { fontSize: 22 },
  missionInfo: { flex: 1 },
  missionType: { fontSize: FontSize.body, fontWeight: '700', color: Colors.black },
  missionPro: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  missionDate: { fontSize: FontSize.caption, color: Colors.textSecondary, marginTop: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: FontSize.caption, fontWeight: '700' },
  arrivalBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#34C759', paddingVertical: 10, paddingHorizontal: 16,
    marginHorizontal: Spacing.md, marginTop: Spacing.sm, borderRadius: BorderRadius.lg,
  },
  arrivalBannerText: { color: '#fff', fontWeight: '700', fontSize: FontSize.body },
});
