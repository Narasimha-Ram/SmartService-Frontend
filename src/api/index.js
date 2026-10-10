import axios from 'axios';

// Resolve API Base URL for local development and production cloud deployment (Render + Vercel)
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const trimmed = envUrl.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401 handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users'),
  toggleActive: (id) => api.put(`/users/${id}/toggle-active`),
};

export const complaintApi = {
  create: (formData) => api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyComplaints: (page = 0, size = 10) => api.get(`/complaints/my?page=${page}&size=${size}`),
  getById: (id) => api.get(`/complaints/${id}`),
  submitFeedback: (id, data) => api.post(`/complaints/${id}/feedback`, data),
  addComment: (id, data) => api.post(`/complaints/${id}/comments`, data),
  checkDuplicates: (data) => api.post('/complaints/check-duplicates', data),
};

export const adminApi = {
  getAllComplaints: (params) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.priority) query.append('priority', params.priority);
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.search) query.append('search', params.search);
    query.append('page', params.page || 0);
    query.append('size', params.size || 10);
    return api.get(`/admin/complaints?${query.toString()}`);
  },
  getComplaintById: (id) => api.get(`/admin/complaints/${id}`),
  assignComplaint: (id, data) => api.put(`/admin/complaints/${id}/assign`, data),
  updateStatus: (id, data) => api.put(`/admin/complaints/${id}/status`, data),
  addInternalComment: (id, data) => api.post(`/admin/complaints/${id}/comments`, data),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (data) => api.post('/admin/departments', data),
  updateDepartment: (id, data) => api.put(`/admin/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),
  getStaff: () => api.get('/admin/staff'),
  getStaffByDept: (deptId) => api.get(`/admin/staff/department/${deptId}`),
};

export const analyticsApi = {
  getDashboard: () => api.get('/admin/analytics/dashboard'),
  getResolutionTime: () => api.get('/admin/analytics/resolution-time'),
  getLocationAnalysis: () => api.get('/admin/analytics/location-analysis'),
};

export const notificationApi = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAllRead: () => api.put('/notifications/mark-all-read'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
};

export const categoryApi = {
  getActive: () => api.get('/categories'),
};

export default api;
