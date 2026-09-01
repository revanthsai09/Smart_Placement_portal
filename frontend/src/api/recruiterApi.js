import api from './axiosInstance';

export const getMyJobs = () => api.get('/api/jobs/my');
export const postJob = (data) => api.post('/api/jobs', data);
export const updateJob = (id, data) => api.put(`/api/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/api/jobs/${id}`);
export const getJobApplicants = (jobId) => api.get(`/api/applications/job/${jobId}`);
export const updateApplicationStatus = (id, status) =>
  api.put(`/api/applications/${id}/status`, { status });
