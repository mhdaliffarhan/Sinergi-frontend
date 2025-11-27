<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 text-gray-800 dark:text-gray-200">
    
    <div class="space-y-4">
      <div class="relative">
        <label for="username" class="block text-sm font-medium mb-1 transition-colors" :class="errors.username ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
          Username <span class="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          id="username" 
          v-model="form.username"
          required
          :disabled="isEditMode"
          class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
          :class="errors.username ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'"
          placeholder="Contoh: budi.santoso"
        />
        <transition name="slide-fade">
          <p v-if="errors.username" class="mt-1 text-xs text-red-500 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            {{ errors.username }}
          </p>
        </transition>
      </div>

      <div>
        <label for="namaLengkap" class="block text-sm font-medium mb-1 transition-colors" :class="errors.namaLengkap ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
          Nama Lengkap <span class="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          id="namaLengkap" 
          v-model="form.namaLengkap"
          required
          class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
          :class="errors.namaLengkap ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'"
          placeholder="Nama Lengkap dan Gelar"
        />
        <transition name="slide-fade">
          <p v-if="errors.namaLengkap" class="mt-1 text-xs text-red-500 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            {{ errors.namaLengkap }}
          </p>
        </transition>
      </div>
      
      <transition name="slide-fade">
        <div v-if="!isEditMode">
          <label for="password" class="block text-sm font-medium mb-1 transition-colors" :class="errors.password ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
            Password <span class="text-red-500">*</span>
          </label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password"
            :required="!isEditMode"
            class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
            :class="errors.password ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'"
            placeholder="Masukkan password..."
          />
          <transition name="slide-fade">
            <p v-if="errors.password" class="mt-1 text-xs text-red-500 flex items-center">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
              {{ errors.password }}
            </p>
          </transition>
        </div>
      </transition>
    </div>

    <div class="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600">
      <div>
        <label for="nip" class="block text-sm font-medium mb-1 transition-colors" :class="errors.nip ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
          NIP (18 digit)
        </label>
        <input 
          type="text" 
          id="nip" 
          v-model="form.nip"
          maxlength="18"
          class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
          :class="errors.nip ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
          placeholder="NIP 18 digit..."
        />
        <transition name="slide-fade">
          <p v-if="errors.nip" class="mt-1 text-xs text-red-500">{{ errors.nip }}</p>
        </transition>
      </div>

      <div>
        <label for="nipbps" class="block text-sm font-medium mb-1 transition-colors" :class="errors.nipbps ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
          NIP BPS (9 digit)
        </label>
        <input 
          type="text" 
          id="nipbps" 
          v-model="form.nipbps"
          maxlength="9"
          class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
          :class="errors.nipbps ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
          placeholder="NIP BPS 9 digit..."
        />
        <transition name="slide-fade">
          <p v-if="errors.nipbps" class="mt-1 text-xs text-red-500">{{ errors.nipbps }}</p>
        </transition>
      </div>
      
      <div class="md:col-span-2">
        <label for="nohp" class="block text-sm font-medium mb-1 transition-colors" :class="errors.nohp ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
          No. HP (WhatsApp)
        </label>
        <div class="relative">
          <input 
            type="text" 
            id="nohp" 
            v-model="form.nohp"
            class="block w-full pl-10 px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
            :class="errors.nohp ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
            placeholder="Format: 62812..."
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          </div>
        </div>
        <transition name="slide-fade">
          <p v-if="errors.nohp" class="mt-1 text-xs text-red-500">{{ errors.nohp }}</p>
        </transition>
      </div>
    </div>

    <div class="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="sistemRole" class="block text-sm font-medium mb-1 transition-colors" :class="errors.sistemRoleId ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
          Peran Sistem <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <select 
            id="sistemRole" 
            v-model="form.sistemRoleId"
            required
            class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm appearance-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none cursor-pointer"
            :class="errors.sistemRoleId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
          >
            <option disabled value="">Pilih peran sistem</option>
            <option v-for="role in sistemRoles" :key="role.id" :value="role.id">{{ role.namaRole }}</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
        <transition name="slide-fade">
          <p v-if="errors.sistemRoleId" class="mt-1 text-xs text-red-500">{{ errors.sistemRoleId }}</p>
        </transition>
      </div>

      <div>
        <label for="jabatan" class="block text-sm font-medium mb-1 transition-colors" :class="errors.jabatanId ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
          Jabatan <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <select 
            id="jabatan" 
            v-model="form.jabatanId"
            required
            class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm appearance-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none cursor-pointer"
            :class="errors.jabatanId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
          >
            <option disabled value="">Pilih jabatan</option>
            <option v-for="jabatan in jabatanList" :key="jabatan.id" :value="jabatan.id">{{ jabatan.namaJabatan }}</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
        <transition name="slide-fade">
          <p v-if="errors.jabatanId" class="mt-1 text-xs text-red-500">{{ errors.jabatanId }}</p>
        </transition>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
      <button type="button" @click="$emit('close')" class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors">
        Batal
      </button>
      <button type="submit" class="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-transparent rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105">
        Simpan Pengguna
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watchEffect, ref } from 'vue';

const props = defineProps({
  initialData: { type: Object, default: null },
  isEditMode: { type: Boolean, default: false },
  sistemRoles: { type: Array, required: true },
  jabatanList: { type: Array, required: true }
});

const emit = defineEmits(['close', 'submit']);

// Form state
const form = reactive({
  username: '',
  namaLengkap: '',
  password: '',
  sistemRoleId: '',
  jabatanId: '',
  nip: '',
  nipbps: '',
  nohp: ''
});

// Error state (diubah ke 'ref' agar mudah di-reset)
const errors = ref({});

// Mengisi/mereset form saat modal dibuka
watchEffect(() => {
  if (props.isEditMode && props.initialData) {
    // Mode Edit
    form.username = props.initialData.username || '';
    form.namaLengkap = props.initialData.namaLengkap || '';
    form.sistemRoleId = props.initialData.sistemRole?.id || '';
    form.jabatanId = props.initialData.jabatan?.id || '';
    form.password = ''; 
    form.nip = props.initialData.nip || '';
    form.nipbps = props.initialData.nipbps || '';
    form.nohp = props.initialData.nohp || '';
  } else {
    // Mode Create
    form.username = '';
    form.namaLengkap = '';
    form.password = '';
    form.sistemRoleId = '';
    form.jabatanId = '';
    form.nip = '';
    form.nipbps = '';
    form.nohp = '';
  }
  // Reset error setiap kali form dibuka/berubah
  errors.value = {};
});

/**
 * Fungsi validasi Frontend (Poin 1, 2, 3)
 */
const validate = () => {
  errors.value = {}; // Reset error
  let isValid = true; // Mulai dengan asumsi valid
  const { username, namaLengkap, password, sistemRoleId, jabatanId, nip, nipbps, nohp } = form;

  // --- Validasi Wajib ---
  if (!username) {
    errors.value.username = 'Username wajib diisi.';
    isValid = false; // Set isValid ke false
  }
  if (!namaLengkap) {
    errors.value.namaLengkap = 'Nama lengkap wajib diisi.';
    isValid = false;
  }
  if (!props.isEditMode && !password) {
    errors.value.password = 'Password wajib diisi saat membuat user baru.';
    isValid = false;
  }
  if (!sistemRoleId) {
    errors.value.sistemRoleId = 'Peran sistem wajib dipilih.';
    isValid = false;
  }
  if (!jabatanId) {
    errors.value.jabatanId = 'Jabatan wajib dipilih.';
    isValid = false;
  }

  // --- Validasi Format (Opsional, tapi jika diisi harus benar) ---
  
  // 1. Validasi NIP (18 digit)
  if (nip && nip.trim() !== "") {
    const nipNumeric = nip.replace(/\D/g, ''); // Hapus non-angka
    if (nipNumeric.length !== 18) {
      errors.value.nip = 'NIP harus 18 digit angka.';
      isValid = false;
    }
  }
  
  // 2. Validasi NIP BPS (9 digit, berdasarkan data Anda)
  if (nipbps && nipbps.trim() !== "") {
    const nipNumeric = nipbps.replace(/\D/g, '');
    if (nipNumeric.length !== 9) { 
      errors.value.nipbps = 'NIP BPS harus 9 digit angka.';
      isValid = false;
    }
  }

  // 3. Validasi No. HP (WA)
  if (nohp && nohp.trim() !== "") {
    const nohpNumeric = nohp.replace(/\D/g, ''); 
    
    if (!nohpNumeric.startsWith('62')) {
      errors.value.nohp = 'No. HP harus diawali dengan 62 (misal: 62812...).';
      isValid = false;
    } else if (nohpNumeric.length < 12 || nohpNumeric.length > 14) {
      errors.value.nohp = 'No. HP harus 12 s.d. 14 digit (termasuk 62).';
      isValid = false;
    }
  }

  return isValid;
};

const handleSubmit = () => {
  if (validate()) {
    const payload = {
      ...form,
      nip: form.nip ? form.nip.replace(/\D/g, '') : null,
      nipbps: form.nipbps ? form.nipbps.replace(/\D/g, '') : null,
      nohp: form.nohp ? form.nohp.replace(/\D/g, '') : null
    };
    emit('submit', payload);
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
</style>