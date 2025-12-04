<template>
  <div >
    
    <!-- BACKGROUND DECORATIONS -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl opacity-60 dark:opacity-20"></div>
        <div class="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl opacity-60 dark:opacity-20"></div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="relative z-10 max-w-7xl mx-auto pb-20">
      
      <!-- Breadcrumbs -->
      <div class="mb-6">
        <Breadcrumbs :items="breadcrumbItems" />
      </div>

      <!-- LOADING STATE -->
      <transition name="fade" mode="out-in">
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-white/20 shadow-sm">
          <div class="relative w-20 h-20">
            <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-100 dark:border-blue-900/30 rounded-full opacity-50"></div>
            <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p class="mt-6 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Sedang memuat data...</p>
        </div>

        <!-- CONTENT CARD -->
        <div v-else-if="aktivitas" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700 relative animate-fade-in-up">
          
          <div class="p-4 sm:p-8 md:p-10 relative z-10">
            
            <!-- HEADER SECTION -->
            <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-10">
              <div class="flex-1 space-y-4">
                
                <!-- Badges -->
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50">
                    Detail Aktivitas
                  </span>
                  <span v-if="aktivitas.publicId" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    Publik
                  </span>
                </div>

                <!-- Title & Desc -->
                <div>
                  <h1 class="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight mb-3">
                    {{ aktivitas.namaAktivitas }}
                  </h1>
                  <div class="prose dark:prose-invert max-w-4xl text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    {{ aktivitas.deskripsi || 'Tidak ada deskripsi tambahan.' }}
                  </div>
                </div>
              </div>

              <!-- Action Button (Menu) -->
              <div class="flex-shrink-0 w-full md:w-auto">
              <Menu as="div" class="relative inline-block text-left w-full md:w-auto">
              <MenuButton class="inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 hover:shadow-md">
                  <span>Tindakan</span>
                  <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" /></svg>
                </MenuButton>

                <transition enter-active-class="transition ease-out duration-200" enter-from-class="transform opacity-0 scale-95 -translate-y-2" enter-to-class="transform opacity-100 scale-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="transform opacity-100 scale-100 translate-y-0" leave-to-class="transform opacity-0 scale-95 -translate-y-2">
                    <MenuItems class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
                      <div class="py-1">
                        <MenuItem v-slot="{ active }">
                          <button @click="handleDownloadAll" :class="[active ? 'bg-gray-50 dark:bg-gray-700/50' : '', 'group flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 transition-colors']">
                            <span class="mr-3 text-lg opacity-80">📦</span> Unduh ZIP
                          </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <button @click="copyPublicLink" :class="[active ? 'bg-gray-50 dark:bg-gray-700/50' : '', 'group flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 transition-colors']">
                            <span class="mr-3 text-lg opacity-80">🔗</span> Salin Link
                          </button>
                        </MenuItem>
                      </div>
                      <div class="py-1" v-if="isAuthorized">
                        <MenuItem v-slot="{ active }">
                          <button @click="openEditModal" :class="[active ? 'bg-blue-50 dark:bg-blue-900/20' : '', 'group flex w-full items-center px-4 py-2.5 text-sm text-blue-600 dark:text-blue-400 font-medium transition-colors']">
                            <span class="mr-3 text-lg opacity-80">✏️</span> Edit Aktivitas
                          </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <button @click="confirmDeleteActivity" :class="[active ? 'bg-red-50 dark:bg-red-900/20' : '', 'group flex w-full items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 font-medium transition-colors']">
                            <span class="mr-3 text-lg opacity-80">🗑️</span> Hapus
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
              </Menu>
            </div>
            </div>

            <!-- INFO GRID (WAKTU - TIM - PROJECT) -->
            <!-- Design System: Kuning (Waktu), Biru (Tim), Hijau (Project) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              
              <!-- 1. WAKTU (Yellow/Gold Theme) -->
              <div class="group relative overflow-hidden bg-gradient-to-br from-yellow-50 to-amber-100/30 dark:from-yellow-900/20 dark:to-amber-950/30 border border-yellow-200/60 dark:border-yellow-700/30 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg class="w-20 h-20 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg>
                </div>
                <div class="relative z-10">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg text-yellow-700 dark:text-yellow-400 shadow-sm">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </span>
                    <p class="text-xs font-bold uppercase tracking-wider text-yellow-800/70 dark:text-yellow-200/70">Waktu</p>
                  </div>
                  <p class="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg leading-tight">
                    {{ formattedWaktuPelaksanaan.tanggal }}
                  </p>
                  <p v-if="formattedWaktuPelaksanaan.waktu" class="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {{ formattedWaktuPelaksanaan.waktu }}
                  </p>
                </div>
              </div>
              
              <!-- 2. TIM (Blue Theme) -->
              <div class="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100/30 dark:from-blue-900/20 dark:to-indigo-950/30 border border-blue-200/60 dark:border-blue-700/30 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg class="w-20 h-20 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                </div>
                <div class="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div class="flex items-center gap-2 mb-2">
                      <span class="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-700 dark:text-blue-400 shadow-sm">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      </span>
                      <p class="text-xs font-bold uppercase tracking-wider text-blue-800/70 dark:text-blue-200/70">Penyelenggara</p>
                    </div>
                    <router-link :to="{ name: 'team-detail', params: { id: aktivitas.team?.id } }" class="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {{ aktivitas.team?.namaTim || 'Tidak ada tim' }}
                    </router-link>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Ketua: {{ aktivitas.team?.ketuaTim?.namaLengkap || '-' }}</p>
                  </div>
                  
                  <div v-if="aktivitas.timTerkait && aktivitas.timTerkait.length > 0" class="mt-3">
                    <div class="flex flex-wrap gap-1">
                      <span class="text-[10px] font-semibold text-blue-500/80 uppercase mr-1 pt-1">Kolaborasi:</span>
                      <router-link 
                        v-for="tim in aktivitas.timTerkait.slice(0, 2)" 
                        :key="tim.id"
                        :to="{ name: 'team-detail', params: { id: tim.id } }"
                        class="px-2 py-0.5 bg-white/60 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-200 rounded text-[10px] font-medium hover:bg-white transition shadow-sm"
                      >
                        {{ tim.namaTim }}
                      </router-link>
                      <span v-if="aktivitas.timTerkait.length > 2" class="px-2 py-0.5 bg-blue-200/50 text-blue-800 rounded text-[10px] font-bold">
                        +{{ aktivitas.timTerkait.length - 2 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3. PROJECT (Green Theme) -->
              <div class="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100/30 dark:from-green-900/20 dark:to-emerald-950/30 border border-green-200/60 dark:border-green-700/30 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg class="w-20 h-20 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.435-.46-7.9-1.308z"></path></svg>
                </div>
                <div class="relative z-10">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-700 dark:text-green-400 shadow-sm">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    </span>
                    <p class="text-xs font-bold uppercase tracking-wider text-green-800/70 dark:text-green-200/70">Proyek Induk</p>
                  </div>
                  <router-link :to="{ name: 'project-detail', params: { id: aktivitas.project?.id } }" class="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    {{ aktivitas.project?.namaProject || 'Non-Proyek' }}
                  </router-link>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Leader: {{ aktivitas.project?.projectLeader?.namaLengkap || '-' }}
                  </p>
                </div>
              </div>

            </div>

            <!-- MEMBERS SECTION -->
            <div class="mt-8 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <h2 class="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                    Pegawai Terlibat
                  </h2>
                  <span class="ml-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-md text-xs font-mono">
                    {{ aktivitas.users ? aktivitas.users.length : 0 }}
                  </span>
                </div>
                
                <!-- Toggle Switch -->
                <div class="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700" v-if="aktivitas.users && aktivitas.users.length > 0">
                  <button 
                    @click="activeMemberTab = 'summary'"
                    class="px-3 py-1 text-xs font-bold rounded-md transition-all duration-200"
                    :class="activeMemberTab === 'summary' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
                  >
                    Grid
                  </button>
                  <button 
                    @click="activeMemberTab = 'list'"
                    class="px-3 py-1 text-xs font-bold rounded-md transition-all duration-200"
                    :class="activeMemberTab === 'list' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
                  >
                    Tabel
                  </button>
                </div>
              </div>
              
              <div v-if="aktivitas.users && aktivitas.users.length > 0">
                <!-- GRID VIEW -->
                <div v-if="activeMemberTab === 'summary'" class="animate-fade-in flex flex-wrap gap-3">
                   <div 
                    v-for="user in aktivitas.users" 
                    :key="user.id" 
                    class="group relative"
                  >
                    <div class="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-white dark:border-gray-800 shadow-sm transition-transform duration-200 hover:scale-110 hover:z-10 cursor-pointer overflow-hidden ring-2 ring-transparent hover:ring-blue-400">
                      <img v-if="user.fotoProfilUrl"
                        :src="getProfileUrl(user.fotoProfilUrl)"
                        class="h-full w-full object-cover"
                        :title="user.namaLengkap"
                      />
                      <div v-else
                        class="h-full w-full flex items-center justify-center text-xs sm:text-sm font-bold text-white"
                        :style="{ backgroundColor: getSoftRandomColor(user.id) }"
                        :title="user.namaLengkap"
                      >
                        {{ getInitials(user.namaLengkap) }}
                      </div>
                    </div>
                    <!-- Tooltip -->
                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                      {{ user.namaLengkap }}
                    </div>
                  </div>
                </div>

                <!-- TABLE VIEW -->
                <div v-else class="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl animate-fade-in shadow-sm">
                  <table class="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Pegawai</th>
                        <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Username</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                      <tr v-for="user in aktivitas.users" :key="user.id" class="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                        <td class="px-4 py-2.5 whitespace-nowrap flex items-center gap-3">
                          <div class="flex-shrink-0 h-8 w-8">
                             <img v-if="user.fotoProfilUrl" :src="getProfileUrl(user.fotoProfilUrl)" class="h-8 w-8 rounded-full object-cover shadow-sm"/>
                             <div v-else class="h-8 w-8 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-sm" :style="{ backgroundColor: getSoftRandomColor(user.id) }">{{ getInitials(user.namaLengkap) }}</div>
                          </div>
                          <div class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ user.namaLengkap }}</div>
                        </td>
                        <td class="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 hidden sm:table-cell font-mono">
                          @{{ user.username }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p v-else class="text-sm text-gray-400 italic">Belum ada pegawai yang ditambahkan.</p>
            </div>

            <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-10"></div>

            <!-- DOCUMENTS SECTION -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <!-- LEFT COL -->
              <div class="lg:col-span-2 space-y-8">
                
                <!-- Upload Button -->
                <div v-if="isAnggotaTim" class="relative group transform transition-all duration-300 hover:-translate-y-1 active:scale-[0.99]">
                   <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                   <button 
                    @click="isUnifiedModalOpen = true"
                    class="relative w-full flex items-center justify-center gap-4 py-5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-2xl border border-gray-100 dark:border-gray-700 transition-all shadow-sm"
                  >
                    <div class="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 p-3 rounded-full text-blue-600 dark:text-blue-300 shadow-inner group-hover:scale-110 transition-transform">
                      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    </div>
                    <div class="text-left">
                      <span class="block font-extrabold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400">Upload Dokumen</span>
                      <span class="block text-xs text-gray-500 dark:text-gray-400 font-medium">Klik untuk menambah bukti dukung atau link</span>
                    </div>
                  </button>
                </div>
                
                <!-- Checklist -->
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <span class="text-2xl">📝</span> Dokumen Wajib
                    </h2>
                    <span class="text-xs font-bold px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700">
                      {{ aktivitas.daftarDokumenWajib?.length || 0 }} Item
                    </span>
                  </div>
                  
                  <div v-if="aktivitas.daftarDokumenWajib && aktivitas.daftarDokumenWajib.length > 0" class="space-y-4">
                    <div 
                      v-for="item in aktivitas.daftarDokumenWajib" 
                      :key="item.id"
                      class="rounded-xl transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md border"
                      :class="[
                        item.statusPengecekan 
                          ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800/50' 
                          : (!item.files || item.files.length === 0)
                            ? 'bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-800/50'
                            : 'bg-white border-gray-200 dark:bg-gray-800/50 dark:border-gray-700'
                      ]"
                    >
                      <ChecklistItem
                        :item="item"
                        :is-authorized="isAuthorized" 
                        @check="handleCheckDoc"
                        @preview="handlePreviewRequest"
                        @delete-file="confirmDeleteDokumen"
                        class="bg-transparent border-none shadow-none p-4" 
                      />
                    </div>
                  </div>
                  <div v-else class="text-center py-10 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <p class="text-gray-400 dark:text-gray-500 text-sm font-medium">Tidak ada daftar dokumen wajib.</p>
                  </div>
                </div>

              </div>

              <!-- RIGHT COL: Other Files -->
              <div class="lg:col-span-1 space-y-6">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b-2 border-gray-100 dark:border-gray-800">
                  <span class="text-2xl">📂</span> File Lainnya
                </h3>

                <!-- List file lainnya here (omitted for brevity as structure is same) -->
                <div v-if="Object.keys(groupedOtherDocuments).length > 0" class="space-y-6">
                  <div v-for="(files, keterangan) in groupedOtherDocuments" :key="keterangan" class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div class="bg-gray-50/80 dark:bg-gray-700/40 px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <h4 class="text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <span class="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                        {{ keterangan }}
                      </h4>
                      <span class="text-[10px] font-bold bg-white dark:bg-gray-600 border dark:border-gray-500 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-300">{{ files.length }}</span>
                    </div>

                    <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
                      <div v-for="file in files" :key="file.id" class="px-4 py-3 flex items-center justify-between hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition group cursor-pointer" @click="handlePreviewRequest(file)">
                        <div class="flex items-center gap-3 min-w-0">
                          <div class="w-10 h-10 rounded-xl bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 text-lg shadow-sm border border-blue-200/50 dark:border-blue-800/30">
                            {{ file.tipe === 'LINK' ? '🔗' : '📄' }}
                          </div>
                          <div class="min-w-0">
                            <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[140px]">
                              {{ file.namaFileAsli || file.pathAtauUrl }}
                            </p>
                            <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium">
                              {{ formatFileDate(file.diunggahPada) }}
                            </p>
                          </div>
                        </div>
                        
                        <button 
                          v-if="isAuthorized"
                          @click.stop="confirmDeleteDokumen(file.id)" 
                          class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition opacity-0 group-hover:opacity-100"
                          title="Hapus File"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-10 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                   <span class="text-4xl opacity-30 mb-2 block grayscale">📂</span>
                   <p class="text-gray-400 dark:text-gray-500 text-sm">Belum ada file pendukung.</p>
                </div>

              </div>

            </div>
          </div>
        </div>
      </transition>

      <!-- MODALS (Same structure) -->
      <FilePreviewModal :show="isPreviewModalOpen" :file-url="fileToPreview.url" :file-name="fileToPreview.name" :file-type="fileToPreview.type" @close="closePreviewModal" />
      
      <ModalWrapper :show="isUnifiedModalOpen" @close="isUnifiedModalOpen = false" title="Tambah Dokumen / Bukti Dukung">
        <UnifiedUploadModal 
          :checklist-options="checklistOptions"
          :existing-groups="existingGroups"
          @close="isUnifiedModalOpen = false"
          @submit="handleUnifiedSubmit"
        />
      </ModalWrapper>

      <ModalWrapper :show="isUploadingFiles" :prevent-close="true" title="Sedang Memproses...">
        <div class="text-center p-8">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mx-auto mb-4"></div>
          <p class="text-lg font-bold text-gray-800 dark:text-white mb-1">Mengunggah File...</p>
          <p class="text-sm text-gray-500">{{ uploadProgressLabel }}</p>
        </div>
      </ModalWrapper>

      <ModalWrapper :show="isEditModalOpen" @close="closeEditModal" title="Edit Aktivitas">
        <FormAktivitas tipe="Simpan" :initial-data="aktivitas" @close="closeEditModal" @submit="handleUpdateActivity" :team-list="teamList" :project-list="projectList" :pegawai-list="pegawaiList" :team-members="teamMembers" />
      </ModalWrapper>
      
      <ModalWrapper :show="isReplaceModalOpen" @close="closeReplaceModal" title="Ganti File Dokumen">
        <ModalKonfirmasiGantiFile @pilih="handleReplaceActionChosen" />
      </ModalWrapper>
      <input type="file" ref="replaceFileInput" @change="handleReplaceFileSelected" class="hidden">

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
import FormAktivitas from '@/components/aktivitas/FormAktivitas.vue';
import ChecklistItem from '@/components/aktivitas/ChecklistItem.vue';
import ModalKonfirmasiGantiFile from '@/components/aktivitas/ModalKonfirmasiGantiFile.vue';
import FilePreviewModal from '@/components/FilePreviewModal.vue';
import UnifiedUploadModal from '@/components/aktivitas/UnifiedUploadModal.vue';

// --- STATE & CONFIG ---
const baseURL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const router = useRouter();
const toast = useToast();
const aktivitasId = route.params.id;
const authStore = useAuthStore();
const user = computed(() => authStore.user); 
const activeMemberTab = ref('summary');

const aktivitas = ref(null);
const isLoading = ref(true);
const breadcrumbItems = ref([
  { text: 'Daftar Aktivitas', to: '/aktivitas/daftar' },
  { text: 'Project', to: ''},
  { text: 'Detail Aktivitas' }
]);

// Modal States
const isEditModalOpen = ref(false);
const isFileModalOpen = ref(false);
const isReplaceModalOpen = ref(false);
const isPreviewModalOpen = ref(false);
const isUnifiedModalOpen = ref(false);

// Upload States
const fileToUpload = ref(null);
const replaceFileInput = ref(null);
const checklistItemIdToUpload = ref(null); 
const itemToReplace = ref(null);
const isUploadingFiles = ref(false);
const uploadProgressLabel = ref('');
const fileToPreview = ref({ url: '', name: '', type: '' });

// Data Pendukung Edit
const teamList = ref([]);
const projectList = ref([]);
const pegawaiList = ref([]);
const teamMembers = ref([]); 

// --- AUTHORIZATION ---
const isAuthorized = computed(() => {
  if (!user.value || !aktivitas.value) return false;
  const userId = user.value.id;
  if (authStore.isAdmin) return true;
  const ketuaTimId = aktivitas.value.team?.ketuaTimId || aktivitas.value.team?.ketua_tim_id;
  if (ketuaTimId === userId) return true;
  const projectLeaderId = aktivitas.value.project?.projectLeaderId || aktivitas.value.project?.project_leader_id;
  if (projectLeaderId === userId) return true;
  const teamsInvolved = aktivitas.value.timTerkait || aktivitas.value.tim_terkait;
  if (teamsInvolved && teamsInvolved.length > 0) {
    if (teamsInvolved.some(t => (t.ketuaTimId || t.ketua_tim_id) === userId)) return true;
  }
  return false;
});

const isAnggotaTim = computed(() => {
  if (!user.value || !aktivitas.value) return false;
  const isParticipant = aktivitas.value.users?.some(u => u.id === user.value.id);
  if (isParticipant) return true;
  const aktivitasTeamId = aktivitas.value.team?.id;
  const isMemberOfHostTeam = user.value.teams?.some(team => team.id === aktivitasTeamId);
  return isAuthorized.value || isMemberOfHostTeam;
});

// --- DATA COMPUTED ---
const checklistOptions = computed(() => {
  if (!aktivitas.value || !aktivitas.value.daftarDokumenWajib) {
      return [];
  }
  return aktivitas.value.daftarDokumenWajib;
});

const existingGroups = computed(() => {
  return Object.keys(groupedOtherDocuments.value);
});

const unfulfilledChecklistItems = computed(() =>
  aktivitas.value?.daftarDokumenWajib?.filter(item => (!item.files || item.files.length === 0)) || []
);

const otherDocumentsRaw = computed(() => {
  if (!aktivitas.value?.dokumen) return [];
  return aktivitas.value.dokumen.filter(doc => doc.daftarDokumenId === null || doc.daftarDokumenId === undefined);
});

const groupedOtherDocuments = computed(() => {
  const docs = otherDocumentsRaw.value;
  const groups = {};
  docs.forEach(doc => {
    const key = doc.keterangan || 'Dokumen Lainnya';
    if (!groups[key]) groups[key] = [];
    groups[key].push(doc);
  });
  return groups;
});

const formattedWaktuPelaksanaan = computed(() => {
  if (!aktivitas.value?.tanggalMulai) return { tanggal: '-', waktu: '' };
  const tglMulai = new Date(aktivitas.value.tanggalMulai);
  let tanggalTampil = tglMulai.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  
  if (aktivitas.value.tanggalSelesai) {
    const tglSelesai = new Date(aktivitas.value.tanggalSelesai);
    if (tglMulai.getTime() !== tglSelesai.getTime()) {
        tanggalTampil = `${tglMulai.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} - ${tglSelesai.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }
  }
  
  let waktuTampil = '';
  if (aktivitas.value.jamMulai) {
      waktuTampil = aktivitas.value.jamMulai.substring(0, 5);
      if (aktivitas.value.jamSelesai) waktuTampil += ` - ${aktivitas.value.jamSelesai.substring(0, 5)}`;
      waktuTampil += ' WITA';
  }
  return { tanggal: tanggalTampil, waktu: waktuTampil };
});

// --- FETCH DATA ---
const fetchDetailAktivitas = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${baseURL}/api/aktivitas/${aktivitasId}`);
    aktivitas.value = response.data;
    breadcrumbItems.value[1] = {
      text: aktivitas.value.project?.namaProject || 'Proyek',
      to: aktivitas.value.project ? `/project/detail/${aktivitas.value.project.id}` : '#'
    };
    breadcrumbItems.value[2].text = aktivitas.value?.namaAktivitas ?? 'Detail Aktivitas';
  } catch (error) {
    toast.error("Gagal memuat detail aktivitas.");
  } finally {
    isLoading.value = false;
  }
};

const fetchTeams = async () => { try { const res = await axios.get(`${baseURL}/api/teams/active`); teamList.value = res.data.items; } catch (e) {} };
const fetchProjects = async () => { try { const res = await axios.get(`${baseURL}/api/projects`, {params:{limit:1000}}); projectList.value = res.data.items; } catch (e) {} };
const fetchPegawai = async () => { try { const res = await axios.get(`${baseURL}/api/users`, {params:{limit:10000}}); pegawaiList.value = res.data.items; } catch (e) {} };

onMounted(() => { 
  fetchDetailAktivitas(); fetchTeams(); fetchProjects(); fetchPegawai();
});

// --- ACTIONS HANDLERS ---
const handleUnifiedSubmit = async (payload) => {
  isUnifiedModalOpen.value = false;
  const { type, files, linkData, targetType, checklistItemId, keterangan } = payload;
  let finalKeterangan = keterangan;
  
  if (targetType === 'checklist') {
    const item = aktivitas.value.daftarDokumenWajib.find(i => i.id === checklistItemId);
    if (item) finalKeterangan = item.namaDokumen;
    else finalKeterangan = 'Dokumen Wajib'; 
  }

  if (type === 'LINK') {
    try {
          const postData = {
          path_atau_url: linkData.url,
          keterangan: finalKeterangan || linkData.title, 
          nama_file_asli: linkData.title, 
          tipe: 'LINK',
          checklist_item_id: checklistItemId 
        };
        await axios.post(`${baseURL}/api/aktivitas/${aktivitasId}/link`, postData);
        toast.success("Link berhasil disimpan!");
        fetchDetailAktivitas();
    } catch (e) { toast.error("Gagal simpan link"); }
  } else if (type === 'FILE') {
    isUploadingFiles.value = true;
    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      uploadProgressLabel.value = `Mengunggah ${i+1}/${files.length}: ${file.name}`;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('keterangan', finalKeterangan); 
      if (checklistItemId) formData.append('checklist_item_id', checklistItemId);
      try {
        await axios.post(`${baseURL}/api/aktivitas/${aktivitasId}/dokumen`, formData);
        successCount++;
      } catch (e) {
        toast.error(`Gagal upload: ${file.name}`);
      }
    }
    isUploadingFiles.value = false;
    if (successCount > 0) {
        toast.success(`${successCount} file berhasil diunggah.`);
        fetchDetailAktivitas();
    }
  }
};

const openEditModal = () => { isEditModalOpen.value = true; };
const closeEditModal = () => { isEditModalOpen.value = false; };
const handleUpdateActivity = async (formData) => {
  const payload = { ...formData };
  const nullable = ['tanggalMulai','tanggalSelesai','jamMulai','jamSelesai'];
  nullable.forEach(f => { if(payload[f]==='') payload[f]=null; });
  try {
    await axios.put(`${baseURL}/api/aktivitas/${aktivitasId}`, payload);
    toast.success("Berhasil diperbarui!");
    closeEditModal();
    fetchDetailAktivitas();
  } catch(e) { toast.error("Gagal update."); }
};

const confirmDeleteActivity = () => { if(confirm("Hapus aktivitas?")) deleteActivity(); };
const deleteActivity = async () => {
  try { await axios.delete(`${baseURL}/api/aktivitas/${aktivitasId}`); toast.success("Terhapus"); router.push('/aktivitas/daftar'); }
  catch(e) { toast.error("Gagal hapus."); }
};

const confirmDeleteDokumen = (id) => { if(confirm("Hapus file ini?")) deleteDokumen(id); };
const deleteDokumen = async (id) => {
  try {
    await axios.delete(`${baseURL}/api/dokumen/${id}`);
    toast.success("File dihapus.");
    if (aktivitas.value.dokumen) {
      aktivitas.value.dokumen = aktivitas.value.dokumen.filter(d => d.id !== id);
    }
    if (aktivitas.value.daftarDokumenWajib) {
      aktivitas.value.daftarDokumenWajib.forEach(item => {
        if (item.files) item.files = item.files.filter(f => f.id !== id);
      });
    }
  } catch(e) { toast.error("Gagal hapus file."); }
};

const handleCheckDoc = async ({ id, value }) => {
    try {
        const { data } = await axios.patch(`${baseURL}/api/daftar_dokumen/${id}/cek`, { statusPengecekan: value });
        const target = aktivitas.value.daftarDokumenWajib.find(d => d.id === id);
        if(target) target.statusPengecekan = data.statusPengecekan;
        toast.success(value ? "Divalidasi" : "Validasi dibatalkan");
    } catch(e) { toast.error("Gagal update status."); }
};

const openPreviewModal = () => { isPreviewModalOpen.value = true; };
const closePreviewModal = () => {
    if(fileToPreview.value.url) URL.revokeObjectURL(fileToPreview.value.url);
    isPreviewModalOpen.value = false;
    fileToPreview.value = {url:'',name:'',type:''};
};
const handlePreviewRequest = async (doc) => {
    if (doc.tipe === 'LINK') {
        window.open(doc.pathAtauUrl, '_blank');
        return;
    }
    try {
        const res = await axios.get(`${baseURL}/api/dokumen/${doc.id}/download`, { responseType: 'blob' });
        const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
        fileToPreview.value = { url, name: doc.namaFileAsli, type: res.headers['content-type'] };
        openPreviewModal();
    } catch(e) { toast.error("Gagal preview."); }
};

const handleDownloadAll = async () => {
  const hasOtherFiles = aktivitas.value.dokumen && aktivitas.value.dokumen.some(d => d.tipe === 'FILE');
  const hasChecklistFiles = aktivitas.value.daftarDokumenWajib && aktivitas.value.daftarDokumenWajib.some(item => 
      item.files && item.files.some(f => f.tipe === 'FILE')
  );
  if (!hasOtherFiles && !hasChecklistFiles) {
    toast.warning("Tidak ada file yang bisa diunduh.");
    return; 
  }
  if (window.confirm(`Unduh semua file?`)) {
    const toastId = toast.info("Sedang memproses...", { timeout: false });
    try {
      const response = await axios.get(`${baseURL}/api/aktivitas/${aktivitasId}/download-all`, {
        responseType: 'blob', timeout: 60000,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      let fileName = `${aktivitas.value.namaAktivitas || 'dokumen'}.zip`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("Berhasil diunduh!");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Gagal mengunduh file.");
    }
  }
};

const copyPublicLink = async () => {
  if (!aktivitas.value?.publicId) {
    toast.error("Gagal mendapatkan link.");
    return;
  }
  const url = `${window.location.origin}/public/aktivitas/${aktivitas.value.publicId}`;
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link disalin!");
  } catch (err) {
    toast.error("Gagal menyalin.");
  }
};

const getInitials = (namaLengkap) => {
  if (!namaLengkap) return '';
  const parts = namaLengkap.split(' ').filter(p => p.length > 0);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

const getSoftRandomColor = (userId) => {
  const colors = ['#E57373', '#F06292', '#BA68C8', '#9575CD', '#7986CB', '#64B5F6', '#4FC3F7', '#4DD0E1', '#4DB6AC', '#81C784', '#AED581', '#FF8A65', '#FFB74D'];
  return colors[userId % colors.length];
};

const getProfileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('./')) return `${baseURL}/${path.replace('./', '')}`;
  return path;
};

const formatFileDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'});
};

// Replace File Handlers
const closeReplaceModal = () => { isReplaceModalOpen.value = false; itemToReplace.value = null; };
const handleReplaceActionChosen = (action) => {
   if (!itemToReplace.value) return;
   itemToReplace.value.old_file_action = action;
   closeReplaceModal();
   replaceFileInput.value.click();
};
const handleReplaceFileSelected = async (event) => {
   const newFile = event.target.files[0];
   if (!newFile || !itemToReplace.value) return;
   const data = new FormData(); 
   data.append('file', newFile);
   data.append('old_file_action', itemToReplace.value.old_file_action);
   try {
     await axios.post(`${baseURL}/api/checklist/${itemToReplace.value.id}/replace`, data);
     toast.success("File berhasil diganti!");
     await fetchDetailAktivitas();
   } catch (error) {
     toast.error("Gagal mengganti file.");
   } finally {
     itemToReplace.value = null;
     event.target.value = '';
   }
};
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>