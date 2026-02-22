import axios from 'axios';

const BASEURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASEURL,
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
      console.error("Authentication Error: Token is invalid or expired.");
      
      // Only redirect to login if we're on a protected route (admin pages)
      const protectedRoutes = ['/admin', '/chef', '/spin-admin'];
      const isProtectedRoute = protectedRoutes.some(route => 
        window.location.pathname.startsWith(route)
      );
      
      // Clear the invalid token
      localStorage.removeItem('authToken');
      
      // Only redirect if on a protected route and not already on login page
      if (isProtectedRoute && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;