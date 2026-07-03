import { useEffect, useState } from 'react';
import { adminApi } from '../services/api';

interface DashboardData {
  total_users: number;
  total_professionals: number;
  active_professionals: number;
  pending_professionals: number;
  total_missions: number;
  active_missions: number;
  total_revenue: number;
  total_commissions: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const d = await adminApi.dashboard();
        setData(d);
      } catch (e: any) {
        setError(e.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={styles.loading}>Chargement...</div>;
  if (error) return <div style={styles.loading}>Erreur : {error}</div>;

  const cards = [
    { label: 'Utilisateurs', value: data.total_users, color: '#007AFF' },
    { label: 'Pros actifs', value: data.active_professionals, color: '#34C759' },
    { label: 'Pros en attente', value: data.pending_professionals, color: '#FF9500' },
    { label: 'Missions en cours', value: data.active_missions, color: '#FF3B30' },
    { label: 'Missions totales', value: data.total_missions, color: '#5856D6' },
    { label: 'Revenus (FCFA)', value: data.total_revenue.toLocaleString(), color: '#007AFF' },
    { label: 'Commissions', value: data.total_commissions.toLocaleString(), color: '#34C759' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tableau de bord</h1>
      <div style={styles.grid}>
        {cards.map((card, i) => (
          <div key={i} style={{ ...styles.card, borderTopColor: card.color }}>
            <div style={styles.cardValue}>{card.value}</div>
            <div style={styles.cardLabel}>{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 32, backgroundColor: '#F5F5F7', minHeight: '100vh' },
  title: { fontSize: 28, fontWeight: '700', color: '#1D1D1F', marginBottom: 24 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 },
  card: {
    background: '#FFFFFF', borderRadius: 16, padding: 24,
    borderTopWidth: 4, borderTopStyle: 'solid',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  cardValue: { fontSize: 32, fontWeight: '700', color: '#1D1D1F', marginBottom: 4 },
  cardLabel: { fontSize: 14, color: '#86868B', fontWeight: '500' },
  loading: { padding: 32, fontSize: 18, color: '#86868B' },
};
