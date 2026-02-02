import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // Auth
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  setupAdmin: (email, password) => apiClient.post('/auth/setup', { email, password }),

  // Profile
  getProfile: () => apiClient.get('/profile'),
  updateProfile: (data) => apiClient.patch('/profile', data),

  // Skills
  getSkills: (filters = {}) => apiClient.get('/skills', { params: filters }),
  getSkillById: (id) => apiClient.get(`/skills/${id}`),
  createSkill: (data) => apiClient.post('/skills', data),
  updateSkill: (id, data) => apiClient.put(`/skills/${id}`, data),
  deleteSkill: (id) => apiClient.delete(`/skills/${id}`),

  // Projects
  getProjects: (filters = {}) => apiClient.get('/projects', { params: filters }),
  getProjectById: (id) => apiClient.get(`/projects/${id}`),
  createProject: (data) => apiClient.post('/projects', data),
  updateProject: (id, data) => apiClient.put(`/projects/${id}`, data),
  deleteProject: (id) => apiClient.delete(`/projects/${id}`),
  toggleProjectVisibility: (id) =>
    apiClient.patch(`/projects/${id}/toggle-visibility`),
  toggleProjectFeatured: (id) => apiClient.patch(`/projects/${id}/toggle-featured`),

  // Experience
  getExperience: () => apiClient.get('/experience'),
  getExperienceById: (id) => apiClient.get(`/experience/${id}`),
  createExperience: (data) => apiClient.post('/experience', data),
  updateExperience: (id, data) => apiClient.put(`/experience/${id}`, data),
  deleteExperience: (id) => apiClient.delete(`/experience/${id}`),

  // Certifications
  getCertifications: (filters = {}) =>
    apiClient.get('/certifications', { params: filters }),
  getCertificationById: (id) => apiClient.get(`/certifications/${id}`),
  createCertification: (data) => apiClient.post('/certifications', data),
  updateCertification: (id, data) => apiClient.put(`/certifications/${id}`, data),
  deleteCertification: (id) => apiClient.delete(`/certifications/${id}`),

  // AI Kernel
  kernelChat: (message, context = null) =>
    apiClient.post('/kernel/chat', { message, context }),
  getSystemStatus: () => apiClient.get('/kernel/status'),
};

export default apiClient;
