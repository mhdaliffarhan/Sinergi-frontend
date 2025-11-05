<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-4">
      
      <div>
        <label for="nama-tim" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Tim</label>
        <input 
          type="text" 
          id="nama-tim" 
          v-model="form.namaTim"
          :class="{ 'border-red-500': errors.namaTim }"
          class="mt-1 block w-full px-3 py-2 border text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Contoh: Tim Neraca 2025"
        />
        <p v-if="errors.namaTim" class="mt-1 text-xs text-red-500">{{ errors.namaTim }}</p>
      </div>

      <div>
        <label for="ketua-tim" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Ketua Tim</label>
        <select 
          id="ketua-tim" 
          v-model="form.ketuaTimId"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        >
          <option :value="null">-- Tidak ada ketua tim --</option>
          <option v-for="user in userList" :key="user.id" :value="user.id">
            {{ user.namaLengkap }}
          </option>
        </select>
        <p v-if="errors.ketuaTimId" class="mt-1 text-xs text-red-500">{{ errors.ketuaTimId }}</p>
      </div>

      <div>
        <label for="operator" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Operator Tim (Opsional)</label>
        <div class="relative mt-1">
          <div class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:text-white cursor-pointer" @click="isDropdownOpen = !isDropdownOpen">
            <div v-if="selectedOperators.length === 0" class="text-gray-400">Pilih satu atau lebih operator...</div>
            <div v-else class="flex flex-wrap gap-2">
              <span v-for="operator in selectedOperators" :key="operator.id" class="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-800 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200">
                {{ operator.namaLengkap }}
                <button type="button" @click.stop="removeOperator(operator.id)" class="ml-1 -mr-0.5 h-4 w-4 text-blue-500 hover:text-blue-700">
                  <svg class="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </span>
            </div>
          </div>
          
          <div v-if="isDropdownOpen" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg py-1 max-h-60 overflow-y-auto">
            <input type="text" v-model="searchQuery" placeholder="Cari pengguna..." class="sticky top-0 w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-600 focus:outline-none text-sm dark:text-white" @click.stop/>
            <ul class="py-1">
              <li v-for="user in filteredUsersForOperator" :key="user.id" @click="selectOperator(user)" class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-white">
                <span :class="{'font-bold': isOperatorSelected(user.id)}">{{ user.namaLengkap }}</span>
              </li>
            </ul>
            <p v-if="filteredUsersForOperator.length === 0" class="text-center text-gray-400 py-4 text-sm">Pengguna tidak ditemukan.</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="valid-from" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Periode Aktif Mulai</label>
          <input 
            type="date" 
            id="valid-from" 
            v-model="form.validFrom"
            class="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
         <p v-if="errors.validFrom" class="mt-1 text-xs text-red-500">{{ errors.validFrom }}</p>
        </div>
        <div>
          <label for="valid-until" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Periode Aktif Selesai</label>
          <input 
            type="date" 
            id="valid-until" 
            v-model="form.validUntil"
            :class="{ 'border-red-500': errors.validUntil }"
            class="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="errors.validUntil" class="mt-1 text-xs text-red-500">{{ errors.validUntil }}</p>
        </div>
      </div>

      <!-- Warna Tim -->
      <div>
        <label for="warna" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Warna Tim
        </label>
        <div class="flex items-center gap-3 mt-1">
          <input 
            id="warna"
            type="color"
            v-model="form.warna"
            class="w-12 h-10 cursor-pointer border border-gray-300 dark:border-gray-600 rounded"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300">
            {{ form.warna }}
          </span>
        </div>
      </div>

    </div>

    <div class="mt-6 flex justify-end gap-3">
      <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
        Batal
      </button>
      <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
        Simpan
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watchEffect, ref, computed } from 'vue';

const props = defineProps({
  initialData: { type: Object, default: null },
  userList: { type: Array, required: true }
});

const emit = defineEmits(['close', 'submit']);
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

const isDropdownOpen = ref(false);
const searchQuery = ref('');
const selectedOperators = ref([]);

// Filter user untuk dropdown operator
const filteredUsersForOperator = computed(() => {
  const query = searchQuery.value.toLowerCase();
  // Filter juga agar ketua tim tidak muncul di pilihan operator
  const availableUsers = props.userList.filter(user => user.id !== form.ketuaTimId);
  if (!query) return availableUsers;
  return availableUsers.filter(user =>
    user.namaLengkap.toLowerCase().includes(query)
  );
});

// Fungsi-fungsi untuk mengelola multi-select
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

watchEffect(() => {
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

  if (props.initialData) {
    form.namaTim = props.initialData.namaTim || '';
    form.validFrom = props.initialData.validFrom?.split('T')[0] || null;
    form.validUntil = props.initialData.validUntil?.split('T')[0] || null;
    form.ketuaTimId = props.initialData.ketuaTim?.id || null;
    form.warna = props.initialData.warna || '#3b82f6';

    // Isi selectedOperators JIKA data operators ada di initialData
    if (props.initialData.operators && Array.isArray(props.initialData.operators)) {
        console.log("Found operators in initialData:", JSON.parse(JSON.stringify(props.initialData.operators))); // DEBUG LOG 2
        // Pastikan kita membuat salinan array untuk reaktivitas
        selectedOperators.value = [...props.initialData.operators];
    } else {
        console.log("No operators found in initialData or not an array."); // DEBUG LOG 3
    }
  } else {
      console.log("FormTim: Not in edit mode or no initialData."); // DEBUG LOG 4
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