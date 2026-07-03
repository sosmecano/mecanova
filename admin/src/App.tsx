import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Professionals from './pages/Professionals';
import Missions from './pages/Missions';
import Payments from './pages/Payments';
import UsersPage from './pages/Users';
import { adminApi } from './services/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [page, setPage] = useState<'dashboard' | 'professionals' | 'missions' | 'payments' | 'users'>('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { setChecking(false); return; }
    adminApi.dashboard()
      .then(() => setIsLoggedIn(true))
      .catch(() => { localStorage.removeItem('admin_token'); })
      .finally(() => setChecking(false));
  }, []);

  if (checking) return null;

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div style={styles.layout}>
      <nav style={styles.sidebar}>
        <h2 style={styles.logo}>MecaCI</h2>
        <p style={styles.logoSub}>Admin</p>
        <button onClick={() => setPage('dashboard')} style={{ ...styles.navBtn, background: page === 'dashboard' ? '#007AFF' : 'transparent', color: page === 'dashboard' ? '#fff' : '#1D1D1F' }}>📊 Dashboard</button>
        <button onClick={() => setPage('professionals')} style={{ ...styles.navBtn, background: page === 'professionals' ? '#007AFF' : 'transparent', color: page === 'professionals' ? '#fff' : '#1D1D1F' }}>👥 Professionnels</button>
        <button onClick={() => setPage('missions')} style={{ ...styles.navBtn, background: page === 'missions' ? '#007AFF' : 'transparent', color: page === 'missions' ? '#fff' : '#1D1D1F' }}>📋 Missions</button>
        <button onClick={() => setPage('payments')} style={{ ...styles.navBtn, background: page === 'payments' ? '#007AFF' : 'transparent', color: page === 'payments' ? '#fff' : '#1D1D1F' }}>💳 Paiements</button>
        <button onClick={() => setPage('users')} style={{ ...styles.navBtn, background: page === 'users' ? '#007AFF' : 'transparent', color: page === 'users' ? '#fff' : '#1D1D1F' }}>👤 Utilisateurs</button>
        <div style={{ flex: 1 }} />
        <button onClick={() => { localStorage.removeItem('admin_token'); setIsLoggedIn(false); }}
          style={{ ...styles.navBtn, color: '#FF3B30' }}>Dconnexion</button>
      </nav>
      <main style={styles.main}>
        {page === 'dashboard' && <Dashboard />}
        {page === 'professionals' && <Professionals />}
        {page === 'missions' && <Missions />}
        {page === 'payments' && <Payments />}
        {page === 'users' && <UsersPage />}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: 240, background: '#fff', borderRight: '1px solid #E5E5EA', padding: 24, display: 'flex', flexDirection: 'column', gap: 4 },
  logo: { fontSize: 22, fontWeight: '700', color: '#1D1D1F', margin: 0 },
  logoSub: { fontSize: 12, color: '#86868B', marginBottom: 24, marginTop: 2 },
  navBtn: { padding: '10px 16px', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 500, fontSize: 14, textAlign: 'left' as const, width: '100%' },
  main: { flex: 1, background: '#F5F5F7' },
};
