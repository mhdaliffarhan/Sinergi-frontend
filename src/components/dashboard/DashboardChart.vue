<template>
  <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col relative overflow-hidden">
    
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div class="absolute top-[-50%] left-[-10%] w-[70%] h-[70%] bg-blue-500/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-[-50%] right-[-10%] w-[70%] h-[70%] bg-purple-500/5 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 flex flex-col h-full">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
        <div>
          <h3 class="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span class="text-xl bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-lg">📈</span> 
            Tren Aktivitas
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
            Visualisasi kinerja tim per bulan
          </p>
        </div>

        <!-- <div class="flex items-center gap-2 self-end sm:self-auto">
           <button 
            @click="resetZoom" 
            class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Reset Zoom"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
          </button>

          <div class="relative">
            <select 
              v-model="selectedRange" 
              @change="handleRangeChange" 
              class="text-xs font-bold border-none bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none transition-shadow hover:shadow-sm"
            >
              <option :value="6">6 Bulan</option>
              <option :value="12">1 Tahun</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div> -->
      </div>

      <div class="mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
        <button 
          @click="isFilterExpanded = !isFilterExpanded"
          class="flex items-center justify-between w-full text-left text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
        >
          <div class="flex items-center gap-2">
            <span>Filter Tim ({{ activeTeamsCount }} / {{ uniqueTeams.length }})</span>
            <span class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[10px]" v-if="hiddenTeams.length > 0">
              {{ hiddenTeams.length }} Disembunyikan
            </span>
          </div>
          <svg 
            class="w-4 h-4 transform transition-transform duration-300" 
            :class="isFilterExpanded ? 'rotate-180' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <transition 
          enter-active-class="transition duration-300 ease-out" 
          enter-from-class="transform -translate-y-2 opacity-0 max-h-0" 
          enter-to-class="transform translate-y-0 opacity-100 max-h-40" 
          leave-active-class="transition duration-200 ease-in" 
          leave-from-class="transform translate-y-0 opacity-100 max-h-40" 
          leave-to-class="transform -translate-y-2 opacity-0 max-h-0"
        >
          <div v-if="isFilterExpanded" class="mt-3 overflow-hidden">
            <div class="flex flex-wrap gap-2 p-1">
              <button 
                @click="toggleAllTeams"
                class="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all"
                :class="hiddenTeams.length === 0 
                  ? 'bg-blue-100 text-blue-700 border-blue-200' 
                  : 'bg-white dark:bg-gray-700 text-gray-500 border-gray-200 dark:border-gray-600'"
              >
                {{ hiddenTeams.length === 0 ? 'Sembunyikan Semua' : 'Tampilkan Semua' }}
              </button>

              <button 
                v-for="teamName in uniqueTeams" 
                :key="teamName"
                @click="toggleTeam(teamName)"
                class="text-[10px] font-medium px-3 py-1.5 rounded-full border transition-all duration-200 flex items-center gap-1.5 hover:shadow-md active:scale-95"
                :class="!hiddenTeams.includes(teamName) 
                  ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600' 
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-400 border-transparent opacity-50'"
              >
                <span 
                  class="w-2 h-2 rounded-full shadow-sm" 
                  :style="{ backgroundColor: !hiddenTeams.includes(teamName) ? getTeamColor(teamName) : '#9ca3af' }"
                ></span>
                {{ teamName }}
              </button>
            </div>
          </div>
        </transition>
      </div>
      
      <div class="flex-1 w-full min-h-0 relative">
        <Line ref="chartRef" v-if="chartData" :data="chartData" :options="chartOptions" />
        
        <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <div class="relative w-12 h-12 mb-3">
             <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-100 dark:border-gray-700 rounded-full"></div>
             <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <span class="text-xs font-medium animate-pulse">Menyiapkan data visualisasi...</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'vue-chartjs';
import zoomPlugin from 'chartjs-plugin-zoom';
import Hammer from 'hammerjs'; // Pastikan install: npm install hammerjs

// Register Plugins
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, zoomPlugin
);

const props = defineProps({
  rawStats: { type: Array, default: () => [] },
  teamList: { type: Array, default: () => [] } 
});

const emit = defineEmits(['filter']);
const selectedRange = ref(12);
const chartRef = ref(null);
const hiddenTeams = ref([]); 
const isFilterExpanded = ref(false); // State untuk accordion filter

// --- HELPERS ---

const handleRangeChange = () => {
  emit('filter', selectedRange.value);
};

const formatMonthLabel = (ymStr) => {
  if (!ymStr) return '';
  const [year, month] = ymStr.split('-');
  const date = new Date(year, month - 1);
  const monthName = date.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
  return `${monthName} '${year.slice(2)}`; 
};

const getTeamColor = (teamName) => {
  const team = props.teamList.find(t => t.namaTim === teamName);
  return team ? (team.warna || '#3b82f6') : stringToColor(teamName); 
};

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

// --- FILTER LOGIC ---

const uniqueTeams = computed(() => {
  if (!props.rawStats) return [];
  return [...new Set(props.rawStats.map(item => item.groupName || 'Umum'))].sort();
});

const activeTeamsCount = computed(() => uniqueTeams.value.length - hiddenTeams.value.length);

const toggleTeam = (teamName) => {
  if (hiddenTeams.value.includes(teamName)) {
    hiddenTeams.value = hiddenTeams.value.filter(t => t !== teamName);
  } else {
    hiddenTeams.value.push(teamName);
  }
};

const toggleAllTeams = () => {
  if (hiddenTeams.value.length === 0) {
    // Sembunyikan semua
    hiddenTeams.value = [...uniqueTeams.value];
  } else {
    // Tampilkan semua
    hiddenTeams.value = [];
  }
};

const resetZoom = () => {
  if (chartRef.value && chartRef.value.chart) {
    chartRef.value.chart.resetZoom();
  }
};

// --- CHART DATA & OPTIONS ---

const chartData = computed(() => {
  if (!props.rawStats || props.rawStats.length === 0) return null;

  const uniqueMonths = [...new Set(props.rawStats.map(item => item.monthYear))].sort();
  const labels = uniqueMonths.map(m => formatMonthLabel(m));

  const datasets = uniqueTeams.value
    .filter(teamName => !hiddenTeams.value.includes(teamName)) 
    .map(teamName => {
      const color = getTeamColor(teamName);
      
      const dataPoints = uniqueMonths.map(month => {
        const record = props.rawStats.find(r => r.monthYear === month && r.groupName === teamName);
        return record ? record.activityCount : 0;
      });

      // Konversi HEX ke RGB untuk opacity background (Area Fill)
      let bgGradient = color; 
      // Kita akan biarkan Chart.js context generator menangani gradien di script ini agak rumit jika pakai hexToRgb manual
      // Jadi kita pakai trik simple: fill dengan opacity rendah dari warna utama
      
      return {
        label: teamName,
        data: dataPoints,
        borderColor: color,
        backgroundColor: (ctx) => {
            const canvas = ctx.chart.ctx;
            const gradient = canvas.createLinearGradient(0, 0, 0, 300);
            // Gunakan warna tim tapi dengan opacity
            // Note: Ini simplifikasi, idealnya kita konversi hex ke rgba
            gradient.addColorStop(0, color); 
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            return gradient;
        },
        pointBackgroundColor: '#fff',
        pointBorderColor: color,
        pointHoverBackgroundColor: color,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        borderWidth: 3,
        tension: 0.4, // Garis melengkung halus
        fill: false // Ubah ke 'start' jika ingin area berwarna, tapi untuk multi-line 'false' lebih bersih
      };
    });

  return {
    labels: labels,
    datasets: datasets
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // PENTING untuk layout flex
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: { display: false }, // Kita pakai custom filter di atas
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)', // Slate-900
      titleColor: '#f8fafc', // Slate-50
      bodyColor: '#cbd5e1', // Slate-300
      titleFont: { size: 13, weight: 'bold' },
      bodyFont: { size: 12 },
      padding: 12,
      cornerRadius: 12,
      boxWidth: 10,
      usePointStyle: true,
      callbacks: {
        title: (tooltipItems) => {
            return tooltipItems[0].label; 
        },
        label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += context.parsed.y + ' Aktivitas';
            }
            return label;
        }
      }
    },
    zoom: {
      pan: { enabled: true, mode: 'x' },
      zoom: {
        wheel: { enabled: true },
        pinch: { enabled: true },
        mode: 'x',
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { 
        color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        drawBorder: false 
      },
      ticks: { 
        color: '#94a3b8', 
        font: { size: 10 },
        precision: 0 
      }
    },
    x: {
      grid: { display: false },
      ticks: { 
        color: '#94a3b8', 
        font: { size: 11, weight: '600' } 
      }
    }
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; }
</style>