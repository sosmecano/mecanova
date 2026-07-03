import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import Button from '../components/Button';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import { api } from '../services/api';

const GARAGE_COLORS = ['#FF6B35', '#004E89', '#1A936F', '#7B2D8E', '#D81159', '#218380'];

function isOpenNow(hoursJson: string): boolean {
  try {
    const hours = JSON.parse(hoursJson);
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const now = new Date();
    const day = dayNames[now.getDay()];
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const range = hours[day];
    if (!range || range === 'closed' || range === 'fermé') return false;
    const [start, end] = range.split('-');
    return time >= start && time <= end;
  } catch { return false; }
}

function formatHours(hoursJson: string): string {
  try {
    const hours = JSON.parse(hoursJson);
    const dayNames = { mon: 'Lun', tue: 'Mar', wed: 'Mer', thu: 'Jeu', fri: 'Ven', sat: 'Sam', sun: 'Dim' };
    const days = Object.entries(dayNames) as [string, string][];
    const parts = days.map(([key, label]) => {
      const range = hours[key];
      if (!range || range === 'closed') return `${label} : Fermé`;
      return `${label} : ${range}`;
    });
    return parts.join('\n');
  } catch { return ''; }
}

function formatPrices(pricesJson: string): [string, string][] {
  try {
    const prices = JSON.parse(pricesJson);
    return Object.entries(prices) as [string, string][];
  } catch { return []; }
}

function callPhone(phone: any) {
  if (!phone) return;
  const str = String(phone);
  const clean = str.replace(/[\s\-]/g, '');
  Linking.openURL(`tel:${clean}`).catch(() => {});
}

export default function GaragesScreen({ navigation }: any) {
  const [garages, setGarages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGarages = async () => {
    setError(null);
    try {
      const data = await api.garages.list();
      setGarages(data);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGarages();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Garages</Text>
        <Text style={styles.subtitle}>{garages.length} garage(s) à proximité</Text>
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={{ alignItems: 'center', marginTop: Spacing.xl, paddingHorizontal: Spacing.lg }}>
          <Text style={{ color: Colors.mediumGray, textAlign: 'center', marginBottom: Spacing.md }}>{error}</Text>
          <Button title="Réessayer" onPress={loadGarages} variant="outline" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {garages.length === 0 ? (
            <Text style={styles.empty}>Aucun garage trouvé</Text>
          ) : (
            garages.map((g, i) => {
              const color = GARAGE_COLORS[i % GARAGE_COLORS.length];
              const open = isOpenNow(g.hours);
              const prices = formatPrices(g.indicative_prices);
              return (
                <View key={g.id || i} style={styles.card}>
                  <View style={[styles.cardTop, { backgroundColor: color }]}>
                    <Text style={styles.cardName}>{g.name}</Text>
                    <View style={[styles.badge, open ? styles.badgeOpen : styles.badgeClosed]}>
                      <View style={[styles.badgeDot, { backgroundColor: open ? '#34C759' : '#FF3B30' }]} />
                      <Text style={[styles.badgeText, { color: open ? '#34C759' : '#FF3B30' }]}>
                        {open ? 'Ouvert' : 'Fermé'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    {Array.isArray(g.specialties) && g.specialties.length > 0 && (
                      <View style={styles.tagsRow}>
                        {g.specialties.map((s: string, si: number) => (
                          <View key={s || String(si)} style={[styles.tag, { backgroundColor: color + '15' }]}>
                            <Text style={[styles.tagText, { color }]}>{s}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={styles.infoRow}>
                      <Text style={styles.infoIcon}>📍</Text>
                      <Text style={styles.infoText}>{g.address}</Text>
                    </View>

                    {g.phone && (
                      <TouchableOpacity style={styles.infoRow} onPress={() => callPhone(g.phone)}>
                        <Text style={styles.infoIcon}>📞</Text>
                        <Text style={[styles.infoText, styles.phoneText]}>{g.phone}</Text>
                      </TouchableOpacity>
                    )}

                    {prices.length > 0 && (
                      <View style={styles.pricesWrap}>
                        <Text style={styles.pricesTitle}>Prix indicatifs</Text>
                        {prices.map(([service, price], pi) => (
                          <View key={service || String(pi)} style={styles.priceRow}>
                            <Text style={styles.priceService}>{service}</Text>
                            <Text style={styles.priceValue}>{price} FCFA</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <TouchableOpacity style={styles.hoursBtn} onPress={() => {
                      const msg = formatHours(g.hours);
                      if (msg) alert(`Horaires d'ouverture\n\n${msg}`);
                    }}>
                      <Text style={styles.hoursBtnText}>🕐 Voir les horaires</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.cardFooter}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => callPhone(g.phone)}>
                      <Text style={styles.actionBtnText}>📞 Contacter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]} onPress={() => {
                      navigation.navigate('GarageMap', { name: g.name, address: g.address, lat: g.lat, lng: g.lng, phone: g.phone });
                    }}>
                      <Text style={[styles.actionBtnText, { color: Colors.black }]}>📍 Y aller</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { fontSize: FontSize.body, color: Colors.mediumGray, textAlign: 'center', paddingVertical: Spacing.xxl },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  title: { fontSize: FontSize.largeTitle, fontWeight: '800', color: Colors.black },
  subtitle: { fontSize: FontSize.body, color: Colors.mediumGray, marginTop: 2 },
  list: { padding: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.xxl },

  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },

  cardTop: {
    padding: Spacing.lg, paddingBottom: Spacing.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cardName: { fontSize: FontSize.subtitle, fontWeight: '800', color: Colors.white, flex: 1, marginRight: Spacing.sm },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeOpen: { backgroundColor: 'rgba(255,255,255,0.25)' },
  badgeClosed: { backgroundColor: 'rgba(255,255,255,0.2)' },
  badgeDot: { width: 7, height: 7, borderRadius: 4, marginRight: 5 },
  badgeText: { fontSize: FontSize.caption, fontWeight: '700' },

  cardBody: { padding: Spacing.lg, paddingTop: Spacing.md },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.md },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: FontSize.caption, fontWeight: '600' },

  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoIcon: { fontSize: 15, marginRight: 8 },
  infoText: { fontSize: FontSize.body, color: Colors.mediumGray, flex: 1 },
  phoneText: { color: Colors.primaryDark, fontWeight: '600' },

  pricesWrap: { backgroundColor: '#FAFAFA', borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.sm, marginBottom: Spacing.sm },
  pricesTitle: { fontSize: FontSize.caption, fontWeight: '700', color: Colors.mediumGray, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  priceService: { fontSize: FontSize.body, color: Colors.black, textTransform: 'capitalize' },
  priceValue: { fontSize: FontSize.body, fontWeight: '700', color: Colors.black },

  hoursBtn: { alignSelf: 'flex-start', marginTop: 4 },
  hoursBtnText: { fontSize: FontSize.caption, color: Colors.mediumGray, fontWeight: '600' },

  cardFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  actionBtn: {
    flex: 1, paddingVertical: Spacing.md, alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  actionBtnSecondary: { backgroundColor: '#F5F5F5' },
  actionBtnText: { fontSize: FontSize.body, fontWeight: '700', color: Colors.black },
});
