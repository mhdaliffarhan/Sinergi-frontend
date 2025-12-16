<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span class="text-3xl">🚀</span> Daftar Project
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Kelola inisiatif dan Project tim Anda di sini.
        </p>
      </div>
      
      <div class="mt-4 sm:mt-0 flex-shrink-0" v-if="authStore.user?.isKetuaTim || authStore.isOperator || authStore.isSuperAdmin">
        <button 
          @click="openModal" 
          class="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span class="text-xl font-bold">+</span>
          <span class="font-semibold">Buat Project Baru</span>
        </button>
      </div>
    </div>

    <!-- TAB FILTER -->
    <div class="mb-6">
      <div class="inline-flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
        <button 
          @click="setFilter('saya')"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
          :class="filterMode === 'saya' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
        >
          Project Saya
        </button>
        <button 
          @click="setFilter('semua')"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
          :class="filterMode === 'semua' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
        >
          Semua Project
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 mb-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
      <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-green-500/5 rounded-full blur-2xl"></div>

      <div class="flex flex-col md:flex-row gap-5 justify-between items-center relative z-10">
        
        <div class="relative w-full md:max-w-lg group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Cari Project berdasarkan nama..."
            class="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-blue-500 transition-all shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
          />
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          
          <div class="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex shadow-inner">
            <button
              @click="viewMode = 'card'"
              title="Tampilan Kartu"
              class="p-2 rounded-lg transition-all duration-200"
              :class="viewMode === 'card' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </button>
            <button
              @click="viewMode = 'table'"
              title="Tampilan Tabel"
              class="p-2 rounded-lg transition-all duration-200"
              :class="viewMode === 'table' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="mt-6 min-h-[300px]">
      <div v-if="isLoading" class="text-center p-10 text-gray-500 dark:text-gray-400 animate-pulse">
        <div class="inline-block p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-3">
          <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="font-medium">Memuat daftar Project...</p>
      </div>

      <div v-else-if="!isLoading && projects.length === 0" class="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 group hover:border-blue-300 transition-colors">
        <span class="text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📭</span>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          Belum Ada Project
        </h3>
        <p class="text-gray-500 dark:text-gray-400 text-center max-w-sm mt-2">
          {{ filterMode === 'saya' ? 'Anda belum memiliki project terkait.' : 'Tidak ditemukan Project yang sesuai dengan pencarian Anda.' }}
        </p>
        <button v-if="authStore.user?.isKetuaTim || authStore.isOperator" @click="openModal" class="mt-6 text-blue-600 hover:text-blue-800 font-medium text-sm">
          + Buat Project Baru Sekarang
        </button>
      </div>

      <div v-else class="animate-fade-in-up">
        <DaftarProject v-if="viewMode === 'card'" :projects="projects" />
        <TabelProject 
          v-if="viewMode === 'table'" 
          :projects="projects" 
          :current-page="currentPage" 
          :items-per-page="itemsPerPage"
        />
      </div>
    </div>

    <Pagination
      v-if="totalProjects > itemsPerPage"
      :current-page="currentPage"
      :total-items="totalProjects"
      :items-per-page="itemsPerPage"
      @page-changed="handlePageChange"
      class="mt-1"
    />

    <ModalWrapper :show="isModalOpen" @close="closeModal" title="Buat Project Baru">
      <FormProject tipe="Buat" @close="closeModal" @submit="handleProjectSubmit" :team-list="teamList" />
    </ModalWrapper>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import DaftarProject from '@/components/project/DaftarProject.vue';
import TabelProject from '@/components/project/TabelProject.vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
import FormProject from '@/components/project/FormProject.vue';
import Pagination from '@/components/Pagination.vue';
import { useAuthStore } from '@/stores/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const toast = useToast();
const authStore = useAuthStore();

const projects = ref([]);
const teamList = ref([]);
const isModalOpen = ref(false);
const viewMode = ref('table');
const isLoading = ref(false);
const searchQuery = ref('');
const filterMode = ref('saya'); // Default 'saya'
let debounceTimer = null;

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalProjects = ref(0);

const setFilter = (mode) => {
  filterMode.value = mode;
  currentPage.value = 1;
  fetchProjects();
};

const fetchProjects = async () => {
  isLoading.value = true;
  try {
    
    // A. FETCH SEMUA PROJECT (Server Side)
    if (filterMode.value === 'semua') {
      const skip = (currentPage.value - 1) * itemsPerPage.value;
      const response = await axios.get(`${baseURL}/api/projects`, {
        params: {
          q: searchQuery.value,
          skip: skip,
          limit: itemsPerPage.value
        }
      });
      
      // Sorting ID Desc (Terbaru)
      const items = response.data.items || [];
      items.sort((a, b) => b.id - a.id);
      
      projects.value = items;
      totalProjects.value = response.data.total;
    } 
    
    // B. FETCH PROJECT SAYA (Client Side Logic)
    else {
      // 1. Fetch All (limit besar untuk difilter lokal)
      // Karena belum ada endpoint /projects/me di backend
      const response = await axios.get(`${baseURL}/api/projects`, {
        params: {
          q: searchQuery.value,
          limit: 1000 
        }
      });
      
      let allProjects = response.data.items || [];

      // 2. Ambil List ID Tim Saya
      const myTeamsMember = authStore.user?.teams || [];
      const myTeamsLeader = authStore.user?.ketuaTimAktif || [];
      const myTeamIds = [...myTeamsMember, ...myTeamsLeader].map(t => t.id);
      const myId = authStore.user?.id;

      // 3. Filter: Project milik Tim Saya ATAU Saya Leadernya
      allProjects = allProjects.filter(p => {
        // Cek apakah team project ini ada di list tim saya
        const projectTeamId = p.team?.id || p.teamId;
        const isMyTeam = myTeamIds.includes(projectTeamId);
        
        // Cek apakah saya project leader
        const projectLeaderId = p.projectLeader?.id || p.projectLeaderId;
        const isMyProject = projectLeaderId === myId;
        
        return isMyTeam || isMyProject;
      });

      // 4. Sorting Terbaru
      allProjects.sort((a, b) => b.id - a.id);

      // 5. Pagination Client Side
      totalProjects.value = allProjects.length;
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      projects.value = allProjects.slice(start, end);
    }

  } catch (error) {
    toast.error("Gagal memuat data project.");
    console.error("Gagal mengambil data project:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchTeams = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/teams/active`);
    teamList.value = response.data.items;
  } catch (error) {
    toast.error("Gagal memuat daftar tim.");
    console.error(error);
  }
};

const handleProjectSubmit = async (formData) => {
  try {
    await axios.post(`${baseURL}/api/projects`, formData);
    toast.success("Project berhasil dibuat!");
    closeModal();
    await fetchProjects();
  } catch (error) {
    const errorMsg = error.response?.data?.detail || "Gagal menyimpan project.";
    toast.error(errorMsg);
  }
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchProjects();
};

const openModal = () => { isModalOpen.value = true; };
const closeModal = () => { isModalOpen.value = false; };

// Watchers
watch(searchQuery, (newQuery) => {
  currentPage.value = 1;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchProjects();
  }, 500); 
});

onMounted(() => {
  fetchProjects();
  fetchTeams();
});
</script>

<style scoped>
/* Animasi Fade In Up */
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>