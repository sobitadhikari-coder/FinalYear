// src/utils/constants.js

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
  TEACHER_TUITIONS: '/tuitions/teacher',
  STUDENT_TUITIONS: '/tuitions/student',
  TUITION_DETAIL: '/tuition/:id',
  TEACHER_APPLICATIONS: '/tuitions/applications',
  STUDENT_APPLICATIONS: '/tuitions/my-applications',
  GROUPS: '/groups',
  GROUP_DETAIL: '/groups/:id',
};