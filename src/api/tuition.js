// src/api/tuition.js

import axiosInstance from '../utils/axiosInstance';

export const createTuition = (data) =>
  axiosInstance.post('/api/tution/create/', data).then((res) => res.data);

export const getMyTuitions = () =>
  axiosInstance.get('/api/tution/my/').then((res) => res.data);

export const updateTuition = (id, data) =>
  axiosInstance.put(`/api/tution/CRUD/${id}/`, data).then((res) => res.data);

export const deleteTuition = (id) =>
  axiosInstance.delete(`/api/tution/CRUD/${id}/`).then((res) => res.data);

// Now returns only unapplied tuitions (backend filtered)
export const getAvailableTuitions = () =>
  axiosInstance.get('/api-stu/available-tutions/').then((res) => res.data);

export const getTuitionDetail = (id) =>
  axiosInstance.get(`/api-stu/available-tutions/${id}/`).then((res) => res.data);

export const applyForTuition = (tuitionId, message) =>
  axiosInstance
    .post('/api-stu/apply-tution/', { tuition: tuitionId, message })
    .then((res) => res.data);

// Teacher endpoints
export const getApplications = () =>
  axiosInstance.get('/api/tution-applications/').then((res) => res.data);

export const acceptApplication = (id) =>
  axiosInstance.post(`/api/tution-applications/${id}/accept/`).then((res) => res.data);

export const rejectApplication = (id) =>
  axiosInstance.post(`/api/tution-applications/${id}/reject/`).then((res) => res.data);

export const completeApplication = (id) =>
  axiosInstance.post(`/api/tution-applications/${id}/complete/`).then((res) => res.data);

// Student's own applications (fixed: GET, not POST)
export const getMyApplications = () =>
  axiosInstance.get('/api-stu/my-applications/').then((res) => res.data);