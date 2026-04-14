import api from './axios';

export const getChannel = (channelId, signal) => api.get(`/v1/users/channel/${channelId}`, { signal });