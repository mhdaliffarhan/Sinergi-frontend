import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './axiosConfig' 

const app = createApp(App)
const pinia = createPinia() 
app.use(pinia)

// Buat instance store SETELAH pinia di-mount
const authStore = useAuthStore(pinia); 

app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true
})

// Buat fungsi async untuk setup
async function initializeApp() {
  try {
    await authStore.restoreSession();
  } catch (error) {
    console.error("Gagal memulihkan sesi:", error);
  }
  
  app.use(router) // Gunakan router SETELAH sesi dipulihkan
  app.mount('#app')
}

// Panggil fungsi inisialisasi
initializeApp();