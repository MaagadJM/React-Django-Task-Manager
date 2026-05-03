const BASE_URL = 'http://127.0.0.1:8000/api';

function getToken() {
  return localStorage.getItem('access_token');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    // Token expired — send user back to login
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    window.location.href = '/';
  }

  return res;
}

export const api = {
  login: (username, password) =>
    fetch('http://127.0.0.1:8000/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }),

  register: (username, password, confirm_password) =>
    fetch('http://127.0.0.1:8000/api/auth/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, confirm_password }),
    }),

  getTasks:   ()           => request('/tasks/'),
  createTask: (data)       => request('/tasks/',       { method: 'POST',   body: JSON.stringify(data) }),
  updateTask: (id, data)   => request(`/tasks/${id}/`, { method: 'PATCH',  body: JSON.stringify(data) }),
  deleteTask: (id)         => request(`/tasks/${id}/`, { method: 'DELETE' }),

  searchOIG: ({ firstName, lastName, busName, npi }) =>
    fetch(`${BASE_URL}/oig/search/?firstName=${firstName}&lastName=${lastName}&busName=${busName}&npi=${npi}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    }),
  
};