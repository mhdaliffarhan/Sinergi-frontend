<template>
  <Transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <!-- Backdrop -->
      <div 
        @click="$emit('close')" 
        class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      ></div>
  
      <!-- Modal Content -->
      <!-- REVISI 5: max-w-lg diubah menjadi sm:max-w-2xl agar lebih lebar -->
      <div class="relative w-full sm:max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transform transition-all">
        
        <!-- Header -->
        <div class="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-6">
            {{ title }}
          </h3>
          <button 
            @click="$emit('close')" 
            class="p-2 -mr-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
  
        <!-- Body -->
        <div class="flex-grow p-6 overflow-y-auto custom-scrollbar">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Judul Modal',
  },
  preventClose: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
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
  transition: all 0.2s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}
</style>