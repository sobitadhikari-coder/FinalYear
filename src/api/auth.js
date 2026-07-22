// src/api/auth.js

import axiosInstance from '../utils/axiosInstance';

export const register = (data) =>
  axiosInstance.post('/api/register/', data).then((res) => res.data);

export const login = (identifier, password) =>
  axiosInstance
    .post('/api/login/', { identifier, password })
    .then((res) => res.data);

export const refreshToken = (refresh) =>
  axiosInstance
    .post('/api/token/refresh/', { refresh })
    .then((res) => res.data);

export const forgotPassword = (email) =>
  axiosInstance.post('/api/forgot_password/', { email }).then((res) => res.data);

export const verifyOTPAndResetPassword = (email, otp, password) =>
  axiosInstance
    .post('/api/verify_otp/', { email, otp, password })
    .then((res) => res.data);