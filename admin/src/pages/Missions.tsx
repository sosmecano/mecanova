import { useEffect, useState } from 'react';
import { adminApi } from '../services/api';

interface Mission {
  id: string;
  user_name: string;
  pro_name: string;
  service_type: string;
  status: string;
  location_address: string;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  accepted: 'Accepte',
  en_route: 'En route',
  arrived: 'Arriv',
  in_progress: 'En cours',
  completed: 'Termine',
  cancelled: 'Annul',
};

export default function Missions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.missions(filter);
      setMissions(data);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  if (loading) return <div style={styles.loading}>Chargement...</div>;
  if (error) return <div style={styles.loading}>Erreur : {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Missions</h1>
      <div style={styles.filters}>
        {['all', 'pending', 'accepted', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...styles.filterBtn, background: filter === f ? '#007AFF' : '#E5E5EA', color: filter === f ? '#fff' : '#1D1D1F' }}>
            {statusLabels[f] || f}
          </button>
        ))}
      </div>
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Client</span><span>Pro</span><span>Service</span><span>Adresse</span><span>Statut</span><span>Date</span>
        </div>
        {missions.map((m) => (
          <div key={m.id} style={styles.tableRow}>
            <span style={{ fontWeight: 500 }}>{m.user_name || '-'}</span>
            <span>{m.pro_name || '-'}</span>
            <span>{m.service_type}</span>
            <span style={{ fontSize: 13, color: '#86868B' }}>{m.location_address || '-'}</span>
            <span>{statusLabels[m.status] || m.status}</span>
            <span style={{ fontSize: 13, color: '#86868B' }}>{m.created_at?.slice(0, 10)}</span>
          </div>
        ))}
        {missions.length === 0 && <div style={styles.empty}>Aucune mission trouve</div>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 32, backgroundColor: '#F5F5F7', minHeight: '100vh' },
  title: { fontSize: 28, fontWeight: '700', color: '#1D1D1F', marginBottom: 24 },
  filters: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  filterBtn: { padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  table: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  tableHeader: { display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 2fr 1fr 1fr', padding: '16px 20px', background: '#F5F5F7', fontWeight: 600, color: '#86868B', fontSize: 13 },
  tableRow: { display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 2fr 1fr 1fr', padding: '14px 20px', borderBottom: '1px solid #E5E5EA', alignItems: 'center', fontSize: 14 },
  empty: { padding: 24, textAlign: 'center', color: '#86868B' },
  loading: { padding: 32, fontSize: 18, color: '#86868B' },
};
