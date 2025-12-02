<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col">
    <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
      <h3 class="font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <span class="text-xl">{{ titleIcon }}</span> {{ title }}
      </h3>
      <span v-if="items.length > 0" class="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full">
        {{ items.length }} Pending
      </span>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
      <div v-if="items.length === 0" class="h-full flex flex-col items-center justify-center text-center py-10 opacity-50">
        <span class="text-4xl mb-2">🎉</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">Tidak ada tugas yang tertunda.</p>
      </div>

      <div 
        v-else
        v-for="item in items" 
        :key="item.id"
        class="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all bg-white dark:bg-gray-800"
      >
        <div class="flex-shrink-0 mt-1">
          <div v-if="item.jenisTugas === 'upload'" class="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center text-lg animate-pulse">
            📤
          </div>
          <div v-else class="w-8 h-8 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 flex items-center justify-center text-lg">
            🛡️
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <h4 class="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{{ item.namaDokumen }}</h4>
            <span class="text-[10px] text-gray-400 whitespace-nowrap">{{ formatDate(item.tanggalMulai) }}</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
            di: <span class="font-medium text-blue-600 dark:text-blue-400">{{ item.namaAktivitas }}</span>
          </p>
          <p class="text-[10px] text-gray-400 mt-0.5">
            {{ item.jenisTugas === 'upload' ? 'Belum diunggah' : 'Menunggu validasi Anda' }}
          </p>
        </div>

        <button 
          @click="goToDetail(item.aktivitasId)"
          class="self-center px-3 py-1.5 text-xs font-bold text-white rounded-lg shadow-sm transition-transform active:scale-95"
          :class="item.jenisTugas === 'upload' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-500 hover:bg-yellow-600'"
        >
          {{ item.jenisTugas === 'upload' ? 'Upload' : 'Periksa' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  items: { type: Array, default: () => [] },
  role: { type: String, default: 'member' } // 'member' | 'leader'
});

const router = useRouter();

const title = computed(() => props.role === 'leader' ? 'Perlu Validasi' : 'Tunggakan Dokumen');
const titleIcon = computed(() => props.role === 'leader' ? '✅' : '🔥');

const goToDetail = (id) => {
  router.push(`/aktivitas/detail/${id}`);
};

const formatDate = (dateStr) => {
  if(!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}
</script>