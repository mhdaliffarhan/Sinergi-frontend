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
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label for="namaLengkap" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
        <input 
          type="text" 
          id="namaLengkap" 
          v-model="form.namaLengkap"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="nip" class="block text-sm font-medium text-gray-700 dark:text-gray-300">NIP</label>
          <input 
            type="text" 
            id="nip" 
            v-model="form.nip"
            maxlength="18"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label for="nipbps" class="block text-sm font-medium text-gray-700 dark:text-gray-300">NIP BPS (9 digit)</label>
          <input 
            type="text" 
            id="nipbps" 
            v-model="form.nipbps"
            maxlength="9"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
      <div>
        <label for="nohp" class="block text-sm font-medium text-gray-700 dark:text-gray-300">No. HP (WhatsApp)</label>
        <input 
          type="text" 
          id="nohp" 
          v-model="form.nohp"
          placeholder="Contoh: 628123456789"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div v-if="!isEditMode">
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="form.password"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label for="sistemRole" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Peran Sistem</label>
        <select 
          id="sistemRole" 
          v-model="form.sistemRoleId"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        >
          <option disabled value="">Pilih peran sistem</option>
          <option v-for="role in sistemRoles" :key="role.id" :value="role.id">{{ role.namaRole }}</option>
        </select>
      </div>

      <div>
        <label for="jabatan" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Jabatan</label>
        <select 
          id="jabatan" 
          v-model="form.jabatanId"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        >
          <option disabled value="">Pilih jabatan</option>
          <option v-for="jabatan in jabatanList" :key="jabatan.id" :value="jabatan.id">{{ jabatan.namaJabatan }}</option>
        </select>
      </div>

    </div>

    <div class="mt-6 flex justify-end gap-3">
      <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md ...">Batal</button>
      <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none">Simpan</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watchEffect } from 'vue';

const props = defineProps({
  initialData: { type: Object, default: null },
  isEditMode: { type: Boolean, default: false },
  sistemRoles: { type: Array, required: true },
  jabatanList: { type: Array, required: true }
});

const emit = defineEmits(['close', 'submit']);

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

watchEffect(() => {
  if (props.isEditMode && props.initialData) {
    form.username = props.initialData.username || '';
    form.namaLengkap = props.initialData.namaLengkap || '';
    form.sistemRoleId = props.initialData.sistemRole?.id || '';
    form.jabatanId = props.initialData.jabatan?.id || '';
    form.password = ''; 
    form.nip = props.initialData.nip || '';
    form.nipbps = props.initialData.nipbps || '';
    form.nohp = props.initialData.nohp || '';
  } else {
    form.username = '';
    form.namaLengkap = '';
    form.password = '';
    form.sistemRoleId = '';
    form.jabatanId = '';
    form.nip = '';
    form.nipbps = '';
    form.nohp = '';
  }
});

const handleSubmit = () => {
  emit('submit', form);
};
</script>