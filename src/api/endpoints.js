import { request } from './client';

export const api = {
  auth: {
    login: (credentials) => request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  },
  token: {
    create: (data) => request('/token/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getByGuid: (guid) => request(`/token/by-guid/${guid}`),
    getDisplayStatus: () => request('/token/display-status'),
  },
  admin: {
    getTokens: (params) => {
      const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
      return request(`/admin/tokens${qs}`);
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
    delete: (id) => request(`/forms/${id}`, 'DELETE')
  },
};
