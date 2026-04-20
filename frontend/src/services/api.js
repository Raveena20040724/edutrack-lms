// src/services/api.js
// Connects React frontend to Django backend

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getAccessToken  = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const setTokens = (access, refresh) => {
  localStorage.setItem('access_token',  access);
  localStorage.setItem('refresh_token', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// ── Core fetch with auto token refresh ───────────────────────────────────────
async function request(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  if (options.body instanceof FormData) delete headers['Content-Type'];

  let response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  // Auto refresh token if expired
  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await fetch(`${BASE_URL}/auth/token/refresh/`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refresh: getRefreshToken() }),
    });

    if (refreshed.ok) {
      const data = await refreshed.json();
      setTokens(data.access, getRefreshToken());
      headers['Authorization'] = `Bearer ${data.access}`;
      response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    } else {
      clearTokens();
      window.location.href = '/';
      return;
    }
  }

  if (response.status === 204) return null;
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Something went wrong' }));
    throw err;
  }

  return response.json();
}

// ── AUTH API ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) =>
    request('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),

  login: (username, password) =>
    request('/auth/login/', {
      method: 'POST',
      body:   JSON.stringify({ username, password }),
    }),

  logout: (refresh) =>
    request('/auth/logout/', { method: 'POST', body: JSON.stringify({ refresh }) }),

  getProfile: () => request('/auth/profile/'),

  updateProfile: (data) =>
    request('/auth/profile/', { method: 'PATCH', body: JSON.stringify(data) }),

  changePassword: (old_password, new_password) =>
    request('/auth/change-password/', {
      method: 'POST',
      body:   JSON.stringify({ old_password, new_password }),
    }),

  getUsers: (role = '') =>
    request(`/auth/users/${role ? `?role=${role}` : ''}`),

  createUser: (data) =>
    request('/auth/users/', { method: 'POST', body: JSON.stringify(data) }),

  deleteUser: (id) =>
    request(`/auth/users/${id}/`, { method: 'DELETE' }),
};

// ── COURSES API ───────────────────────────────────────────────────────────────
export const coursesAPI = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/courses/${query ? `?${query}` : ''}`);
  },
  get:              (id)             => request(`/courses/${id}/`),
  create:           (data)           => request('/courses/', { method: 'POST', body: JSON.stringify(data) }),
  update:           (id, data)       => request(`/courses/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete:           (id)             => request(`/courses/${id}/`, { method: 'DELETE' }),
  getLessons:       (courseId)       => request(`/courses/${courseId}/lessons/`),
  createLesson:     (courseId, form) => request(`/courses/${courseId}/lessons/`, { method: 'POST', body: form }),
  markLessonDone:   (courseId, lid)  => request(`/courses/${courseId}/lessons/${lid}/complete/`, { method: 'POST' }),
  getLessonProgress:(courseId)       => request(`/courses/${courseId}/progress/`),
  enroll:           (courseId)       => request(`/courses/${courseId}/enroll/`, { method: 'POST' }),
  unenroll:         (courseId)       => request(`/courses/${courseId}/unenroll/`, { method: 'DELETE' }),
  myEnrollments:    ()               => request('/courses/my-enrollments/'),
  myCourses:        ()               => request('/courses/my-courses/'),
  getCourseStudents:(courseId)       => request(`/courses/${courseId}/students/`),
  adminAllCourses:  ()               => request('/courses/admin/all/'),
};

// ── ASSIGNMENTS API ───────────────────────────────────────────────────────────
export const assignmentsAPI = {
  list:            (courseId = null) => request(`/assignments/${courseId ? `?course=${courseId}` : ''}`),
  get:             (id)              => request(`/assignments/${id}/`),
  create:          (data)            => request('/assignments/', { method: 'POST', body: JSON.stringify(data) }),
  update:          (id, data)        => request(`/assignments/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete:          (id)              => request(`/assignments/${id}/`, { method: 'DELETE' }),
  submit:          (id, form)        => request(`/assignments/${id}/submit/`, { method: 'POST', body: form }),
  mySubmissions:   ()                => request('/assignments/my-submissions/'),
  myResults:       ()                => request('/assignments/results/'),
  getSubmissions:  (id)              => request(`/assignments/${id}/submissions/`),
  grade:           (id, data)        => request(`/assignments/submissions/${id}/grade/`, { method: 'POST', body: JSON.stringify(data) }),
  trainerAnalytics:()                => request('/assignments/analytics/'),
  adminAnalytics:  ()                => request('/assignments/admin/analytics/'),
};