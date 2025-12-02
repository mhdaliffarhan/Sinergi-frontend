<template>
  <div class="min-h-screen p-4 sm:p-8 font-sans transition-colors duration-300">
    
    <!-- HEADER SECTION -->
    <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      
      <!-- KIRI: Sapaan & Tombol Action -->
      <div class="flex flex-col gap-4">
        <!-- Sapaan -->
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span class="text-3xl sm:text-4xl animate-bounce-slow">👋</span> 
            <span>
              Selamat {{ greeting }}, <br class="sm:hidden">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {{ username }}
              </span>
            </span>
          </h1>
        </div>

        <!-- Tombol (Dipindah ke sini) -->
        <div>
          <button 
            @click="openModal" 
            class="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <div class="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
               </svg>
            </div>
            <span class="font-semibold whitespace-nowrap text-sm sm:text-base">Buat Aktivitas</span>
          </button>
        </div>
      </div>
      
      <!-- KANAN: Tanggal & Role Info -->
      <div class="flex flex-col items-start md:items-end gap-1 border-l-4 md:border-l-0 md:border-r-4 border-gray-200 dark:border-gray-700 pl-4 md:pl-0 md:pr-4 py-1">
        <!-- Tanggal -->
        <p class="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {{ currentDate }}
        </p>
        
        <!-- Role Label (Dipindah ke sini) -->
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <p class="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium">
            {{ roleLabel }}
          </p>
        </div>
      </div>

    </div>

    <!-- LOADING STATE -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 space-y-4">
       <div class="relative w-16 h-16">
         <div class="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full opacity-50"></div>
         <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
       </div>
       <p class="text-gray-400 font-medium animate-pulse">Memuat Dashboard...</p>
    </div>

    <!-- MAIN CONTENT -->
    <div v-else class="space-y-8 animate-fade-in-up">
      
      <!-- 1. STATS CARDS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-if="isKepala">
          <DashboardStats title="Total Pegawai" :value="stats.totalPegawai" icon="👥" color="blue" />
          <DashboardStats title="Tim Aktif" :value="stats.totalTim" icon="🏢" color="purple" />
          <DashboardStats title="Aktivitas Bulan Ini" :value="stats.totalAktivitasBulanIni" icon="📊" color="green" />
        </template>

        <template v-else-if="isKetuaTim">
          <DashboardStats title="Anggota Tim" :value="stats.totalAnggotaTim" icon="👥" color="blue" />
          <DashboardStats title="Total Project" :value="stats.totalProject" icon="💼" color="purple" />
          <DashboardStats title="Aktivitas Tim" :value="stats.totalAktivitasBulanIni" icon="🗂️" color="green" />
        </template>

        <template v-else>
          <DashboardStats title="Aktivitas Saya" :value="stats.totalAktivitasSaya" icon="👤" color="blue" />
          <DashboardStats title="Tunggakan Dokumen" :value="todoList.length" icon="⚠️" color="orange" />
          <DashboardStats title="Total Tim" :value="authStore.user?.teams?.length || 0" icon="👥" color="green" />
        </template>
      </div>

      <!-- 2. CHARTS & LISTS AREA -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- Left/Main Column (Charts/Todo) -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Chart untuk Kepala Kantor -->
          <div v-if="isKepala" class="h-[500px]">
             <DashboardChart 
                :raw-stats="chartData" 
                :team-list="allTeams" 
                @filter="fetchChartData" 
             />
          </div>

          <!-- Content untuk Pegawai/Ketua Tim -->
          <div v-else class="space-y-8">
             <div v-if="isKetuaTim" class="h-[500px]">
                <DashboardTeamTimeline />
             </div>

             <div class="h-[500px]">
                <DashboardTodoList 
                   :items="todoList" 
                   :role="isKetuaTim ? 'leader' : 'member'" 
                />
             </div>
          </div>

        </div>

        <!-- Right Column (Agenda) -->
        <div class="lg:col-span-1 h-[500px]">
           <DashboardAgenda :events="agendaList" />
        </div>

      </div>
      
      <!-- 3. BOTTOM SECTION (Timeline Kepala) -->
      <div v-if="isKepala" class="w-full">
         <DashboardTimeline />
      </div>

    </div>

    <!-- MODAL FORM -->
    <ModalWrapper :show="isModalOpen" @close="closeModal" title="Buat Aktivitas Baru">
      <FormAktivitas 
        tipe="Buat" 
        @close="closeModal" 
        @submit="handleActivitySubmit" 
        :team-list="teamList" 
        :project-list="projectList" 
        :pegawai-list="pegawaiList" 
        :team-members="teamMembers" 
      />
    </ModalWrapper>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { useToast } from 'vue-toastification';

// Import Widgets Dashboard
import DashboardStats from '@/components/dashboard/DashboardStats.vue';
import DashboardTodoList from '@/components/dashboard/DashboardTodoList.vue';
import DashboardAgenda from '@/components/dashboard/DashboardAgenda.vue';
import DashboardChart from '@/components/dashboard/DashboardChart.vue';
import DashboardTimeline from '@/components/dashboard/DashboardTimeline.vue';
import DashboardTeamTimeline from '@/components/dashboard/DashboardTeamTimeline.vue';

// Import Komponen Form
import ModalWrapper from '@/components/ModalWrapper.vue';
import FormAktivitas from '@/components/aktivitas/FormAktivitas.vue';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authStore = useAuthStore();
const toast = useToast();

const isLoading = ref(true);
const stats = ref({});
const todoList = ref([]);
const agendaList = ref([]); 
const chartData = ref([]);
const allTeams = ref([]);

// State untuk Form Aktivitas
const isModalOpen = ref(false);
const teamList = ref([]);
const projectList = ref([]);
const pegawaiList = ref([]);
const teamMembers = ref([]); 

// --- ROLE LOGIC ---
const isKepala = computed(() => {
  const jabName = authStore.user?.jabatan?.namaJabatan;
  return (jabName && jabName.toLowerCase().includes('kepala')) ;
});

const isKetuaTim = computed(() => {
  return !isKepala.value && authStore.user?.isKetuaTim;
});

// Label Role untuk Header
const roleLabel = computed(() => {
  if (isKepala.value) return 'Dashboard Pimpinan';
  if (isKetuaTim.value) return 'Dashboard Ketua Tim';
  return 'Dashboard Pegawai';
});

// UI Helpers
const username = computed(() => authStore.user?.namaLengkap || 'User');

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 11) return 'Pagi';
  if (hour < 15) return 'Siang';
  if (hour < 19) return 'Sore';
  return 'Malam';
});

const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
});

// --- FETCH DASHBOARD DATA ---
const fetchChartData = async (months = 6) => {
  if (!isKepala.value) return;
  chartData.value = null; 
  try {
      const resChart = await axios.get(`${baseURL}/api/aktivitas/trend`, { 
           params: { group_by: 'all_teams', months: months } 
      });
      chartData.value = resChart.data;
  } catch (e) {
      console.warn("Gagal memuat grafik", e);
      chartData.value = []; 
  }
};

const fetchDashboardData = async () => {
  isLoading.value = true;
  try {
    // 1. Stats (Semua Role)
    const resStats = await axios.get(`${baseURL}/api/dashboard/stats`);
    stats.value = resStats.data;

    // 2. Logic Percabangan Data
    if (!isKepala.value) {
        const resTodo = await axios.get(`${baseURL}/api/dashboard/todo`);
        todoList.value = resTodo.data;
    } else {
        await fetchChartData(6);
        const resTeams = await axios.get(`${baseURL}/api/teams/active`);
        allTeams.value = resTeams.data.items || [];
    }

    // 3. Agenda (Semua Role)
    const scope = isKepala.value ? 'all' : 'me';
    const resAgenda = await axios.get(`${baseURL}/api/aktivitas`, {
        params: { limit: 200, user_scope: scope } 
    });
    agendaList.value = resAgenda.data.items;

  } catch (error) {
    console.error("Dashboard Error:", error);
    toast.error("Gagal memuat data dashboard.");
  } finally {
    isLoading.value = false;
  }
};

// --- FORM AKTIVITAS LOGIC ---
const fetchFormData = async () => {
  try {
    const [teamsRes, projectsRes, pegawaiRes] = await Promise.all([
      axios.get(`${baseURL}/api/teams/active`),
      axios.get(`${baseURL}/api/projects`, { params: { limit: 1000 } }),
      axios.get(`${baseURL}/api/users`, { params: { limit: 10000 } })
    ]);
    
    teamList.value = teamsRes.data.items || [];
    projectList.value = projectsRes.data.items || [];
    pegawaiList.value = pegawaiRes.data.items || [];
    
  } catch (error) {
    console.error("Gagal memuat data form:", error);
  }
};

const openModal = () => { 
  if (teamList.value.length === 0) {
    fetchFormData();
  }
  isModalOpen.value = true; 
};

const closeModal = () => { isModalOpen.value = false; };

const handleActivitySubmit = async (formData) => {
  const payload = { ...formData };
  const nullableFields = ['tanggalMulai', 'tanggalSelesai', 'jamMulai', 'jamSelesai'];
  nullableFields.forEach(field => {
    if (payload[field] === '') payload[field] = null;
  });

  try {
    await axios.post(`${baseURL}/api/aktivitas`, payload);
    toast.success("Aktivitas berhasil dibuat!");
    closeModal();
    fetchDashboardData();
  } catch (error) {
    const errorMsg = error.response?.data?.detail?.[0]?.msg || "Gagal menyimpan. Periksa kembali isian Anda.";
    toast.error(errorMsg);
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-bounce-slow {
  animation: bounce 2s infinite;
}
</style>