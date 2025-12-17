<template>
  <div class="min-h-screen transition-colors duration-300">
    
    <!-- Child Component: Header & Filter -->
    <KalenderFilter
      v-model:mode="mode"
      v-model:searchQuery="searchQuery"
      :teams="teams"
      :selectedTeams="selectedTeams"
      :filteredPegawai="filteredPegawai"
      :selectedPegawaiId="selectedPegawaiId"
      :timelineCurrentDate="timelineCurrentDate"
      @prev-month="prevMonth"
      @next-month="nextMonth"
      @toggle-team="toggleTeam"
      @select-all-teams="selectAllTeams"
      @select-pegawai="selectPegawai"
    />

    <!-- MAIN CONTENT AREA -->
    <div class="max-w-7xl mx-auto pb-10 mt-6">
      
      <!-- LOADING STATE -->
      <transition name="fade" mode="out-in">
        <div v-if="isLoading" class="flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="relative w-16 h-16">
            <div class="absolute top-0 left-0 w-full h-full border-4 border-gray-100 dark:border-gray-700 rounded-full"></div>
            <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent shadow-lg shadow-blue-500/20"></div>
          </div>
          <p class="mt-4 text-gray-400 dark:text-gray-500 font-medium animate-pulse">Memuat data...</p>
        </div>

        <!-- CONTENT -->
        <div v-else class="min-h-[500px]">
          
          <!-- Child Component: FullCalendar (Mode Team/Person) -->
          <div v-if="(mode === 'team' || mode === 'person') && !isLoading">
             <KalenderFullCalendar 
               :events="calendarEvents"
               @event-click="openModal"
             />
          </div>
          
          <!-- Child Component: Timeline (Mode Timeline) -->
          <div v-if="mode === 'timeline'">
            <KalenderTimeline 
              :pegawaiList="daftarPegawaiTimeline"
              :timelineDates="timelineDates"
              :events="filteredActivities"
              :timelineCurrentDate="timelineCurrentDate"
              @event-click="openModal"
            />
          </div>

        </div>
      </transition>
    </div>
    
    <ModalAktivitas v-if="isModalOpen" :aktivitas="selectedAktivitas" @close="closeModal" @go-to-detail="goToActivityDetail" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from "axios";
import { useToast } from 'vue-toastification';
import { subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// Import Components (Sesuaikan path jika berbeda)
import KalenderFilter from '@/components/kalender/KalenderFilter.vue';
import KalenderFullCalendar from '@/components/kalender/KalenderFullCalendar.vue';
import KalenderTimeline from '@/components/kalender/KalenderTimeline.vue';
import ModalAktivitas from '@/components/aktivitas/ModalAktivitas.vue';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

// State
const isModalOpen = ref(false);
const selectedAktivitas = ref(null);
const isLoading = ref(true);
const mode = ref("person");
const selectedTeams = ref([]); 
const selectedPegawaiId = ref(null);
const allPegawai = ref([]);
const searchQuery = ref("");
const teams = ref([]);
const aktivitas = ref([]);
const timelineCurrentDate = ref(new Date());
const kepalaKantorUser = ref(null); // State baru untuk menyimpan data user Kepala Kantor

// Logic Date Navigation
const prevMonth = () => { timelineCurrentDate.value = subMonths(timelineCurrentDate.value, 1); };
const nextMonth = () => { timelineCurrentDate.value = addMonths(timelineCurrentDate.value, 1); };

// Modal Logic
const openModal = async (aktivitasId) => {
    try {
        const response = await axios.get(`${baseURL}/api/aktivitas/${aktivitasId}`);
        selectedAktivitas.value = response.data;
        isModalOpen.value = true;
    } catch (error) {
        toast.error('Gagal memuat detail aktivitas.');
    }
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedAktivitas.value = null;
};

const goToActivityDetail = (id) => {
  router.push(`/aktivitas/detail/${id}`);
};

// Data Fetching
const fetchInitialData = async () => {
  isLoading.value = true;
  try {
    const [teamsResponse, usersResponse] = await Promise.all([
      axios.get(`${baseURL}/api/teams?limit=1000`),
      axios.get(`${baseURL}/api/users?limit=1000`)
    ]);
    teams.value = teamsResponse.data.items;
    
    const kepalaKantor = {
      id: 'kepala-kantor-filter', 
      namaTim: 'Kepala Kantor',
      warna: '#0ea5e9' 
    };
    teams.value.unshift(kepalaKantor);
    
    allPegawai.value = usersResponse.data.items.sort((a, b) => a.namaLengkap.localeCompare(b.namaLengkap));
    
    // Cari User Kepala Kantor (berdasarkan jabatan string mengandung 'Kepala Kantor')
    kepalaKantorUser.value = allPegawai.value.find(p => p.jabatan?.namaJabatan?.toLowerCase().includes("kepala kantor"));



    // Default Filter Logic
    const currentUser = authStore.user;
    if (currentUser) {
        const defaultSelectedTeams = [];
        teams.value.forEach(team => {
            if (team.id === 'kepala-kantor-filter') return;
            if (Array.isArray(team.users)) {
                if (team.users.some(u => u.id === currentUser.id)) {
                    defaultSelectedTeams.push(team);
                }
            }
        });
        // Jika user yang login adalah Kepala Kantor, default filter ke 'Kepala Kantor'
        if (currentUser.jabatan?.namaJabatan?.toLowerCase().includes("kepala kantor")) {
             const teamKepala = teams.value.find(t => t.id === 'kepala-kantor-filter');
             if (teamKepala) defaultSelectedTeams.push(teamKepala);
        }
        if (defaultSelectedTeams.length > 0) {
            selectedTeams.value = defaultSelectedTeams;
        }
    }
    mode.value = 'person';

    if (authStore.user) {
      selectedPegawaiId.value = authStore.user.id;
      searchQuery.value = authStore.user.namaLengkap;
    }
  } catch (err) {
    console.error("Gagal mengambil data awal:", err);
    toast.error("Gagal mengambil data tim atau pegawai.");
  } finally {
    isLoading.value = false;
  }
};

const fetchAktivitas = async () => {
  isLoading.value = true;
  aktivitas.value = [];
  try {
    let endpoint = '';
    let params = {};
    const isKepalaSelected = selectedTeams.value.some(t => t.id === 'kepala-kantor-filter');

    if (mode.value === 'team') {
      if (isKepalaSelected) {
        // Prioritaskan endpoint khusus kepala
        endpoint = `${baseURL}/api/aktivitas/kepala`;
      } else {
        endpoint = `${baseURL}/api/kalender/events`;
        const teamIds = selectedTeams.value.map(t => t.id).join(',');
        if (teamIds) params.team_ids = teamIds;
      }
    } else if (mode.value === 'person' && selectedPegawaiId.value) {
      endpoint = `${baseURL}/api/users/${selectedPegawaiId.value}/aktivitas`;
    } else if(mode.value == 'timeline') {
      endpoint = `${baseURL}/api/kalender/events`;
    }
    const response = await axios.get(endpoint, { params });
    aktivitas.value = response.data;
  } catch (err) {
    console.error("Gagal mengambil data aktivitas:", err);
    toast.error("Gagal mengambil data aktivitas.");
  } finally {
    // Delay sedikit untuk transisi halus
    setTimeout(() => {
       isLoading.value = false;
    }, 300);
  }
};

// Computed Properties & Filters
const filteredPegawai = computed(() => {
  if (!searchQuery.value) return allPegawai.value;
  const query = searchQuery.value.toLowerCase();
  return allPegawai.value.filter(p => p.namaLengkap.toLowerCase().includes(query) || p.username.toLowerCase().includes(query));
});

const filteredActivities = computed(() => {
  let data = aktivitas.value || [];
  const isKepalaSelected = selectedTeams.value.some(t => String(t.id) === 'kepala-kantor-filter');

  // PERBAIKAN: Filter Ketat untuk Mode Kepala Kantor
  if (mode.value === 'team' && isKepalaSelected) {
    // Hanya tampilkan aktivitas dimana Kepala Kantor menjadi peserta (users)
    if (kepalaKantorUser.value) {
        return data.filter(a => a.users && a.users.some(u => u.id === kepalaKantorUser.value.id));
    }
    return data; 
  }

  if (mode.value === 'team') {
    if (selectedTeams.value.length > 0) {
      const teamIds = new Set(selectedTeams.value.map(t => String(t.id)));
      data = data.filter(a => {
        return a.teamId !== undefined && a.teamId !== null && teamIds.has(String(a.teamId));
      });
    }
  } else if (mode.value === 'timeline' || mode.value === 'person') {
    const relevantPegawaiIds = new Set(daftarPegawaiTimeline.value.map(p => String(p.id)));
    if (relevantPegawaiIds.size > 0) {
      data = data.filter(a => (a.users || []).some(u => relevantPegawaiIds.has(String(u.id))));
    } else {
      data = [];
    }
  }
  return data;
});

const daftarPegawaiTimeline = computed(() => {
  const pegawaiMap = new Map();
  const isKepalaSelected = selectedTeams.value.some(t => t.id === 'kepala-kantor-filter');

  if (isKepalaSelected) {
    // PERBAIKAN: Hanya tampilkan Kepala Kantor di row timeline
    if (kepalaKantorUser.value) {
       pegawaiMap.set(kepalaKantorUser.value.id, kepalaKantorUser.value);
    }
  } else if (mode.value === 'timeline' && selectedTeams.value.length > 0) {
    selectedTeams.value.forEach(t => {
      const teamData = teams.value.find(team => team.id === t.id);
      if (teamData && teamData.users) {
        teamData.users.forEach(u => pegawaiMap.set(u.id, u));
      }
    });
  } else {
    aktivitas.value.forEach(a => {
      if (a.users) {
        a.users.forEach(u => pegawaiMap.set(u.id, u));
      }
    });
  }
  return Array.from(pegawaiMap.values()).sort((a, b) => a.namaLengkap.localeCompare(b.namaLengkap));
});

const calendarEvents = computed(() =>
  filteredActivities.value.map(a => {
    const endDate = a.tanggalSelesai ? new Date(a.tanggalSelesai) : new Date(a.tanggalMulai);
    endDate.setDate(endDate.getDate() + 1);
    const isAllDay = !a.jamMulai && !a.jamSelesai;

    return {
      id: a.id,
      title: a.namaAktivitas,
      start: isAllDay ? a.tanggalMulai : `${a.tanggalMulai}T${a.jamMulai}`,
      end: isAllDay ? endDate.toISOString().split('T')[0] : `${a.tanggalSelesai || a.tanggalMulai}T${a.jamSelesai}`,
      allDay: isAllDay,
      backgroundColor: a.team?.warna || '#3b82f6',
      borderColor: a.team?.warna || '#3b82f6',
    };
  })
);

const timelineDates = computed(() => {
  const start = startOfMonth(timelineCurrentDate.value);
  const end = endOfMonth(timelineCurrentDate.value)
  return eachDayOfInterval({ start, end }).map(date => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
});

// Actions
const toggleTeam = async (team) => {
  const index = selectedTeams.value.findIndex(t => t.id === team.id);
  if (team.id === 'kepala-kantor-filter') {
    // Jika klik kepala kantor, reset filter lain dan set hanya kepala kantor
    selectedTeams.value = [team];
  } else if (index > -1) { 
    selectedTeams.value.splice(index, 1); 
  } else { 
    // Jika pilih tim biasa, hapus filter kepala kantor jika ada
    const kepalaIndex = selectedTeams.value.findIndex(t => t.id === 'kepala-kantor-filter');
    if (kepalaIndex > -1) selectedTeams.value.splice(kepalaIndex, 1);
    
    selectedTeams.value.push(team); 
  }
  await fetchAktivitas();
};

const selectAllTeams = async () => { 
  selectedTeams.value = [];
  await fetchAktivitas();
};

const selectPegawai = (pegawai) => {
  selectedPegawaiId.value = pegawai.id;
  searchQuery.value = pegawai.id ? pegawai.namaLengkap : "";
};

// Watchers
watch(selectedTeams, async () => {
  await fetchAktivitas();
}, { deep: true });

watch(mode, async () => {
  selectedTeams.value = [];
  selectedPegawaiId.value = null;

  if (mode.value === 'person') {
     selectedPegawaiId.value = authStore.user?.id || null;
     searchQuery.value = authStore.user?.namaLengkap || '';
     fetchAktivitas(); 
  } else {
     // Re-apply default filter logic when returning to team mode
     const currentUser = authStore.user;
     if (currentUser) {
        const defaultSelectedTeams = [];
        teams.value.forEach(team => {
            if (team.id === 'kepala-kantor-filter') return;
            if (Array.isArray(team.users)) {
                if (team.users.some(u => u.id === currentUser.id)) {
                    defaultSelectedTeams.push(team);
                }
            }
        });
        if (currentUser.jabatan?.namaJabatan?.toLowerCase().includes("kepala kantor")) {
             const teamKepala = teams.value.find(t => t.id === 'kepala-kantor-filter');
             if (teamKepala) defaultSelectedTeams.push(teamKepala);
        }
        if (defaultSelectedTeams.length > 0) {
            selectedTeams.value = defaultSelectedTeams;
        }
     }
  }
});

// Watch untuk trigger fetch aktivitas jika selectedPegawaiId berubah (Mode Person)
watch(selectedPegawaiId, async (newVal) => {
    if (mode.value === 'person' && newVal) {
        await fetchAktivitas();
    }
});

onMounted(() => {
  fetchInitialData();
});
</script>

<style>
/* Global Styles for Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>