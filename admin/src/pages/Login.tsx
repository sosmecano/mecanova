import { useState } from 'react';
import { adminApi } from '../services/api';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const sendOtp = async () => {
    setLoading(true);
    setError('');
    setOtpCode('');
    try {
      const data = await adminApi.sendOtp(phone);
      if (data.code) setOtpCode(data.code);
      setStep('code');
    } catch (e: any) {
      setError(e.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.verifyOtp(phone, code);
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        onLogin();
      }
    } catch (e: any) {
      setError(e.message || 'Erreur de vérification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Mecanova</h1>
        <p style={styles.subtitle}>Back-office administrateur</p>
        {error && <p style={styles.error}>{error}</p>}
        {step === 'phone' ? (
          <>
            <input
              style={styles.input}
              placeholder="Téléphone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <button onClick={sendOtp} disabled={loading} style={styles.button}>
              {loading ? 'Envoi...' : 'Envoyer le code'}
            </button>
          </>
        ) : (
          <>
            <p style={{ marginBottom: 16, color: '#666' }}>Code envoyé au {phone}</p>
            {otpCode && (
              <p style={{ marginBottom: 20, padding: '12px 16px', background: '#E8F0FE', borderRadius: 12, fontSize: 24, fontWeight: 700, letterSpacing: 4, color: '#1D1D1F' }}>
                {otpCode}
              </p>
            )}
            <input
              style={styles.input}
              placeholder="Code reçu"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
            <button onClick={verifyOtp} disabled={loading} style={styles.button}>
              {loading ? 'Vérification...' : 'Se connecter'}
            </button>
            <p style={{ marginTop: 12, fontSize: 12, color: '#999', cursor: 'pointer' }} onClick={() => setStep('phone')}>
              Changer de numéro
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F7' },
  card: { background: '#fff', padding: 48, borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: 400, width: '90%' },
  title: { fontSize: 32, fontWeight: '700', color: '#1D1D1F', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#86868B', marginBottom: 32 },
  input: { width: '100%', padding: '14px 16px', fontSize: 16, border: '1px solid #D2D2D7', borderRadius: 12, marginBottom: 16, outline: 'none', boxSizing: 'border-box' },
  button: { padding: '14px 32px', background: '#007AFF', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', width: '100%' },
  error: { color: '#FF3B30', marginBottom: 16, fontSize: 14 },
};