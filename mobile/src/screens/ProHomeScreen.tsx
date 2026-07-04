import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, Switch,
  TouchableOpacity, ActivityIndicator, Vibration, Animated, Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as SecureStore from 'expo-secure-store';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import Button from '../components/Button';
import Card from '../components/Card';
import { connectSocket, disconnectSocket, onReconnect } from '../services/socket';
import { api } from '../services/api';
import { playRing, stopRing } from '../../modules/sound-player/src/index';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProHomeScreen({ navigation }: any) {
  const [available, setAvailable] = useState(true);
  const [missions, setMissions] = useState<any[]>([]);
  const [pro, setPro] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [incoming, setIncoming] = useState<any>(null);
  const [incomingDistance, setIncomingDistance] = useState<number>(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const knownIdsRef = useRef<Set<string>>(new Set());
  const socketRef = useRef<any>(null);

  const fetchedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startPolling() {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(async () => {
      try {
        const nearby = await api.professionals.nearbyMissions();
        nearby.forEach((m: any) => {
          if (!knownIdsRef.current.has(m.id)) {
            knownIdsRef.current.add(m.id);
            showIncoming(m);
          }
        });
      } catch {}
    }, 15000);
  }

  function stopPolling() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function showIncoming(mission: any) {
    setIncoming(mission);
    setIncomingDistance(0);
    setMissions((prev) => {
      if (prev.find((m) => m.id === mission.id)) return prev;
      return [mission, ...prev];
    });
    Vibration.vibrate([0, 400, 200, 400, 200, 400], true);
    playRing();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      try {
        const [proData, missionsData] = await Promise.all([
          api.professionals.me(),
          api.professionals.missions('pending'),
        ]);
        setPro(proData);
        setAvailable(proData.is_available === true || proData.is_available === 'true');
        setMissions(missionsData);
        missionsData.forEach((m: any) => knownIdsRef.current.add(m.id));

        const token = await SecureStore.getItemAsync('auth_token');
        if (token && proData?.id) {
          const s = connectSocket(token);
          socketRef.current = s;
          s.emit('join:pro', proData.id);
          s.on('new:mission', (data: any) => {
            stopPolling();
            const mission = data.mission || data;
            if (!knownIdsRef.current.has(mission.id)) {
              knownIdsRef.current.add(mission.id);
              showIncoming(mission);
            }
          });
          s.on('disconnect', () => startPolling());
          if (!s.connected) startPolling();
        }
      } catch (e: any) {
        startPolling();
      } finally {
        setLoading(false);
      }
    })();

    const unsubReconnect = onReconnect(async () => {
      stopPolling();
      const token = await SecureStore.getItemAsync('auth_token');
      if (token && pro?.id) {
        const s = connectSocket(token);
        socketRef.current = s;
        s.emit('join:pro', pro.id);
        s.on('new:mission', (data: any) => {
          const mission = data.mission || data;
          if (!knownIdsRef.current.has(mission.id)) {
            knownIdsRef.current.add(mission.id);
            showIncoming(mission);
          }
        });
      }
    });

    return () => {
      Vibration.cancel();
      stopRing();
      stopPolling();
      unsubReconnect();
      if (socketRef.current) { socketRef.current.off('new:mission'); socketRef.current.off('disconnect'); disconnectSocket(); }
    };
  }, []);

  const toggleAvailability = async (val: boolean) => {
    setAvailable(val);
    try {
      await api.professionals.setAvailability(val);
    } catch (e: any) {
      setAvailable(!val);
    }
  };

  const acceptMission = async () => {
    if (!incoming) return;
    Vibration.cancel();
    stopRing();
    try {
      await api.missions.accept(incoming.id);
      setIncoming(null);
      navigation.navigate('ProMission', { missionId: incoming.id });
    } catch (e: any) {
      alert(e.message);
    }
  };

  const ignoreMission = () => {
    Vibration.cancel();
    stopRing();
    setIncoming(null);
    pulseAnim.setValue(1);
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

  return (
    <SafeAreaView style={styles.container}>
      {incoming ? (
        <View style={styles.incomingOverlay}>
          <View style={styles.incomingHeader}>
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.pulseIcon}>🔧</Text>
            </Animated.View>
            <Text style={styles.incomingTitle}>Nouvelle demande</Text>
            <Text style={styles.incomingDist}>{incomingDistance} km · {incoming.service_type || incoming.type || 'Service'}</Text>
          </View>

          <MapView
            style={styles.incomingMap}
            initialRegion={{
              latitude: parseFloat(incoming.location_lat) || 5.345,
              longitude: parseFloat(incoming.location_lng) || -4.015,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(incoming.location_lat) || 5.345,
                longitude: parseFloat(incoming.location_lng) || -4.015,
              }}
              title="Client"
              pinColor="#FF3B30"
            />
          </MapView>

          <View style={styles.incomingBottom}>
            <Card style={styles.clientInfoCard}>
              <View style={styles.clientInfoRow}>
                <View style={styles.clientAvatarSmall}>
                  <Text style={styles.clientAvatarSmallText}>
                    {(incoming.user_first_name?.[0] || incoming.user_last_name?.[0] || 'C')}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.clientInfoName}>
                    {[incoming.user_first_name, incoming.user_last_name].filter(Boolean).join(' ') || 'Client'}
                  </Text>
                  <Text style={styles.clientInfoAddress}>
                    📍 {incoming.location_address || incoming.address || 'Adresse inconnue'}
                  </Text>
                  <Text style={styles.clientInfoDesc}>
                    {incoming.description || ''}
                  </Text>
                </View>
              </View>
            </Card>

            <View style={styles.incomingActions}>
              <Button
                title="Accepter"
                onPress={acceptMission}
                style={styles.acceptBtn}
              />
              <Button
                title="Ignorer"
                onPress={ignoreMission}
                variant="outline"
                style={styles.ignoreBtn}
              />
            </View>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.businessName}>{pro?.business_name || 'Mon Garage'}</Text>
              <Text style={styles.businessSub}>{pro?.type || 'Pro'} · {pro?.city || ''}</Text>
            </View>
            <View style={styles.availRow}>
              <Text style={[styles.availDot, { color: available ? Colors.success : Colors.mediumGray }]}>●</Text>
              <Text style={styles.availLabel}>{available ? 'Disponible' : 'Indisponible'}</Text>
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
              <Text style={styles.statNum}>{typeof pro?.rating === 'number' ? pro.rating.toFixed(1) : pro?.rating || '—'}</Text>
              <Text style={styles.statLabel}>Note</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{pro?.rating_count || 0}</Text>
              <Text style={styles.statLabel}>Avis</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{missions.length}</Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nouvelles demandes</Text>
            <Text style={styles.badge}>{missions.length}</Text>
          </View>

          {missions.length === 0 ? (
            <Text style={styles.noRequests}>Aucune demande pour le moment</Text>
          ) : (
            missions.map((m: any, i: number) => {
              const clientName = [m.user_first_name, m.user_last_name].filter(Boolean).join(' ') || 'Client';
              return (
              <TouchableOpacity key={m.id || i} style={styles.requestCard} activeOpacity={0.7}>
                <View style={styles.requestTop}>
                  <View style={styles.requestAvatar}>
                    <Text style={styles.requestAvatarText}>{clientName[0] || '?'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.serviceLabel}>{m.type || 'Service'}</Text>
                    <Text style={styles.requestDetail}>{m.address || m.location_address || ''}</Text>
                    <Text style={styles.requestClient}>👤 {clientName}</Text>
                  </View>
                  {m.price_estimate && <Text style={styles.requestPrice}>{m.price_estimate} FCFA</Text>}
                </View>
                <View style={styles.requestActions}>
                  <Button title="Accepter" onPress={async () => {
                    try {
                      await api.missions.accept(m.id);
                      navigation.navigate('ProMission', { missionId: m.id });
                    } catch (e: any) {
                      alert(e.message);
                    }
                  }} style={{ flex: 1 }} />
                  <Button title="Ignorer" onPress={() => {}} variant="outline" style={{ flex: 1 }} />
                </View>
              </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: Spacing.lg },

  // Incoming overlay
  incomingOverlay: { flex: 1, backgroundColor: Colors.black },
  incomingHeader: {
    alignItems: 'center', paddingVertical: Spacing.lg,
    backgroundColor: Colors.black, paddingTop: Spacing.xl,
  },
  pulseCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  pulseIcon: { fontSize: 32 },
  incomingTitle: { fontSize: FontSize.title, fontWeight: '800', color: Colors.white },
  incomingDist: { fontSize: FontSize.body, color: Colors.mediumGray, marginTop: 2 },
  incomingMap: { flex: 1, width: SCREEN_WIDTH },
  incomingBottom: {
    backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: Spacing.lg, paddingBottom: Spacing.xl,
  },
  clientInfoCard: { padding: Spacing.md, marginBottom: Spacing.md },
  clientInfoRow: { flexDirection: 'row', alignItems: 'center' },
  clientAvatarSmall: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  clientAvatarSmallText: { fontSize: 16, fontWeight: '700', color: Colors.black },
  clientInfoName: { fontSize: FontSize.body, fontWeight: '700', color: Colors.black },
  clientInfoAddress: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  clientInfoDesc: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  incomingActions: { flexDirection: 'row', gap: Spacing.sm },
  acceptBtn: { flex: 2 },
  ignoreBtn: { flex: 1 },

  // Normal mode
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  businessName: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black },
  businessSub: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  availRow: { alignItems: 'flex-end' },
  availDot: { fontSize: 10, textAlign: 'right' },
  availLabel: { fontSize: FontSize.caption, color: Colors.mediumGray, marginBottom: 4, fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  statNum: { fontSize: FontSize.title, fontWeight: '800', color: Colors.black },
  statLabel: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.subtitle, fontWeight: '700', color: Colors.black, flex: 1 },
  badge: {
    backgroundColor: Colors.primary, color: Colors.black,
    fontSize: FontSize.caption, fontWeight: '700',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
    overflow: 'hidden',
  },
  requestCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md,
    marginBottom: Spacing.md, position: 'relative',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  requestTop: { flexDirection: 'row', marginBottom: Spacing.md },
  requestAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  requestAvatarText: { fontSize: 16, fontWeight: '700', color: Colors.black },
  serviceLabel: { fontSize: FontSize.body, fontWeight: '700', color: Colors.black },
  requestDetail: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  requestClient: { fontSize: FontSize.caption, color: Colors.mediumGray, marginTop: 1 },
  requestPrice: { fontSize: FontSize.caption, fontWeight: '600', color: Colors.black },
  requestActions: { flexDirection: 'row', gap: Spacing.sm },
  noRequests: { fontSize: FontSize.body, color: Colors.mediumGray, textAlign: 'center', marginTop: Spacing.xl },
});
