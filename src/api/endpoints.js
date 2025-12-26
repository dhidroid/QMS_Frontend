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
    getTokens: () => request('/admin/tokens'),
    updateStatus: (data) => request('/handler/update-status', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    callNext: (data) => request('/handler/call-next', {
      method: 'POST',
      body: JSON.stringify(data || {})
    }),
  },
};
