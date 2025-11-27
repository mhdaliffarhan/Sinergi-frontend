<template>
  <router-link :to="`/aktivitas/detail/${aktivitas.id}`" class="block h-full group">
    
    <div class="flex flex-col h-full p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
      
      <div 
        class="absolute top-0 left-0 w-full h-1" 
        :style="{ backgroundColor: aktivitas.team?.warna || '#3b82f6' }"
      ></div>

      <div class="flex items-start gap-4 mb-3">
        <div 
          class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm transition-colors duration-300"
          :style="{ 
            backgroundColor: hexToRgba(aktivitas.team?.warna || '#3b82f6', 0.1), 
            color: aktivitas.team?.warna || '#3b82f6' 
          }"
        >
          📝
        </div>
        <div class="flex-grow min-w-0">
          <h3 class="text-base font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {{ aktivitas.namaAktivitas }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {{ aktivitas.project?.namaProject || 'Proyek Tidak Diketahui' }}
          </p>
        </div>
      </div>
      
      <div class="mt-auto space-y-2 mb-4">
        <div class="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg w-max max-w-full">
          <span class="flex-shrink-0">🗓️</span>
          <span class="truncate">{{ formatDate(aktivitas.tanggalMulai, aktivitas.tanggalSelesai) }}</span>
        </div>
        <div v-if="aktivitas.jamMulai" class="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg w-max">
          <span class="flex-shrink-0">⏰</span>
          <span>{{ formatTime(aktivitas.jamMulai, aktivitas.jamSelesai) }}</span>
        </div>
      </div>

      <div class="pt-4 border-t border-gray-100 dark:border-gray-700">
        <div v-if="totalDokumenWajib > 0">
          <div class="flex justify-between items-end mb-2">
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Kelengkapan Dokumen</span>
            <span class="text-xs font-bold" :class="persentaseTerkumpul === 100 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'">
              {{ dokumenTerkumpul }} / {{ totalDokumenWajib }}
            </span>
          </div>
          
          <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              class="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out relative"
              :style="{ width: `${persentaseTerkumpul}%` }"
            >
              <div 
                class="absolute top-0 left-0 h-2 bg-green-500 rounded-full transition-all duration-500 ease-out"
                :style="{ width: `${(dokumenTerverifikasi / dokumenTerkumpul) * 100}%` }"
                v-if="dokumenTerkumpul > 0"
              ></div>
            </div>
          </div>
          
          <div class="flex justify-between mt-1">
             <span class="text-[10px] text-green-600 dark:text-green-400" v-if="dokumenTerverifikasi > 0">{{ dokumenTerverifikasi }} Valid</span>
             <span class="text-[10px] text-gray-400 ml-auto" v-if="persentaseTerkumpul < 100">{{ Math.round(persentaseTerkumpul) }}% Terisi</span>
             <span class="text-[10px] text-green-600 font-bold ml-auto" v-else>Selesai!</span>
          </div>
        </div>
        
        <div v-else class="text-center py-2">
          <span class="text-xs text-gray-400 italic">Tidak ada dokumen wajib</span>
        </div>
      </div>

    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const props = defineProps({
  aktivitas: {
    type: Object,
    required: true,
  }
});

// --- HELPER COLOR ---
const hexToRgba = (hex, alpha) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  return "rgba(" + +r + "," + +g + "," + +b + "," + alpha + ")";
};

// --- COMPUTED LOGIC ---

const totalDokumenWajib = computed(() => {
  return props.aktivitas.daftarDokumenWajib?.length || 0;
});

const dokumenTerkumpul = computed(() => {
  if (totalDokumenWajib.value === 0) return 0;
  // PERBAIKAN LOGIC: Cek 'files' array, bukan 'dokumenId' (karena one-to-many)
  return props.aktivitas.daftarDokumenWajib.filter(
    doc => doc.files && doc.files.length > 0
  ).length;
});

const dokumenTerverifikasi = computed(() => {
  if (totalDokumenWajib.value === 0) return 0;
  return props.aktivitas.daftarDokumenWajib.filter(
    doc => doc.statusPengecekan === true
  ).length;
});

const persentaseTerkumpul = computed(() => {
  if (totalDokumenWajib.value === 0) return 0;
  return (dokumenTerkumpul.value / totalDokumenWajib.value) * 100;
});

// --- FORMATTER ---

const formatDate = (start, end) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  if (!start) return 'Jadwal Belum Ditentukan';
  
  const startDate = new Date(start);
  const startStr = format(startDate, 'd MMM yyyy', { locale: id });
  
  if (end && end !== start) {
    const endDate = new Date(end);
    const endStr = format(endDate, 'd MMM yyyy', { locale: id });
    
    // Jika tahun sama
    if (startDate.getFullYear() === endDate.getFullYear()) {
         // Jika bulan sama
         if (startDate.getMonth() === endDate.getMonth()) {
             return `${format(startDate, 'd')} - ${endStr}`;
         }
         return `${format(startDate, 'd MMM')} - ${endStr}`;
    }
    return `${startStr} - ${endStr}`;
  }
  
  return startStr;
};

const formatTime = (start, end) => {
  if (!start) return '';
  const startTime = start.substring(0, 5);
  const endTime = end ? end.substring(0, 5) : null;
  
  if (startTime && endTime) {
    return `${startTime} - ${endTime} WITA`;
  }
  return `${startTime} WITA`;
};
</script>