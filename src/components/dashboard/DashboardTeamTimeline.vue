<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col overflow-hidden">
    
    <!-- Header & Navigation -->
    <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 flex flex-col gap-3">
      
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm">
          <span class="text-lg">📅</span> Agenda Tim
        </h3>
        <span v-if="isCurrentWeek" class="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full font-bold">
          Minggu Ini
        </span>
      </div>
      
      <div class="flex items-center justify-between w-full bg-white dark:bg-gray-700 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-600">
        <button 
          @click="changeWeek(-1)" 
          class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition text-gray-500 dark:text-gray-300 flex-shrink-0 w-8 flex justify-center"
          title="Minggu Lalu"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        
        <div class="flex flex-col items-center justify-center flex-1 px-2 cursor-default">
          <span class="text-[11px] sm:text-xs font-bold text-gray-700 dark:text-gray-200 text-center select-none">
            {{ dateRangeLabel }}
          </span>
        </div>
        
        <button 
          @click="changeWeek(1)" 
          class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition text-gray-500 dark:text-gray-300 flex-shrink-0 w-8 flex justify-center"
          title="Minggu Depan"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>

    <!-- Content List -->
    <div class="flex-1 p-4 overflow-y-auto custom-scrollbar relative min-h-[300px]">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-800/80 z-20 backdrop-blur-sm">
         <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600 mb-2"></div>
         <p class="text-xs text-gray-500">Memuat agenda...</p>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && filteredEvents.length === 0" class="h-full flex flex-col items-center justify-center text-center py-10 opacity-60">
        <span class="text-4xl mb-3 grayscale opacity-50">☕</span>
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Minggu Tenang</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Tidak ada agenda tim di minggu ini.</p>
      </div>

      <!-- Event List -->
      <transition-group name="list" tag="div" class="space-y-3 relative z-10" v-else>
        <div 
          v-for="event in filteredEvents" 
          :key="event.id" 
          @click="goToDetail(event.id)"
          class="flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group hover:shadow-md relative overflow-hidden bg-white dark:bg-gray-800"
          :class="isToday(event.tanggalMulai) 
            ? 'border-blue-200 dark:border-blue-800 shadow-sm' 
            : 'border-gray-100 dark:border-gray-700 hover:border-blue-300'"
        >
          <!-- Color Indicator -->
          <div 
            class="absolute left-0 top-0 bottom-0 w-1" 
            :style="{ backgroundColor: event.team?.warna || '#3b82f6' }"
          ></div>

          <!-- Date Box -->
          <div class="flex-shrink-0 w-12 text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1 border border-gray-200 dark:border-gray-600 flex flex-col justify-center h-full min-h-[50px] ml-1">
            <span class="block text-[9px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">
              {{ getMonthName(event.tanggalMulai) }}
            </span>
            <span class="block text-xl font-black text-gray-800 dark:text-white leading-none my-0.5">
              {{ getDay(event.tanggalMulai) }}
            </span>
             <span class="block text-[9px] font-bold" :class="isToday(event.tanggalMulai) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'">
              {{ getDayName(event.tanggalMulai) }}
            </span>
          </div>

          <!-- Info -->
          <div class="min-w-0 flex-1 flex flex-col justify-center pl-1">
            
            <div class="flex items-center gap-1.5 mb-1">
               <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: event.team?.warna || '#9ca3af' }"></div>
               <p class="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 truncate">
                 {{ event.team?.namaTim || 'Tim Umum' }}
               </p>
            </div>

            <h4 class="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug mb-1.5">
              {{ event.namaAktivitas }}
            </h4>

            <div class="flex flex-wrap gap-1.5">
              <span class="inline-flex items-center text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600">
                🗓️ {{ formatSchedule(event).date }}
              </span>

              <span v-if="formatSchedule(event).time" class="inline-flex items-center text-[10px] font-mono bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800/50">
                ⏰ {{ formatSchedule(event).time }}
              </span>
            </div>
          </div>
        </div>
      </transition-group>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { startOfWeek, endOfWeek, addWeeks, format, isWithinInterval, parseISO, isSameDay, getWeek } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Props menerima teamId dari parent dropdown
const props = defineProps({
  teamId: { type: [Number, String], default: null } 
});

const router = useRouter();
const currentWeekStart = ref(startOfWeek(new Date(), { weekStartsOn: 1 })); // Senin
const events = ref([]);
const isLoading = ref(false);

// --- FETCH DATA ---
const fetchEvents = async () => {
  isLoading.value = true;
  try {
    // Panggil API Kalender Events dengan filter team_ids
    const params = {};
    if (props.teamId) {
        params.team_ids = props.teamId.toString();
    }
    
    const response = await axios.get(`${baseURL}/api/kalender/events`, { params });
    events.value = response.data || [];
    
  } catch (error) {
    console.error("Gagal memuat agenda tim:", error);
    events.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Watch perubahan teamId dari dropdown parent
watch(() => props.teamId, () => {
  fetchEvents();
}, { immediate: true });

// --- LOGIC NAVIGASI TANGGAL ---
const changeWeek = (direction) => {
  currentWeekStart.value = addWeeks(currentWeekStart.value, direction);
};

const isCurrentWeek = computed(() => {
    const now = new Date();
    const start = currentWeekStart.value;
    const end = endOfWeek(start, { weekStartsOn: 1 });
    return isWithinInterval(now, { start, end });
});

const dateRangeLabel = computed(() => {
  const start = currentWeekStart.value;
  const end = endOfWeek(start, { weekStartsOn: 1 });
  
  if (start.getMonth() === end.getMonth()) {
      return `${format(start, 'd', { locale: idLocale })} - ${format(end, 'd MMMM yyyy', { locale: idLocale })}`;
  }
  return `${format(start, 'd MMM', { locale: idLocale })} - ${format(end, 'd MMM yyyy', { locale: idLocale })}`;
});

// Filter Event Client-Side berdasarkan Minggu yang dipilih
const filteredEvents = computed(() => {
  if (!events.value.length) return [];
  
  const viewStart = currentWeekStart.value;
  const viewEnd = endOfWeek(viewStart, { weekStartsOn: 1 });
  
  const weekEvents = events.value.filter(event => {
    if (!event.tanggalMulai) return false;
    
    const actStart = parseISO(event.tanggalMulai);
    const actEnd = event.tanggalSelesai ? parseISO(event.tanggalSelesai) : actStart;
    
    // Logika Overlap: Event muncul jika rentang tanggalnya bersinggungan dengan minggu ini
    return actStart <= viewEnd && actEnd >= viewStart;
  });

  return weekEvents.sort((a, b) => new Date(a.tanggalMulai) - new Date(b.tanggalMulai));
});

const goToDetail = (id) => router.push(`/aktivitas/detail/${id}`);

// --- FORMATTER HELPERS ---
const isToday = (dateStr) => isSameDay(parseISO(dateStr), new Date());
const getDay = (dateStr) => new Date(dateStr).getDate();
const getMonthName = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', { month: 'short' });
const getDayName = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase();

const formatSchedule = (event) => {
    const sDate = new Date(event.tanggalMulai);
    let dateStr = format(sDate, 'd MMM', { locale: idLocale });

    if (event.tanggalSelesai && event.tanggalSelesai !== event.tanggalMulai) {
        const eDate = new Date(event.tanggalSelesai);
        if (sDate.getMonth() === eDate.getMonth()) {
            dateStr = `${format(sDate, 'd')} - ${format(eDate, 'd MMM', { locale: idLocale })}`;
        } else {
            dateStr = `${format(sDate, 'd MMM')} - ${format(eDate, 'd MMM', { locale: idLocale })}`;
        }
    }

    let timeStr = null;
    if (event.jamMulai) {
        const start = event.jamMulai.substring(0, 5);
        if (event.jamSelesai) {
            timeStr = `${start} - ${event.jamSelesai.substring(0, 5)}`;
        } else {
            timeStr = `${start} WITA`;
        }
    }

    return { date: dateStr, time: timeStr };
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; }

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