<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 relative">
    
    <div class="absolute top-4 right-4 sm:top-6 sm:right-8 z-10 flex items-center gap-3">
      <button
        @click="toggleDarkMode"
        class="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span v-if="isDarkMode">☀️</span>
        <span v-else>🌙</span>
      </button>

      <a href="/login" 
         class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
        Login
      </a>
    </div>

    <div class="max-w-4xl mx-auto pt-10">

      <div v-if="isLoading" 
           class="animate-pulse bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-10">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div class="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <div class="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl max-w-lg mx-auto">
          <span class="text-7xl">🚨</span>
          <h2 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Gagal Memuat</h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            {{ error }}
          </p>
          <a href="/" class="mt-6 inline-block px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
            Kembali ke Beranda
          </a>
        </div>
      </div>

      <div v-else-if="aktivitas" 
           class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        
        <div class="p-6 sm:p-10 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            {{ aktivitas.namaAktivitas }}
          </h1>
          <p class="text-lg sm:text-xl font-medium text-blue-600 dark:text-blue-400">
            {{ aktivitas.project?.namaProject || 'Proyek Internal' }}
          </p>
        </div>

        <div class="p-6 sm:p-10">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            <div class="flex items-center gap-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <span class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl" :class="computedStatus.bgClass">
                <span>{{ computedStatus.icon }}</span>
              </span>
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <p class="text-lg font-semibold" :class="computedStatus.textClass">{{ computedStatus.text }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <span class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xl">
                <span>🗓️</span>
              </span>
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Waktu Pelaksanaan</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formattedTanggalWaktu }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <span class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl" :style="{ backgroundColor: aktivitas.team?.warna || '#6B7280' }">
                <span>👥</span>
              </span>
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Tim</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ aktivitas.team?.namaTim || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <span class="text-2xl mr-2">ℹ️</span> Deskripsi
            </h2>
            <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {{ aktivitas.deskripsi || 'Tidak ada deskripsi.' }}
            </p>
          </div>
          
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <span class="text-2xl mr-2">👥</span>
              Anggota Terlibat
            </h2>

            <div class="flex border-b border-gray-200 dark:border-gray-700 mb-4">
              <button
                v-for="tab in ['Ringkasan', 'Daftar Lengkap']"
                :key="tab"
                @click="activeTab = tab"
                :class="[
                  'px-4 py-2 text-sm font-medium transition-colors duration-150',
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                ]"
              >
                {{ tab }}
              </button>
            </div>

            <div v-if="aktivitas.users && aktivitas.users.length > 0">
              <div v-if="activeTab === 'Ringkasan'" class="flex flex-wrap items-center gap-4">
                <div class="flex flex-wrap -space-x-3">
                  <div 
                    v-for="user in aktivitas.users" 
                    :key="user.id" 
                    class="relative h-12 w-12 rounded-full flex items-center justify-center text-xs font-semibold ring-2 ring-white dark:ring-gray-800 transition duration-150 transform hover:scale-110 hover:z-10 cursor-pointer"
                    :title="user.namaLengkap"
                  >
                    <img v-if="user.fotoProfilUrl"
                      :src="getProfileUrl(user.fotoProfilUrl)"
                      alt="Profil"
                      class="h-full w-full rounded-full object-cover"
                    />
                    <div v-else
                      class="h-full w-full rounded-full flex items-center justify-center text-sm"
                      :style="{ backgroundColor: getSoftRandomColor(user.id).bg, color: getSoftRandomColor(user.id).text }"
                    >
                      {{ getInitials(user.namaLengkap) }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="activeTab === 'Daftar Lengkap'" class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <table class="min-w-full text-sm text-left text-gray-600 dark:text-gray-300">
                  <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="px-4 py-3 w-16 text-center">Foto</th>
                      <th scope="col" class="px-4 py-3">Nama Lengkap</th>
                      <th scope="col" class="px-4 py-3 hidden sm:table-cell">Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="user in aktivitas.users"
                      :key="user.id"
                      class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td class="px-4 py-3 text-center">
                        <div class="h-10 w-10 rounded-full overflow-hidden mx-auto">
                          <img v-if="user.fotoProfilUrl"
                            :src="getProfileUrl(user.fotoProfilUrl)"
                            alt="Profil"
                            class="h-full w-full object-cover"
                          />
                          <div
                            v-else
                            class="h-full w-full flex items-center justify-center text-xs font-semibold"
                            :style="{ backgroundColor: getSoftRandomColor(user.id).bg, color: getSoftRandomColor(user.id).text }"
                          >
                            {{ getInitials(user.namaLengkap) }}
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {{ user.namaLengkap }}
                      </td>
                      <td class="px-4 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                        @{{ user.username }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div v-else class="text-center text-gray-500 dark:text-gray-400 p-6">
              Tidak ada anggota yang terlibat dalam aktivitas ini.
            </div>
          </div>
          
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <span class="text-2xl mr-2">📎</span>Bukti Dukung
            </h2>
            <ul v-if="aktivitas.dokumen?.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
              <li v-for="doc in aktivitas.dokumen" :key="doc.id"
                  class="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <div class="flex items-center min-w-0">
                  <span class="text-xl mr-3 flex-shrink-0">
                    {{ doc.tipe === 'FILE' ? '📄' : '🔗' }}
                  </span>
                  <span class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {{ doc.keterangan || doc.namaFileAsli || 'Dokumen' }}
                  </span>
                </div>
                <a :href="getDocumentUrl(doc)" target="_blank" rel="noopener noreferrer"
                   class="ml-4 flex-shrink-0 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  Lihat
                </a>
              </li>
            </ul>
            <p v-else class="text-gray-500 dark:text-gray-400 text-sm">
              Tidak ada dokumen atau link terlampir.
            </p>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-20">
         <div class="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl max-w-lg mx-auto">
          <span class="text-7xl">🧐</span>
          <h2 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Tidak Ditemukan</h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Aktivitas yang Anda cari tidak ada atau link-nya tidak valid.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'; // <-- Pastikan 'watch' di-impor
import { useRoute } from 'vue-router';
import axios from 'axios';
import { format, parseISO, isPast, isFuture, isToday } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const route = useRoute();
const aktivitas = ref(null);
const isLoading = ref(true);
const error = ref(null);

const baseURL = import.meta.env.VITE_API_BASE_URL;

// =================================================================
// LOGIKA DARK MODE (BARU)
// =================================================================
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

const activeTab = ref('Ringkasan');


const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length === 0) return '';
  const firstInitial = parts[0][0];
  const lastPart = parts[parts.length - 1];
  const lastInitial = lastPart.replace(/[^a-zA-Z]/g, '')[0]; // Ambil inisial terakhir dari nama belakang
  
  // Jika hanya satu nama, gunakan 2 huruf pertama
  if (parts.length === 1 && name.length > 1) {
    return name.substring(0, 2).toUpperCase();
  }
  
  return (firstInitial + lastInitial).toUpperCase();
};

const getSoftRandomColor = (seed) => {
  // Gunakan ID user sebagai seed untuk warna yang konsisten
  if (seed === null || seed === undefined) seed = 0;
  const colors = [
    // Palet warna soft-pastel
    { bg: '#fecaca', text: '#b91c1c' }, // red
    { bg: '#fde68a', text: '#b45309' }, // amber
    { bg: '#d9f99d', text: '#4d7c0f' }, // lime
    { bg: '#bbf7d0', text: '#15803d' }, // green
    { bg: '#bae6fd', text: '#0369a1' }, // lightBlue
    { bg: '#c7d2fe', text: '#4338ca' }, // indigo
    { bg: '#fbcfe8', text: '#be185d' }  // pink
  ];
  return colors[Math.abs(seed) % colors.length];
};


const getProfileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("./")) {
    return `${baseURL}/${path.replace("./", "")}`;
  }
  return `${baseURL}/${path}`;
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    applyTheme(true);
  } else if (savedTheme === 'light') {
    applyTheme(false);
  } else {
    // Jika tidak ada di local storage, cek preferensi sistem
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  
  // ... (Sisa onMounted Anda untuk fetch data)
  // ...
});
// =================================================================

const getDocumentUrl = (doc) => {
  // (camelCase sudah benar dari sebelumnya)
  if (doc.tipe === 'FILE') {
    return `${baseURL}/${doc.pathAtauUrl}`;
  }
  return doc.pathAtauUrl;
};

const formattedTanggalWaktu = computed(() => {
  // (camelCase sudah benar dari sebelumnya)
  if (!aktivitas.value) return 'N/A';
  const { tanggalMulai, tanggalSelesai, jamMulai, jamSelesai } = aktivitas.value;
  // ... (sisa logika Anda sudah benar) ...
  try {
    const tglMulai = parseISO(tanggalMulai);
    const tglSelesai = tanggalSelesai ? parseISO(tanggalSelesai) : tglMulai;
    const formatTgl = 'd MMM yyyy';
    
    let tglStr;
    if (format(tglMulai, 'yyyyMMdd') === format(tglSelesai, 'yyyyMMdd')) {
      tglStr = format(tglMulai, formatTgl, { locale: idLocale });
    } else {
      tglStr = `${format(tglMulai, formatTgl, { locale: idLocale })} - ${format(tglSelesai, formatTgl, { locale: idLocale })}`;
    }
    
    let waktuStr = '';
    if (jamMulai) {
      waktuStr = ` (${jamMulai.substring(0, 5)}`;
      if (jamSelesai) {
        waktuStr += ` - ${jamSelesai.substring(0, 5)}`;
      }
      waktuStr += " WITA)";
    }
    return `${tglStr}${waktuStr}`;
  } catch (e) {
    return "Format tanggal tidak valid";
  }
});

// =================================================================
// GANTI COMPUTED STATUS (untuk mengembalikan EMOJI)
// =================================================================
const computedStatus = computed(() => {
  if (!aktivitas.value?.tanggalMulai) {
    return { text: 'N/A', icon: '⚠️', bgClass: 'bg-gray-100', textClass: 'text-gray-600' };
  }
  const tglMulai = parseISO(aktivitas.value.tanggalMulai);
  const tglSelesai = aktivitas.value.tanggalSelesai ? parseISO(aktivitas.value.tanggalSelesai) : tglMulai;
  
  if (isPast(tglSelesai) && !isToday(tglSelesai)) {
    return { text: 'Selesai', icon: '✅', bgClass: 'bg-green-100', textClass: 'text-green-600' };
  }
  if (isFuture(tglMulai) && !isToday(tglMulai)) {
    return { text: 'Akan Datang', icon: '🗓️', bgClass: 'bg-gray-100', textClass: 'text-gray-600' };
  }
  return { text: 'Berlangsung', icon: '⏳', bgClass: 'bg-blue-100', textClass: 'text-blue-600' };
});

// onMounted Anda untuk fetch data (Biarkan seperti yang lama)
onMounted(async () => {
  isLoading.value = true;
  error.value = null;
  aktivitas.value = null;

  const publicId = route.params.public_id;
  
  if (!publicId || publicId === 'undefined') {
     error.value = "Link aktivitas tidak valid atau rusak.";
     isLoading.value = false;
     return;
  }
  
  try {
    const response = await axios.get(`${baseURL}/api/public/aktivitas/${publicId}`);
    if (!response.data) {
        error.value = "Aktivitas tidak ditemukan.";
    } else {
        aktivitas.value = response.data;
    }
  } catch (err) {
    console.error("Gagal memuat aktivitas:", err);
    if (err.response) {
      if (err.response.status === 404) {
        error.value = "Aktivitas tidak ditemukan atau link tidak valid (404).";
      } else if (err.response.status === 422) {
        error.value = "Link aktivitas ini rusak atau tidak valid (422).";
      } else {
        error.value = err.response.data?.detail || 'Terjadi kesalahan pada server.';
      }
    } else {
      error.value = 'Gagal terhubung ke server. Periksa koneksi Anda.';
    }
  } finally {
    isLoading.value = false;
  }
});
</script>