<template>
  <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-40">
    <div class="px-4 sm:px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="uiStore.toggleSidebar" class="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <router-link to="/dashboard" class="flex items-center">
          <img src="/logo-tulisan.png" alt="Logo SINERGI" class="pt-2 w-32 h-full object-contain">
        </router-link>
      </div>
      <div class="flex items-center gap-2">
      </div>
      <div class="flex items-center gap-2 sm:gap-4">

        <button 
          @click="openGuideBookModal" 
          class="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" 
          title="Buku Panduan Penggunaan"
        >
          📖
        </button>

        
        <button @click="toggleTheme" class="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span v-if="theme === 'light'">☀️</span>
          <span v-else>🌙</span>
        </button>

        <Menu as="div" class="relative">
          <MenuButton @click="fetchNotifications" class="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative" title="Notifikasi">
            <span>🔔</span>  
            <span v-if="unreadCount > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full ring-2 ring-white dark:ring-gray-800">
                  {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
          </MenuButton>

          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 scale-95 translate-y-2"
            enter-to-class="transform opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="transform opacity-100 scale-100 translate-y-0"
            leave-to-class="transform opacity-0 scale-95 translate-y-2"
            >
            <MenuItems class="absolute right-0 mt-3 w-80 sm:w-96 origin-top-right bg-white dark:bg-gray-800 rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none overflow-hidden z-50">
              
              <!-- Header Notif -->
              <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">Notifikasi</h3>
                <span class="text-xs font-medium px-2 py-0.5 rounded-md bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  {{ unreadCount }} Baru
                </span>
              </div>

              <!-- List Notif -->
              <div class="max-h-[20rem] overflow-y-auto custom-scrollbar">
                <div v-if="notifications.length === 0" class="p-8 text-center">
                   <div class="text-4xl mb-2 opacity-30 grayscale">🔕</div>
                   <p class="text-xs text-gray-500">Tidak ada notifikasi terbaru.</p>
                </div>

                <MenuItem v-else v-for="notif in notifications" :key="notif.id" v-slot="{ active }">
                  <div
                    @click="handleNotificationClick(notif)"
                    :class="[
                      active ? 'bg-gray-50 dark:bg-gray-700/50' : '',
                      !notif.isRead ? 'bg-blue-50/60 dark:bg-blue-900/10' : 'bg-white dark:bg-gray-800',
                      'px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 cursor-pointer transition-colors relative'
                    ]"
                  >
                    <!-- Dot Unread -->
                    <div v-if="!notif.isRead" class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>

                    <div class="flex gap-3">
                       <div class="flex-shrink-0 mt-1">
                          <!-- Icon based on logic (optional) -->
                          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm" :class="!notif.isRead ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'">
                             📢
                          </div>
                       </div>
                       <div class="flex-1 min-w-0">
                          <p class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1" :class="{'text-blue-700 dark:text-blue-300': !notif.isRead}">
                        {{ notif.title }}
                          </p>
                          <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">
                            {{ notif.message || notif.massage }}
                          </p>
                          <p class="text-[10px] text-gray-400 mt-1">
                        {{ formatTimeAgo(notif.createdAt) }}
                          </p>
                       </div>
                    </div>
                  </div>
                </MenuItem>
              </div>

              <!-- Footer Notif -->
              <div class="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-center">
                <router-link :to="{ name: 'notifikasi-semua' }" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  Lihat Semua Notifikasi
                </router-link>
              </div>
            </MenuItems>
          </transition>
        </Menu>
        <Menu as="div" class="relative">
          <MenuButton class="flex items-center">
            <img
              class="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-gray-200 dark:border-gray-700" 
              :src="getProfileUrl(authStore.user?.fotoProfilUrl)"
              alt="User profile photo"
            />
          </MenuButton>

          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 scale-95 translate-y-2"
            enter-to-class="transform opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="transform opacity-100 scale-100 translate-y-0"
            leave-to-class="transform opacity-0 scale-95 translate-y-2"
          >
            <MenuItems class="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden z-50">
              <!-- Info User Mobile/Desktop -->
              <div class="px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30">
                <p class="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {{ authStore.user?.namaLengkap || 'Pengguna' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  @{{ authStore.user?.username }}
                </p>
                <p class="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md inline-block">
                   {{ authStore.user?.jabatan?.namaJabatan || 'Jabatan -' }}
                </p>
              </div>

              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <router-link to="/profil" :class="[active ? 'bg-gray-50 dark:bg-gray-700' : '', 'group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200']">
                    <span class="mr-3 text-lg opacity-70">👤</span> Profil Saya
                  </router-link>
                </MenuItem>
              </div>

              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <button @click="authStore.logout" :class="[active ? 'bg-red-50 dark:bg-red-900/20' : '', 'group flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400']">
                    <span class="mr-3 text-lg opacity-70">🚪</span> Keluar
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>
  </header>
  <FilePreviewModal
    :show="showGuideBookModal"
    :file-url="guideBookData.url"
    :file-name="guideBookData.name"
    :file-type="guideBookData.type"
    @close="showGuideBookModal = false"
  />
</template>

<script setup>
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted, onUnmounted} from 'vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import FilePreviewModal from '@/components/FilePreviewModal.vue';
import axios from 'axios'; 
import { useRouter } from 'vue-router';
import { formatDistanceToNowStrict } from 'date-fns';
import { id } from 'date-fns/locale';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const uiStore = useUIStore();
const authStore = useAuthStore();
const router = useRouter();

const unreadCount = ref(0);
const notifications = ref([]);
let pollingInterval = null;
const POLLING_INTERVAL_MS = 60000;

const showGuideBookModal = ref(false);
const guideBookData = {
    url: '/BukuPedoman.pdf',
    name: 'Buku Pedoman Penggunaan Aplikasi',
    type: 'application/pdf'
};

const openGuideBookModal = () => {
    showGuideBookModal.value = true;
};

const theme = ref('light'); 

const applyTheme = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    theme.value = newTheme;
};

const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
};

// Fungsi untuk format waktu yang lebih ringkas
const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    return formatDistanceToNowStrict(new Date(dateString), { addSuffix: true, locale: id });
};

// Fungsi untuk Polling Hitungan Notifikasi
const fetchNotificationCount = async () => {
    if (!authStore.isAuthenticated) {
        unreadCount.value = 0;
        return;
    }
    try {
        const response = await axios.get(`${baseURL}/api/notifications/count`);
        unreadCount.value = response.data.count;
    } catch (e) {
        console.error("Gagal polling notifikasi count:", e);
    }
};

// Fungsi untuk Mengambil Daftar Notifikasi (dipanggil saat dropdown dibuka)
const fetchNotifications = async () => {
    if (!authStore.isAuthenticated) return;
    try {
        const response = await axios.get(`${baseURL}/api/notifications/header?limit=5`); 
        notifications.value = response.data;
    } catch (e) {
        console.error("Gagal mengambil daftar notifikasi:", e);
    }
};

// Handler saat notifikasi di klik
const handleNotificationClick = async (notif, closeMenu, e) => { 
    // Pastikan event tidak diteruskan ke elemen lain yang mungkin mengganggu navigasi
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // 1. Logika menandai sebagai sudah dibaca
    if (!notif.isRead) {
        try {
            // ... (logika patch API dan update state lokal tetap sama)
            await axios.patch(`${baseURL}/api/notifications/${notif.id}/read`);
            const index = notifications.value.findIndex(n => n.id === notif.id);
            if (index !== -1) {
                notifications.value[index].is_read = true;
            }
            unreadCount.value = Math.max(0, unreadCount.value - 1);
        } catch (error) { 
            console.error("Gagal menandai notifikasi sebagai dibaca:", error);
        }
    }
    
    // 2. Arahkan ke halaman terkait
    if (notif.linkTo) {
        // Tutup menu sebelum navigasi
        if (closeMenu) {
            closeMenu();
        }
        router.push(notif.linkTo);
    }
};

onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        if (prefersDark) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    if (authStore.isAuthenticated) {
        fetchNotificationCount();
        pollingInterval = setInterval(fetchNotificationCount, POLLING_INTERVAL_MS);
    }
});

onUnmounted(() => {
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }
});

const getProfileUrl = (path) => {
    if (!path) return "/profile-default.png";
    if (path.startsWith("./")) {
        return `${baseURL}/${path.replace("./", "")}`;
    }
    return path;
};
</script>