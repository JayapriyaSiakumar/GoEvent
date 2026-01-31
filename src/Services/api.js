import axios from "axios";

const api = axios.create({
  baseURL: "https://goevent-backend.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
//https://goevent-backend.onrender.com
//http://localhost:3000
