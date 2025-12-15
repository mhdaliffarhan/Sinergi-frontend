<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 text-gray-800 dark:text-gray-200">
    
    <!-- BAGIAN 1: INFORMASI PROJECT -->
    <div class="space-y-4">
      <!-- NAMA PROJECT -->
      <div class="relative">
        <label for="nama-project" class="block text-sm font-medium mb-1 transition-colors" :class="errors.namaProject ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
          Nama Project <span class="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          id="nama-project" 
          v-model="form.namaProject"
          class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
          :class="errors.namaProject ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'"
          placeholder="Contoh: Publikasi Daerah Dalam Angka"
        />
        <transition name="slide-fade">
          <p v-if="errors.namaProject" class="mt-1 text-xs text-red-500 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            {{ errors.namaProject }}
          </p>
        </transition>
      </div>
    </div>

    <!-- BAGIAN 2: TIM PENYELENGGARA (Filtered Dropdown) -->
    <div class="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600">
      <label for="tim" class="block text-sm font-medium mb-1 transition-colors" :class="errors.teamId ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
        Tim Pemilik Project <span class="text-red-500">*</span>
      </label>
      
      <div v-if="daftarTim.length === 0" class="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg text-xs text-yellow-700 dark:text-yellow-400">
         Anda tidak memiliki akses untuk membuat project di tim manapun (Bukan Ketua Tim/Operator/Admin).
      </div>

      <div v-else class="relative">
        <select 
          id="tim" 
          v-model="form.teamId"
          class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm appearance-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none cursor-pointer"
          :class="errors.teamId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
          :disabled="tipe === 'Simpan' && !isAdmin" 
        >
          <option disabled value="">-- Pilih Tim --</option>
          <option v-for="tim in daftarTim" :key="tim.id" :value="tim.id">
            {{ tim.namaTim }}
          </option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
      <transition name="slide-fade">
        <p v-if="errors.teamId" class="mt-1 text-xs text-red-500">{{ errors.teamId }}</p>
      </transition>
    </div>
      
    <!-- BAGIAN 3: PROJECT LEADER (Searchable Dropdown) -->
    <div class="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
      <label class="block text-sm font-medium mb-1 transition-colors" :class="errors.projectLeaderId ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
        Project Leader <span class="text-red-500">*</span>
      </label>
      
      <transition name="slide-up" mode="out-in">
        <div v-if="form.teamId">
          <div class="relative group">
            <!-- Trigger Box -->
            <div 
              class="min-h-[42px] w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800 cursor-pointer flex items-center justify-between transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-blue-500/50 group-focus-within:border-blue-500"
              :class="errors.projectLeaderId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
              @click="toggleLeaderDropdown"
            >
              <span class="truncate" :class="form.projectLeaderId ? 'text-gray-900 dark:text-white' : 'text-gray-400'">
                {{ selectedLeaderName }}
              </span>
              <svg class="w-5 h-5 text-gray-400 transition-transform duration-200" :class="{'rotate-180': isLeaderDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            <!-- Dropdown Menu -->
            <transition name="dropdown">
              <div v-if="isLeaderDropdownOpen" class="absolute z-40 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
                <!-- Search Input -->
                <div class="p-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 sticky top-0">
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input 
                      type="text" 
                      v-model="leaderSearchQuery" 
                      placeholder="Cari nama anggota..." 
                      class="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors" 
                      ref="leaderSearchInput"
                    />
                  </div>
                </div>
                
                <!-- List -->
                <ul class="overflow-y-auto flex-1 py-1 custom-scrollbar">
                  <li 
                    v-for="user in filteredMembers" 
                    :key="user.id" 
                    @click="selectLeader(user)" 
                    class="px-4 py-2.5 cursor-pointer text-sm flex justify-between items-center transition-colors border-l-4 border-transparent"
                    :class="form.projectLeaderId === user.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-blue-500' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'"
                  >
                    <div class="flex flex-col">
                      <span class="font-medium">{{ user.namaLengkap }}</span>
                      <span class="text-xs text-gray-500">{{ user.username }}</span>
                    </div>
                    <span v-if="form.projectLeaderId === user.id" class="text-blue-600 dark:text-blue-400">✓</span>
                  </li>
                </ul>
                
                <!-- Empty State -->
                <div v-if="filteredMembers.length === 0" class="p-4 text-center text-gray-400 text-sm">
                   <p v-if="isLoadingMembers">Memuat anggota...</p>
                   <p v-else>Tidak ada anggota ditemukan.</p>
                </div>
              </div>
            </transition>

            <!-- Overlay (Click Outside) -->
            <div v-if="isLeaderDropdownOpen" class="fixed inset-0 z-30" @click="isLeaderDropdownOpen = false"></div>
          </div>
          <p class="mt-2 text-xs text-gray-500">Pilih dari daftar anggota tim yang terpilih.</p>
        </div>
        
        <div v-else class="flex items-center justify-center h-[42px] text-sm text-gray-400 italic border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          Pilih Tim terlebih dahulu untuk memuat daftar pegawai
        </div>
      </transition>
      
      <transition name="slide-fade">
        <p v-if="errors.projectLeaderId" class="mt-1 text-xs text-red-500">{{ errors.projectLeaderId }}</p>
      </transition>
    </div>

    <!-- NOTIFIKASI WHATSAPP -->
    <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/50">
        <div class="flex items-start gap-3">
          <div class="flex items-center h-5">
            <input
              id="send-whatsapp-proj"
              v-model="form.sendWhatsapp"
              type="checkbox"
              class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="ml-2 text-sm">
            <label for="send-whatsapp-proj" class="font-medium text-gray-900 dark:text-gray-100 select-none cursor-pointer">
              Kirim Notifikasi WhatsApp
            </label>
            <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Kirim notifikasi ke Project Leader dan anggota tim bahwa project baru telah dibuat.
            </p>
          </div>
        </div>
    </div>

    <div class="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
      <button type="button" @click="$emit('close')" class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors">
        Batal
      </button>
      <button type="submit" :disabled="daftarTim.length === 0" class="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-transparent rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
        {{ tipe }} Project
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, nextTick } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authStore = useAuthStore();
const toast = useToast();

const props = defineProps({
  initialData: { type: Object, default: null },
  teamList: { type: Array, required: true },
  tipe : { type: String, required: true}
});
  
const emit = defineEmits(['close', 'submit']);

const form = reactive({
  namaProject: '',
  teamId: '',
  projectLeaderId: null,
  sendWhatsapp: false
});

const teamMembers = ref([]);
const isLoadingMembers = ref(false);

const errors = reactive({
  namaProject: null,
  teamId: null,
  projectLeaderId: null,
});

// -- COMPUTED HELPERS --
const isAdmin = computed(() => {
    const role = authStore.user?.sistemRole?.namaRole?.toLowerCase();
    return ['superadmin', 'admin'].includes(role);
});

// --- LOGIKA FILTER TIM (SUPERADMIN ENABLED) ---
const daftarTim = computed(() => {
  if (!props.teamList || props.teamList.length === 0) return [];

  // 1. Cek Role Superadmin/Admin (Bisa semua tim)
  if (isAdmin.value) {
     return [...props.teamList].sort((a, b) => a.namaTim.localeCompare(b.namaTim));
  }

  // 2. Filter untuk User Biasa
  // Kumpulkan ID tim yang diizinkan (Ketua atau Operator)
  const allowedTeamIds = new Set();

  // A. Cek Tim dimana dia adalah Ketua (dari props.teamList)
  props.teamList.forEach(team => {
      if (team.ketuaTimId === authStore.user.id) {
          allowedTeamIds.add(team.id);
      }
  });

  // B. Cek Tim dimana dia adalah Operator (dari authStore.user.teams)
  if (authStore.user?.teams && Array.isArray(authStore.user.teams)) {
      authStore.user.teams.forEach(userTeam => {
          if (userTeam.peran === 'operator') {
              allowedTeamIds.add(userTeam.id);
          }
      });
  }

  // Filter list tim asli berdasarkan ID yang diizinkan
  return props.teamList
    .filter(team => allowedTeamIds.has(team.id))
    .sort((a, b) => a.namaTim.localeCompare(b.namaTim));
});

// -- LEADER DROPDOWN STATE --
const isLeaderDropdownOpen = ref(false);
const leaderSearchQuery = ref('');
const leaderSearchInput = ref(null);

// Computed untuk Search Leader
const filteredMembers = computed(() => {
  const query = leaderSearchQuery.value.toLowerCase();
  if (!query) return teamMembers.value;
  return teamMembers.value.filter(user => 
    user.namaLengkap.toLowerCase().includes(query) || 
    user.username.toLowerCase().includes(query)
  );
});

// Helper Label Leader
const selectedLeaderName = computed(() => {
  if (!form.projectLeaderId) return '-- Pilih Project Leader --';
  const user = teamMembers.value.find(u => u.id === form.projectLeaderId);
  return user ? user.namaLengkap : 'Leader Tidak Ditemukan (Data Belum Termuat)';
});

// Action Select Leader
const selectLeader = (user) => {
  form.projectLeaderId = user.id;
  isLeaderDropdownOpen.value = false;
};

const toggleLeaderDropdown = () => {
    isLeaderDropdownOpen.value = !isLeaderDropdownOpen.value;
    if (isLeaderDropdownOpen.value) {
        nextTick(() => {
            leaderSearchInput.value?.focus();
        });
    }
};

// --- DATA FETCHING (CRITICAL FIX) ---
// Mengambil data anggota tim dari API secara langsung, bukan dari props global
const fetchTeamMembers = async (teamId) => {
  if (!teamId) return;
  isLoadingMembers.value = true;
  teamMembers.value = []; // Reset dulu

  try {
    const response = await axios.get(`${baseURL}/api/teams/${teamId}`);
    
    // Pastikan response.data valid
    if (response.data) {
        // Gabungkan ketua tim dan anggota biasa agar semua bisa dipilih jadi leader
        const ketua = response.data.ketuaTim ? [response.data.ketuaTim] : [];
        const users = response.data.users || [];
        
        // Pastikan tidak ada duplikat (jika ketua juga ada di list users)
        const combined = [...ketua, ...users];
        const uniqueMembers = Array.from(new Map(combined.map(item => [item.id, item])).values());
        
        teamMembers.value = uniqueMembers;
    }
  } catch (error) {
    toast.error("Gagal memuat daftar pegawai untuk tim ini.");
    console.error(error);
  } finally {
      isLoadingMembers.value = false;
  }
};

// Watcher Tim ID
watch(() => form.teamId, async (newTeamId, oldTeamId) => {
  if (newTeamId) {
    // Reset leader jika tim berubah (kecuali saat inisialisasi awal Edit)
    // Logika: Jika oldTeamId ada (berarti ganti tim manual), reset leader.
    // Jika oldTeamId kosong (berarti init load), jangan reset dulu, biarkan onMounted handle.
    if (oldTeamId && newTeamId !== oldTeamId) {
        form.projectLeaderId = null;
    }
    await fetchTeamMembers(newTeamId);
  } else {
    teamMembers.value = [];
  }
});

// Init Data (Mode Edit / Buat)
onMounted(async () => {
  if (props.initialData) {
    form.namaProject = props.initialData.namaProject || '';
    form.teamId = props.initialData.teamId || props.initialData.team?.id || '';
    
    // Tunggu fetch members selesai sebelum set leader ID agar nama muncul
    if (form.teamId) {
       await fetchTeamMembers(form.teamId);
       // Pastikan leader ID diset setelah data tersedia
       form.projectLeaderId = props.initialData.projectLeaderId || null;
    }
  }
});

const validate = () => {
  Object.keys(errors).forEach(key => errors[key] = null);
  let isValid = true;

  if (!form.namaProject) { errors.namaProject = 'Nama Project wajib diisi.'; isValid = false; }
  if (!form.teamId) { errors.teamId = 'Tim wajib dipilih.'; isValid = false; }
  if (!form.projectLeaderId) { errors.projectLeaderId = 'Project Leader wajib dipilih.'; isValid = false; }
  
  return isValid;
};

const handleSubmit = () => {
  if (validate()) {
    emit('submit', { 
      namaProject: form.namaProject,
      teamId: form.teamId,
      projectLeaderId: form.projectLeaderId,
      sendWhatsapp: form.sendWhatsapp
    });
  }
};
</script>

<style scoped>
/* Transitions */
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-10px); opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease-out; max-height: 500px; opacity: 1; }
.slide-up-enter-from, .slide-up-leave-to { max-height: 0; opacity: 0; transform: translateY(10px); }

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-5px) scale(0.95); }

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #4b5563; }
</style>