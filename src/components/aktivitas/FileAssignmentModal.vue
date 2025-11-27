<template>
  <div class="p-1">
    <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 flex items-start gap-3">
      <div class="p-2 bg-white dark:bg-gray-800 rounded-full text-xl shadow-sm">
        {{ isLinkMode ? '🔗' : '📄' }}
      </div>
      <div>
        <h4 class="font-bold text-gray-800 dark:text-white text-sm">
          {{ isLinkMode ? 'Menambahkan Tautan' : `Mengunggah ${files.length} File` }}
        </h4>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ isLinkMode ? linkData.pathAtauUrl : files.map(f => f.name).join(', ') }}
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori Dokumen</label>
        <div class="grid grid-cols-2 gap-4">
          <label 
            class="border rounded-xl p-3 cursor-pointer transition-all flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
            :class="category === 'wajib' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' : 'border-gray-200 dark:border-gray-700'"
          >
            <input type="radio" v-model="category" value="wajib" class="hidden">
            <span class="text-xl">✅</span>
            <span class="text-sm font-medium" :class="category === 'wajib' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'">Dokumen Wajib (Checklist)</span>
          </label>

          <label 
            class="border rounded-xl p-3 cursor-pointer transition-all flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
            :class="category === 'lainnya' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' : 'border-gray-200 dark:border-gray-700'"
          >
            <input type="radio" v-model="category" value="lainnya" class="hidden">
            <span class="text-xl">📂</span>
            <span class="text-sm font-medium" :class="category === 'lainnya' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'">Dokumen Lainnya</span>
          </label>
        </div>
      </div>

      <div v-if="category === 'wajib'" class="space-y-3 animate-fade-in">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Pilih Item Checklist</label>
        <select 
          v-model="selectedChecklistId" 
          required 
          class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"
        >
          <option :value="null" disabled>-- Pilih Item --</option>
          <option v-for="item in checklistOptions" :key="item.id" :value="item.id">
            {{ item.namaDokumen }}
          </option>
        </select>
        <p class="text-xs text-gray-500">File akan ditandai sebagai pemenuhan item checklist ini.</p>
      </div>

      <div v-if="category === 'lainnya'" class="space-y-4 animate-fade-in">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kelompok / Keterangan</label>
          
          <div class="flex flex-wrap gap-2 mb-3" v-if="existingGroups.length > 0">
            <button 
              v-for="group in existingGroups" 
              :key="group"
              type="button"
              @click="keterangan = group"
              class="px-3 py-1 text-xs rounded-full border transition-colors"
              :class="keterangan === group 
                ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400'"
            >
              {{ group }}
            </button>
          </div>

          <input 
            type="text" 
            v-model="keterangan" 
            required 
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"
            placeholder="Contoh: Dokumentasi Lapangan, Nota Dinas..."
          />
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          Batal
        </button>
        <button 
          type="submit" 
          :disabled="!isValid"
          class="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Simpan & Proses
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  files: { type: Array, default: () => [] },
  linkData: { type: Object, default: null }, // { url, keterangan }
  checklistOptions: { type: Array, default: () => [] },
  existingGroups: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'submit']);

const isLinkMode = computed(() => !!props.linkData);
const category = ref('wajib'); // 'wajib' | 'lainnya'
const selectedChecklistId = ref(null);
const keterangan = ref('');

// Jika mode link, isi keterangan default dari linkData
watch(() => props.linkData, (val) => {
  if (val) keterangan.value = val.keterangan || '';
}, { immediate: true });

const isValid = computed(() => {
  if (category.value === 'wajib') return !!selectedChecklistId.value;
  if (category.value === 'lainnya') return !!keterangan.value.trim();
  return false;
});

const handleSubmit = () => {
  const payload = {
    category: category.value,
    checklistItemId: category.value === 'wajib' ? selectedChecklistId.value : null,
    keterangan: category.value === 'lainnya' ? keterangan.value : null
  };
  
  // Jika kategori wajib, keterangan otomatis diambil dari nama item checklist di parent
  emit('submit', payload);
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>