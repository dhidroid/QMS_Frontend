import { request } from './client';

export const api = {
  auth: {
    login: (credentials) => request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    getProfile: () => request('/auth/profile'),
    updateProfile: (data) => request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },
  token: {
    create: (data) => request('/token/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getByGuid: (guid) => request(`/token/by-guid/${guid}`),
    getDisplayStatus: () => request('/token/display-status'),
    search: (term) => request('/token/search', {
      method: 'POST',
      body: JSON.stringify({ searchTerm: term }),
    }),
  },
  admin: {
    getTokens: (params) => {
      const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
      return request(`/admin/tokens${qs}`);
    },
    getAllTokens: () => request('/admin/all-tokens'),
    getTickets: (params) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/tickets?${query}`);
    },
    updateStatus: (data) => request('/handler/update-status', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    callNext: (data) => request('/handler/call-next', {
      method: 'POST',
      body: JSON.stringify(data || {})
    }),
    createUser: (data) => request('/admin/create-user', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getUsers: () => request('/admin/users'),
    getPushSubs: () => request('/admin/push-subs'),
  },
  forms: {
    save: (data) => request('/forms/save', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    list: () => request('/forms'),
    get: (id) => request(`/forms/${id}`),
    getDefault: () => request('/forms/default'),
    delete: (id) => request(`/forms/${id}`, { method: 'DELETE' })
  },
  notification: {
    subscribe: (subscription) => request('/notification/subscribe', {
      method: 'POST',
      body: JSON.stringify({ subscription }),
    }),
  },
  analytics: {
    get: (range) => request(`/analytics${range ? `?range=${range}` : ''}`),
  }
};
