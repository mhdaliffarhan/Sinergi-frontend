<template>
  <div>
    <!-- 
      BAGIAN 1: HEADER HALAMAN
      Judul di kiri, Tombol "Buat Baru" di kanan.
    -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-green-700 dark:text-green-500">
          Daftar Aktivitas
        </h1>
      </div>
      <div class="mt-4 sm:mt-0 flex-shrink-0">
        <button 
          @click="openModal" 
          class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <!-- Emoji konsisten dengan UI lain -->
          <span class="text-lg">+</span>
          <span>Buat Aktivitas Baru</span>
        </button>
      </div>
    </div>

    <!-- 
      BAGIAN 2: KARTU FILTER & AKSI
      Filter di kiri, Tombol Aksi (View Mode, Download) di kanan.
    -->
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 sm:p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-4 justify-between">
        
        <!-- Kiri: Grup Filter -->
        <div class="flex flex-col sm:flex-row gap-3 flex-wrap items-center">
          
          <!-- Filter Scope (Aktivitas Saya / Semua) -->
          <div class="relative flex-shrink-0 flex items-center bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-full sm:w-auto">
            <button
              @click="filterScope = 'me'"
              class="relative z-10 w-1/2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-300"
              :class="filterScope === 'me' ? 'text-white' : 'text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'"
            >
              Aktivitas Saya
            </button>
            <button
              @click="filterScope = 'all'"
              class="relative z-10 w-1/2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-300"
              :class="filterScope === 'all' ? 'text-white' : 'text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'"
            >
              Semua Aktivitas
            </button>
            <span
              class="absolute top-1 bottom-1 left-1 w-1/2 bg-blue-600 rounded-md shadow-md transition-transform duration-300 ease-in-out"
              :class="{ 'translate-x-0': filterScope === 'me', 'translate-x-full': filterScope === 'all' }"
            ></span>
          </div>

          <!-- Filter Waktu (Bulan & Tahun) -->
          <div class="flex gap-3 w-full sm:w-auto">
            <!-- Filter Bulan -->
            <div class="relative w-1/2 sm:w-36">
              <select v-model="filterMonth" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm text-sm py-2 pl-3 pr-8 appearance-none">
                <option v-for="month in monthOptions" :key="month.value" :value="month.value">{{ month.label }}</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
            
            <!-- Filter Tahun -->
            <div class="relative w-1/2 sm:w-28">
              <select v-model="filterYear" class="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm text-sm py-2 pl-3 pr-8 appearance-none">
                <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Kanan: Grup Aksi (View Mode & Download) -->
        <div class="flex-shrink-0 flex flex-col sm:flex-row items-center gap-3">
          
          <!-- View Mode Toggle (Permintaan #2) -->
          <div class="relative inline-flex items-center bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <span
              class="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] bg-orange-500 rounded-md shadow-md transition-transform duration-300 ease-in-out"
              :class="{ 'translate-x-full': viewMode === 'table' }"
            ></span>
            <!-- Tombol Card -->
            <button
              @click="viewMode = 'card'"
              title="Tampilan Kartu"
              class="relative z-10 w-1/2 px-3 py-1.5 flex justify-center items-center transition-colors duration-300"
              :class="viewMode === 'card' ? 'text-white' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </button>
            <!-- Tombol Table -->
            <button
              @click="viewMode = 'table'"
              title="Tampilan Tabel"
              class="relative z-10 w-1/2 px-3 py-1.5 flex justify-center items-center transition-colors duration-300"
              :class="viewMode === 'table' ? 'text-white' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
            </button>
          </div>
          
          <!-- Tombol Download Excel -->
          <button 
            @click="handleDownloadExcel" 
            :disabled="isDownloading"
            class="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span class="text-sm font-medium">
              {{ isDownloading ? 'Mendownload...' : 'Download Excel' }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- 
      BAGIAN 3: SEARCH BAR
    -->
    <div class="mb-6 relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>
      <input 
        type="text" 
        v-model="searchQuery"
        placeholder="Cari aktivitas dalam filter bulan/tahun yang dipilih..."
        class="block w-full sm:w-96 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm"
      />
    </div>

    <!-- 
      BAGIAN 4: TABEL AKTIVITAS
    -->
    <div class="mt-6">
      <!-- 1. Tampilan Loading -->
      <div v-if="isLoading" class="text-center p-10 text-gray-500 dark:text-gray-400">
        <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-sm">Memuat aktivitas...</p>
      </div>
      
      <!-- 2. Tampilan Kosong (Dinamis) -->
      <div v-else-if="!isLoading && aktivitas.length === 0" class="text-center p-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <span class="text-5xl">🧐</span>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mt-4">
          Tidak Ada Aktivitas Ditemukan
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Belum ada aktivitas pada bulan {{ selectedMonthName }} Tahun {{ filterYear }}.
        </p>
      </div>

      <!-- 3. Tampilan Konten (Jika Ada Data) -->
      <div v-else>
        <DaftarAktivitas v-if="viewMode === 'card'" :aktivitas="aktivitas" />
        <TabelAktivitas v-if="viewMode === 'table'" :aktivitas="aktivitas" />
      </div>
    </div>

    <!-- 
      BAGIAN 5: PAGINATION
      Hanya tampil jika ada item, di luar logic loading/empty
    -->
    <Pagination
      v-if="totalAktivitas > itemsPerPage"
      :current-page="currentPage"
      :total-items="totalAktivitas"
      :items-per-page="itemsPerPage"
      @page-changed="handlePageChange"
      class="mt-6"
    />

    <!-- 
      BAGIAN 6: MODAL
      Tetap di root level
    -->
    <ModalWrapper :show="isModalOpen" @close="closeModal" title="Buat Aktivitas Baru">
      <FormAktivitas @close="closeModal" @submit="handleActivitySubmit" tipe="Buat" :team-list="teamList" :project-list="projectList" :team-members="teamMembers" :pegawai-list="pegawaiList" />
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
const searchQuery = ref('');
let debounceTimer = null;

const filterScope = ref('me');
const filterMonth = ref(new Date().getMonth() + 1);
const filterYear = ref(new Date().getFullYear());

// PAGINATION
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
  return month ? month.label : 'bulan ini';
});

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
    const response = await axios.get(`${baseURL}/api/teams/active`);
    const fetchedTeams = response.data.items || []; 
    teamList.value = fetchedTeams.map(team => ({
        id: team.id,
        namaTim: team.namaTim 
    }));
  } catch (error) {
    toast.error("Gagal memuat daftar tim.");
    console.error("Gagal mengambil data tim:", error);
  }
};

const fetchPegawai = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/users`, {
      params : {
        limit : 10000
      }
    });
    const sortedPegawai = response.data.items.sort((a,b) =>{
      return a.namaLengkap.localeCompare(b.namaLengkap, 'id', { sensitivity: 'base' });
    });

    pegawaiList.value = sortedPegawai;
  } catch (error) {
    toast.error("Gagal memuat data pegawai.");
    console.error("Gagal mengambil data pegawai", error);
  }
}

const fetchProjects = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/projects`, {
      params: {limit : 1000}
    });
    projectList.value = response.data.items.map(project => ({
      id: project.id,
      namaProject: project.namaProject,
      teamId: project.teamId,
      projectLeaderId: project.projectLeaderId
    }));
  } catch (error) {
    toast.error("Gagal memuat data project");
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

// Watcher untuk pagination
watch(currentPage, fetchAktivitas);

onMounted(() => {
  updateViewMode();
  window.addEventListener('resize', updateViewMode);
  fetchAktivitas();
  fetchTeams();
  fetchProjects();
  fetchPegawai();
});

// --- FUNGSI SUBMIT YANG MENGGABUNGKAN SEMUANYA ---
const handleActivitySubmit = async (formData) => {
  const payload = { ...formData };
  const nullableFields = ['tanggal', 'tanggalMulai', 'tanggalSelesai', 'jamMulai', 'jamSelesai'];

  // Loop melalui setiap field dan ubah nilainya jika kosong
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
    console.error("Gagal menyimpan aktivitas:", error.response?.data || error.message);
  }
};

const handleDownloadExcel = async () => {
  isDownloading.value = true;
  toast.info("Mempersiapkan file Excel... Ini mungkin perlu waktu.", { timeout: 3000 });
  
  try {
    // Siapkan params, SAMA seperti fetch, tapi TANPA pagination (skip/limit)
    const params = {
      user_scope: filterScope.value,
      month: filterMonth.value,
      year: filterYear.value
    };
    
    const response = await axios.get(`${baseURL}/api/aktivitas/download-excel`, { 
      params,
      responseType: 'blob' // Ini SANGAT PENTING untuk menerima file
    });
    
    // Buat link di memori untuk men-trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    
    // Coba dapatkan nama file dari header
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
    
    // Bersihkan link
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

const openModal = () => { isModalOpen.value = true; };
const closeModal = () => { isModalOpen.value = false; };
</script>