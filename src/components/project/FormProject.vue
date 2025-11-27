<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 text-gray-800 dark:text-gray-200">
    
    <div class="space-y-4">
      
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

      <div>
        <label for="tim" class="block text-sm font-medium mb-1 transition-colors" :class="errors.teamId ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
          Tim Penyelenggara <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <select  disabled
            id="tim" 
            v-model="form.teamId"
            class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm appearance-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none cursor-pointer"
            :class="errors.teamId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
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
      
      <transition name="slide-up">
        <div v-if="form.teamId">
          <label for="project-leader" class="block text-sm font-medium mb-1 transition-colors" :class="errors.projectLeaderId ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
            Project Leader <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <select 
              id="project-leader" 
              v-model="form.projectLeaderId"
              class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm appearance-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none cursor-pointer"
              :class="errors.projectLeaderId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
            >
              <option disabled value="">-- Pilih Project Leader --</option>
              <option v-for="user in teamMembers" :key="user.id" :value="user.id">
                {{ user.namaLengkap }} ({{ user.username }})
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          <transition name="slide-fade">
            <p v-if="errors.projectLeaderId" class="mt-1 text-xs text-red-500">{{ errors.projectLeaderId }}</p>
          </transition>
        </div>
      </transition>
      
    </div>

    <div class="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

    <div class="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
      <button type="button" @click="$emit('close')" class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors">
        Batal
      </button>
      <button type="submit" class="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-transparent rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105">
        {{ tipe }} Project
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { useToast } from 'vue-toastification';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const authStore = useAuthStore();
const toast = useToast();

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },
  teamList: { type: Array, required: true },
  tipe : { type: String, required: true}
});
  
const daftarTim = computed(() => {
  if (!props.teamList) return [];

  const manageableTeams = new Map();

  if (authStore.user.ketuaTimAktif) {
    authStore.user.ketuaTimAktif.forEach(team => {
      manageableTeams.set(team.id, team);
    });
  }
  if (authStore.user.teams) {
    const operatorTeams = authStore.user.teams
      .filter(teamRole => teamRole.peran === 'operator')
      .map(operatorTeamInfo => {
          return props.teamList.find(t => t.id === operatorTeamInfo.id);
      })
      .filter(Boolean);

    operatorTeams.forEach(team => {
      manageableTeams.set(team.id, team);
    });
  }

  return Array.from(manageableTeams.values()).sort((a, b) => a.namaTim.localeCompare(b.namaTim));
});

const emit = defineEmits(['close', 'submit']);

const form = reactive({
  namaProject: '',
  teamId: '',
  projectLeaderId: null,
});

const teamMembers = ref([]);

const errors = reactive({
  namaProject: null,
  teamId: null,
  projectLeaderId: null,
});

// Watcher untuk memuat anggota tim saat teamId berubah
watch(() => form.teamId, async (newTeamId) => {
  // Atur ulang projectLeaderId saat tim berubah, KECUALI jika kita sedang inisialisasi (di mana projectLeaderId sudah di-set)
  // TAPI: logika watchEffect di bawah sudah menangani inisialisasi dengan urutan yang benar.
  // Jadi di sini kita hanya reset jika perubahan BUKAN dari inisialisasi.
  // Namun, watchEffect lebih kuat. Di sini kita cukup load data.
  
  // Agar aman, kita biarkan reset di sini, tapi di watchEffect kita set value SETELAH data dimuat.
  // (Lihat logika di watchEffect bawah)
  
  teamMembers.value = [];

  if (newTeamId) {
    try {
      const response = await axios.get(`${baseURL}/api/teams/${newTeamId}`);
      teamMembers.value = response.data.users;
    } catch (error) {
      toast.error("Gagal memuat anggota tim.");
      console.error("Gagal mengambil data anggota tim:", error);
    }
  }
});

// --- Watcher untuk mengisi form saat initialData berubah ---
watch(() => props.initialData, (newData) => {
    // Reset form ke nilai default
    form.namaProject = '';
    form.teamId = '';
    form.projectLeaderId = null;
    teamMembers.value = [];
    
    // Reset error
    Object.keys(errors).forEach(key => errors[key] = null);

    if (newData) {
        form.namaProject = newData.namaProject || '';
        form.teamId = newData.teamId || '';
        
        // PENTING: Perlu memuat anggota tim terlebih dahulu sebelum mengisi projectLeaderId
        if (newData.teamId) {
            axios.get(`${baseURL}/api/teams/${newData.teamId}`).then(response => {
                teamMembers.value = response.data.users;
                // Set project leader SETELAH data user tersedia
                form.projectLeaderId = newData.projectLeaderId || null;
            });
        }
    }
}, { immediate: true });

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
    });
  }
};
</script>

<style scoped>
/* Transition Classes */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease-out;
  max-height: 100px; /* Tinggi perkiraan konten dropdown */
  opacity: 1;
}
.slide-up-enter-from, .slide-up-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(10px);
}
</style>