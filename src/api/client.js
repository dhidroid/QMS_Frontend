// Use current hostname to allow mobile access on same network
const API_BASE = `http://localhost:4000/api`;

export async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API Request Failed');
    }

    return await response.json();
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}
