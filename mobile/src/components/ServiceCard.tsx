import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';

interface Props {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

const ACCENTS: Record<string, string> = {
  'Mécanicien': '#FF6B35',
  'Urgence': '#FF3B30',
  'Remorquage': '#007AFF',
  'Garages': '#34C759',
};

export default function ServiceCard({ icon, title, subtitle, onPress }: Props) {
  const accent = ACCENTS[title] || '#666';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.ring, { borderColor: accent + '30' }]}>
        <View style={[styles.circle, { backgroundColor: accent }]}>
          <Text style={styles.emoji}>{icon}</Text>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 20,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  ring: {
    width: 64, height: 64, borderRadius: 32,
    borderWidth: 3,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  circle: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
  },
  emoji: { fontSize: 24 },
  title: {
    fontSize: FontSize.body, fontWeight: '700',
    color: Colors.black, textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.caption, color: 'rgba(0,0,0,0.5)',
    textAlign: 'center', marginTop: 2,
  },
});
