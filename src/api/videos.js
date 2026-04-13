import api from './axios'

export const getAllVideos = (signal) => api.get('/v1/videos/all-videos', { signal })
export const getVideoById = (videoId, signal) => api.get(`/v1/videos/${videoId}`, { signal })
