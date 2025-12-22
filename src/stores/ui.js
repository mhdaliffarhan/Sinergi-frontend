import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'; 
import { useAuthStore } from '@/stores/auth'; 

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const useUIStore = defineStore('ui', () => {
  // 'state' untuk melacak status sidebar
  const isSidebarOpen = ref(false)
  const unreadCount = ref(0); 

  // 'action' untuk mengubah state
  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function closeSidebar() {
    // Hanya tutup jika di layar mobile
    if (window.innerWidth < 768) {
      isSidebarOpen.value = false
    }
  }

  async function fetchNotificationCount() {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) {
      unreadCount.value = 0;
      return;
    }
    try {
        const response = await axios.get(`${baseURL}/api/notifications/count`);
        unreadCount.value = response.data.count;
    } catch (e) {
        console.error("Gagal fetching notifikasi count di UI Store:", e);
        unreadCount.value = 0;
    }
  }

  return { isSidebarOpen, toggleSidebar, closeSidebar, unreadCount, fetchNotificationCount }
})