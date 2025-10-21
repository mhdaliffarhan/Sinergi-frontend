<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Semua Notifikasi</h1>
      
      <div class="flex items-center gap-3 mt-4 sm:mt-0">
        <select v-model="filterStatus" @change="fetchNotifications(1)"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        >
          <option :value="null">Semua</option>
          <option :value="false">Belum Dibaca</option>
          <option :value="true">Sudah Dibaca</option>
        </select>
        
        <button 
          @click="markAllAsRead" 
          :disabled="totalUnread === 0"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          Tandai Semua Dibaca
        </button>
      </div>
    </div>
    
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="notifications.length > 0" class="space-y-3">
      <div 
        v-for="notif in notifications" 
        :key="notif.id"
        @click="handleNotificationClick(notif)"
        :class="[
          // Logic ini memastikan HANYA UNREAD yang berwarna biru
          !notif.isRead 
            ? 'bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-800/70' 
            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50' // Kembali ke normal jika sudah dibaca
        ]"
        class="block p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors duration-200"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <span v-if="!notif.isRead" class="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" title="Belum Dibaca"></span>
            <span v-else class="h-2 w-2 rounded-full bg-transparent flex-shrink-0"></span>
            
            <div class="flex-1 min-w-0">
              <p class="text-base font-semibold text-gray-900 dark:text-white line-clamp-1" :class="{'font-extrabold': !notif.is_read}">
                {{ notif.title }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {{ notif.massage }}
              </p>
            </div>
          </div>

          <div class="mt-2 sm:mt-0 text-right sm:pl-4 flex-shrink-0">
             <p class="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                {{ formatTimeAgo(notif.created_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <p class="text-lg text-gray-500 dark:text-gray-400">Tidak ada notifikasi yang ditemukan.</p>
    </div>

    <Pagination
      v-if="totalNotifikasi > itemsPerPage"
      :current-page="currentPage"
      :total-items="totalNotifikasi"
      :items-per-page="itemsPerPage"
      @page-changed="fetchNotifications"
      class="mt-6 border-b-0 border-t border-gray-200 dark:border-gray-700 rounded-lg shadow-md"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';
import { formatDistanceToNowStrict } from 'date-fns';
import { id } from 'date-fns/locale';

import Pagination from '@/components/Pagination.vue';
import { useUIStore } from '@/stores/ui';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const uiStore = useUIStore();

const notifications = ref([]);
const isLoading = ref(true);
const currentPage = ref(1);
const totalNotifikasi = ref(0);
const itemsPerPage = 20;
const filterStatus = ref(null); 

const totalUnread = ref(0);

const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    return formatDistanceToNowStrict(new Date(dateString), { addSuffix: true, locale: id });
};


const fetchNotifications = async (page = 1) => {
    isLoading.value = true;
    currentPage.value = page;
    const skip = (page - 1) * itemsPerPage;
    
    // Tentukan filter is_read
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
        
        notifications.value = response.data.items;
        totalNotifikasi.value = response.data.total;

        // console.log("Notifikasi : ", notifications.value);
        // Fetch count terpisah untuk tombol
        const countRes = await axios.get(`${baseURL}/api/notifications/count`);
        totalUnread.value = countRes.data.count;

    } catch (error) {
        toast.error("Gagal memuat notifikasi.");
        console.error("Error fetching notifications:", error);
    } finally {
        isLoading.value = false;
    }
};

const handleNotificationClick = async (notif) => {
    let shouldNavigate = false;
    
    if (!notif.is_read) {
        try {
            await axios.patch(`${baseURL}/api/notifications/${notif.id}/read`);
            
            // Update status di array lokal
            const index = notifications.value.findIndex(n => n.id === notif.id);
            if (index !== -1) {
                notifications.value[index].is_read = true;
            }
            shouldNavigate = true;
            
        } catch (e) {
            console.error("Gagal menandai notifikasi sebagai dibaca:", e);
        }
    } else {
        shouldNavigate = true;
    }
    
    // Perbarui count di header (UI Store)
    await uiStore.fetchNotificationCount();
    
    if (shouldNavigate && notif.link_to) {
        router.push(notif.link_to);
    } else {
        // Jika tidak ada link, reload list untuk memastikan status terupdate
        fetchNotifications(currentPage.value); 
    }
};

const markAllAsRead = async () => {
    if (totalUnread.value === 0 || !window.confirm("Apakah Anda yakin ingin menandai semua notifikasi sebagai sudah dibaca?")) return;
    
    try {
        await axios.patch(`${baseURL}/api/notifications/mark-all-read`);
        
        // Perbarui tampilan dan header
        await fetchNotifications(currentPage.value);
        
        await uiStore.fetchNotificationCount();
        
        toast.success("Semua notifikasi berhasil ditandai sudah dibaca!");
        
    } catch (error) {
        toast.error("Gagal menandai semua notifikasi sudah dibaca.");
    }
};

onMounted(() => {
    fetchNotifications();
});

watch(filterStatus, () => fetchNotifications(1));
</script>