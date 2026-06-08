const BASE = 'http://localhost:8085/api';

export const employeeApi = {
  getAll: () => fetch(`${BASE}/employees`).then(r => r.json()),
  getById: (id) => fetch(`${BASE}/employees/${id}`).then(r => r.json()),
  search: (name) => fetch(`${BASE}/employees/search?name=${encodeURIComponent(name)}`).then(r => r.json()),
  getByDept: (dept) => fetch(`${BASE}/employees/department/${encodeURIComponent(dept)}`).then(r => r.json()),
  create: (body) => fetch(`${BASE}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json()),
  update: (id, body) => fetch(`${BASE}/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json()),
  delete: (id) => fetch(`${BASE}/employees/${id}`, { method: 'DELETE' }),
  ask: (id, question) => fetch(`${BASE}/employees/${id}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  }).then(r => r.json()),
};

export const aiApi = {
  chat: (message) => fetch(`${BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  }).then(r => r.json()),
  health: () => fetch(`${BASE}/ai/health`).then(r => r.text()),
};
