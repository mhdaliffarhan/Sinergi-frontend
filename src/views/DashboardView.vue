<template>
  <div class="min-h-screenfont-sans transition-colors duration-300">
    
    <!-- BACKGROUND DECORATIONS -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl opacity-60 dark:opacity-20"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl opacity-60 dark:opacity-20"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto">
      
      <!-- HEADER SECTION -->
      <div class="mb-8 sm:mb-10 flex flex-col md:flex-row md:justify-between gap-6">
        
        <!-- KIRI: Sapaan & Tombol Action -->
        <div class="flex flex-col items-start gap-4">
          <!-- Sapaan -->
          <div>
            <h1 class="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <span class="text-3xl sm:text-5xl animate-bounce-slow">👋</span> 
              <div class="flex flex-col">
                <span class="text-base sm:text-xl font-medium text-gray-500 dark:text-gray-400">Selamat {{ greeting }},</span>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 leading-tight">
                  {{ username }}
                </span>
              </div>
            </h1>
          </div>

          <!-- Tombol Buat Aktivitas -->
          <button 
            @click="openModalAktivitas" 
            class="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span class="text-xl font-bold">+</span>
            <span class="font-semibold">Buat Aktivitas</span>
          </button>
        </div>

        <!-- KANAN: Info & Filter -->
        <div class="flex flex-col items-start md:items-end gap-3">
          
          <!-- Tanggal -->
          <div class="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
             <span class="text-xl">📅</span>
             <p class="text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">
               {{ currentDate }}
             </p>
          </div>
          
          <!-- Role & Filter Container -->
          <div class="flex flex-col md:items-end gap-2 w-full md:w-auto">
            
            <!-- Badge Role -->
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-800 self-start md:self-end">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <p class="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                {{ roleLabel }}
              </p>
            </div>

            <!-- FILTER TIM (Khusus Ketua Tim) -->
            <div v-if="isKetuaTim && managedTeams.length > 0" class="mt-1 w-full md:w-64">
               <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <select 
                    v-model="selectedTeamId"
                    @change="handleTeamFilterChange"
                    class="block w-full pl-10 pr-10 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer hover:border-blue-300 transition-colors"
                  >
                    <option v-for="tim in managedTeams" :key="tim.id" :value="tim.id">
                      {{ tim.namaTim }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
               </div>
            </div>

          </div>
        </div>

      </div>

      <!-- LOADING STATE -->
      <transition name="fade" mode="out-in">
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 space-y-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-white/20">
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
              <DashboardStats title="Total Project" :value="stats.totalProject" icon="💼" color="yellow" />
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
                    <DashboardTeamTimeline :team-id="selectedTeamId" />
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
      </transition>

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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { useToast } from 'vue-toastification';

import DashboardStats from '@/components/dashboard/DashboardStats.vue';
import DashboardTodoList from '@/components/dashboard/DashboardTodoList.vue';
import DashboardAgenda from '@/components/dashboard/DashboardAgenda.vue';
import DashboardChart from '@/components/dashboard/DashboardChart.vue';
import DashboardTimeline from '@/components/dashboard/DashboardTimeline.vue';
import DashboardTeamTimeline from '@/components/dashboard/DashboardTeamTimeline.vue';

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

const isModalOpen = ref(false);
const teamList = ref([]);
const projectList = ref([]);
const pegawaiList = ref([]);
const teamMembers = ref([]); 

const managedTeams = ref([]);
const selectedTeamId = ref(null);

const isKepala = computed(() => {
  const jabName = authStore.user?.jabatan?.namaJabatan;
  return (jabName && jabName.toLowerCase().includes('kepala')) ;
});

const isKetuaTim = computed(() => {
  return !isKepala.value && authStore.user?.isKetuaTim;
});

const roleLabel = computed(() => {
  if (isKepala.value) return 'Dashboard Pimpinan';
  if (isKetuaTim.value) return 'Dashboard Ketua Tim';
  return 'Dashboard Pegawai';
});

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

const fetchChartData = async (months = 6) => {
  if (!isKepala.value) return;
  chartData.value = null; 
  try {
      const resChart = await axios.get(`${baseURL}/api/aktivitas/trend`, { 
           params: { group_by: 'all_teams', months: months } 
      });
      chartData.value = resChart.data;
  } catch (e) {
      chartData.value = []; 
  }
};

const fetchDashboardData = async () => {
  isLoading.value = true;
  try {
    const params = {};
    if (isKetuaTim.value && selectedTeamId.value) {
        params.team_id = selectedTeamId.value;
    }

    const resStats = await axios.get(`${baseURL}/api/dashboard/stats`, { params });
    stats.value = resStats.data;

    if (!isKepala.value) {
        const resTodo = await axios.get(`${baseURL}/api/dashboard/todo`, { params });
        todoList.value = resTodo.data;
    } else {
        await fetchChartData(6);
        const resTeams = await axios.get(`${baseURL}/api/teams/active`);
        allTeams.value = resTeams.data.items || [];
    }

    const scope = 'me';
    const agendaParams = { ...params, limit: 2000, user_scope: scope };
    
    const resAgenda = await axios.get(`${baseURL}/api/aktivitas`, {
        params: agendaParams
    });
    agendaList.value = resAgenda.data.items;

  } catch (error) {
    toast.error("Gagal memuat data dashboard.");
  } finally {
    isLoading.value = false;
  }
};

const handleTeamFilterChange = () => {
    fetchDashboardData();
};

const fetchFormData = async () => {
  try {
    const [teamsRes, projectsRes, pegawaiRes] = await Promise.all([
      axios.get(`${baseURL}/api/teams/active`, { params: { limit: 100 }}),
      axios.get(`${baseURL}/api/projects`, { params: { limit: 10000 } }),
      axios.get(`${baseURL}/api/users`, { params: { limit: 10000 } })
    ]);
    
    teamList.value = teamsRes.data.items || [];
    projectList.value = projectsRes.data.items || [];
    pegawaiList.value = pegawaiRes.data.items || [];
    
  } catch (error) {
    console.error("Gagal memuat data form:", error);
  }
};

const openModalAktivitas = () => { 
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
  if (isKetuaTim.value && authStore.user?.ketuaTimAktif) {
      managedTeams.value = authStore.user.ketuaTimAktif;
  }

  if (managedTeams.value.length > 0) selectedTeamId.value = managedTeams.value[0].id;

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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>