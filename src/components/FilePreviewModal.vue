<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
        
        <div class="w-full h-full bg-white dark:bg-gray-900 flex flex-col rounded-none sm:rounded-2xl overflow-hidden shadow-2xl relative">
          
          <!-- Header -->
          <div class="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                 <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md" :title="fileName">
                {{ fileName || 'Preview Dokumen' }}
              </h3>
            </div>
            
            <div class="flex items-center gap-2">
              <a :href="fileUrl" :download="fileName" class="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Unduh
              </a>
              <button @click="$emit('close')" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-grow bg-gray-100 dark:bg-black overflow-hidden relative flex items-center justify-center">
            <iframe v-if="isPdf" :src="fileUrl" class="w-full h-full border-none" title="PDF Preview"></iframe>
            <img v-else-if="isImage" :src="fileUrl" class="max-w-full max-h-full object-contain p-2" :alt="fileName">
            
            <!-- Fallback / Unduh untuk Mobile -->
            <div v-else class="text-center p-8">
              <div class="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <p class="text-lg font-bold text-gray-800 dark:text-white mb-2">Preview Tidak Tersedia</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">Format file ini tidak dapat ditampilkan langsung di browser.</p>
              <a :href="fileUrl" :download="fileName" class="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition-all">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Unduh File
              </a>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true }
});

const emit = defineEmits(['close']);

const isPdf = computed(() => props.fileType === 'application/pdf');
const isImage = computed(() => props.fileType.startsWith('image/'));

const handleKeydown = (e) => {
  if (props.show && e.key === 'Escape') {
    emit('close');
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>