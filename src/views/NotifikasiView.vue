<template>
  <div>
    <!-- BACKGROUND DECORATIONS -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl opacity-60 dark:opacity-20"></div>
        <div class="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-3xl opacity-60 dark:opacity-20"></div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="relative z-10 max-w-4xl mx-auto pb-20">
      
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <span class="text-4xl">🔔</span> Notifikasi
          </h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Anda memiliki <span class="font-bold text-blue-600 dark:text-blue-400">{{ totalUnread }}</span> notifikasi baru.
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- Filter Dropdown -->
          <div class="relative">
            <select v-model="filterStatus" @change="fetchNotifications(1)"
              class="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer hover:border-blue-300 transition-colors"
            >
              <option :value="null">Semua</option>
              <option :value="false">Belum Dibaca</option>
              <option :value="true">Sudah Dibaca</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          
          <!-- Mark All Read Button -->
          <button 
            @click="markAllAsRead" 
            :disabled="totalUnread === 0"
            class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/20 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span class="hidden sm:inline">Tandai Dibaca</span>
          </button>
        </div>
      </div>
      
      <!-- LIST CONTAINER -->
      <div class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700 overflow-hidden relative min-h-[400px]">
        
        
        <div class="p-2 sm:p-4">
          
          <!-- LOADING -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center h-64">
            <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 dark:border-blue-900 border-t-blue-600 mb-3"></div>
            <p class="text-gray-400 text-sm animate-pulse">Memuat notifikasi...</p>
          </div>

          <!-- NOTIFICATION LIST -->
          <div v-else-if="notifications.length > 0" class="space-y-2">
            <transition-group name="list">
              <div 
                v-for="notif in notifications" 
                :key="notif.id"
                @click="handleNotificationClick(notif)"
                class="group relative flex flex-col sm:flex-row gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-300 border border-transparent"
                :class="[
                  !notif.isRead 
                    ? 'bg-blue-50/80 dark:bg-blue-900/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 border-blue-100 dark:border-blue-800/30' 
                    : 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-100 dark:border-gray-800'
                ]"
              >
                <!-- Indikator Unread (Dot) -->
                <div v-if="!notif.isRead" class="absolute top-4 right-4 sm:static sm:mt-1.5">
                   <div class="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50 animate-pulse"></div>
                </div>
                <!-- Spacer -->
                <div v-else class="hidden sm:block w-2.5 h-2.5 mt-1.5"></div>

                <!-- Icon Type -->
                <div class="flex-shrink-0">
                   <div 
                    class="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm transition-transform group-hover:scale-110"
                    :class="!notif.isRead ? 'bg-white dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'"
                   >
                     {{ getNotificationIcon(notif.type) }}
                   </div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0 pr-6 sm:pr-0">
                  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white line-clamp-1" :class="{'text-blue-700 dark:text-blue-300': !notif.isRead}">
                      {{ notif.title }}
                    </h3>
                    <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700">
                      {{ formatTimeAgo(notif.createdAt) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors">
                    {{ notif.message || notif.massage }}
                  </p>
                </div>

                <!-- Arrow Indicator -->
                <div class="hidden sm:flex items-center text-gray-300 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
              </div>
            </transition-group>
          </div>

          <!-- EMPTY STATE -->
          <div v-else class="flex flex-col items-center justify-center h-80 text-center">
            <div class="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-4xl opacity-30 grayscale">
              🔕
            </div>
            <p class="text-lg font-bold text-gray-900 dark:text-white">Tidak ada notifikasi</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Anda sudah melihat semua pembaruan terbaru.</p>
          </div>

        </div>

        <!-- Pagination Footer -->
        <div v-if="totalNotifikasi > itemsPerPage" class="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <Pagination
            :current-page="currentPage"
            :total-items="totalNotifikasi"
            :items-per-page="itemsPerPage"
            @page-changed="fetchNotifications"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { useToast } from 'vue-toastification';
import { formatDistanceToNowStrict } from 'date-fns';
import { id } from 'date-fns/locale';

import Pagination from '@/components/Pagination.vue';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUIStore();
const toast = useToast();

const notifications = ref([]);
const isLoading = ref(true);
const currentPage = ref(1);
const totalNotifikasi = ref(0);
const itemsPerPage = 10;
const filterStatus = ref(false); 
const totalUnread = ref(0);

const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Baru saja'; 
    return formatDistanceToNowStrict(date, { addSuffix: true, locale: id });
  } catch (error) { return ''; }
};

const getNotificationIcon = (type) => {
    if (!type) return '📢';
    const t = type.toLowerCase();
    if (t.includes('dokumen') || t.includes('upload')) return '📂';
    if (t.includes('aktivitas') || t.includes('jadwal')) return '📅';
    if (t.includes('tim') || t.includes('anggota')) return '👥';
    if (t.includes('warning') || t.includes('tunggakan')) return '⚠️';
    return '📢';
};

const fetchNotifications = async (page = 1) => {
    isLoading.value = true;
    currentPage.value = page;
    const skip = (page - 1) * itemsPerPage;
    
    let isReadQuery = filterStatus.value;
    if (filterStatus.value === 'false') isReadQuery = false;
    if (filterStatus.value === 'true') isReadQuery = true;

    try {
        const response = await axios.get(`${baseURL}/api/notifications`, {
            params: {
                skip: skip,
                limit: itemsPerPage,
                is_read: isReadQuery
            }
        });
        
        // Normalisasi data (mengatasi snake_case vs camelCase dari backend)
        notifications.value = response.data.items.map(n => ({
            ...n,
            isRead: n.is_read !== undefined ? n.is_read : n.isRead,
            createdAt: n.created_at || n.createdAt,
            // Prioritaskan link_to (snake_case)
            linkTo: n.link_to || n.linkTo
        }));

        totalNotifikasi.value = response.data.total;

        // Update unread count global
        const countRes = await axios.get(`${baseURL}/api/notifications/count`);
        totalUnread.value = countRes.data.count;

    } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Gagal memuat notifikasi.");
    } finally {
        isLoading.value = false;
    }
};

const handleNotificationClick = async (notif) => {
    // 1. Tentukan target link
    const targetLink = notif.link_to || notif.linkTo; 

    // 2. Jika belum dibaca, tandai dibaca (background process)
    if (!notif.isRead) {
        try {
            await axios.patch(`${baseURL}/api/notifications/${notif.id}/read`);
            
            // Optimistic Update Lokal
            notif.isRead = true;
            if(totalUnread.value > 0) totalUnread.value--;
            
            // Sync Global Badge
            uiStore.fetchNotificationCount(); 
        } catch (e) { console.error("Read status error:", e); }
    }
    
    // 3. Navigasi (Selalu jalan meskipun API read error)
    if (targetLink) {
        // Cek apakah link internal (route vue) atau eksternal
        if (targetLink.startsWith('http')) {
             window.open(targetLink, '_blank');
        } else {
             router.push(targetLink);
        }
    } else {
        // Jika tidak ada link, cuma refresh list jika sedang filter "Belum Dibaca"
        if (filterStatus.value === false) {
            fetchNotifications(currentPage.value); 
        }
    }
};

const markAllAsRead = async () => {
    if (totalUnread.value === 0) return;
    if (!window.confirm("Tandai semua sebagai sudah dibaca?")) return;
    
    try {
        await axios.patch(`${baseURL}/api/notifications/mark-all-read`);
        await fetchNotifications(currentPage.value);
        await uiStore.fetchNotificationCount();
        toast.success("Semua notifikasi ditandai dibaca.");
    } catch (error) {
        toast.error("Gagal memproses permintaan.");
    }
};

onMounted(() => {
    fetchNotifications();
});

watch(filterStatus, () => fetchNotifications(1));
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>