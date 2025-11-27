<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span class="text-3xl">🏢</span> Manajemen Tim
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Kelola struktur tim, anggota, dan peran dalam organisasi.
        </p>
      </div>
      
      <div class="mt-4 sm:mt-0 flex-shrink-0">
        <button 
          @click="openCreateModal" 
          class="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span class="text-xl font-bold">+</span>
          <span class="font-semibold">Buat Tim Baru</span>
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 mb-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
      <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl"></div>

      <div class="flex flex-col md:flex-row gap-5 items-center relative z-10 w-full">
        
        <div class="relative w-full md:flex-1 group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Cari tim berdasarkan nama..."
            class="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-blue-500 transition-all shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
          />
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto justify-end flex-shrink-0">
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
        <p class="font-medium">Memuat data tim...</p>
      </div>

      <div v-else-if="!isLoading && teams.length === 0" class="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 group hover:border-blue-300 transition-colors">
        <span class="text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📭</span>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          Belum Ada Tim
        </h3>
        <p class="text-gray-500 dark:text-gray-400 text-center max-w-sm mt-2">
          Tidak ditemukan tim yang sesuai dengan pencarian Anda.
        </p>
        <button @click="openCreateModal" class="mt-6 text-blue-600 hover:text-blue-800 font-medium text-sm">
          + Buat Tim Baru
        </button>
      </div>

      <div v-else class="animate-fade-in-up">
        
        <DaftarTeam 
          v-if="viewMode === 'card'" 
          :teams="teams" 
          @edit="openDetailModal" 
          @delete="confirmDeleteTeam" 
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        />

        <div v-if="viewMode === 'table'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th scope="col" class="px-6 py-4 font-semibold">Nama Tim</th>
                  <th scope="col" class="px-6 py-4 font-semibold">Ketua Tim</th>
                  <th scope="col" class="px-6 py-4 font-semibold">Periode Aktif</th>
                  <th scope="col" class="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                <tr 
                  v-for="(team, index) in teams" 
                  :key="team.id" 
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer group"
                  @click="openDetailModal(team)"
                >
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center gap-3">
                    <div 
                      class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm"
                      :style="{ backgroundColor: team.warna || '#3b82f6' }"
                    >
                      {{ team.namaTim?.charAt(0) || '?' }}
                    </div>
                    {{ team.namaTim }}
                  </th>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2" v-if="team.ketuaTim">
                      <span class="text-gray-700 dark:text-gray-300">{{ team.ketuaTim.namaLengkap }}</span>
                    </div>
                    <span v-else class="text-gray-400 italic">-</span>
                  </td>
                  <td class="px-6 py-4 text-gray-500">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {{ formatPeriode(team.validFrom, team.validUntil) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" @click.stop>
                      <button @click="openDetailModal(team)" class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors" title="Detail Tim">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button v-if="authStore.isSuperAdmin" @click="confirmDeleteTeam(team)" class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Hapus Tim">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <Pagination
      v-if="totalTeams > itemsPerPage"
      :current-page="currentPage"
      :total-items="totalTeams"
      :items-per-page="itemsPerPage"
      @page-changed="handlePageChange"
      class="mt-1"
    />

    <ModalWrapper :show="isModalOpen" @close="closeModal" :title="modalTitle">
      <FormTim
        v-if="!isEditMode"
        :user-list="allUsers"
        @close="closeModal" 
        @submit="handleTeamCreate" 
      />
      <TeamDetailModal
          v-if="isEditMode && selectedTeam"
          :team="selectedTeam"
          :user-list="allUsers"
          @close="closeModal"
          @teamUpdated="handleTeamUpdate"
      />
    </ModalWrapper>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import ModalWrapper from '@/components/ModalWrapper.vue';
import FormTim from '@/components/admin/FormTim.vue';
import TeamDetailModal from '@/components/admin/TeamDetailModal.vue';
import Pagination from '@/components/Pagination.vue';
import { useAuthStore } from '@/stores/auth';
import DaftarTeam from '@/components/team/DaftarTeam.vue';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authStore = useAuthStore();
const toast = useToast();
const teams = ref([]);
const allUsers = ref([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedTeam = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalTeams = ref(0);
const searchQuery = ref('');
let debounceTimer = null;
const viewMode = ref('table');

const modalTitle = computed(() => {
    if (isEditMode.value && selectedTeam.value) {
    return `Kelola Tim: ${selectedTeam.value.namaTim}`;
  }
  return 'Tambah Tim Baru';
});

const fetchData = async () => {
  isLoading.value = true;
  try {
    const skip = (currentPage.value - 1) * itemsPerPage.value;
    const [teamsRes, usersRes] = await Promise.all([
      axios.get(`${baseURL}/api/teams`, {
        params: { 
          q: searchQuery.value,
          skip: skip, 
          limit: itemsPerPage.value 
        }
      }),
      axios.get(`${baseURL}/api/users`, { params: { limit: 10000 } }) 
    ]);

    teams.value = teamsRes.data.items;
    totalTeams.value = teamsRes.data.total;
    allUsers.value = usersRes.data.items;

  } catch (error) {
    toast.error("Gagal memuat data administrasi.");
    console.error("Gagal mengambil data:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => { 
  updateViewMode();
  window.addEventListener('resize', updateViewMode);
  fetchData(); 
});

watch(searchQuery, () => {
  currentPage.value = 1;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchData();
  }, 500);
});

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchData();
};

const updateViewMode = () => {
  if (window.innerWidth < 768) {
    viewMode.value = 'card';
  } else {  
    viewMode.value = 'table';
  }
};

const formatPeriode = (start, end) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const startDate = start ? new Date(start).toLocaleDateString('id-ID', options) : '...';
  const endDate = end ? new Date(end).toLocaleDateString('id-ID', options) : '...';
  return `${startDate} - ${endDate}`;
};

const openCreateModal = () => {
    isEditMode.value = false;
    selectedTeam.value = null;
    isModalOpen.value = true;
};

const openDetailModal = (team) => {
    isEditMode.value = true;
    selectedTeam.value = team;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedTeam.value = null;
    isEditMode.value = false; 
};

const handleTeamCreate = async (formData) => {
  try {
    await axios.post(`${baseURL}/api/teams`, formData);
    toast.success(`Tim "${formData.namaTim}" berhasil dibuat.`);
    closeModal();
    await fetchData();
  } catch (error) {
    toast.error(error.response?.data?.detail || "Gagal membuat tim.");
  }
};

const handleTeamUpdate = async (formData) => {
    try {
        await axios.put(`${baseURL}/api/teams/${formData.id}`, formData);
        toast.success(`Tim "${formData.namaTim}" berhasil diperbarui.`);
        closeModal();
        await fetchData();
    } catch (error) {
        toast.error(error.response?.data?.detail || "Gagal memperbarui tim.");
    }
};

const confirmDeleteTeam = (team) => {
  if (window.confirm(`Apakah Anda yakin ingin menghapus tim "${team.namaTim}"?`)) {
    deleteTeam(team.id);
  }
};

const deleteTeam = async (teamId) => {
  try {
    await axios.delete(`${baseURL}/api/teams/${teamId}`);
    toast.success("Tim berhasil dihapus.");
    await fetchData();
  } catch (error) {
    toast.error(error.response?.data?.detail || error.message);
  }
};
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