import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';
import { useToast } from 'vue-toastification';


const toast = useToast();
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null);
  const user = ref(null);

  const isAuthenticated = computed(() => !!accessToken.value);
  const userRole = computed(() => user.value?.sistemRole?.namaRole);

  const isAdmin = computed(() => {
    const role = user.value?.sistemRole?.namaRole;
    return role === 'Superadmin' || role === 'Admin';
  });

  const isSuperAdmin = computed(() => {
    const role = user.value?.sistemRole?.namaRole;
    return role === 'Superadmin';
  });

  const isOperator = computed(() => {
    if (user.value && user.value.teams && user.value.teams.length > 0) {
      return user.value.teams.some(team => team.peran === 'operator');
    }
    return false;
  });


  // --- ACTIONS ---

  /**
   * Helper internal untuk mengatur state setelah login atau refresh
   */
function setAuthData(newAccessToken, userData) {
    accessToken.value = newAccessToken;
    user.value = userData;
    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
  }


  /**
   * Helper internal untuk membersihkan state saat logout
   */
function clearAuthData() {
    accessToken.value = null;
    user.value = null;
    // Hapus refresh token dari KEDUA storage
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
  }
/**
   * [1] Dipanggil oleh LoginView.vue
   */
  async function login(username, password, rememberMe) {
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await axios.post(`${baseURL}/token`, params);

      const newAccessToken = response.data.accessToken; 
      const newRefreshToken = response.data.refreshToken;

      // Simpan refresh token di storage
      if (rememberMe) {
        localStorage.setItem('refreshToken', newRefreshToken);
        sessionStorage.removeItem('refreshToken');
      } else {
        sessionStorage.setItem('refreshToken', newRefreshToken);
        localStorage.removeItem('refreshToken');
      }

      // Ambil data user
      // Kita set token sementara untuk request fetchUser
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      const userResponse = await axios.get(`${baseURL}/users/me`);

      // Set state aplikasi
      setAuthData(newAccessToken, userResponse.data);
      
      // Logika Paksa Isi Profil
      if (user.value && !user.value.nohp) {
        toast.info("Harap lengkapi Nomor HP Anda untuk Notifikasi WA.");
        router.push('/profil');
      } else {
        router.push('/dashboard');
      }
      
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Username atau password salah.');
    }
  }
/**
   * [2] Dipanggil oleh router guard dan app load
   */
  async function fetchUser() {
    if (!accessToken.value) return;
    try {
      const response = await axios.get(`${baseURL}/users/me`);
      user.value = response.data;
    } catch (error) {
      logout();
    }
  }

  /**
   * [3] Dipanggil oleh Axios Interceptor (Langkah 4)
   */
  async function restoreSession() {
    const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return false; // Tidak ada sesi untuk dipulihkan
    }

    try {
      // Panggil endpoint /refresh dengan refresh token
      const response = await axios.post(
        `${baseURL}/api/auth/refresh`, 
        {}, // Body kosong
        { headers: { 'Authorization': `Bearer ${refreshToken}` } }
      );

      const newAccessToken = response.data.accessToken;
      if (!newAccessToken) {
        throw new Error("Refresh token tidak valid");
      }
      
      // Ambil data user dengan token baru
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      const userResponse = await axios.get(`${baseURL}/users/me`);
      
      // Set state aplikasi
      setAuthData(newAccessToken, userResponse.data);
      return true;

    } catch (error) {
      // Jika refresh token gagal (kedaluwarsa/dicabut), logout
      clearAuthData();
      router.push('/login');
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      return false;
    }
  }

  /**
   * [4] Dipanggil oleh tombol Logout
   */
  function logout() {
    clearAuthData();
    router.push('/login');
    toast.success('Anda berhasil Logout!');
  }

  return {
    accessToken,
    user,
    isAuthenticated,
    userRole,
    isAdmin,
    isSuperAdmin,
    isOperator,
    login,
    fetchUser,
    restoreSession,
    logout,
    setAuthData
  };
});