import axios from 'axios';

// Create a single, intelligent Axios instance.
// REMOVED the default 'Content-Type' header. Axios will handle it automatically.
const api = axios.create({
  baseURL:"https://arabiaseel.crmgcc.net/api",
});

// --- Smart Request Interceptor ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const publicRoutes = ['/auth/login', '/auth/signup', '/auth/verify'];
    const isPublicRoute = publicRoutes.some(route => config.url.startsWith(route));

    if (token && !isPublicRoute) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor for Handling 401 Errors ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Authentication Error: Token is invalid or expired. Redirecting to login.");
      localStorage.removeItem('authToken');
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;