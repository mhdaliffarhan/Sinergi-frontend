<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col relative overflow-hidden">
    
    <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 flex justify-between items-center">
      <div>
        <h3 class="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm">
          <span class="text-lg">🗓️</span> Jadwal Tim
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Aktivitas minggu ini
        </p>
      </div>
      
      <div class="flex items-center bg-white dark:bg-gray-700 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-600">
        <button @click="changeWeek(-1)" class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition text-gray-500 dark:text-gray-300">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <span class="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-200 min-w-[90px] text-center select-none px-2">
          {{ dateRangeLabel }}
        </span>
        <button @click="changeWeek(1)" class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition text-gray-500 dark:text-gray-300">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>

    <div class="flex-1 p-0 overflow-y-auto custom-scrollbar relative">
      
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10">
         <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div class="relative pb-6">
        <div class="absolute left-[27px] top-4 bottom-4 w-px bg-gray-200 dark:bg-gray-700 z-0"></div>

        <div v-for="(dayGroup, index) in groupedEvents" :key="index" class="relative z-10">
          
          <div class="sticky top-0 z-20 flex items-center gap-4 px-4 py-2 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-700">
             <div 
               class="w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 shadow-sm z-20 flex-shrink-0"
               :class="isToday(dayGroup.date) ? 'bg-green-500 ring-2 ring-green-200 dark:ring-green-900 scale-125' : 'bg-blue-400'"
             ></div>
             <div class="flex items-baseline gap-2">
               <span class="text-sm font-bold text-gray-800 dark:text-white uppercase w-8">{{ dayGroup.dayName }}</span>
               <span class="text-xs pl-6 font-mono text-gray-500 dark:text-gray-400">{{ dayGroup.dateFormatted }}</span>
               <span v-if="isToday(dayGroup.date)" class="text-[10px] bg-green-100 text-green-700 px-2 rounded-full font-bold ml-2">Hari Ini</span>
             </div>
          </div>

          <div class="px-4 py-2 pl-12 space-y-2">
            <div v-if="dayGroup.items.length === 0" class="text-xs text-gray-400 italic py-2 border-l-2 border-transparent pl-2">
               - Tidak ada jadwal -
            </div>
            
            <div 
              v-for="event in dayGroup.items" 
              :key="event.id"
              @click="goToDetail(event.id)"
              class="bg-white dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-xl p-3 hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div class="flex justify-between items-start mb-1">
                 <h4 class="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition-colors line-clamp-2">
                   {{ event.nama_aktivitas }}
                 </h4>
              </div>
              
              <div class="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2 items-center">
                 <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded text-[10px]">
                    <span>⏰</span>
                    <span class="font-mono">{{ formatTime(event) }}</span>
                 </div>
                 
                 <div v-if="event.project" class="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-300">
                    <span>💼</span>
                    <span class="truncate max-w-[150px] font-medium">{{ event.project.nama_project }}</span>
                 </div>

                 <span v-if="isActiveNow(event)" class="flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded animate-pulse">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Sedang Berlangsung
                 </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { startOfWeek, endOfWeek, addWeeks, format, addDays, isSameDay, parseISO, isWithinInterval } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

const currentWeekStart = ref(startOfWeek(new Date(), { weekStartsOn: 1 })); // Senin
const events = ref([]);
const isLoading = ref(false);

// Kita gunakan state 'now' yang reaktif agar status 'Sedang Berlangsung' update realtime
const now = ref(new Date());
let timer = null;

// Update waktu setiap menit
onMounted(() => {
  fetchTeamTimeline();
  timer = setInterval(() => {
    now.value = new Date();
  }, 60000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

// --- FETCH DATA ---
const fetchTeamTimeline = async () => {
  isLoading.value = true;
  const start = format(currentWeekStart.value, 'yyyy-MM-dd');
  const end = format(endOfWeek(currentWeekStart.value, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  
  try {
    const response = await axios.get(`${baseURL}/api/dashboard/team-timeline`, {
      params: { start_date: start, end_date: end }
    });
    events.value = response.data;
  } catch (error) {
    console.error("Gagal memuat timeline tim:", error);
  } finally {
    isLoading.value = false;
  }
};

const changeWeek = (direction) => {
  currentWeekStart.value = addWeeks(currentWeekStart.value, direction);
  fetchTeamTimeline();
};

const dateRangeLabel = computed(() => {
  const start = currentWeekStart.value;
  const end = endOfWeek(start, { weekStartsOn: 1 });
  if (start.getMonth() === end.getMonth()) {
     return `${format(start, 'd', { locale: idLocale })} - ${format(end, 'd MMM yyyy', { locale: idLocale })}`;
  }
  return `${format(start, 'd MMM', { locale: idLocale })} - ${format(end, 'd MMM yyyy', { locale: idLocale })}`;
});

// --- GROUPING LOGIC ---
const groupedEvents = computed(() => {
  const days = [];
  const start = currentWeekStart.value;

  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(start, i);
    
    // Filter events yang terjadi pada hari ini
    const dayItems = events.value.filter(ev => {
        if (!ev.tanggal_mulai) return false;
        
        const sDate = parseISO(ev.tanggal_mulai);
        const eDate = ev.tanggal_selesai ? parseISO(ev.tanggal_selesai) : sDate;

        return isWithinInterval(currentDate, { start: sDate, end: eDate });
    });

    // Sort berdasarkan jam
    dayItems.sort((a, b) => {
        const tA = a.jam_mulai || '00:00:00';
        const tB = b.jam_mulai || '00:00:00';
        return tA.localeCompare(tB);
    });

    days.push({
      date: currentDate,
      dayName: format(currentDate, 'EEEE', { locale: idLocale }),
      dateFormatted: format(currentDate, 'd MMM', { locale: idLocale }),
      items: dayItems
    });
  }
  return days;
});

// --- LOGIKA STATUS BERLANGSUNG (FIXED) ---
const isActiveNow = (event) => {
  if (!event.tanggal_mulai) return false;
  
  // 1. Setup Start DateTime
  const start = parseISO(event.tanggal_mulai);
  if (event.jam_mulai) {
    const [h, m] = event.jam_mulai.split(':');
    start.setHours(parseInt(h), parseInt(m), 0);
  } else {
    start.setHours(0, 0, 0, 0); // Mulai awal hari
  }

  // 2. Setup End DateTime
  // Jika tanggal_selesai null, gunakan tanggal_mulai
  const end = event.tanggal_selesai ? parseISO(event.tanggal_selesai) : parseISO(event.tanggal_mulai);
  
  if (event.jam_selesai) {
    const [h, m] = event.jam_selesai.split(':');
    end.setHours(parseInt(h), parseInt(m), 59);
  } else {
    end.setHours(23, 59, 59, 999); // Sampai akhir hari
  }

  // 3. Cek apakah SEKARANG ada di antara Start dan End
  return isWithinInterval(now.value, { start, end });
};

// --- UTILS ---
const isToday = (dateObj) => isSameDay(dateObj, new Date());

const formatTime = (event) => {
    if (event.jam_mulai) {
        const start = event.jam_mulai.substring(0, 5);
        if (event.jam_selesai) return `${start} - ${event.jam_selesai.substring(0, 5)}`;
        return `${start} WITA`;
    }
    return 'Sepanjang Hari';
};

const goToDetail = (id) => router.push(`/aktivitas/detail/${id}`);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; }
</style>