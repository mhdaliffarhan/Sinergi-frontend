import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Flag untuk mencegah loop refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Pasang interceptor pada response
axios.interceptors.response.use(
  (response) => response, // Jika sukses, lanjutkan
  
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // Jika error 401 (Unauthorized) & BUKAN request ke /token atau /refresh
    if (error.response?.status === 401 && 
        !originalRequest._retry &&
        originalRequest.url !== `${baseURL}/token` &&
        originalRequest.url !== `${baseURL}/api/auth/refresh`) 
    {
      if (isRefreshing) {
        // Jika sedang refresh, masukkan request ini ke antrian
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        });
      }

      originalRequest._retry = true; // Tandai bahwa request ini sudah di-retry
      isRefreshing = true;

      const success = await authStore.restoreSession();

      if (success) {
        originalRequest.headers['Authorization'] = `Bearer ${authStore.accessToken}`;
        processQueue(null, authStore.accessToken);
        return axios(originalRequest); // Ulangi request yang gagal
      } else {
        // Jika restoreSession gagal, logout sudah ditangani di dalam store
        processQueue(error, null);
        return Promise.reject(error);
      }
      
    }
    
    return Promise.reject(error);
  }
);