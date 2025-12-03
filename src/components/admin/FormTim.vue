<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 text-gray-800 dark:text-gray-200">
    
    <!-- BAGIAN 1: IDENTITAS TIM -->
    <div class="space-y-4">
      <div class="relative">
        <label for="nama-tim" class="block text-sm font-medium mb-1 transition-colors" :class="errors.namaTim ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
          Nama Tim <span class="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          id="nama-tim" 
          v-model="form.namaTim"
          class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
          :class="errors.namaTim ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'"
          placeholder="Contoh: Tim Neraca 2025"
        />
        <transition name="slide-fade">
          <p v-if="errors.namaTim" class="mt-1 text-xs text-red-500 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            {{ errors.namaTim }}
          </p>
        </transition>
      </div>

      <div class="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-600 flex items-center justify-between">
        <label for="warna" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Warna Identitas Tim
        </label>
        <div class="flex items-center gap-3">
          <span class="text-xs font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
            {{ form.warna }}
          </span>
          <input 
            id="warna"
            type="color"
            v-model="form.warna"
            class="w-10 h-10 cursor-pointer border-none rounded-lg shadow-sm p-0 bg-transparent overflow-hidden transition-transform hover:scale-110"
          />
        </div>
      </div>
    </div>

    <div class="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

    <!-- BAGIAN 2: ANGGOTA TIM -->
    <div class="grid grid-cols-1 gap-6">
      
      <!-- DROPDOWN KETUA TIM (SINGLE SELECT DENGAN SEARCH) -->
      <div>
        <label class="block text-sm font-medium mb-1 transition-colors" :class="errors.ketuaTimId ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
          Ketua Tim <span class="text-red-500">*</span>
        </label>
        
        <div class="relative group">
          <!-- Trigger Box -->
          <div 
            class="min-h-[42px] w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800 cursor-pointer flex items-center justify-between transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-blue-500/50 group-focus-within:border-blue-500"
            :class="errors.ketuaTimId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
            @click="isLeaderDropdownOpen = !isLeaderDropdownOpen"
          >
            <span :class="form.ketuaTimId ? 'text-gray-900 dark:text-white' : 'text-gray-400'">
              {{ selectedLeaderName }}
            </span>
            <svg class="w-5 h-5 text-gray-400 transition-transform duration-200" :class="{'rotate-180': isLeaderDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>

          <!-- Dropdown Menu -->
          <transition name="dropdown">
            <div v-if="isLeaderDropdownOpen" class="absolute z-40 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
              <!-- Search Input -->
              <div class="p-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <input 
                  type="text" 
                  v-model="leaderSearchQuery" 
                  placeholder="Cari nama ketua..." 
                  class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors" 
                  @click.stop
                  ref="leaderSearchInput"
                />
              </div>
              
              <!-- List -->
              <ul class="overflow-y-auto flex-1 py-1 custom-scrollbar">
                <li 
                  v-for="user in filteredUsersForLeader" 
                  :key="user.id" 
                  @click="selectLeader(user)" 
                  class="px-4 py-2.5 cursor-pointer text-sm flex justify-between items-center transition-colors border-l-4 border-transparent"
                  :class="form.ketuaTimId === user.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-blue-500' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'"
                >
                  <span>{{ user.namaLengkap }}</span>
                  <span v-if="form.ketuaTimId === user.id" class="text-blue-600 dark:text-blue-400">✓</span>
                </li>
              </ul>
              
              <!-- Empty State -->
              <div v-if="filteredUsersForLeader.length === 0" class="p-4 text-center text-gray-400 text-sm">
                Pengguna tidak ditemukan.
              </div>
            </div>
          </transition>

          <!-- Overlay click outside -->
          <div v-if="isLeaderDropdownOpen" class="fixed inset-0 z-30" @click="isLeaderDropdownOpen = false"></div>
        </div>

        <transition name="slide-fade">
          <p v-if="errors.ketuaTimId" class="mt-1 text-xs text-red-500">{{ errors.ketuaTimId }}</p>
        </transition>
      </div>

      <!-- DROPDOWN OPERATOR TIM (MULTI SELECT) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Operator Tim
          <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            {{ selectedOperators.length }} dipilih
          </span>
        </label>
        
        <div class="relative group">
          <div 
            class="min-h-[42px] w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 cursor-pointer transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-indigo-500/50 group-focus-within:border-indigo-500 border-gray-300 dark:border-gray-600"
            @click="isOperatorDropdownOpen = !isOperatorDropdownOpen"
          >
            <div v-if="selectedOperators.length === 0" class="text-gray-400 text-sm py-0.5">Pilih satu atau lebih operator...</div>
            <div v-else class="flex flex-wrap gap-2">
              <transition-group name="list">
                <span 
                  v-for="operator in selectedOperators" 
                  :key="operator.id" 
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-800 transition-all hover:bg-indigo-100"
                >
                  {{ operator.namaLengkap }}
                  <button type="button" @click.stop="removeOperator(operator.id)" class="ml-1.5 text-indigo-400 hover:text-indigo-600 focus:outline-none">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                  </button>
                </span>
              </transition-group>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <svg class="w-5 h-5 transition-transform duration-200" :class="{'rotate-180': isOperatorDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <transition name="dropdown">
            <div v-if="isOperatorDropdownOpen" class="absolute z-30 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
              <div class="p-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <input 
                  type="text" 
                  v-model="operatorSearchQuery" 
                  placeholder="Cari nama operator..." 
                  class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:border-indigo-500 transition-colors" 
                  @click.stop
                />
              </div>
              
              <ul class="overflow-y-auto flex-1 py-1 custom-scrollbar">
                <li 
                  v-for="user in filteredUsersForOperator" 
                  :key="user.id" 
                  @click.stop="selectOperator(user)" 
                  class="px-4 py-2.5 cursor-pointer text-sm flex justify-between items-center transition-colors border-l-4 border-transparent"
                  :class="isOperatorSelected(user.id) 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-l-indigo-500' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'"
                >
                  <span>{{ user.namaLengkap }}</span>
                  <transition name="scale">
                    <svg v-if="isOperatorSelected(user.id)" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  </transition>
                </li>
              </ul>
              <div v-if="filteredUsersForOperator.length === 0" class="p-4 text-center text-gray-400 text-sm">
                Pengguna tidak ditemukan.
              </div>
            </div>
          </transition>
          
          <div v-if="isOperatorDropdownOpen" class="fixed inset-0 z-20" @click="isOperatorDropdownOpen = false"></div>
        </div>
      </div>

    </div>

    <div class="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

    <!-- BAGIAN 3: TANGGAL VALIDITAS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="valid-from" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Periode Aktif Mulai<span class="text-red-500">*</span></label>
        <input 
          type="date" 
          id="valid-from" 
          v-model="form.validFrom"
          :class="{ 'border-red-500': errors.validFrom }"
          class="block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"
        />
        <p v-if="errors.validFrom" class="mt-1 text-xs text-red-500">{{ errors.validFrom }}</p>
      </div>
      <div>
        <label for="valid-until" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Periode Aktif Selesai<span class="text-red-500">*</span></label>
        <input 
          type="date" 
          id="valid-until" 
          v-model="form.validUntil"
          :class="{ 'border-red-500': errors.validUntil }"
          class="block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"
        />
        <p v-if="errors.validUntil" class="mt-1 text-xs text-red-500">{{ errors.validUntil }}</p>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
      <button type="button" @click="$emit('close')" class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors">
        Batal
      </button>
      <button type="submit" class="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-transparent rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105">
        Simpan Tim
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watchEffect, ref, computed, nextTick } from 'vue';

const props = defineProps({
  initialData: { type: Object, default: null },
  userList: { type: Array, required: true }
});

const emit = defineEmits(['close', 'submit']);

// Form State
const form = reactive({
  namaTim: '',
  validFrom: null,
  validUntil: null,
  ketuaTimId: null,
  warna: '#3b82f6',
  operator_ids: []
});

const errors = reactive({
  namaTim: null,
  validUntil: null,
  ketuaTimId: null,
  validFrom: null,
});

// -- LEADER DROPDOWN STATE --
const isLeaderDropdownOpen = ref(false);
const leaderSearchQuery = ref('');
const leaderSearchInput = ref(null);

// -- OPERATOR DROPDOWN STATE --
const isOperatorDropdownOpen = ref(false);
const operatorSearchQuery = ref('');
const selectedOperators = ref([]);

// --- COMPUTED: Filter Ketua Tim ---
const filteredUsersForLeader = computed(() => {
  const query = leaderSearchQuery.value.toLowerCase();
  return props.userList.filter(user => 
    user.namaLengkap.toLowerCase().includes(query)
  );
});

// Helper untuk menampilkan nama ketua terpilih saat dropdown tutup
const selectedLeaderName = computed(() => {
  if (!form.ketuaTimId) return '-- Pilih Ketua Tim --';
  const user = props.userList.find(u => u.id === form.ketuaTimId);
  return user ? user.namaLengkap : '-- Pilih Ketua Tim --';
});

// --- COMPUTED: Filter Operator ---
const filteredUsersForOperator = computed(() => {
  const query = operatorSearchQuery.value.toLowerCase();
  // Filter: Jangan tampilkan user yang sudah jadi Ketua Tim
  const availableUsers = props.userList.filter(user => user.id !== form.ketuaTimId);
  
  if (!query) return availableUsers;
  return availableUsers.filter(user =>
    user.namaLengkap.toLowerCase().includes(query)
  );
});

// --- METHODS: Leader Dropdown ---
const selectLeader = (user) => {
  form.ketuaTimId = user.id;
  isLeaderDropdownOpen.value = false;
  // Jika user yang dipilih sebelumnya ada di operator, hapus dari operator
  if (isOperatorSelected(user.id)) {
    removeOperator(user.id);
  }
};

// --- METHODS: Operator Dropdown ---
const isOperatorSelected = (id) => selectedOperators.value.some(op => op.id === id);
const selectOperator = (user) => {
  if (!isOperatorSelected(user.id)) {
    selectedOperators.value.push(user);
  } else {
    removeOperator(user.id);
  }
};
const removeOperator = (id) => {
  selectedOperators.value = selectedOperators.value.filter(op => op.id !== id);
};

// Watchers
watchEffect(() => {
  // 1. Reset Form Defaults
  Object.assign(form, {
    namaTim: '', 
    validFrom: null, 
    validUntil: null, 
    ketuaTimId: null,
    warna: '#3b82f6',
    operator_ids: []
  });
  selectedOperators.value = [];
  Object.keys(errors).forEach(key => errors[key] = null);

  // 2. Populate jika ada initialData
  if (props.initialData) {
    form.namaTim = props.initialData.namaTim || '';
    form.validFrom = props.initialData.validFrom?.split('T')[0] || null;
    form.validUntil = props.initialData.validUntil?.split('T')[0] || null;
    form.ketuaTimId = props.initialData.ketuaTim?.id || null;
    form.warna = props.initialData.warna || '#3b82f6';

    if (props.initialData.operators && Array.isArray(props.initialData.operators)) {
        selectedOperators.value = [...props.initialData.operators];
    }
  }
});

const validate = () => {
  Object.keys(errors).forEach(key => errors[key] = null);
  let isValid = true;

  if (!form.namaTim.trim()) {
    errors.namaTim = 'Nama tim wajib diisi.';
    isValid = false;
  }

  if (!form.ketuaTimId) {
    errors.ketuaTimId = 'Ketua tim wajib dipilih.';
    isValid = false;
  }
  
  if (!form.validFrom){
    errors.validFrom = 'Periode Aktif Mulai tidak boleh kosong';
    isValid = false;
  }

  if (!form.validUntil){
    errors.validUntil = 'Periode Aktif Selesai tidak boleh kosong';
    isValid = false;
  }

  if (form.validFrom && form.validUntil && form.validUntil < form.validFrom) {
    errors.validUntil = 'Periode Aktif selesai tidak boleh sebelum Periode Aktif mulai.';
    isValid = false;
  }
  
  return isValid;
};

const handleSubmit = () => {
  form.operator_ids = selectedOperators.value.map(op => op.id);
  if (validate()) {
    emit('submit', form);
  }
};
</script>

<style scoped>
/* Transitions */
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-10px); opacity: 0; }

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-5px) scale(0.95); }

.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(20px); }

.scale-enter-active { transition: all 0.2s ease; }
.scale-enter-from { opacity: 0; transform: scale(0); }

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #4b5563; }
</style>