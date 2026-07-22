// src/api/groups.js

import axiosInstance from '../utils/axiosInstance';

export const getMyGroups = () =>
  axiosInstance.get('/api/groups/my-groups/').then((res) => res.data);

export const getGroupDetail = (groupId) =>
  axiosInstance.get(`/api/groups/${groupId}/`).then((res) => res.data);

export const getGroupMessages = (groupId) =>
  axiosInstance.get(`/api/groups/${groupId}/messages/`).then((res) => res.data);

export const getVideoRoomLink = (groupId) =>
  axiosInstance.get(`/api/groups/${groupId}/video-room/`).then((res) => res.data);