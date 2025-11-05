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
            enter-active-class="transition ease-out duration-150"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems
              class="fixed sm:absolute right-0 top-16 sm:top-auto mt-2 w-full sm:w-96 origin-top-right
                    divide-y divide-gray-100 dark:divide-gray-800
                    rounded-none sm:rounded-xl
                    bg-white dark:bg-gray-900
                    shadow-2xl ring-1 ring-inset ring-gray-200 dark:ring-gray-700
                    focus:outline-none
                    max-h-[85vh] overflow-y-auto
                    z-50 transition-all duration-200"
            >
              <!-- HEADER -->
              <div class="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Pemberitahuan</h3>
                <span class="text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400">
                  ({{ unreadCount }} Baru)
                </span>
              </div>

              <!-- EMPTY STATE -->
              <div
                v-if="notifications.length === 0"
                class="p-8 text-center text-gray-500 dark:text-gray-400 text-sm"
              >
                Tidak ada notifikasi baru untuk Anda.
              </div>

              <!-- NOTIFICATION LIST -->
              <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
                <MenuItem
                  v-for="notif in notifications"
                  :key="notif.id"
                  v-slot="{ active, close }"
                >
                  <div
                    @click="handleNotificationClick(notif, close, $event)"
                    :class="[
                      notif.isRead
                        ? 'bg-white dark:bg-gray-900'
                        : 'bg-blue-50 dark:bg-blue-900/40',
                      active
                        ? 'hover:bg-gray-100 dark:hover:bg-gray-800/70'
                        : '',
                    ]"
                    class="group flex flex-col px-4 py-2.5 text-left cursor-pointer transition-colors"
                  >
                    <div class="flex justify-between items-start gap-2">
                      <h4
                        class="text-sm sm:text-[15px] font-semibold text-gray-900 dark:text-white line-clamp-2 pr-2"
                        :class="{ 'font-extrabold': !notif.is_read }"
                      >
                        {{ notif.title }}
                      </h4>
                      <span
                        class="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 whitespace-nowrap"
                      >
                        {{ formatTimeAgo(notif.createdAt) }}
                      </span>
                    </div>

                    <p
                      class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2"
                    >
                      {{ notif.message }}
                    </p>
                  </div>
                </MenuItem>
              </div>

              <!-- FOOTER -->
              <div class="p-3 bg-gray-50 dark:bg-gray-800 sticky bottom-0 z-10">
                <router-link
                  :to="{ name: 'notifikasi-semua' }"
                  class="block w-full text-center text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Lihat Semua Notifikasi
                </router-link>
              </div>
            </MenuItems>
          </transition>
        </Menu>
        <Menu as="div" class="relative">
          <MenuButton class="flex items-center">
            <img
              class="h-9 w-9 rounded-full object-cover"
              :src="getProfileUrl(authStore.user?.fotoProfilUrl)"
              alt="User profile photo"
            />
          </MenuButton>
          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems class="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 dark:divide-gray-600 rounded-md bg-white dark:bg-gray-800 shadow-lg broder border-gray-200 dark:border-gray-700 focus:outline-none">
              <div class="px-1 py-1">
                <div class="px-2 py-2">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ authStore.user?.namaLengkap || 'Memuat...' }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ authStore.user?.username }}</p>
                </div>
              </div>
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <router-link 
                    to="/profil" 
                    :class="[active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-200', 'group flex w-full items-center rounded-md px-2 py-2 text-sm']"
                    class="w-full text-left"
                  >
                    Profil
                  </router-link>
                </MenuItem>
              </div>
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <button @click="authStore.logout" :class="[active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-200', 'group flex w-full items-center rounded-md px-2 py-2 text-sm']">
                    Logout
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
import axios from 'axios'; // PENTING: Tambahkan impor axios
import { useRouter } from 'vue-router'; // PENTING: Tambahkan impor useRouter
import { formatDistanceToNowStrict } from 'date-fns';
import { id } from 'date-fns/locale';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const uiStore = useUIStore();
const authStore = useAuthStore();
const router = useRouter(); // Inisialisasi router

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
        } catch (error) { // Gunakan 'error' untuk kejelasan
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