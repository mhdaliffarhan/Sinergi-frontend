<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span class="text-3xl">🗂️</span> Daftar Aktivitas
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Kelola, pantau, dan arsipkan semua kegiatan tim Anda.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex-shrink-0">
        <button 
          @click="openModal" 
          class="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span class="text-xl font-bold">+</span>
          <span class="font-semibold">Buat Aktivitas</span>
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 sm:p-5 mb-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
      <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-green-500/5 rounded-full blur-2xl"></div>

      <div class="relative z-10 space-y-4">
        
        <div class="flex justify-center sm:justify-start">
          <div class="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex w-full sm:w-auto shadow-inner">
            <button
              @click="filterScope = 'me'"
              class="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 ease-out"
              :class="filterScope === 'me' 
                ? 'text-blue-700 dark:text-blue-100 shadow-sm bg-white dark:bg-gray-600' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
            >
              👤 Saya
            </button>
            <button
              @click="filterScope = 'all'"
              class="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 ease-out"
              :class="filterScope === 'all' 
                ? 'text-orange-700 dark:text-orange-100 shadow-sm bg-white dark:bg-gray-600' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
            >
              🏢 Semua
            </button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-between gap-4">
          
          <div class="flex gap-2 w-full sm:w-auto">
            <div class="relative flex-grow sm:flex-grow-0 sm:w-40 group">
              <select v-model="filterMonth" class="w-full appearance-none bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 pl-3 pr-8 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer font-medium">
                <option v-for="month in monthOptions" :key="month.value" :value="month.value">{{ month.label }}</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            
            <div class="relative flex-grow sm:flex-grow-0 sm:w-28 group">
              <select v-model="filterYear" class="w-full appearance-none bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 pl-3 pr-8 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer font-medium">
                <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            
            <div class="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex shadow-inner mr-auto sm:mr-0">
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

            <button 
              @click="confirmExcelDownload" 
              :disabled="isDownloading"
              title="Download Rekap Excel"
              class="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
            >
              <span v-if="!isDownloading" class="text-xl">📥</span>
              <svg v-else class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </button>

            <button 
              @click="confirmBackup" 
              :disabled="isBackingUp || isDownloading"
              title="Backup Dokumen (ZIP)"
              class="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-orange-400 to-amber-500 text-white rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
            >
              <span v-if="!isBackingUp" class="text-xl">📦</span>
              <svg v-else class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </button>

          </div>
        </div>

      </div>
    </div>

    <div class="mb-6 relative group">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>
      <input 
        type="text" 
        v-model="searchQuery"
        placeholder="Cari aktivitas, tim, atau deskripsi..."
        class="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-blue-500 transition-all shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
      />
    </div>

    <div class="mt-6 min-h-[300px]">
      <div v-if="isLoading" class="text-center p-10 text-gray-500 dark:text-gray-400 animate-pulse">
        <div class="inline-block p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-3">
          <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="font-medium">Sedang memuat data...</p>
      </div>
      
      <div v-else-if="!isLoading && aktivitas.length === 0" class="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 group hover:border-blue-300 transition-colors">
        <span class="text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📭</span>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          Belum Ada Aktivitas
        </h3>
        <p class="text-gray-500 dark:text-gray-400 text-center max-w-sm mt-2">
          Tidak ditemukan data untuk bulan <span class="font-semibold text-blue-600">{{ selectedMonthName }} {{ filterYear }}</span>.
          <br>Silakan ubah filter atau buat aktivitas baru.
        </p>
        <button @click="openModal" class="mt-6 text-blue-600 hover:text-blue-800 font-medium text-sm">
          + Buat Aktivitas Sekarang
        </button>
      </div>

      <div v-else class="animate-fade-in-up">
        <DaftarAktivitas v-if="viewMode === 'card'" :aktivitas="aktivitas" />
        <TabelAktivitas v-if="viewMode === 'table'" :aktivitas="aktivitas" />
      </div>
    </div>

    <Pagination
      v-if="totalAktivitas > itemsPerPage"
      :current-page="currentPage"
      :total-items="totalAktivitas"
      :items-per-page="itemsPerPage"
      @page-changed="handlePageChange"
      class="mt-1"
    />

    <ModalWrapper :show="isModalOpen" @close="closeModal" title="Buat Aktivitas Baru">
      <FormAktivitas @close="closeModal" @submit="handleActivitySubmit" tipe="Buat" :team-list="teamList" :project-list="projectList" :team-members="teamMembers" :pegawai-list="pegawaiList" />
    </ModalWrapper>

    <ModalWrapper :show="showExcelConfirm" @close="showExcelConfirm = false" title="Download Laporan Excel">
      <div class="p-1">
        <div class="flex items-start mb-4">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
            📥
          </div>
          <div class="ml-3">
            <p class="text-sm text-gray-500 dark:text-gray-300">
              Anda akan mengunduh rekap aktivitas untuk:
            </p>
            <p class="font-bold text-gray-800 dark:text-white mt-1">
              Bulan: {{ selectedMonthName }} {{ filterYear }}
            </p>
            <p class="font-bold text-gray-800 dark:text-white">
              Filter: {{ filterScope === 'me' ? 'Aktivitas Saya' : 'Semua Aktivitas' }}
            </p>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="showExcelConfirm = false" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Batal</button>
          <button @click="processDownloadExcel" class="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition">
            Ya, Download
          </button>
        </div>
      </div>
    </ModalWrapper>

    <ModalWrapper :show="showBackupConfirm" @close="showBackupConfirm = false" title="Backup Dokumen (ZIP)">
      <div class="p-1">
        <div class="flex items-start mb-4">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl">
            📦
          </div>
          <div class="ml-3">
            <p class="text-sm text-gray-500 dark:text-gray-300">
              Sistem akan mengompres semua dokumen fisik pada bulan <strong>{{ selectedMonthName }} {{ filterYear }}</strong> menjadi satu file ZIP.
            </p>
            <div class="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-3 rounded">
              <p class="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Perhatian:</strong> Proses ini mungkin memakan waktu beberapa menit tergantung jumlah file. Mohon jangan tutup halaman ini.
              </p>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="showBackupConfirm = false" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Batal</button>
          <button @click="processBackup" class="px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-md transition">
            Mulai Backup
          </button>
        </div>
      </div>
    </ModalWrapper>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import DaftarAktivitas from '@/components/aktivitas/DaftarAktivitas.vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
import FormAktivitas from '@/components/aktivitas/FormAktivitas.vue';
import TabelAktivitas from '@/components/aktivitas/TabelAktivitas.vue';
import Pagination from '@/components/Pagination.vue';

// ... (Bagian import dan setup awal SAMA SEPERTI SEBELUMNYA) ...
const baseURL = import.meta.env.VITE_API_BASE_URL;
const authStore = useAuthStore();
const toast = useToast();
const aktivitas = ref([]);
const teamList = ref([]);
const teamMembers = ref([]);
const projectList = ref([]);
const pegawaiList = ref([]);
const isModalOpen = ref(false);
const viewMode = ref('table');
const isLoading = ref(false);
const isDownloading = ref(false);
const isBackingUp = ref(false); // State Backup
const searchQuery = ref('');
let debounceTimer = null;

const filterScope = ref('me');
const filterMonth = ref(new Date().getMonth() + 1);
const filterYear = ref(new Date().getFullYear());

// State Modal Konfirmasi (BARU)
const showExcelConfirm = ref(false);
const showBackupConfirm = ref(false);

// ... (Pagination state, monthOptions, yearOptions SAMA SEPERTI SEBELUMNYA) ...
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalAktivitas = ref(0);

const monthOptions = computed(() => [
  { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' }, { value: 3, label: 'Maret' },
  { value: 4, label: 'April' }, { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' }, { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' }, { value: 11, label: 'November' }, { value: 12, label: 'Desember' },
]);

const yearOptions = computed(() => {
  const year = new Date().getFullYear();
  return [year - 2, year - 1, year, year + 1];
});

const selectedMonthName = computed(() => {
  const month = monthOptions.value.find(m => m.value === filterMonth.value);
  return month ? month.label : '';
});

// ... (updateViewMode, fetchAktivitas, fetchTeams, fetchPegawai, fetchProjects SAMA SEPERTI SEBELUMNYA) ...
// (Agar jawaban tidak terlalu panjang, saya asumsikan fungsi fetch data standar tidak berubah)
// Pastikan Anda menyalin fungsi fetchAktivitas yang sudah ada logic filternya.

const updateViewMode = () => {
  if (window.innerWidth < 768) {
    viewMode.value = 'card';
  } else {
    viewMode.value = 'table';
  }
};

const fetchAktivitas = async (query = searchQuery.value) => {
   isLoading.value = true;
  try {
    const response = await axios.get(`${baseURL}/api/aktivitas`, {
      params: { 
        q: query,
        month: filterMonth.value,
        year: filterYear.value,
        skip: (currentPage.value - 1) * itemsPerPage.value,
        limit: itemsPerPage.value,
        user_scope: filterScope.value
      }
    });

    aktivitas.value = response.data.items || [];
    totalAktivitas.value = response.data.total || 0;
  } catch (error) {
    toast.error("Gagal memuat data aktivitas.");
    console.error("Gagal mengambil data aktivitas:", error);
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchAktivitas();
};

const fetchTeams = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/teams/active`, { params: { limit : 100 }});
    const fetchedTeams = response.data.items || []; 
    teamList.value = fetchedTeams.map(team => ({
        id: team.id,
        namaTim: team.namaTim 
    }));
  } catch (error) {
    console.error("Gagal mengambil data tim:", error);
  }
};

const fetchPegawai = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/users`, { params : { limit : 10000 } });
    const sortedPegawai = response.data.items.sort((a,b) =>{
      return a.namaLengkap.localeCompare(b.namaLengkap, 'id', { sensitivity: 'base' });
    });
    pegawaiList.value = sortedPegawai;
  } catch (error) {
    console.error("Gagal mengambil data pegawai", error);
  }
}

const fetchProjects = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/projects`, { params: {limit : 1000} });
    projectList.value = response.data.items.map(project => ({
      id: project.id,
      namaProject: project.namaProject,
      teamId: project.teamId,
      projectLeaderId: project.projectLeaderId
    }));
  } catch (error) {
    console.error("Gagal memuat data project: ", error);
  }
}

watch(searchQuery, (newQuery) => {
  currentPage.value = 1;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchAktivitas();
  }, 300);
});

watch([filterScope, filterMonth, filterYear], () => {
  currentPage.value = 1;
  fetchAktivitas();
});

watch(currentPage, fetchAktivitas);

onMounted(() => {
  updateViewMode();
  window.addEventListener('resize', updateViewMode);
  fetchAktivitas();
  fetchTeams();
  fetchProjects();
  fetchPegawai();
});


// --- LOGIKA MODAL KONFIRMASI (BARU) ---

// 1. Trigger Excel
const confirmExcelDownload = () => {
  showExcelConfirm.value = true;
};

const processDownloadExcel = async () => {
  showExcelConfirm.value = false; // Tutup modal
  isDownloading.value = true;
  toast.info("Mempersiapkan file Excel...", { timeout: 2000 });
  
  try {
    const params = {
      user_scope: filterScope.value,
      month: filterMonth.value,
      year: filterYear.value
    };
    
    const response = await axios.get(`${baseURL}/api/aktivitas/download-excel`, { 
      params,
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    
    const contentDisposition = response.headers['content-disposition'];
    let filename = `daftar_aktivitas_${filterYear.value}-${filterMonth.value}.xlsx`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch.length === 2)
        filename = filenameMatch[1];
    }
    
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    link.remove();
    window.URL.revokeObjectURL(url);
    
    toast.success("File Excel berhasil diunduh.");

  } catch (error) {
    console.error("Gagal mengunduh Excel:", error);
    toast.error("Gagal mengunduh file Excel.");
  } finally {
    isDownloading.value = false;
  }
};

// 2. Trigger Backup
const confirmBackup = () => {
  showBackupConfirm.value = true;
};

const processBackup = async () => {
  showBackupConfirm.value = false; // Tutup modal
  isBackingUp.value = true;
  toast.info("Sedang mengompres file... Proses ini mungkin memakan waktu.", { timeout: 5000 });
  
  try {
    const params = {
      month: filterMonth.value,
      year: filterYear.value
    };
    
    const response = await axios.get(`${baseURL}/api/aktivitas/backup-monthly`, { 
      params,
      responseType: 'blob', 
      timeout: 120000 
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    
    let filename = `Backup_Sinergi_${filterYear.value}-${filterMonth.value}.zip`;
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match && match[2]) filename = match[1];
    }
    
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    link.remove();
    window.URL.revokeObjectURL(url);
    
    toast.success("Backup berhasil diunduh!");

  } catch (error) {
    console.error("Gagal backup:", error);
    if (error.response && error.response.status === 404) {
         toast.warning("Tidak ada dokumen fisik yang ditemukan untuk bulan ini.");
    } else {
         toast.error("Gagal membuat backup. Coba lagi nanti.");
    }
  } finally {
    isBackingUp.value = false;
  }
};

// --- Handle Submit (SAMA SEPERTI SEBELUMNYA) ---
// (Anda bisa gunakan fungsi handleActivitySubmit, openModal, closeModal yang lama)
const handleActivitySubmit = async (formData) => {
  // ... (Logika submit Anda yang sudah diperbaiki sebelumnya) ...
  // Pastikan Anda menggunakan versi yang menghandle null value untuk tanggal/jam
  const payload = { ...formData };
  const nullableFields = ['tanggal', 'tanggalMulai', 'tanggalSelesai', 'jamMulai', 'jamSelesai'];

  nullableFields.forEach(field => {
    if (payload[field] === '') {
      payload[field] = null;
    }
  });
  
  try {
    await axios.post(`${baseURL}/api/aktivitas`, payload);
    toast.success("Aktivitas berhasil dibuat!");
    closeModal();
    await fetchAktivitas();
  } catch (error) {
    const errorMsg = error.response?.data?.detail?.[0]?.msg || "Gagal menyimpan. Periksa kembali isian Anda.";
    toast.error(errorMsg);
  }
};

const openModal = () => { isModalOpen.value = true; };
const closeModal = () => { isModalOpen.value = false; };

</script>

<style>
/* Animasi tambahan untuk list */
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