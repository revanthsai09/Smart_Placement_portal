import api from './axiosInstance';

export const getProfile = () => api.get('/api/student/profile');
export const updateProfile = (data) => api.put('/api/student/profile', data);
export const uploadResume = (formData) =>
  api.post('/api/student/profile/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getAllJobs = (params) => api.get('/api/jobs', { params });
export const applyToJob = (jobId) => api.post(`/api/applications/${jobId}`);
export const getMyApplications = () => api.get('/api/applications/my');
