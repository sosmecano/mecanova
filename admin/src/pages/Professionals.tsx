import { useEffect, useState } from 'react';
import { adminApi } from '../services/api';

interface Professional {
  id: string;
  first_name: string;
  last_name: string;
  type: string;
  phone: string;
  status: string;
  business_name: string;
  specialties: string[];
  created_at: string;
}

export default function Professionals() {
  const [pros, setPros] = useState<Professional[]>([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.professionals(filter);
      setPros(data);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const validate = async (id: string, action: string) => {
    setError(null);
    try {
      await adminApi.validatePro(id, action);
      load();
    } catch (e: any) {
      setError(e.message || 'Erreur de validation');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Professionnels</h1>
      <div style={styles.filters}>
        {['all', 'pending', 'active', 'suspended'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...styles.filterBtn, background: filter === f ? '#007AFF' : '#E5E5EA', color: filter === f ? '#fff' : '#1D1D1F' }}>
            {f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : f === 'active' ? 'Actifs' : 'Suspendus'}
          </button>
        ))}
      </div>

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Nom</span><span>Type</span><span>Téléphone</span><span>Structure</span><span>Statut</span><span>Actions</span>
        </div>
        {pros.map((p) => (
          <div key={p.id} style={styles.tableRow}>
            <span style={{ fontWeight: 500 }}>{p.first_name} {p.last_name}</span>
            <span>{p.type === 'mechanic' ? '🔧 Mécanicien' : p.type === 'tow_truck' ? '🚛 Remorqueur' : '🏪 Garage'}</span>
            <span>{p.phone}</span>
            <span>{p.business_name || '-'}</span>
            <span>{p.status === 'active' ? '✅' : p.status === 'pending' ? '⏳' : '⛔'}</span>
            <span>
              {p.status === 'pending' && (
                <>
                  <button onClick={() => validate(p.id, 'approve')} style={styles.approveBtn}>✅ Valider</button>
                  <button onClick={() => validate(p.id, 'reject')} style={styles.rejectBtn}>❌ Refuser</button>
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 32, backgroundColor: '#F5F5F7', minHeight: '100vh' },
  title: { fontSize: 28, fontWeight: '700', color: '#1D1D1F', marginBottom: 24 },
  filters: { display: 'flex', gap: 8, marginBottom: 24 },
  filterBtn: { padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  table: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr 1.5fr', padding: '16px 20px', background: '#F5F5F7', fontWeight: 600, color: '#86868B', fontSize: 13 },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr 1.5fr', padding: '14px 20px', borderBottom: '1px solid #E5E5EA', alignItems: 'center', fontSize: 14 },
  approveBtn: { padding: '6px 12px', background: '#34C759', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', marginRight: 8, fontWeight: 600 },
  rejectBtn: { padding: '6px 12px', background: '#FF3B30', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 },
};
