<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-4">
      
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
        <input 
          type="text" 
          id="username" 
          v-model="form.username"
          required
          :disabled="isEditMode"
          :class="{ 'border-red-500': errors.username, 'bg-gray-100 dark:bg-gray-800': isEditMode }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        />
        <p v-if="errors.username" class="mt-1 text-xs text-red-500">{{ errors.username }}</p>
      </div>

      <div>
        <label for="namaLengkap" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
        <input 
          type="text" 
          id="namaLengkap" 
          v-model="form.namaLengkap"
          required
          :class="{ 'border-red-500': errors.namaLengkap }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        />
        <p v-if="errors.namaLengkap" class="mt-1 text-xs text-red-500">{{ errors.namaLengkap }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="nip" class="block text-sm font-medium text-gray-700 dark:text-gray-300">NIP (18 digit)</label>
          <input 
            type="text" 
            id="nip" 
            v-model="form.nip"
            maxlength="18"
            placeholder="NIP 18 digit..."
            :class="{ 'border-red-500': errors.nip }"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          />
          <p v-if="errors.nip" class="mt-1 text-xs text-red-500">{{ errors.nip }}</p>
        </div>
        <div>
          <label for="nipbps" class="block text-sm font-medium text-gray-700 dark:text-gray-300">NIP BPS (9 digit)</label>
          <input 
            type="text" 
            id="nipbps" 
            v-model="form.nipbps"
            maxlength="9"
            placeholder="NIP BPS 9 digit..."
            :class="{ 'border-red-500': errors.nipbps }"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          />
          <p v-if="errors.nipbps" class="mt-1 text-xs text-red-500">{{ errors.nipbps }}</p>
        </div>
      </div>
      
      <div>
        <label for="nohp" class="block text-sm font-medium text-gray-700 dark:text-gray-300">No. HP (WhatsApp)</label>
        <input 
          type="text" 
          id="nohp" 
          v-model="form.nohp"
          placeholder="Format: 62812..."
          :class="{ 'border-red-500': errors.nohp }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        />
        <p v-if="errors.nohp" class="mt-1 text-xs text-red-500">{{ errors.nohp }}</p>
      </div>

      <div v-if="!isEditMode">
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="form.password"
          :required="!isEditMode"
          :class="{ 'border-red-500': errors.password }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        />
        <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
      </div>

      <div>
        <label for="sistemRole" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Peran Sistem</label>
        <select 
          id="sistemRole" 
          v-model="form.sistemRoleId"
          required
          :class="{ 'border-red-500': errors.sistemRoleId }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        >
          <option disabled value="">Pilih peran sistem</option>
          <option v-for="role in sistemRoles" :key="role.id" :value="role.id">{{ role.namaRole }}</option>
        </select>
        <p v-if="errors.sistemRoleId" class="mt-1 text-xs text-red-500">{{ errors.sistemRoleId }}</p>
      </div>

      <div>
        <label for="jabatan" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Jabatan</label>
        <select 
          id="jabatan" 
          v-model="form.jabatanId"
          required
          :class="{ 'border-red-500': errors.jabatanId }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        >
          <option disabled value="">Pilih jabatan</option>
          <option v-for="jabatan in jabatanList" :key="jabatan.id" :value="jabatan.id">{{ jabatan.namaJabatan }}</option>
        </select>
        <p v-if="errors.jabatanId" class="mt-1 text-xs text-red-500">{{ errors.jabatanId }}</p>
      </div>

    </div>

    <div class="mt-6 flex justify-end gap-3">
      <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none">Batal</button>
      <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none">Simpan</button>
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
    isValid = false; // <-- PERBAIKAN: Set isValid ke false
  }
  if (!namaLengkap) {
    errors.value.namaLengkap = 'Nama lengkap wajib diisi.';
    isValid = false; // <-- PERBAIKAN: Set isValid ke false
  }
  if (!props.isEditMode && !password) {
    errors.value.password = 'Password wajib diisi saat membuat user baru.';
    isValid = false; // <-- PERBAIKAN: Set isValid ke false
  }
  if (!sistemRoleId) {
    errors.value.sistemRoleId = 'Peran sistem wajib dipilih.';
    isValid = false; // <-- PERBAIKAN: Set isValid ke false
  }
  if (!jabatanId) {
    errors.value.jabatanId = 'Jabatan wajib dipilih.';
    isValid = false; // <-- PERBAIKAN: Set isValid ke false
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
    // Bersihkan data sebelum mengirim ke parent
    // (Backend akan membersihkan lagi, tapi ini praktik yang baik)
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