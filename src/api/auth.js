import api from './axios'
console.log("api: ", api);

// Adjust the response path (res.data.data vs res.data) to match your backend's shape
export const getCurrentUser = (signal) => api.get('/v1/users/current-user', { signal })
export const loginUser = (credentials) => api.post('/v1/users/auth/login', credentials)
export const logoutUser = () => api.post('/v1/users/logout')
