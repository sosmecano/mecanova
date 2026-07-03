import { useEffect, useState } from 'react';
import { adminApi } from '../services/api';

interface Payment {
  id: string;
  user_name: string;
  pro_name: string;
  amount: number;
  commission: number;
  method: string;
  status: string;
  created_at: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.payments();
        setPayments(data);
      } catch (e: any) {
        setError(e.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const commissions = payments.reduce((s, p) => s + (p.commission || 0), 0);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Paiements</h1>
      <div style={styles.summary}>
        <div style={styles.summaryCard}><span style={styles.summaryValue}>{total.toLocaleString()} FCFA</span><span style={styles.summaryLabel}>Total</span></div>
        <div style={styles.summaryCard}><span style={styles.summaryValue}>{commissions.toLocaleString()} FCFA</span><span style={styles.summaryLabel}>Commissions</span></div>
        <div style={styles.summaryCard}><span style={styles.summaryValue}>{payments.length}</span><span style={styles.summaryLabel}>Transactions</span></div>
      </div>
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Client</span><span>Pro</span><span>Montant</span><span>Commission</span><span>Mthode</span><span>Statut</span><span>Date</span>
        </div>
        {payments.map((p) => (
          <div key={p.id} style={styles.tableRow}>
            <span>{p.user_name || '-'}</span>
            <span>{p.pro_name || '-'}</span>
            <span style={{ fontWeight: 600 }}>{(p.amount || 0).toLocaleString()} FCFA</span>
            <span>{(p.commission || 0).toLocaleString()} FCFA</span>
            <span>{p.method || '-'}</span>
            <span>{p.status === 'completed' ? '✅' : p.status === 'pending' ? '⏳' : '❌'}</span>
            <span style={{ fontSize: 13, color: '#86868B' }}>{p.created_at?.slice(0, 10)}</span>
          </div>
        ))}
        {payments.length === 0 && <div style={styles.empty}>Aucun paiement trouv</div>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 32, backgroundColor: '#F5F5F7', minHeight: '100vh' },
  title: { fontSize: 28, fontWeight: '700', color: '#1D1D1F', marginBottom: 24 },
  summary: { display: 'flex', gap: 16, marginBottom: 24 },
  summaryCard: { background: '#fff', borderRadius: 16, padding: '20px 24px', flex: 1, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  summaryValue: { display: 'block', fontSize: 24, fontWeight: '700', color: '#1D1D1F' },
  summaryLabel: { display: 'block', fontSize: 13, color: '#86868B', marginTop: 4 },
  table: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  tableHeader: { display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 0.5fr 1fr', padding: '16px 20px', background: '#F5F5F7', fontWeight: 600, color: '#86868B', fontSize: 13 },
  tableRow: { display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 0.5fr 1fr', padding: '14px 20px', borderBottom: '1px solid #E5E5EA', alignItems: 'center', fontSize: 14 },
  empty: { padding: 24, textAlign: 'center', color: '#86868B' },
};
