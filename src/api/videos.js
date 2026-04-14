import api from './axios'

// fetch all videos
export const getAllVideos = ({
  skip = 0, limit, userId } = {},
  signal
) => api.post('/v1/videos/all-videos', { skip, limit, userId }, { signal });

// get video by id
export const getVideoById = (videoId, signal) => api.get(`/v1/videos/${videoId}`, { signal })
