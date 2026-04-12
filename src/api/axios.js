import axios from "axios";

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // sends cookies (for auth/session)
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
