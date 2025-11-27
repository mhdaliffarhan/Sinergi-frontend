<template>
  <div class="space-y-4">
    
    <div 
      class="border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 relative overflow-hidden"
      :class="[
        isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600',
        isLoading ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
      ]"
      @dragover.prevent="!isLoading && (isDragging = true)"
      @dragleave.prevent="!isLoading && (isDragging = false)"
      @drop.prevent="!isLoading && handleDrop($event)"
      @click="!isLoading && triggerFileInput()"
    >
      <input 
        type="file" 
        ref="fileInput" 
        class="hidden" 
        @change="handleFileSelect"
        multiple 
        :disabled="isLoading"
      />
      
      <div v-if="!isLoading" class="flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
        <svg class="w-12 h-12 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
        <p class="text-sm font-medium">
          <span class="text-blue-600 font-bold hover:underline">Klik untuk upload</span> atau drag and drop
        </p>
        <p class="text-xs">Bisa pilih banyak file sekaligus (PDF, JPG, DOCX, dll)</p>
      </div>

      <div v-else class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10">
        <svg class="animate-spin h-10 w-10 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-sm font-semibold text-blue-600 dark:text-blue-400 animate-pulse">
          {{ progressLabel || 'Sedang Mengunggah...' }}
        </p>
      </div>
    </div>

    <transition-group name="list" tag="div" v-if="selectedFiles.length > 0" class="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
      <div v-for="(file, index) in selectedFiles" :key="file.name + index" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 uppercase">
            {{ getFileExtension(file.name) }}
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ file.name }}</span>
            <span class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
          </div>
        </div>
        <button 
          @click.stop="removeFile(index)" 
          type="button" 
          :disabled="isLoading"
          class="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </transition-group>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keterangan (Opsional)</label>
      <input 
        v-model="keterangan" 
        type="text" 
        :disabled="isLoading"
        class="block w-full px-4 py-2 rounded-lg dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none disabled:bg-gray-100 dark:disabled:bg-gray-900"
        placeholder="Beri keterangan untuk kumpulan file ini..."
      />
    </div>

    <div class="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
      <button 
        type="button" 
        @click="$emit('close')" 
        :disabled="isLoading"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Batal
      </button>
      
      <button 
        type="button" 
        @click="submitFiles" 
        :disabled="selectedFiles.length === 0 || isLoading"
        class="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
      >
        <span v-if="!isLoading">Upload {{ selectedFiles.length > 0 ? `(${selectedFiles.length})` : '' }}</span>
        <span v-else>Memproses...</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

// Props baru untuk menerima status dari parent
const props = defineProps({
  isLoading: { type: Boolean, default: false },
  progressLabel: { type: String, default: '' }
});

const emit = defineEmits(['close', 'submit-files']);
const fileInput = ref(null);
const isDragging = ref(false);
const selectedFiles = ref([]);
const keterangan = ref('');

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  addFiles(files);
  event.target.value = ''; 
};

const handleDrop = (event) => {
  isDragging.value = false;
  const files = Array.from(event.dataTransfer.files);
  addFiles(files);
};

const addFiles = (newFiles) => {
  selectedFiles.value = [...selectedFiles.value, ...newFiles];
};

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
};

const submitFiles = () => {
  if (selectedFiles.value.length > 0) {
    emit('submit-files', {
      files: selectedFiles.value,
      keterangan: keterangan.value
    });
    // Note: Kita JANGAN reset selectedFiles di sini.
    // Biarkan parent yang me-reset atau menutup modal setelah sukses.
    // Ini agar jika error, user tidak kehilangan file yang dipilih.
  }
};

// Helper
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileExtension = (filename) => {
  return filename.split('.').pop().toUpperCase();
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>