<template>
  <div class="h-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <span>🥇</span> Leaderboard Kolektor
      </h3>
      <span class="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">Top 10</span>
    </div>

    <div class="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
      <div v-for="(user, idx) in items" :key="user.userId" 
           class="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
        <div class="flex items-center gap-4">
          <!-- Rank -->
          <div class="w-6 text-center">
            <span v-if="idx === 0" class="text-xl">👑</span>
            <span v-else-if="idx === 1" class="text-xl">🥈</span>
            <span v-else-if="idx === 2" class="text-xl">🥉</span>
            <span v-else class="text-xs font-black text-gray-400">{{ idx + 1 }}</span>
          </div>
          
          <!-- Profile -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-700">
              <img v-if="user.fotoProfilUrl" :src="getFullUrl(user.fotoProfilUrl)" class="w-full h-full object-cover">
              <span v-else class="text-sm font-black text-blue-600 dark:text-blue-400">
                {{ user.namaLengkap.charAt(0) }}
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-gray-800 dark:text-gray-200 truncate max-w-[120px]">{{ user.namaLengkap }}</span>
              <span class="text-[10px] font-medium text-gray-500 dark:text-gray-400">Kontributor</span>
            </div>
          </div>
        </div>

        <div class="text-right">
          <div class="text-sm font-black text-gray-900 dark:text-white">{{ user.uploadCount }}</div>
          <div class="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Dokumen</div>
        </div>
      </div>

      <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-10 opacity-30 italic text-sm text-gray-500">
        Belum ada data...
      </div>
    </div>
  </div>
</template>

<script setup>
const baseURL = import.meta.env.VITE_API_BASE_URL

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const getFullUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${baseURL}${url}`
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.4);
}
</style>
