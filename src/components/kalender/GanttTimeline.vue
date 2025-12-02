<template>
  <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative flex flex-col h-[calc(100vh-220px)] min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
    
    <div class="flex-grow overflow-auto custom-scrollbar timeline-main-container bg-white dark:bg-gray-800">
      <div class="inline-block min-w-full align-top">
        
        <!-- HEADER (Dates) -->
        <div class="sticky top-0 z-30 flex min-w-fit bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          
          <!-- Corner Label -->
          <div class="sticky left-0 z-40 bg-white/95 backdrop-blur dark:bg-gray-800/95 border-r border-gray-200 dark:border-gray-700 flex items-center pl-4 font-bold text-gray-700 dark:text-gray-200 shadow-[2px_0_5px_rgba(0,0,0,0.05)] flex-shrink-0 w-[220px] sm:w-[250px] min-w-[220px] sm:min-w-[250px] h-14 sm:h-16">
            Pegawai
          </div>
          
          <!-- Date Headers -->
          <div 
            v-for="day in timelineDates" 
            :key="day" 
            class="flex-shrink-0 flex flex-col justify-center items-center h-14 sm:h-16 transition-colors border-r border-gray-100 dark:border-gray-700 box-border"
            :class="{ 
              'bg-red-50/70 dark:bg-red-900/10': isWeekend(day),
              'bg-white dark:bg-gray-800': !isWeekend(day)
            }"
            :style="{ width: `${COLUMN_WIDTH}px`, minWidth: `${COLUMN_WIDTH}px` }"
          >
            <span 
              class="text-[10px] font-bold uppercase tracking-wider mb-0.5"
              :class="isWeekend(day) ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'"
            >
              {{ format(new Date(day), 'E', { locale: idLocale }) }}
            </span>
            <div 
              class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs sm:text-sm font-bold transition-all"
              :class="[
                isToday(day) 
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200 dark:ring-blue-900 scale-110' 
                  : isWeekend(day) 
                    ? 'text-red-600 dark:text-red-300' 
                    : 'text-gray-700 dark:text-gray-200'
              ]"
            >
              {{ format(new Date(day), 'dd') }}
            </div>
          </div>
        </div>
        
        <!-- BODY ROWS -->
        <div class="min-w-fit">
          <div v-for="pegawai in pegawaiList" :key="pegawai.id" class="flex relative group hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
            
            <!-- Row Label (Sticky Left) -->
            <div class="sticky left-0 z-20 bg-white/95 backdrop-blur dark:bg-gray-800/95 border-r border-gray-200 dark:border-gray-700 shadow-[2px_0_5px_rgba(0,0,0,0.05)] group-hover:bg-gray-50/95 dark:group-hover:bg-gray-700/95 transition-colors flex-shrink-0 w-[220px] sm:w-[250px] min-w-[220px] sm:min-w-[250px] flex items-center px-3 sm:px-4">
              <div class="flex items-center gap-3 w-full overflow-hidden">
                <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-600 dark:to-gray-700 flex-shrink-0 flex items-center justify-center text-xs sm:text-sm font-bold text-blue-700 dark:text-gray-200 border border-blue-200 dark:border-gray-500 shadow-sm">
                  {{ pegawai.namaLengkap.charAt(0) }}
                </div>
                <div class="flex flex-col overflow-hidden">
                  <span class="truncate text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100">{{ pegawai.namaLengkap }}</span>
                  <span class="truncate text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{{ pegawai.jabatan?.namaJabatan || 'Pegawai' }}</span>
                </div>
              </div>
            </div>

            <!-- Row Content (Grid & Events) -->
            <div 
              class="relative flex-grow"
              :style="{ height: `${getMaxLane(pegawai.id) * 42 + 20}px` }"
            >
              <!-- Vertical Grid Lines -->
              <div v-for="(day, index) in timelineDates" :key="day"
                class="absolute top-0 bottom-0 border-r border-gray-100 dark:border-gray-700/50 pointer-events-none box-border"
                :class="{ 
                  'bg-red-50/40 dark:bg-red-900/10': isWeekend(day),
                  'bg-transparent': !isWeekend(day)
                }"
                :style="{
                  left: `${index * COLUMN_WIDTH}px`,
                  width: `${COLUMN_WIDTH}px`,
                }"
              ></div>
              
              <!-- Bottom Border -->
              <div class="absolute bottom-0 left-0 right-0 h-px bg-gray-100 dark:bg-gray-700"></div>

              <!-- Events -->
              <div 
                v-for="event in getEventsForPegawai(pegawai.id)" 
                :key="event.id"
                class="timeline-event-bar group/event"
                :style="{
                  'background-color': event.backgroundColor,
                  'left': `${calculateEventOffset(event)}px`,
                  'width': `${Math.max(calculateEventWidth(event) - 6, 6)}px`, 
                  'top': `${(event.lane - 1) * 42 + 10}px`
                }"
                @click="$emit('event-click', event.id)"
              >
                <div class="w-full h-full flex items-center px-2.5">
                   <span class="event-title-text text-white drop-shadow-sm font-medium tracking-tight">{{ event.title }}</span>
                </div>

                <div class="event-tooltip shadow-xl backdrop-blur-sm bg-gray-900/95 border border-gray-700">
                  <div class="text-sm font-bold text-white mb-1 leading-tight">{{ event.title }}</div>
                  <div class="text-xs text-gray-300 flex items-center gap-1.5 mt-1">
                    <span class="font-mono opacity-80">
                      {{ event.start_time && event.end_time ? `${event.start_time} - ${event.end_time}` : 'Sepanjang Hari' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="pegawaiList.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
          <div class="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-full mb-3">
             <svg class="w-10 h-10 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <p class="text-base font-medium text-gray-600 dark:text-gray-300">Tidak ada data pegawai</p>
          <p class="text-xs">Sesuaikan filter tim untuk melihat data.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format, isWithinInterval, startOfMonth, endOfMonth, parseISO, differenceInDays, isSameDay } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const props = defineProps({
  pegawaiList: Array,
  timelineDates: Array,
  events: Array,
  timelineCurrentDate: Date
});

const emit = defineEmits(['event-click']);

const COLUMN_WIDTH = 60;

const isWeekend = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 0 || day === 6;
};

const isToday = (dateString) => {
  return isSameDay(new Date(dateString), new Date());
};

// Event Placement Logic
const assignLanes = (events) => {
  const sortedEvents = [...events].sort((a, b) => new Date(a.start) - new Date(b.start));
  const lanes = [];
  sortedEvents.forEach(event => {
    let assignedLane = -1;
    for (let i = 0; i < lanes.length; i++) {
      let canFit = true;
      for (const placedEvent of lanes[i]) {
        const start1 = new Date(event.start);
        const end1 = event.end ? new Date(event.end) : start1;
        const start2 = new Date(placedEvent.start);
        const end2 = placedEvent.end ? new Date(placedEvent.end) : start2;
        if (Math.max(start1.getTime(), start2.getTime()) <= Math.min(end1.getTime(), end2.getTime())) {
          canFit = false;
          break;
        }
      }
      if (canFit) {
        assignedLane = i;
        break;
      }
    }
    if (assignedLane === -1) {
      lanes.push([event]);
      event.lane = lanes.length;
    } else {
      lanes[assignedLane].push(event);
      event.lane = assignedLane + 1;
    }
  });
  return sortedEvents;
};

const getEventsForPegawai = (pegawaiId) => {
    // Filter dari seluruh list event yang dikirim parent, khusus untuk pegawai ini
    const events = props.events
        .filter(a => a.users && a.users.some(u => u.id === pegawaiId))
        .map(a => {
            const eventStart = a.tanggalMulai;
            const eventEnd = a.tanggalSelesai ? a.tanggalSelesai : a.tanggalMulai;
            return {
                ...a,
                title: a.namaAktivitas,
                start_time: a.jamMulai,
                end_time: a.jamSelesai,
                start: eventStart,
                end: eventEnd,
                backgroundColor: a.team?.warna || '#3b82f6',
            };
        });

    const filteredByMonth = events.filter(e => {
        const eventStart = new Date(e.start);
        const eventEnd = e.end ? new Date(e.end) : eventStart;
        const currentMonthStart = startOfMonth(props.timelineCurrentDate);
        const currentMonthEnd = endOfMonth(props.timelineCurrentDate);
        return isWithinInterval(eventStart, { start: currentMonthStart, end: currentMonthEnd }) ||
               isWithinInterval(eventEnd, { start: currentMonthStart, end: currentMonthEnd }) ||
               (eventStart < currentMonthStart && eventEnd > currentMonthEnd);
    });
    
    return assignLanes(filteredByMonth);
};

const getMaxLane = (pegawaiId) => {
  const events = getEventsForPegawai(pegawaiId);
  return events.length > 0 ? Math.max(...events.map(e => e.lane)) : 1;
};

const calculateEventWidth = (event) => {
  const eventStart = parseISO(event.start);
  const eventEnd = event.end ? parseISO(event.end) : eventStart;
  const currentMonthStart = startOfMonth(props.timelineCurrentDate);
  const currentMonthEnd = endOfMonth(props.timelineCurrentDate);
  const effectiveStart = eventStart < currentMonthStart ? currentMonthStart : eventStart;
  const effectiveEnd = eventEnd > currentMonthEnd ? currentMonthEnd : eventEnd;
  const days = differenceInDays(effectiveEnd, effectiveStart) + 1;
  return days * COLUMN_WIDTH; 
};

const calculateEventOffset = (event) => {
  const eventStart = parseISO(event.start);
  const currentMonthStart = startOfMonth(props.timelineCurrentDate);
  const effectiveStart = eventStart < currentMonthStart ? currentMonthStart : eventStart;
  const daysOffset = differenceInDays(effectiveStart, currentMonthStart);
  return daysOffset * COLUMN_WIDTH; 
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

.timeline-main-container {
  -webkit-overflow-scrolling: touch;
}

.timeline-event-bar {
  position: absolute;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.timeline-event-bar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px -2px rgba(0,0,0,0.15);
  z-index: 20;
}
.event-title-text {
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.event-tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  color: white;
  padding: 10px 14px;
  border-radius: 12px;
  width: max-content;
  max-width: 280px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 100;
}
.event-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: #111827 transparent transparent transparent;
}
.timeline-event-bar:hover .event-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}
</style>