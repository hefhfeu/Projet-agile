/**
 * Client API HTTP avec gestion des tokens JWT et fallback données de démonstration.
 */

const BASE_URL = 'http://localhost:8000/api';

export const authStorage = {
  getToken: () => localStorage.getItem('usine_access_token'),
  getRefreshToken: () => localStorage.getItem('usine_refresh_token'),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem('usine_user_profile') || 'null');
    } catch {
      return null;
    }
  },
  saveSession: (data) => {
    if (data.access) localStorage.setItem('usine_access_token', data.access);
    if (data.refresh) localStorage.setItem('usine_refresh_token', data.refresh);
    if (data.user) localStorage.setItem('usine_user_profile', JSON.stringify(data.user));
  },
  clearSession: () => {
    localStorage.removeItem('usine_access_token');
    localStorage.removeItem('usine_refresh_token');
    localStorage.removeItem('usine_user_profile');
  }
};

export async function apiRequest(endpoint, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (res.status === 401 && authStorage.getRefreshToken()) {
      // Tentative de refresh
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: authStorage.getRefreshToken() })
      });
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        authStorage.saveSession({ access: refreshData.access });
        headers['Authorization'] = `Bearer ${refreshData.access}`;
        const retryRes = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
        return await retryRes.json();
      } else {
        authStorage.clearSession();
      }
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error || `Erreur serveur (${res.status})`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API] Requête vers ${endpoint} indisponible, bascule sur données locales simulées :`, err.message);
    throw err;
  }
}

