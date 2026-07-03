import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Button from '../components/Button';
import * as Location from 'expo-location';
import { Colors, FontSize, Spacing } from '../constants/theme';
import Input from '../components/Input';
import { api } from '../services/api';

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [pros, setPros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPros = async () => {
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      const data = await api.missions.nearbyPros(loc.coords.latitude, loc.coords.longitude);
      setPros(data);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPros();
  }, []);

  const filtered = query
    ? pros.filter(p => {
        const fullName = `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase();
        return fullName.includes(query.toLowerCase());
      })
    : pros;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Input
          placeholder="Que vous faut-il ?"
          value={query}
          onChangeText={setQuery}
          leftIcon="🔍"
          autoFocus
          style={styles.input}
        />
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={{ alignItems: 'center', marginTop: Spacing.xl, paddingHorizontal: Spacing.lg }}>
          <Text style={{ color: Colors.mediumGray, textAlign: 'center', marginBottom: Spacing.md }}>{error}</Text>
          <Button title="Réessayer" onPress={loadPros} variant="outline" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>Aucun professionnel trouvé</Text>
          }
          renderItem={({ item: p }) => {
            const initials = `${(p.first_name?.[0] || '')}${(p.last_name?.[0] || '')}` || '?';
            return (
              <TouchableOpacity style={styles.item}>
                <View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.name}>{p.first_name} {p.last_name}</Text>
                  <Text style={styles.detail}>
                    ⭐ {p.rating?.toFixed(1) || '?'} · {p.type || 'Pro'}{p.distance ? ` · ${p.distance.toFixed(1)} km` : ''}
                  </Text>
                </View>
                {p.estimated_price && <Text style={styles.price}>{p.estimated_price}</Text>}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 20,
    color: Colors.black,
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  list: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.black,
  },
  detail: {
    fontSize: FontSize.caption,
    color: Colors.mediumGray,
    marginTop: 1,
  },
  price: {
    fontSize: FontSize.caption,
    fontWeight: '600',
    color: Colors.mediumGray,
  },
  empty: {
    fontSize: FontSize.body,
    color: Colors.mediumGray,
    textAlign: 'center',
    paddingVertical: Spacing.xxl,
  },
});
