import { useEffect, useState } from 'react';
import { adminApi } from '../services/api';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  phone: number | string;
  email: string;
  city: string;
  status: string;
  created_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.users();
      setUsers(data);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const suspend = async (id: string) => {
    if (!confirm('Suspendre cet utilisateur ?')) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}/suspend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('admin_token') },
      });
      if (!res.ok) throw new Error('Erreur lors de la suspension');
      load();
    } catch (e: any) {
      setError(e.message || 'Erreur de suspension');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Utilisateurs</h1>
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Nom</span><span>Email</span><span>Tlphone</span><span>Ville</span><span>Statut</span><span>Inscrit le</span><span>Actions</span>
        </div>
        {users.map((u) => (
          <div key={u.id} style={styles.tableRow}>
            <span style={{ fontWeight: 500 }}>{u.first_name} {u.last_name}</span>
            <span style={{ fontSize: 13 }}>{u.email || '-'}</span>
            <span>{String(u.phone || '')}</span>
            <span>{u.city || '-'}</span>
            <span>{u.status === 'suspended' ? ' Suspendu' : ' Actif'}</span>
            <span style={{ fontSize: 13, color: '#86868B' }}>{u.created_at?.slice(0, 10)}</span>
            <span>
              {u.status !== 'suspended' && (
                <button onClick={() => suspend(u.id)} style={styles.suspendBtn}>Suspendre</button>
              )}
            </span>
          </div>
        ))}
        {users.length === 0 && <div style={styles.empty}>Aucun utilisateur trouv</div>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 32, backgroundColor: '#F5F5F7', minHeight: '100vh' },
  title: { fontSize: 28, fontWeight: '700', color: '#1D1D1F', marginBottom: 24 },
  table: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  tableHeader: { display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 0.8fr 1fr 1fr', padding: '16px 20px', background: '#F5F5F7', fontWeight: 600, color: '#86868B', fontSize: 13 },
  tableRow: { display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 0.8fr 1fr 1fr', padding: '14px 20px', borderBottom: '1px solid #E5E5EA', alignItems: 'center', fontSize: 14 },
  empty: { padding: 24, textAlign: 'center', color: '#86868B' },
  suspendBtn: { padding: '6px 12px', background: '#FF3B30', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13 },
};
