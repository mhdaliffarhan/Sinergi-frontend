<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h3 class="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-lg">
          <span class="text-2xl">🗓️</span> Timeline Kegiatan Tim
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitoring beban kerja tim minggu ini.
        </p>
      </div>

      <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button @click="shiftWeek(-1)" class="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-md shadow-sm transition">
          ◀
        </button>
        <span class="px-4 font-bold text-sm text-gray-700 dark:text-gray-200 min-w-[140px] text-center">
          {{ dateLabel }}
        </span>
        <button @click="shiftWeek(1)" class="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-md shadow-sm transition">
          ▶
        </button>
      </div>
    </div>

    <div class="overflow-x-auto custom-scrollbar border border-gray-200 dark:border-gray-700 rounded-xl">
      <div class="min-w-[800px]">
        
        <div class="grid grid-cols-[200px_repeat(7,1fr)] bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <div class="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200 dark:border-gray-700 sticky left-0 bg-gray-50 dark:bg-gray-900 z-10">
            Tim Kerja
          </div>
          <div 
            v-for="(day, index) in weekDays" 
            :key="index" 
            class="p-3 text-center border-r border-gray-100 dark:border-gray-700 last:border-r-0"
            :class="isToday(day.date) ? 'bg-blue-50 dark:bg-blue-900/20' : ''"
          >
            <p class="text-[10px] font-bold text-gray-400 uppercase">{{ day.name }}</p>
            <p class="text-sm font-bold text-gray-800 dark:text-white" :class="isToday(day.date) ? 'text-blue-600' : ''">
              {{ day.date.getDate() }}
            </p>
          </div>
        </div>

        <div v-if="isLoading" class="p-10 text-center">
           <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>

        <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
          <div 
            v-for="team in timelineData" 
            :key="team.id" 
            class="grid grid-cols-[200px_repeat(7,1fr)] group hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
          >
            <div class="p-4 border-r border-gray-200 dark:border-gray-700 sticky left-0 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50 z-10 flex items-center gap-3">
              <div class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: team.warna }"></div>
              <div>
                <p class="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{{ team.namaTim }}</p>
                <p class="text-[10px] text-gray-500">Ketua: {{ team.ketua}}</p>
              </div>
            </div>

            <div class="col-span-7 relative h-full min-h-[60px] p-2">
              
              <div class="absolute inset-0 grid grid-cols-7 pointer-events-none">
                 <div v-for="i in 7" :key="i" class="border-r border-dashed border-gray-100 dark:border-gray-700 h-full"></div>
              </div>

              <div class="space-y-1 relative z-0">
                <div 
                  v-for="act in team.activities" 
                  :key="act.id"
                  class="h-7 rounded-md text-[10px] flex items-center px-2 text-white font-medium shadow-sm cursor-pointer hover:opacity-90 transition-all truncate"
                  :style="getBarStyle(act, team.warna)"
                  @click="goToDetail(act.id)"
                  :title="act.namaAktivitas"
                >
                  {{ act.namaAktivitas }}
                </div>
              </div>
              
              <div v-if="team.activities.length === 0" class="h-full flex items-center justify-center opacity-20 text-xs">
                - Kosong -
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { startOfWeek, endOfWeek, addDays, addWeeks, format, isSameDay, parseISO, differenceInDays } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import axios from 'axios';
import { useRouter } from 'vue-router';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

const currentStartDate = ref(startOfWeek(new Date(), { weekStartsOn: 1 })); // Senin
const timelineData = ref([]);
const isLoading = ref(false);

// Generate 7 Hari untuk Header
const weekDays = computed(() => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(currentStartDate.value, i);
    days.push({
      date: d,
      name: format(d, 'EEE', { locale: idLocale }) // SEN, SEL
    });
  }
  return days;
});

const dateLabel = computed(() => {
  const start = currentStartDate.value;
  const end = addDays(start, 6);
  return `${format(start, 'd MMM')} - ${format(end, 'd MMM yyyy')}`;
});

// Navigasi
const shiftWeek = (amount) => {
  currentStartDate.value = addWeeks(currentStartDate.value, amount);
  fetchData();
};

const isToday = (dateObj) => isSameDay(dateObj, new Date());

// Fetch Data
const fetchData = async () => {
  isLoading.value = true;
  const start = format(currentStartDate.value, 'yyyy-MM-dd');
  const end = format(addDays(currentStartDate.value, 6), 'yyyy-MM-dd');
  
  try {
    const response = await axios.get(`${baseURL}/api/dashboard/timeline-monitor`, {
      params: { start_date: start, end_date: end }
    });
    timelineData.value = response.data;
  } catch (error) {
    console.error("Timeline fetch error:", error);
  } finally {
    isLoading.value = false;
  }
};

// Logic Style Bar (Posisi & Lebar)
const getBarStyle = (act, color) => {
  const viewStart = currentStartDate.value;
  const actStart = parseISO(act.tanggalMulai);
  const actEnd = parseISO(act.tanggalSelesai);

  // Hitung Offset (Jarak dari hari Senin minggu ini)
  // Jika mulai sebelum minggu ini, offset 0
  let offset = differenceInDays(actStart, viewStart);
  if (offset < 0) offset = 0;

  // Hitung Durasi (Berapa hari tampil di minggu ini)
  // Clamp start dan end ke range minggu ini
  const effectiveStart = actStart < viewStart ? viewStart : actStart;
  const viewEnd = addDays(viewStart, 6);
  const effectiveEnd = actEnd > viewEnd ? viewEnd : actEnd;

  let duration = differenceInDays(effectiveEnd, effectiveStart) + 1;
  if (duration < 1) duration = 1; // Minimal 1 hari

  // Konversi ke Persentase CSS
  // 1 hari = 100% / 7 = 14.28%
  const widthPct = duration * 14.28; 
  const leftPct = offset * 14.28;

  return {
    backgroundColor: color,
    width: `${widthPct}%`,
    marginLeft: `${leftPct}%`,
    position: 'relative' // Stack secara default
  };
};

const goToDetail = (id) => {
  router.push(`/aktivitas/detail/${id}`);
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 8px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; }
</style>