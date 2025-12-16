<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span class="text-3xl">👥</span> Daftar Tim Aktif
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Lihat dan kelola semua tim yang aktif di kantor Anda.
        </p>
      </div>
      
      <div class="mt-4 sm:mt-0 flex-shrink-0" v-if="authStore.isAdmin">
        <button 
          @click="openModal" 
          class="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span class="text-xl font-bold">+</span>
          <span class="font-semibold">Buat Tim Baru</span>
        </button>
      </div>
    </div>

    <!-- FILTER TOGGLE -->
    <div class="mb-6">
      <div class="inline-flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl shadow-inner">
        <button 
          @click="setFilter('saya')"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          :class="filterMode === 'saya' 
            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
        >
          Tim Saya
        </button>
        <button 
          @click="setFilter('semua')"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          :class="filterMode === 'semua' 
            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
        >
          Semua Tim
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 mb-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      <!-- Background Decorations -->
      <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
      <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>

      <div class="flex flex-col md:flex-row gap-5 justify-between items-center relative z-10">
        
        <!-- Search Input -->
        <div class="relative w-full md:max-w-lg group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Cari tim berdasarkan nama..."
            class="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-indigo-500 transition-all shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
          />
        </div>

        <!-- View Mode Toggle -->
        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div class="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex shadow-inner">
            <button
              @click="viewMode = 'card'"
              title="Tampilan Kartu"
              class="p-2 rounded-lg transition-all duration-200"
              :class="viewMode === 'card' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </button>
            <button
              @click="viewMode = 'table'"
              title="Tampilan Tabel"
              class="p-2 rounded-lg transition-all duration-200"
              :class="viewMode === 'table' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTENT AREA -->
    <div class="mt-6 min-h-[300px]">
      
      <!-- LOADING STATE -->
      <div v-if="isLoading" class="text-center p-10 text-gray-500 dark:text-gray-400 animate-pulse">
        <div class="inline-block p-4 rounded-full bg-indigo-50 dark:bg-indigo-900/20 mb-3">
          <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="font-medium">Memuat daftar tim...</p>
      </div>

      <!-- EMPTY STATE -->
      <div v-else-if="!isLoading && teams.length === 0" class="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 group hover:border-indigo-300 transition-colors">
        <span class="text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📭</span>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          Belum Ada Tim
        </h3>
        <p class="text-gray-500 dark:text-gray-400 text-center max-w-sm mt-2">
          {{ filterMode === 'saya' ? 'Anda belum tergabung dalam tim manapun.' : 'Tidak ditemukan tim yang sesuai.' }}
        </p>
        <button v-if="authStore.isAdmin" @click="openModal" class="mt-6 text-indigo-600 hover:text-indigo-800 font-medium text-sm">
          + Buat Tim Baru Sekarang
        </button>
      </div>

      <!-- DATA LIST -->
      <div v-else class="animate-fade-in-up">
        <DaftarTeam v-if="viewMode === 'card'" :teams="teams" />
        <TabelTeam 
          v-if="viewMode === 'table'" 
          :teams="teams" 
          :current-page="currentPage" 
          :items-per-page="itemsPerPage" 
        />
      </div>
    </div>

    <Pagination
      v-if="totalTeams > itemsPerPage"
      :current-page="currentPage"
      :total-items="totalTeams"
      :items-per-page="itemsPerPage"
      @page-changed="handlePageChange"
    />

    <ModalWrapper :show="isModalOpen" @close="closeModal" title="Buat Tim Baru">
      <FormTim :user-list="allUsers" @close="closeModal" @submit="handleTeamSubmit" />
    </ModalWrapper>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';

// Komponen
import DaftarTeam from '@/components/team/DaftarTeam.vue';
import TabelTeam from '@/components/team/TabelTeam.vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
import FormTim from '@/components/admin/FormTim.vue';
import Pagination from '@/components/Pagination.vue';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authStore = useAuthStore();
const toast = useToast();

// State Data
const teams = ref([]);
const allUsers = ref([]);
const totalTeams = ref(0);

// State UI
const isModalOpen = ref(false);
const viewMode = ref('table');
const isLoading = ref(false);
const searchQuery = ref('');
const filterMode = ref('saya'); // 'saya' | 'semua'
let debounceTimer = null;

// Pagination State
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Responsive View Mode
const updateViewMode = () => {
  if (window.innerWidth < 768) {
    viewMode.value = 'card';
  } else {  
    viewMode.value = 'table';
  }
};

// Handler Ganti Filter
const setFilter = (mode) => {
  filterMode.value = mode;
  currentPage.value = 1;
  fetchTeams();
};

// --- CORE FETCH LOGIC (FIXED) ---
const fetchTeams = async (query = searchQuery.value) => {
  isLoading.value = true;
  
  try {
    // 1. Fetch Users untuk Modal (hanya sekali)
    if (allUsers.value.length === 0 && authStore.isAdmin) {
       const usersRes = await axios.get(`${baseURL}/api/users`, { params: { limit: 10000 } });
       allUsers.value = usersRes.data.items;
    }

    // 2. Logika "TIM SAYA" (Fix: Fetch Full Data lalu Filter di Client)
    if (filterMode.value === 'saya') {
      
      // Ambil daftar ID tim dari Store (Membership & Kepemimpinan)
      const myTeamIds = new Set([
        ...(authStore.user?.teams || []).map(t => t.id),
        ...(authStore.user?.ketuaTimAktif || []).map(t => t.id)
      ]);

      if (myTeamIds.size === 0) {
        teams.value = [];
        totalTeams.value = 0;
        isLoading.value = false;
        return;
      }

      // Fetch Data Lengkap dari Server (Limit besar untuk filter lokal)
      // Kita butuh data lengkap (Ketua, Users, dll) yang tidak ada di Store
      const response = await axios.get(`${baseURL}/api/teams/active`, {
        params: {
          q: query,
          limit: 1000 // Ambil cukup banyak untuk memastikan tim user terambil
        }
      });
      
      const allActiveTeams = response.data.items;

      // Filter: Hanya ambil tim yang ID-nya ada di myTeamIds
      let myTeamsFullData = allActiveTeams.filter(team => myTeamIds.has(team.id));

      // Sorting Terbaru (ID descending)
      myTeamsFullData.sort((a, b) => b.id - a.id);

      // Pagination Client Side
      totalTeams.value = myTeamsFullData.length;
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      teams.value = myTeamsFullData.slice(start, end);

    } 
    // 3. Logika "SEMUA TIM" (Server Side Pagination standard)
    else {
      const skip = (currentPage.value - 1) * itemsPerPage.value;
      const response = await axios.get(`${baseURL}/api/teams/active`, {
        params: { 
          q: query,
          skip: skip, 
          limit: itemsPerPage.value 
        }
      });
      
      teams.value = response.data.items;
      totalTeams.value = response.data.total;
    }

  } catch (error) {
    toast.error("Gagal memuat data tim.");
    console.error("Gagal mengambil data tim:", error);
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchTeams();
}

const handleTeamSubmit = async (formData) => {
  try {
    await axios.post(`${baseURL}/api/teams`, formData);
    toast.success("Tim berhasil dibuat!");
    closeModal();
    await authStore.fetchUser(); // Refresh store jika user jadi anggota tim baru
    await fetchTeams();
  } catch (error) {
    const errorMsg = error.response?.data?.detail?.[0]?.msg || "Gagal menyimpan. Periksa kembali isian Anda.";
    toast.error(errorMsg);
  }
};

const openModal = () => { isModalOpen.value = true; };
const closeModal = () => { isModalOpen.value = false; };

// Watchers
watch(searchQuery, (newQuery) => {
  currentPage.value = 1;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchTeams(newQuery);
  }, 500);
});

watch(() => authStore.user, () => {
  if (filterMode.value === 'saya') fetchTeams();
}, { deep: true });

onMounted(() => {
  updateViewMode();
  window.addEventListener('resize', updateViewMode);
  fetchTeams();
});
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>