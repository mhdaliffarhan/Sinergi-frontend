<template>
  <!-- STICKY HEADER CONTROL PANEL -->
  <div 
    class="sticky top-0 z-30 transition-all duration-500 ease-in-out"
    :class="isScrolled ? 'pt-0' : 'pt-4 px-4'"
  >
    <div 
      class="border-b transition-all duration-500 ease-in-out"
      :class="[
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md border-gray-200 dark:border-gray-700 rounded-none py-3 px-4' 
          : 'bg-white dark:bg-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-none border-transparent rounded-2xl p-5'
      ]"
    >
      <div class="flex flex-col gap-4 max-w-7xl mx-auto">
        
        <!-- Top Row: Mode Switcher & Timeline Controls -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <!-- Mode Switcher -->
          <div class="bg-gray-100/80 dark:bg-gray-700/80 p-1 rounded-xl inline-flex relative w-full md:w-auto shadow-inner">
             <div
                class="absolute top-1 bottom-1 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white dark:bg-gray-600 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] border border-gray-200 dark:border-gray-500"
                :class="{
                  'left-1 w-[calc(33.33%-2.6px)]': true,
                  'translate-x-0': mode === 'team',
                  'translate-x-[100%]': mode === 'timeline',
                  'translate-x-[200%]': mode === 'person'
                }"
              ></div>

            <button
              @click="$emit('update:mode', 'team')"
              class="relative z-10 w-1/3 md:w-28 py-1.5 flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors duration-200"
              :class="mode === 'team' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
            >
              <span class="text-base">👥</span> <span class="hidden sm:inline">Tim</span>
            </button>

            <button
              @click="$emit('update:mode', 'timeline')"
              class="relative z-10 w-1/3 md:w-28 py-1.5 flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors duration-200"
              :class="mode === 'timeline' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
            >
              <span class="text-base">📊</span> <span class="hidden sm:inline">Timeline</span>
            </button>
            
            <button
              @click="$emit('update:mode', 'person')"
              class="relative z-10 w-1/3 md:w-28 py-1.5 flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors duration-200"
              :class="mode === 'person' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
            >
              <span class="text-base">👤</span> <span class="hidden sm:inline">Person</span>
            </button>
          </div>

          <!-- Timeline Controls (Only visible in Timeline Mode) -->
          <div v-if="mode === 'timeline'" class="flex items-center justify-between md:justify-end gap-3 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-600 w-full md:w-auto">
            <button @click="$emit('prev-month')" class="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm text-gray-500 dark:text-gray-300 transition-all active:scale-95">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <span class="text-sm font-bold text-gray-800 dark:text-gray-100 min-w-[120px] text-center capitalize tracking-wide">
              {{ format(timelineCurrentDate, 'MMMM yyyy', { locale: idLocale }) }}
            </span>
            <button @click="$emit('next-month')" class="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm text-gray-500 dark:text-gray-300 transition-all active:scale-95">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        <!-- Bottom Row: Smart Filters -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-t border-gray-100 dark:border-gray-700/50 pt-3">
          
          <!-- Label Filter -->
          <div class="flex items-center gap-2 min-w-fit">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Filter {{ mode === 'person' ? 'Pegawai' : 'Tim' }}:
            </span>
          </div>
          
          <!-- Team Filters (Expandable) -->
          <div v-if="mode === 'team' || mode === 'timeline'" class="w-full">
            <div class="flex flex-wrap items-center gap-2">
              
              <!-- Tombol Toggle Expand/Collapse -->
               <button 
                @click="isFilterExpanded = !isFilterExpanded"
                class="px-3 py-1 text-xs font-bold rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-1 active:scale-95"
              >
                <span v-if="!isFilterExpanded">
                   <span class="mr-1 text-base leading-none">+</span> Edit Filter
                </span>
                <span v-else>
                   <span class="mr-1 text-base leading-none">×</span> Selesai
                </span>
              </button>

              <!-- List Tim (Transition Group for Animation) -->
              <TransitionGroup name="list" tag="div" class="flex flex-wrap gap-2">
                
                <!-- TOMBOL SEMUA TIM (Selalu Ada) -->
                 <button
                  key="all-teams-option"
                  @click="$emit('select-all-teams')"
                  class="px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 flex items-center gap-2 group"
                  :class="selectedTeams.length === 0
                    ? 'bg-gray-800 text-white border-gray-800 dark:bg-white dark:text-gray-900 shadow-sm ring-1 ring-gray-500/20'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'"
                >
                  <span>Semua</span>
                  <span v-if="selectedTeams.length === 0" class="ml-1 text-xs">✓</span>
                </button>

                <!-- Loop Tim -->
                <button
                  v-for="team in visibleTeams"
                  :key="team.id"
                  @click="$emit('toggle-team', team)"
                  class="px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 flex items-center gap-2 group relative overflow-hidden"
                  :class="isTeamSelected(team)
                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700/50 shadow-sm ring-1 ring-blue-500/20'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'"
                >
                  <span 
                    class="w-2 h-2 rounded-full shadow-sm" 
                    :style="{ backgroundColor: team.warna }"
                  ></span>
                  {{ team.namaTim }}
                  
                  <span v-if="isFilterExpanded && isTeamSelected(team)" class="ml-1 text-blue-400 hover:text-blue-600">×</span>
                </button>
              </TransitionGroup>

            </div>
          </div>

          <!-- Person Search (Mode Person) -->
          <div v-if="mode === 'person'" class="relative w-full sm:max-w-xs ml-auto animate-in slide-in-from-right-5 fade-in duration-300">
            <div class="relative group">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input
                type="text"
                :value="searchQuery"
                @input="$emit('update:searchQuery', $event.target.value)"
                placeholder="Cari nama pegawai..."
                class="pl-10 pr-4 py-2 w-full text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                @focus="showDropdown = true"
                @blur="handleBlur"
              />
            </div>
            
            <transition name="dropdown">
              <div 
                v-if="showDropdown && filteredPegawai.length > 0" 
                class="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar ring-1 ring-black/5"
              >
                <div
                  class="px-4 py-2.5 text-sm cursor-pointer border-b border-gray-50 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors flex items-center justify-between"
                  :class="{'bg-blue-50 dark:bg-gray-700 text-blue-600': selectedPegawaiId === ''}"
                  @mousedown.prevent="selectPegawai({ id: '' })"
                >
                  <span>Semua Pegawai</span>
                  <span v-if="selectedPegawaiId === ''" class="text-blue-600">✓</span>
                </div>
                <div 
                  v-for="pegawai in filteredPegawai" 
                  :key="pegawai.id"
                  class="px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors flex items-center justify-between group"
                  :class="{'bg-blue-50 dark:bg-gray-700 text-blue-600': selectedPegawaiId === pegawai.id}"
                  @mousedown.prevent="selectPegawai(pegawai)"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 flex items-center justify-center text-xs font-bold uppercase">
                      {{ pegawai.namaLengkap.charAt(0) }}
                    </div>
                    {{ pegawai.namaLengkap }}
                  </div>
                  <span v-if="selectedPegawaiId === pegawai.id" class="text-blue-600">✓</span>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const props = defineProps({
  mode: String,
  teams: Array,
  selectedTeams: Array,
  searchQuery: String,
  timelineCurrentDate: Date,
  filteredPegawai: Array,
  selectedPegawaiId: [String, Number, null]
});

const emit = defineEmits([
  'update:mode', 
  'update:searchQuery', 
  'prev-month', 
  'next-month', 
  'select-all-teams', 
  'toggle-team',
  'select-pegawai'
]);

const isFilterExpanded = ref(false);
const showDropdown = ref(false);
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const handleBlur = () => {
  setTimeout(() => { showDropdown.value = false; }, 200);
};

const selectPegawai = (pegawai) => {
  emit('select-pegawai', pegawai);
  showDropdown.value = false;
};

const isTeamSelected = (team) => {
  return props.selectedTeams.some(t => t.id === team.id);
};

// Reset expand saat mode berubah
watch(() => props.mode, () => {
  isFilterExpanded.value = false;
});

const visibleTeams = computed(() => {
  if (isFilterExpanded.value) {
    return props.teams;
  } else {
    return props.selectedTeams;
  }
});

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* LIST TRANSITION */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.list-leave-active {
  position: absolute;
}

/* DROPDOWN TRANSITION */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease-out;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}
</style>