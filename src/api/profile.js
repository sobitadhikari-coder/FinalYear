// src/api/profile.js

import axiosInstance from '../utils/axiosInstance';

export const getSharedProfile = () =>
  axiosInstance.get('/api/profile/').then((res) => res.data);

export const updateSharedProfile = (data) =>
  axiosInstance.put('/api/profile/', data).then((res) => res.data);

export const getStudentProfile = () =>
  axiosInstance.get('/api-stu/studentprofile/').then((res) => res.data);

export const updateStudentProfile = (data) =>
  axiosInstance.patch('/api-stu/studentprofile/', data).then((res) => res.data);

export const getTeacherProfile = () =>
  axiosInstance.get('/api/teach-profile/').then((res) => res.data);

export const updateTeacherProfile = (data) =>
  axiosInstance.patch('/api/teach-profile/', data).then((res) => res.data);

export const uploadCV = (file) => {
  const formData = new FormData();
  formData.append('cv', file);
  return axiosInstance.patch('/api/teach-profile/', formData).then((res) => res.data);
};