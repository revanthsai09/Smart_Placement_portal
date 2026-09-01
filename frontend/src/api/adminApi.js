import api from './axiosInstance';

export const getDashboard = () => api.get('/api/admin/dashboard');
export const getAllUsers = () => api.get('/api/admin/users');
export const toggleUserActive = (id) => api.put(`/api/admin/users/${id}/toggle-active`);
export const adminDeleteJob = (id) => api.delete(`/api/admin/jobs/${id}`);
