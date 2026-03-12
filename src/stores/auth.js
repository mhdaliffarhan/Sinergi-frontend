import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const baseURL = import.meta.env.VITE_API_BASE_URL

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!accessToken.value)
  const userRole = computed(() => user.value?.sistemRole?.namaRole)

  const isAdmin = computed(() => {
    const role = user.value?.sistemRole?.namaRole
    return role === 'Superadmin' || role === 'Admin'
  })

  const isSuperAdmin = computed(() => {
    const role = user.value?.sistemRole?.namaRole
    return role === 'Superadmin'
  })

  const isOperator = computed(() => {
    if (user.value && user.value.teams && user.value.teams.length > 0) {
      return user.value.teams.some((team) => team.peran === 'operator')
    }
    return false
  })

  // --- ACTIONS ---

  /**
   * Helper internal untuk mengatur state setelah login atau refresh
   */
  function setAuthData(newAccessToken, userData) {
    accessToken.value = newAccessToken
    user.value = userData

    localStorage.setItem('accessToken', newAccessToken)
    localStorage.setItem('user', JSON.stringify(userData))

    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
  }

  /**
   * Helper internal untuk membersihkan state saat logout
   */
  function clearAuthData() {
    accessToken.value = null
    user.value = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')

    localStorage.removeItem('refreshToken')
    sessionStorage.removeItem('refreshToken')

    delete axios.defaults.headers.common['Authorization']
  }
  /**
   * [1] Dipanggil oleh LoginView.vue
   */
  async function login(username, password, rememberMe) {
    try {
      const params = new URLSearchParams()
      params.append('username', username)
      params.append('password', password)

      const response = await axios.post(`${baseURL}/token`, params)

      const newAccessToken = response.data.accessToken
      const newRefreshToken = response.data.refreshToken

      // Simpan refresh token di storage
      if (rememberMe) {
        localStorage.setItem('refreshToken', newRefreshToken)
        sessionStorage.removeItem('refreshToken')
      } else {
        sessionStorage.setItem('refreshToken', newRefreshToken)
        localStorage.removeItem('refreshToken')
      }

      // Ambil data user
      // Kita set token sementara untuk request fetchUser
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
      const userResponse = await axios.get(`${baseURL}/users/me`)

      // Set state aplikasi
      setAuthData(newAccessToken, userResponse.data)

      // Logika Paksa Isi Profil
      if (user.value && !user.value.nohp) {
        toast.info('Harap lengkapi Nomor HP Anda untuk Notifikasi WA.')
        router.push('/profil')
      } else {
        router.push('/dashboard')
      }

      return true
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Username atau password salah.')
    }
  }
  /**
   * [2] Dipanggil oleh router guard dan app load
   */
  async function fetchUser() {
    if (!accessToken.value) return
    try {
      const response = await axios.get(`${baseURL}/users/me`)
      user.value = response.data
    } catch (error) {
      logout()
    }
  }

  /**
   * [3] Dipanggil oleh Axios Interceptor (Langkah 4)
   */
  async function restoreSession() {
    const refreshToken =
      localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken')

    if (!refreshToken) {
      return false // Tidak ada sesi untuk dipulihkan
    }

    try {
      // Panggil endpoint /refresh dengan refresh token
      const response = await axios.post(
        `${baseURL}/api/auth/refresh`,
        {}, // Body kosong
        { headers: { Authorization: `Bearer ${refreshToken}` } },
      )

      const newAccessToken = response.data.accessToken
      if (!newAccessToken) {
        throw new Error('Refresh token tidak valid')
      }

      // Ambil data user dengan token baru
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
      const userResponse = await axios.get(`${baseURL}/users/me`)

      // Set state aplikasi
      setAuthData(newAccessToken, userResponse.data)
      return true
    } catch (error) {
      // Jika refresh token gagal (kedaluwarsa/dicabut), logout
      clearAuthData()
      router.push('/login')
      toast.error('Sesi Anda telah berakhir. Silakan login kembali.')
      return false
    }
  }

  /**
   * [Modifikasi 4] Logout dengan Single Sign-Out
   */
  function logout() {
    clearAuthData()

    // Alamat Logout SSO
    const ssoLogoutUrl = 'https://auth.pintu.statsntb.id/auth/sso-logout'
    const localLoginUrl = window.location.origin + '/login'

    // Redirect ke SSO Logout agar sesi di pusat juga mati
    window.location.href = `${ssoLogoutUrl}?redirect_uri=${encodeURIComponent(localLoginUrl)}`
  }

  /**
   * [5] Mengarahkan pengguna ke halaman login SSO NTB
   */
  async function ssoLogin() {
    try {
      // Ambil URL login dari backend
      const response = await axios.get(`${baseURL}/api/auth/sso/login`)
      // Redirect browser ke halaman login SSO
      window.location.href = response.data.url
    } catch (error) {
      toast.error('Gagal terhubung ke Server SSO.')
    }
  }

  /**
   * [6] Menangani callback setelah user login di SSO
   */
  // Di dalam src/stores/auth.js
  // Di auth.js (Frontend)
  async function ssoCallback(code) {
    try {
      const response = await axios.post(`${baseURL}/api/auth/sso/callback`, { code })
      const { accessToken } = response.data

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      // ambil user dari endpoint standar
      const userResponse = await axios.get(`${baseURL}/users/me`)

      setAuthData(accessToken, userResponse.data)

      router.push('/dashboard')
    } catch (error) {
      console.error('SSO Error:', error.response?.data)
      router.push('/login') // Ini yang bikin kamu mental balik
    }
  }

  function loadSession() {
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      accessToken.value = token
      user.value = JSON.parse(userData)

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
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
    setAuthData,
    ssoCallback,
    ssoLogin,
    loadSession,
  }
})
