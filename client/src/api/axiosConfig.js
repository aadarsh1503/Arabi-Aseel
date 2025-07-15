import axios from 'axios';

// 1. Create an instance for the Menu API
const menuApi = axios.create({
  baseURL: import.meta.env.VITE_API_MENU_URL,
});

// 2. Create another instance for the Auth API
const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_AUTH_URL,
});

const chefApi = axios.create({
    baseURL: import.meta.env.VITE_API_CHEF_URL,
});
// You can add interceptors to each one if needed. For example, to add a token to menuApi calls:
/*
menuApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*/

// 3. Export both instances using named exports
export { menuApi, authApi , chefApi};