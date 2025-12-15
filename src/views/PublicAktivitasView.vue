<template>
  <div  >
    
    <div class="absolute top-4 right-4 sm:top-6 sm:right-8 z-50 flex items-center gap-3">
      <button
        @click="toggleDarkMode"
        class="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-yellow-400 shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Ganti Tema"
      >
        <span v-if="isDarkMode">🌙</span>
        <span v-else>☀️</span>
      </button>

      <a href="/login" 
         class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Masuk Aplikasi
      </a>
    </div>

    <div class="max-w-5xl mx-auto pt-12 sm:pt-16">
      
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="relative w-20 h-20">
          <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-200 dark:border-blue-900/30 rounded-full opacity-50"></div>
          <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-500 dark:border-blue-400 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="mt-6 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Memuat data publik...</p>
      </div>

      <div v-else-if="error" class="text-center py-20 animate-fade-in-up">
        <div class="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-lg mx-auto relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
          <span class="text-6xl mb-4 block">🚫</span>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Akses Gagal</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-8">{{ error }}</p>
          <a href="/" class="inline-flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Kembali ke Beranda
          </a>
        </div>
      </div>

      <div v-else-if="aktivitas" class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 relative group animate-fade-in-up transition-all duration-300">
        
        <div class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
           <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-purple-500/5 to-transparent dark:from-blue-500/10 dark:via-purple-500/5 rounded-bl-full -mr-20 -mt-20 transition-opacity duration-700"></div>
           <div class="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-500/10 to-transparent dark:from-orange-500/10 rounded-tr-full -ml-16 -mb-16"></div>
        </div>

        <div class="relative z-10">
          
          <div class="p-8 sm:p-10 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div class="flex items-center gap-3 mb-4">
              <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Aktivitas Publik
              </span>
              <!-- <span class="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {{ aktivitas.dibuatPada ? new Date(aktivitas.dibuatPada).toLocaleDateString('id-ID') : '' }}
              </span> -->
            </div>
            
            <h1 class="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
              {{ aktivitas.namaAktivitas }}
            </h1>
            
            <div class="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
               {{ aktivitas.deskripsi || 'Tidak ada deskripsi tambahan.' }}
            </div>
          </div>

          <div class="p-8 sm:p-10 bg-gray-50/50 dark:bg-black/20">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            
            <div class="h-full bg-gradient-to-br from-orange-50 to-amber-100/50 dark:from-orange-950/30 dark:to-amber-900/20 border border-orange-100 dark:border-orange-500/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
              <div class="absolute top-0 right-0 w-16 h-16 bg-orange-200/20 dark:bg-orange-500/10 rounded-full blur-xl -mr-4 -mt-4 transition-all group-hover:bg-orange-300/30 dark:group-hover:bg-orange-500/20"></div>
              
              <div class="flex items-start gap-4 h-full relative z-10">
                <div class="p-3 bg-white dark:bg-orange-900/30 rounded-xl text-2xl shadow-sm text-orange-500 dark:text-orange-400 ring-1 ring-orange-100 dark:ring-orange-500/30">🗓️</div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-wider text-orange-600/70 dark:text-orange-300/80 mb-1">Waktu Pelaksanaan</p>
                  <p class="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-tight">
                    {{ formattedTanggalWaktu.tanggal }}
                  </p>
                  <p v-if="formattedTanggalWaktu.waktu" class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-md inline-block">
                    {{ formattedTanggalWaktu.waktu }}
                  </p>
                </div>
              </div>
            </div>

            <div class="h-full bg-gradient-to-br from-blue-50 to-indigo-100/50 dark:from-blue-950/30 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
              <div class="absolute top-0 right-0 w-16 h-16 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-xl -mr-4 -mt-4 transition-all group-hover:bg-blue-300/30 dark:group-hover:bg-blue-500/20"></div>
              
              <div class="flex items-start gap-4 h-full relative z-10">
                <div class="p-3 bg-white dark:bg-blue-900/30 rounded-xl text-2xl shadow-sm text-blue-500 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-500/30">👥</div>
                
                <div class="flex-1 min-w-0 flex flex-col h-full justify-between">
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-blue-600/70 dark:text-blue-300/80 mb-1">Penyelenggara</p>
                    <p class="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-tight truncate">
                      {{ aktivitas.team?.namaTim || 'Tim Tidak Diketahui' }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      Ketua: {{ aktivitas.team?.ketuaTim?.namaLengkap || '-' }}
                    </p>
                  </div>

                  <div v-if="aktivitas.timTerkait && aktivitas.timTerkait.length > 0" class="mt-3 pt-2 border-t border-blue-200/50 dark:border-blue-500/20">
                    <p class="text-[10px] font-bold text-blue-500/80 dark:text-blue-400 mb-1">Kolaborasi Dengan:</p>
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-for="tim in aktivitas.timTerkait.slice(0, 2)" 
                        :key="tim.id"
                        class="px-2 py-0.5 bg-white dark:bg-blue-900/40 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-200 rounded text-[10px] font-medium"
                      >
                        {{ tim.namaTim }}
                      </span>
                      
                      <span 
                        v-if="aktivitas.timTerkait.length > 2"
                        class="px-2 py-0.5 bg-blue-100 dark:bg-blue-800/40 text-blue-600 dark:text-blue-200 rounded text-[10px] font-bold cursor-help border border-transparent"
                        :title="aktivitas.timTerkait.slice(2).map(t => t.namaTim).join(', ')"
                      >
                        +{{ aktivitas.timTerkait.length - 2 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="h-full bg-gradient-to-br from-purple-50 to-fuchsia-100/50 dark:from-purple-950/30 dark:to-fuchsia-900/20 border border-purple-100 dark:border-purple-500/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
              <div class="absolute top-0 right-0 w-16 h-16 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-xl -mr-4 -mt-4 transition-all group-hover:bg-purple-300/30 dark:group-hover:bg-purple-500/20"></div>
              
              <div class="flex items-start gap-4 h-full relative z-10">
                <div class="p-3 bg-white dark:bg-purple-900/30 rounded-xl text-2xl shadow-sm text-purple-500 dark:text-purple-400 ring-1 ring-purple-100 dark:ring-purple-500/30">💼</div>
                <div class="flex-1 min-w-0">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-purple-600/70 dark:text-purple-300/80 mb-1">Proyek Induk</p>
                  <p class="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-tight truncate">
                    {{ aktivitas.project?.namaProject || 'Tidak ada proyek' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    Lead: {{ aktivitas.project?.projectLeader?.namaLengkap || '-' }}
                  </p>
                </div>
              </div>
            </div>

          </div>

            <div class="mb-10">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span>Pegawai terlibat</span>
                <span class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                  {{ aktivitas.users ? aktivitas.users.length : 0 }}
                </span>
              </h3>
              
              <div class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700" v-if="aktivitas.users && aktivitas.users.length > 0">
                <button 
                  @click="activeMemberTab = 'summary'"
                  class="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200"
                  :class="activeMemberTab === 'summary' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm scale-105' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                >
                  Ringkasan
                </button>
                <button 
                  @click="activeMemberTab = 'list'"
                  class="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200"
                  :class="activeMemberTab === 'list' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm scale-105' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                >
                  Daftar Lengkap
                </button>
              </div>
            </div>

            <div v-if="aktivitas.users && aktivitas.users.length > 0">
               
               <transition name="fade" mode="out-in">
                 <div v-if="activeMemberTab === 'summary'" class="flex flex-wrap items-center gap-3">
                    <div 
                      v-for="user in aktivitas.users" 
                      :key="user.id" 
                      class="relative"
                    >
                      <div class="relative h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 shadow-sm overflow-hidden transition-transform hover:scale-110 hover:z-10 hover:border-blue-300 dark:hover:border-blue-500 peer cursor-help">
                        <img v-if="user.fotoProfilUrl"
                          :src="getProfileUrl(user.fotoProfilUrl)"
                          class="h-full w-full object-cover"
                        />
                        <div v-else
                          class="h-full w-full flex items-center justify-center text-xs font-bold text-white"
                          :style="{ backgroundColor: getSoftRandomColor(user.id).bg, color: getSoftRandomColor(user.id).text }"
                        >
                          {{ getInitials(user.namaLengkap) }}
                        </div>
                      </div>
                      
                      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-gray-900 text-white text-[10px] font-medium rounded-md opacity-0 peer-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                        {{ user.namaLengkap }}
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                 </div>

                 <div v-else class="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead class="bg-gray-50 dark:bg-gray-800/80">
                        <tr>
                          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Pegawai</th>
                          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jabatan</th>
                          </tr>
                      </thead>
                      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="user in aktivitas.users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td class="px-4 py-2.5 whitespace-nowrap flex items-center gap-3">
                             <div class="flex-shrink-0 h-8 w-8">
                               <img v-if="user.fotoProfilUrl" :src="getProfileUrl(user.fotoProfilUrl)" class="h-8 w-8 rounded-full object-cover shadow-sm"/>
                               <div v-else class="h-8 w-8 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-sm" :style="{ backgroundColor: getSoftRandomColor(user.id).bg, color: getSoftRandomColor(user.id).text }">{{ getInitials(user.namaLengkap) }}</div>
                             </div>
                             <div class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ user.namaLengkap }}</div>
                          </td>
                          <td class="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                            <span class="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">{{ user.jabatan?.namaJabatan || '-' }}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                 </div>
               </transition>
            </div>

            <p v-else class="text-gray-400 italic text-sm mt-2">Tidak ada anggota terdaftar.</p>
          </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div class="lg:col-span-2 space-y-6">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span class="text-2xl">📝</span> Dokumen Inti
                </h3>

                <div v-if="aktivitas.daftarDokumenWajib && aktivitas.daftarDokumenWajib.length > 0" class="space-y-3">
                  <div 
                    v-for="item in aktivitas.daftarDokumenWajib" 
                    :key="item.id"
                    class="bg-white dark:bg-gray-800 rounded-xl border p-4 transition-all"
                    :class="[
                      item.files && item.files.length > 0
                        ? 'border-green-200 dark:border-green-800/30 shadow-sm' 
                        : 'border-red-200 dark:border-red-800/30 opacity-70'
                    ]"
                  >
                    <div class="flex justify-between items-start">
                      <div>
                         <h4 class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ item.namaDokumen }}</h4>
                         <p class="text-xs mt-1" :class="item.files && item.files.length > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'">
                           {{ item.files && item.files.length > 0 ? `${item.files.length} file tersedia` : 'Belum tersedia' }}
                         </p>
                      </div>
                      <div v-if="item.statusPengecekan" class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border border-green-200 dark:border-green-800">
                        Terverifikasi
                      </div>
                    </div>
                    
                    <div v-if="item.files && item.files.length > 0" class="mt-3 space-y-1 pl-3 border-l-2 border-gray-100 dark:border-gray-700">
                       <a 
                         v-for="file in item.files" 
                         :key="file.id" 
                         :href="file.tipe === 'LINK' ? file.pathAtauUrl : getDocumentUrl(file.pathAtauUrl)" 
                         target="_blank" 
                         class="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline group"
                       >
                          <span>{{ file.tipe === 'LINK' ? '🔗' : '📄' }}</span>
                          <span class="truncate max-w-xs">{{ file.namaFileAsli || file.keterangan }}</span>
                          <svg class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                       </a>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 text-sm">
                  Tidak ada dokumen wajib.
                </div>
              </div>

              <div class="lg:col-span-1 space-y-4">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                  <span class="text-2xl">📂</span> Arsip Lainnya
                </h3>

                <div v-if="Object.keys(groupedOtherDocuments).length > 0" class="space-y-4">
                  <div v-for="(files, keterangan) in groupedOtherDocuments" :key="keterangan" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div class="bg-gray-50 dark:bg-gray-700/40 px-3 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                       <span class="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">{{ keterangan }}</span>
                       <span class="text-[10px] bg-white dark:bg-gray-600 px-1.5 rounded text-gray-500 dark:text-gray-300">{{ files.length }}</span>
                    </div>
                    <div class="divide-y divide-gray-100 dark:divide-gray-700">
                       <a 
                         v-for="file in files" 
                         :key="file.id" 
                         :href="file.tipe === 'LINK' ? file.pathAtauUrl : getDocumentUrl(file.pathAtauUrl)" 
                         target="_blank"
                         class="block px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition"
                       >
                          <div class="flex items-center gap-2">
                            <span class="text-base">{{ file.tipe === 'LINK' ? '🔗' : '📄' }}</span>
                            <div class="min-w-0">
                              <p class="text-xs font-medium text-gray-800 dark:text-gray-200 truncate max-w-[180px]">
                                {{ file.namaFileAsli || file.pathAtauUrl }}
                              </p>
                              <p class="text-[9px] text-gray-400 uppercase">
                                {{ new Date(file.diunggahPada).toLocaleDateString() }}
                              </p>
                            </div>
                          </div>
                       </a>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 text-sm">
                   Belum ada dokumen tambahan.
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { format, parseISO, isPast, isFuture, isToday } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import Breadcrumbs from '@/components/Breadcrumbs.vue'; // Opsional jika publik

const baseURL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const aktivitas = ref(null);
const isLoading = ref(true);
const error = ref(null);
const activeMemberTab = ref('summary');
// --- DARK MODE LOGIC ---
const isDarkMode = ref(false);

const applyTheme = (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
  isDarkMode.value = isDark;
};

const toggleDarkMode = () => {
  applyTheme(!isDarkMode.value);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') applyTheme(true);
  else if (savedTheme === 'light') applyTheme(false);
  else applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
});

// --- DATA FETCHING ---
onMounted(async () => {
  const publicId = route.params.public_id;
  if (!publicId) { error.value = "ID tidak valid"; isLoading.value = false; return; }

  try {
    const response = await axios.get(`${baseURL}/api/public/aktivitas/${publicId}`);
    aktivitas.value = response.data;
  } catch (err) {
    error.value = err.response?.status === 404 ? "Aktivitas tidak ditemukan." : "Terjadi kesalahan server.";
  } finally {
    isLoading.value = false;
  }
});

// --- COMPUTED & HELPERS ---

const formattedTanggalWaktu = computed(() => {
  if (!aktivitas.value) return { tanggal: '-', waktu: '' };
  const { tanggalMulai, tanggalSelesai, jamMulai, jamSelesai } = aktivitas.value;

  let tglStr = '';
  const tglMulaiObj = parseISO(tanggalMulai);
  const formatStr = 'd MMMM yyyy';

  if (tanggalSelesai) {
    const tglSelesaiObj = parseISO(tanggalSelesai);
    if (format(tglMulaiObj, 'yyyyMM') === format(tglSelesaiObj, 'yyyyMM')) {
        // Bulan sama: 12 - 14 November 2025
        tglStr = `${format(tglMulaiObj, 'd')} - ${format(tglSelesaiObj, formatStr, { locale: idLocale })}`;
    } else {
        tglStr = `${format(tglMulaiObj, formatStr, { locale: idLocale })} - ${format(tglSelesaiObj, formatStr, { locale: idLocale })}`;
    }
  } else {
    tglStr = format(tglMulaiObj, formatStr, { locale: idLocale });
  }

  let waktuStr = '';
  if (jamMulai) {
    waktuStr = jamMulai.substring(0, 5);
    if (jamSelesai) waktuStr += ` - ${jamSelesai.substring(0, 5)}`;
    waktuStr += ' WITA';
  }

  return { tanggal: tglStr, waktu: waktuStr };
});

const groupedOtherDocuments = computed(() => {
  if (!aktivitas.value?.dokumen) return {};
  // Filter: Hanya dokumen yang TIDAK punya parent checklist
  const others = aktivitas.value.dokumen.filter(doc => doc.daftarDokumenId === null || doc.daftarDokumenId === undefined);
  
  const groups = {};
  others.forEach(doc => {
    const key = doc.keterangan || 'Dokumen Umum';
    if (!groups[key]) groups[key] = [];
    groups[key].push(doc);
  });
  return groups;
});

// --- UTILS (Sama dengan detail internal) ---
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length === 0) return '';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length-1][0] : '')).toUpperCase();
};

const getSoftRandomColor = (seed) => {
  // Mengembalikan object { bg, text }
  const colors = [
    { bg: '#fecaca', text: '#b91c1c' }, // Red
    { bg: '#fed7aa', text: '#c2410c' }, // Orange
    { bg: '#fde68a', text: '#b45309' }, // Amber
    { bg: '#bbf7d0', text: '#15803d' }, // Green
    { bg: '#bfdbfe', text: '#1d4ed8' }, // Blue
    { bg: '#e9d5ff', text: '#7e22ce' }, // Purple
    { bg: '#fbcfe8', text: '#be185d' }  // Pink
  ];
  return colors[(seed || 0) % colors.length];
};

const getProfileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("./")) {
    return `${baseURL}/${path.replace("./", "")}`;
  }
  return `${baseURL}/${path}`;
};

const getDocumentUrl = (path) => {
  if (!path) return '#';
  if (path.startsWith('http')) return path;
  return `${baseURL}/${path}`; // Pastikan backend mount /storage
};
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>