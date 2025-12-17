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
          :disabled="isEditMode || isSubmitting"
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
          :disabled="isSubmitting"
          class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none disabled:opacity-50"
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
      
      <!-- Password Section -->
      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <label for="password" class="block text-sm font-medium mb-1 transition-colors" :class="errors.password ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
          {{ isEditMode ? 'Reset Password (Opsional)' : 'Password' }} 
          <span v-if="!isEditMode" class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input 
            :type="showPassword ? 'text' : 'password'"
            id="password" 
            v-model="form.password"
            :required="!isEditMode"
            :disabled="isSubmitting"
            class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none pr-10 disabled:opacity-50"
            :class="errors.password ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'"
            :placeholder="isEditMode ? 'Isi untuk mereset password...' : 'Masukkan password...'"
          />
          <button 
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          >
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
        <transition name="slide-fade">
          <p v-if="errors.password" class="mt-1 text-xs text-red-500 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            {{ errors.password }}
          </p>
        </transition>
        <p v-if="isEditMode" class="text-xs text-blue-600 dark:text-blue-400 mt-1">
          * Isi field ini hanya jika ingin mengganti password pengguna ini.
        </p>
      </div>
    </div>

    <!-- STATUS AKTIF (TOGGLE) -->
    <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status Akun
          </label>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            User non-aktif tidak bisa login & tidak muncul di list tim.
          </p>
        </div>
        <SwitchGroup>
          <div class="flex items-center">
            <SwitchLabel class="mr-3 text-sm font-medium" :class="form.is_active ? 'text-green-600 dark:text-green-400' : 'text-gray-500'">
              {{ form.is_active ? 'Aktif' : 'Non-Aktif' }}
            </SwitchLabel>
            <Switch
              v-model="form.is_active"
              :disabled="isSubmitting"
              :class="[
                form.is_active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600',
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              ]"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <span
                :class="form.is_active ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </Switch>
          </div>
        </SwitchGroup>
      </div>
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
          :disabled="isSubmitting"
          class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none disabled:opacity-50"
          :class="errors.nip ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
          placeholder="NIP 18 digit..."
          @input="form.nip = form.nip.replace(/[^0-9]/g, '')"
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
          :disabled="isSubmitting"
          class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none disabled:opacity-50"
          :class="errors.nipbps ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
          placeholder="NIP BPS 9 digit..."
          @input="form.nipbps = form.nipbps.replace(/[^0-9]/g, '')"
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
            type="tel" 
            id="nohp" 
            v-model="form.nohp"
            :disabled="isSubmitting"
            class="block w-full pl-10 px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none disabled:opacity-50"
            :class="errors.nohp ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
            placeholder="Contoh: 08123456789 atau 62812..."
            @input="form.nohp = form.nohp.replace(/[^0-9]/g, '')"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Gunakan format 08... atau 628... (8-14 digit)
        </p>
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
            :disabled="isSubmitting"
            class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm appearance-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none cursor-pointer disabled:opacity-50"
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
            :disabled="isSubmitting"
            class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm appearance-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none cursor-pointer disabled:opacity-50"
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
      <button 
        type="button" 
        @click="$emit('close')" 
        class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors"
      >
        Batal
      </button>
      <button 
        type="submit" 
        :disabled="isSubmitting"
        class="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-transparent rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        <span>{{ isEditMode ? 'Simpan Perubahan' : 'Buat Pengguna' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watchEffect, ref, watch } from 'vue';
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue';
import { useToast } from 'vue-toastification';

const props = defineProps({
  initialData: { type: Object, default: null },
  isEditMode: { type: Boolean, default: false },
  sistemRoles: { type: Array, required: true },
  jabatanList: { type: Array, required: true }
});

const emit = defineEmits(['close', 'submit']);
const toast = useToast();

// State UI
const showPassword = ref(false);
const isSubmitting = ref(false);

// Form state
const form = reactive({
  username: '',
  namaLengkap: '',
  password: '',
  sistemRoleId: '',
  jabatanId: '',
  nip: '',
  nipbps: '',
  nohp: '',
  is_active: true // Default true
});

// Error state (diubah ke 'ref' agar mudah di-reset)
const errors = ref({});

// Reset isSubmitting when form is reopened (initialData changes)
watch(() => props.initialData, () => {
  isSubmitting.value = false;
});

// Mengisi/mereset form saat modal dibuka
watchEffect(() => {
  if (props.isEditMode && props.initialData) {
    // Mode Edit
    form.username = props.initialData.username || '';
    form.namaLengkap = props.initialData.namaLengkap || '';
    form.sistemRoleId = props.initialData.sistemRole?.id || '';
    form.jabatanId = props.initialData.jabatan?.id || '';
    form.password = ''; // Reset password field saat edit
    form.nip = props.initialData.nip || '';
    form.nipbps = props.initialData.nipbps || '';
    form.nohp = props.initialData.nohp || '';
    form.is_active = props.initialData.isActive !== undefined ? props.initialData.isActive : true;
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
    form.is_active = true;
  }
  // Reset error setiap kali form dibuka/berubah
  errors.value = {};
});

/**
 * Fungsi validasi Frontend
 */
const validate = () => {
  errors.value = {}; // Reset error
  let isValid = true; // Mulai dengan asumsi valid
  const { username, namaLengkap, password, sistemRoleId, jabatanId, nip, nipbps, nohp } = form;

  // --- Validasi Wajib ---
  if (!username) {
    errors.value.username = 'Username wajib diisi.';
    isValid = false;
  }
  if (!namaLengkap) {
    errors.value.namaLengkap = 'Nama lengkap wajib diisi.';
    isValid = false;
  }
  
  // Validasi Password: Wajib saat Create, Opsional saat Edit (untuk Reset)
  if (!props.isEditMode) {
    if (!password) {
      errors.value.password = 'Password wajib diisi saat membuat user baru.';
      isValid = false;
    } else if (password.length < 8) {
      errors.value.password = 'Password minimal 8 karakter.';
      isValid = false;
    }
  } else {
    // Saat Edit, jika diisi, harus valid
    if (password && password.length < 8) {
      errors.value.password = 'Password baru minimal 8 karakter.';
      isValid = false;
    }
  }

  if (!sistemRoleId) {
    errors.value.sistemRoleId = 'Peran sistem wajib dipilih.';
    isValid = false;
  }
  if (!jabatanId) {
    errors.value.jabatanId = 'Jabatan wajib dipilih.';
    isValid = false;
  }

  // --- Validasi Format ---
  
  // 1. Validasi NIP (18 digit)
  if (nip && nip.trim() !== "") {
    const nipNumeric = nip.replace(/\D/g, ''); // Hapus non-angka
    if (nipNumeric.length !== 18) {
      errors.value.nip = 'NIP harus 18 digit angka.';
      isValid = false;
    }
  }
  
  // 2. Validasi NIP BPS (9 digit)
  if (nipbps && nipbps.trim() !== "") {
    const nipNumeric = nipbps.replace(/\D/g, '');
    if (nipNumeric.length !== 9) { 
      errors.value.nipbps = 'NIP BPS harus 9 digit angka.';
      isValid = false;
    }
  }

  // 3. Validasi No. HP (WA) - Menggunakan aturan baru (8-14 digit)
  if (nohp.trim() !== "") {
    const nohpNumeric = nohp.replace(/\D/g, ''); 
    
    // Regex baru: Mengizinkan 08 atau 62 di depan, total 8-14 digit
    const hpRegex = /^(08|62)\d{6,13}$/; 

    if (!hpRegex.test(nohpNumeric)) {
      errors.value.nohp = 'Format salah. Gunakan 08... atau 62... (8-14 digit).';
      isValid = false;
    }
  }

  return isValid;
};

const handleSubmit = async () => {
  if (isSubmitting.value) return; // Prevent double submit

  if (validate()) {
    isSubmitting.value = true;
    const payload = {
      ...form,
      nip: form.nip ? form.nip.replace(/\D/g, '') : null,
      nipbps: form.nipbps ? form.nipbps.replace(/\D/g, '') : null,
      nohp: form.nohp ? form.nohp.replace(/\D/g, '') : null
    };
    emit('submit', payload);
    // Note: isSubmitting will be reset via prop watcher or component unmount 
    // when parent closes modal on success.
  } else {
    toast.error("Mohon periksa kembali isian formulir Anda.");
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