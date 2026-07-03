const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchWithRetry(path: string, options: RequestInit = {}, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, { ...options });
      if (!res.ok && i < retries - 1 && res.status >= 500) continue;
      return res;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
  throw new Error('Failed to fetch');
}

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetchWithRetry(path, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.reload();
    }
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Request failed');
  }
  return res.json();
}

export const adminApi = {
  sendOtp: (phone: string) => request('/auth/send-otp', {
    method: 'POST', body: JSON.stringify({ phone }),
  }),
  verifyOtp: (phone: string, code: string) => request('/auth/admin-verify', {
    method: 'POST', body: JSON.stringify({ phone, code }),
  }),
  dashboard: () => request('/admin/dashboard'),
  professionals: (status?: string) => request(`/admin/professionals?status=${status || 'all'}`),
  validatePro: (id: string, action: string) =>
    request(`/admin/professionals/${id}/validate`, {
      method: 'PATCH',
      body: JSON.stringify({ action }),
    }),
  users: () => request('/admin/users'),
  suspendUser: (id: string) => request(`/admin/users/${id}/suspend`, { method: 'PATCH' }),
  missions: (status?: string) => request(`/admin/missions?status=${status || 'all'}`),
  payments: () => request('/admin/payments'),
};