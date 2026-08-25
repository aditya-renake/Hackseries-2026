const API_BASE = '/api';

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';

  const token = localStorage.getItem('hs_auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem('hs_auth_token');
    localStorage.removeItem('hs_auth_user');
  }

  const data = await res.json().catch(() => ({ success: false, message: 'Server response error' }));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
};

export const api = {
  // Auth API
  auth: {
    login: async (identifier, password) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, username: identifier, email: identifier, password }),
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('hs_auth_token', data.token);
        localStorage.setItem('hs_auth_user', JSON.stringify(data.user));
      }
      return data;
    },
    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
      return handleResponse(res);
    },
    logout: () => {
      localStorage.removeItem('hs_auth_token');
      localStorage.removeItem('hs_auth_user');
    },
    getUser: () => {
      try {
        return JSON.parse(localStorage.getItem('hs_auth_user')) || null;
      } catch (e) {
        return null;
      }
    },
    isAuthenticated: () => !!localStorage.getItem('hs_auth_token'),
  },

  // Registrants API
  registrants: {
    list: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/registrants?${query}`, { headers: getHeaders() });
      return handleResponse(res);
    },
    get: async (id) => {
      const res = await fetch(`${API_BASE}/registrants/${id}`, { headers: getHeaders() });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_BASE}/registrants`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    regenerateQR: async (id) => {
      const res = await fetch(`${API_BASE}/registrants/${id}/generate-qr`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/registrants/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getPublicPass: async (idOrEmail) => {
      const res = await fetch(`${API_BASE}/registrants/pass/${encodeURIComponent(idOrEmail)}`);
      return handleResponse(res);
    },
    simulateGoogleFormWebhook: async (payload) => {
      const res = await fetch(`${API_BASE}/registrants/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    exportCSVUrl: () => `${API_BASE}/registrants/export/csv`,
  },

  // Check-In API
  checkin: {
    scan: async ({ qrPayload, manualCode, scannedBy }) => {
      const res = await fetch(`${API_BASE}/checkin/scan`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ qrPayload, manualCode, scannedBy }),
      });
      return handleResponse(res);
    },
    getStatus: async (uniqueId) => {
      const res = await fetch(`${API_BASE}/checkin/status/${uniqueId}`, { headers: getHeaders() });
      return handleResponse(res);
    },
    undo: async (id) => {
      const res = await fetch(`${API_BASE}/checkin/undo/${id}`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getRecent: async () => {
      const res = await fetch(`${API_BASE}/checkin/recent`, { headers: getHeaders() });
      return handleResponse(res);
    },
  },

  // Email API
  email: {
    sendSingle: async (id) => {
      const res = await fetch(`${API_BASE}/email/send/${id}`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    sendBulk: async (options = {}) => {
      const res = await fetch(`${API_BASE}/email/bulk-send`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(options),
      });
      return handleResponse(res);
    },
  },

  // Event Config API
  event: {
    getConfig: async () => {
      const res = await fetch(`${API_BASE}/event`);
      return handleResponse(res);
    },
    updateConfig: async (data) => {
      const res = await fetch(`${API_BASE}/event`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },
};
