<template>
  <header class="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
    <div class="px-4 sm:px-6 h-16 flex items-center justify-between">
      
      <!-- LEFT: Toggle Sidebar & Logo -->
      <div class="flex items-center gap-4">
        <button 
          @click="uiStore.toggleSidebar" 
          class="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <router-link to="/dashboard" class="flex items-center">
          <img src="/logo-tulisan.png" alt="Logo SINERGI" class="pt-2 w-32 h-full object-contain">
        </router-link>
      </div>

      <!-- RIGHT: Tools & Profile -->
      <div class="flex items-center gap-2 sm:gap-3">

        <!-- 1. Guidebook Button -->
        <button 
          @click="openGuideBookModal" 
          class="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all" 
          title="Buku Panduan"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        </button>

        <!-- 2. Theme Toggle -->
        <button 
          @click="toggleTheme" 
          class="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-gray-800 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all"
          :title="theme === 'light' ? 'Mode Gelap' : 'Mode Terang'"
        >
          <svg v-if="theme === 'light'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        </button>

        <!-- 3. Notification Dropdown -->
        <Menu as="div" class="relative">
          <MenuButton 
            @click="fetchNotifications" 
            class="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-all relative focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            
            <!-- Badge Count -->
            <span v-if="unreadCount > 0" class="absolute top-1.5 right-1.5 flex h-4 w-4">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center border-2 border-white dark:border-gray-900">
                {{ unreadCount > 9 ? '9' : unreadCount }}
              </span>
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

        <!-- 4. Profile Dropdown -->
        <Menu as="div" class="relative">
          <MenuButton class="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none">
            <img 
              class="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-gray-200 dark:border-gray-700" 
              :src="getProfileUrl(authStore.user?.fotoProfilUrl)" 
              alt="User Avatar" 
            />
            <div class="hidden sm:block text-left">
               <p class="text-xs font-bold text-gray-700 dark:text-gray-200 leading-none mb-0.5">
                 {{ getFirstName(authStore.user?.namaLengkap) }}
               </p>
               <p class="text-[10px] text-gray-500 dark:text-gray-400 leading-none">
                 {{ !authStore.user?.sistemRole?.namaRole || authStore.user.sistemRole.namaRole === 'Bukan Admin'
                      ? 'User': authStore.user.sistemRole.namaRole }}
               </p>
            </div>
            <svg class="hidden sm:block w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
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

  <!-- MODAL BUKU PANDUAN -->
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
import { ref, onMounted, onUnmounted } from 'vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import FilePreviewModal from '@/components/FilePreviewModal.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { formatDistanceToNowStrict } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const uiStore = useUIStore();
const authStore = useAuthStore();
const router = useRouter();

const unreadCount = ref(0);
const notifications = ref([]);
let pollingInterval = null;
const POLLING_INTERVAL_MS = 60000; // 1 menit

const theme = ref('light'); 
const showGuideBookModal = ref(false);
const guideBookData = {
    url: '/BukuPedoman.pdf',
    name: 'Buku Pedoman Penggunaan Aplikasi',
    type: 'application/pdf'
};

const openGuideBookModal = () => { showGuideBookModal.value = true; };

// --- THEME LOGIC ---
const applyTheme = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    theme.value = newTheme;
};

const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
};

// --- HELPERS ---
const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    try {
        return formatDistanceToNowStrict(new Date(dateString), { addSuffix: true, locale: idLocale });
    } catch (e) { return ''; }
};

const getProfileUrl = (path) => {
    if (!path) return "/profile-default.png";
    if (path.startsWith("./")) return `${baseURL}/${path.replace("./", "")}`;
    return path;
};

const getFirstName = (fullName) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
};

// --- NOTIFICATION LOGIC ---
const fetchNotificationCount = async () => {
    if (!authStore.isAuthenticated) {
        unreadCount.value = 0;
        return;
    }
    try {
        const response = await axios.get(`${baseURL}/api/notifications/count`);
        unreadCount.value = response.data.count;
    } catch (e) { console.error("Gagal polling notifikasi:", e); }
};

const fetchNotifications = async () => {
    if (!authStore.isAuthenticated) return;
    try {
        const response = await axios.get(`${baseURL}/api/notifications/header?limit=5`); 
        // Normalisasi data (mengatasi snake_case vs camelCase)
        notifications.value = response.data.map(n => ({
            ...n,
            isRead: n.is_read !== undefined ? n.is_read : n.isRead,
            createdAt: n.created_at || n.createdAt,
            linkTo: n.link_to || n.linkTo
        }));
        
        // Update count juga saat membuka menu
        fetchNotificationCount();
    } catch (e) { console.error("Gagal ambil list notif:", e); }
};

const handleNotificationClick = async (notif) => { 
    // 1. Mark as Read (Optimistic)
    if (!notif.isRead) {
        try {
            await axios.patch(`${baseURL}/api/notifications/${notif.id}/read`);
            // Update lokal
            notif.isRead = true;
            if (unreadCount.value > 0) unreadCount.value--;
        } catch (error) { console.error("Gagal mark read:", error); }
    }
    
    // 2. Navigate
    if (notif.linkTo) {
        // Cek link eksternal atau internal
        if (notif.linkTo.startsWith('http')) {
             window.open(notif.linkTo, '_blank');
        } else {
             router.push(notif.linkTo);
        }
    }
};

onMounted(() => {
    // 1. Theme Init
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) applyTheme(savedTheme);
    else applyTheme(prefersDark ? 'dark' : 'light');

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark' : 'light');
    });

    // 2. Notif Init
    if (authStore.isAuthenticated) {
        fetchNotificationCount();
        pollingInterval = setInterval(fetchNotificationCount, POLLING_INTERVAL_MS);
    }
});

onUnmounted(() => {
    if (pollingInterval) clearInterval(pollingInterval);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}
</style>