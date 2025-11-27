<template>
  <div class="p-4 transition-colors duration-200 rounded-xl">
    
    <div class="flex items-start justify-between">
      <div class="flex items-start gap-3 w-full">
        
        <div 
          @click="toggleCheck"
          class="flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 mt-0.5"
          :class="[
            // Warna Background & Border
            item.statusPengecekan 
              ? 'bg-green-500 border-green-500 text-white shadow-sm' 
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-transparent',
            
            // Interaksi (Cursor & Hover)
            canToggle 
              ? 'cursor-pointer hover:border-green-400 hover:shadow-md' 
              : 'cursor-not-allowed opacity-50 bg-gray-100 dark:bg-gray-700'
          ]"
          :title="tooltipText"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
        </div>
        
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight mb-1">
            {{ item.namaDokumen }}
          </h4>
          
          <p class="text-xs font-medium flex items-center gap-2 flex-wrap">
            <span v-if="hasFiles" class="text-blue-600 dark:text-blue-400">
              {{ item.files.length }} dokumen terlampir
            </span>
            <span v-else class="text-red-500 dark:text-red-400 italic flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Belum ada dokumen (Wajib Dilengkapi)
            </span>
            
            <span v-if="item.statusPengecekan" class="text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider border border-green-200 dark:border-green-800">
              Terverifikasi
            </span>
          </p>
        </div>
      </div>
    </div>

    <transition-group name="list" tag="div" v-if="hasFiles" class="space-y-2 mt-3 pl-9">
      <div 
        v-for="file in item.files" 
        :key="file.id"
        class="flex items-center justify-between p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all group"
      >
        <div class="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" @click="$emit('preview', file)">
          <div class="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 text-base border border-blue-100 dark:border-blue-800">
            {{ file.tipe === 'LINK' ? '🔗' : '📄' }}
          </div>
          <div class="min-w-0">
            <p class="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">
              {{ file.namaFileAsli || file.keterangan }}
            </p>
            <p class="text-[10px] text-gray-400">
              {{ formatDate(file.diunggahPada) }}
            </p>
          </div>
        </div>

        <button 
          v-if="isAuthorized"
          @click.stop="$emit('delete-file', file.id)"
          class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          title="Hapus file ini"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    </transition-group>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const props = defineProps({
  item: { type: Object, required: true },
  isAuthorized: { type: Boolean, default: false }
});

const emit = defineEmits(['check', 'preview', 'delete-file']);

// Computed: Cek apakah ada file
const hasFiles = computed(() => {
  return props.item.files && props.item.files.length > 0;
});

// Computed: Cek apakah tombol centang BISA diklik
// Syarat: User berwenang (Ketua/Admin) DAN File sudah ada
const canToggle = computed(() => {
  return props.isAuthorized && hasFiles.value;
});

// Computed: Text tooltip yang informatif
const tooltipText = computed(() => {
  if (!hasFiles.value) return "Belum ada dokumen yang diunggah (Tidak bisa validasi)";
  if (!props.isAuthorized) return "Menunggu Validasi Ketua Tim";
  if (props.item.statusPengecekan) return "Batalkan Validasi";
  return "Validasi Dokumen Ini";
});

const toggleCheck = () => {
  // Guard Clause: Jika tidak authorized ATAU tidak ada file, hentikan.
  if (!canToggle.value) return; 
  
  emit('check', { id: props.item.id, value: !props.item.statusPengecekan });
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'd MMM HH:mm', { locale: idLocale });
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
  transform: translateX(-10px);
}
</style>