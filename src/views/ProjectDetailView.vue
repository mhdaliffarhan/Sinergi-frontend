<template>
  <div>
    <!-- BACKGROUND DECORATIONS (Standardized) -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl opacity-60 dark:opacity-20"></div>
        <div class="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl opacity-60 dark:opacity-20"></div>
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
            <div class="absolute top-0 left-0 w-full h-full border-4 border-green-100 dark:border-green-900/30 rounded-full opacity-50"></div>
            <div class="absolute top-0 left-0 w-full h-full border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p class="mt-6 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Memuat data project...</p>
        </div>

        <!-- CONTENT CARD -->
        <div v-else-if="project" class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700 relative overflow-hidden animate-fade-in-up">
           
          <div class="p-4 sm:p-8 md:p-10 relative z-10">
            
            <!-- HEADER SECTION -->
            <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-10">
              <div class="flex-1 space-y-4">
                
                <!-- Badges -->
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50">
                    Detail Project
                  </span>
                  <router-link 
                    :to="{ name: 'team-detail', params: { id: project.team?.id } }"
                    class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50 flex items-center gap-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    {{ project.team?.namaTim || 'Tim Tidak Diketahui' }}
                  </router-link>
                </div>

                <!-- Title & Desc -->
                <div>
                  <h1 class="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight mb-3">
                    {{ project.namaProject }}
                  </h1>
                  <div class="prose dark:prose-invert max-w-4xl text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    {{ project.deskripsi || 'Tidak ada deskripsi tambahan untuk project ini.' }}
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
                    <MenuItems class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden border border-gray-200 dark:border-gray-700">
                      <div class="py-1">
                        <MenuItem v-slot="{ active }">
                          <button @click="handleDownloadAll" :class="[active ? 'bg-gray-50 dark:bg-gray-700/50' : '', 'group flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 transition-colors']">
                            <span class="mr-3 text-lg opacity-80">📦</span> Unduh ZIP
                          </button>
                        </MenuItem>
                      </div>
                      <div class="py-1" v-if="isAuthorized">
                        <MenuItem v-slot="{ active }">
                          <button @click="openEditModal" :class="[active ? 'bg-blue-50 dark:bg-blue-900/20' : '', 'group flex w-full items-center px-4 py-2.5 text-sm text-blue-600 dark:text-blue-400 font-medium transition-colors']">
                            <span class="mr-3 text-lg opacity-80">✏️</span> Edit Project
                          </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }" v-if="isKetuaTim || authStore.isSuperAdmin">
                          <button @click="confirmDeleteProject" :class="[active ? 'bg-red-50 dark:bg-red-900/20' : '', 'group flex w-full items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 font-medium transition-colors']">
                            <span class="mr-3 text-lg opacity-80">🗑️</span> Hapus
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
            </div>

            <!-- INFO GRID (LEADER - STATS - TEAM) -->
            <!-- Palette: Biru (Leader), Kuning (Stats), Hijau (Team) -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              
              <!-- 1. PROJECT LEADER (Blue Theme) -->
              <div class="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100/30 dark:from-blue-900/20 dark:to-indigo-950/30 border border-blue-200/60 dark:border-blue-700/30 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg class="w-20 h-20 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                </div>
                <div class="relative z-10 flex items-start gap-4 h-full">
                  <div class="relative">
                    <img v-if="project.projectLeader?.fotoProfilUrl"
                      :src="getProfileUrl(project.projectLeader.fotoProfilUrl)"
                      class="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                    />
                    <div v-else
                      class="h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm border-2 border-white dark:border-gray-700"
                      :style="{ backgroundColor: getSoftRandomColor(project.projectLeader?.id) }"
                    >
                      {{ getInitials(project.projectLeader?.namaLengkap) }}
                    </div>
                    <div class="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 border border-gray-100 dark:border-gray-700">
                       <span class="text-xs">👑</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-blue-600/70 dark:text-blue-300/80 mb-1">Project Leader</p>
                    <p class="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-tight">
                      {{ project.projectLeader?.namaLengkap || '-' }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
                      @{{ project.projectLeader?.username }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- 2. TOTAL AKTIVITAS (Yellow Theme) -->
              <div class="group relative overflow-hidden bg-gradient-to-br from-yellow-50 to-amber-100/30 dark:from-yellow-900/20 dark:to-amber-950/30 border border-yellow-200/60 dark:border-yellow-700/30 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg class="w-20 h-20 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>
                </div>
                <div class="flex items-center gap-4 h-full relative z-10">
                  <div class="p-3 bg-white dark:bg-yellow-900/30 rounded-xl text-2xl shadow-sm text-yellow-500 dark:text-yellow-400 ring-1 ring-yellow-100 dark:ring-yellow-500/30">📊</div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-yellow-600/70 dark:text-yellow-300/80 mb-1">Total Aktivitas</p>
                    <p class="text-3xl font-black text-gray-900 dark:text-white">
                      {{ project.aktivitas ? project.aktivitas.length : 0 }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- 3. TEAM STATUS (Green Theme) -->
              <div class="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100/30 dark:from-green-900/20 dark:to-emerald-950/30 border border-green-200/60 dark:border-green-700/30 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                 <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg class="w-20 h-20 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                </div>
                <div class="flex items-center gap-4 h-full relative z-10">
                  <div class="p-3 bg-white dark:bg-green-900/30 rounded-xl text-2xl shadow-sm text-green-600 dark:text-green-400 ring-1 ring-green-100 dark:ring-green-500/30">✅</div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-green-600/70 dark:text-green-300/80 mb-1">Status Tim</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">Aktif</p>
                  </div>
                </div>
              </div>

            </div>
            
            <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-10"></div>

            <!-- ACTIVITY TIMELINE SECTION -->
            <div class="mb-12">
              <div class="flex items-center justify-between mb-8">
                 <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="text-2xl">📅</span> Linimasa Kegiatan
                 </h2>
                 <span class="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                   {{ project.aktivitas ? project.aktivitas.length : 0 }} Item
                 </span>
              </div>

              <!-- TIMELINE LIST -->
              <div v-if="project.aktivitas && project.aktivitas.length > 0" class="relative pl-2 sm:pl-4">
                 
                 <!-- Vertical Line -->
                 <div class="absolute left-[19px] sm:left-[27px] top-4 bottom-4 w-px border-l-2 border-dashed border-gray-200 dark:border-gray-700"></div>

                 <transition-group name="list" tag="div" class="space-y-4">
                   <div 
                      v-for="(aktivitas, index) in displayedActivities" 
                      :key="aktivitas.id" 
                      class="relative flex items-start gap-4 sm:gap-6 group"
                    >
                      <!-- Timeline Dot -->
                      <div 
                        class="flex-shrink-0 w-4 h-4 mt-6 rounded-full border-2 border-white dark:border-gray-900 shadow-sm z-10 transition-all duration-300 group-hover:scale-125"
                        :class="getTimelineColor(aktivitas).bg"
                      ></div>
                      
                      <!-- Card -->
                      <router-link 
                        :to="`/aktivitas/detail/${aktivitas.id}`"
                        class="flex-1 block bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-x-[-4px] overflow-hidden group-hover:border-blue-200 dark:group-hover:border-blue-800"
                      >
                        <div class="flex flex-col sm:flex-row">
                          
                          <!-- Date Box -->
                          <div class="px-2 py-3 sm:w-36 bg-gray-50 dark:bg-gray-700/30 flex flex-row sm:flex-col items-center sm:justify-center gap-3 sm:gap-1 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-gray-700 text-center flex-shrink-0 min-h-[90px]">
                             <div class="flex flex-col leading-none">
                               <span class="text-2xl font-black text-gray-800 dark:text-white">
                                 {{ getTimelineInfo(aktivitas).startDay }}
                               </span>
                               <span class="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400 tracking-widest">
                                 {{ getTimelineInfo(aktivitas).startMonth }}
                               </span>
                             </div>

                             <div v-if="getTimelineInfo(aktivitas).endString" class="hidden sm:block mt-1 py-0.5 px-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                               <p class="text-[10px] font-semibold text-blue-600 dark:text-blue-300 whitespace-nowrap">
                                 {{ getTimelineInfo(aktivitas).endString }}
                               </p>
                             </div>
                             <div v-if="getTimelineInfo(aktivitas).timeString" class="mt-1 sm:mt-2">
                               <span class="text-[10px] font-mono font-medium bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-200 px-2 py-1 rounded border border-gray-200 dark:border-gray-500 shadow-sm whitespace-nowrap">
                                 {{ getTimelineInfo(aktivitas).timeString }}
                               </span>
                             </div>
                          </div>

                          <!-- Content Box -->
                          <div class="p-4 flex-1 flex flex-col justify-center">
                            <div class="flex justify-between items-start gap-2">
                              <h3 class="text-sm font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                {{ aktivitas.namaAktivitas }}
                              </h3>
                              <!-- Status Doc Badge -->
                              <div class="flex-shrink-0 flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700">
                                 <span class="text-[10px] font-semibold" :class="getDocStatusColor(aktivitas)">
                                   {{ getDocCount(aktivitas) }}
                                 </span>
                                 <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                              </div>
                            </div>

                            <div class="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                               <div class="flex items-center gap-1">
                                 <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                 <span>{{ aktivitas.users ? aktivitas.users.length : 0 }} Anggota</span>
                               </div>
                               <span v-if="aktivitas.deskripsi" class="truncate max-w-[200px] opacity-70 border-l pl-3 border-gray-300 dark:border-gray-600">
                                 {{ aktivitas.deskripsi }}
                               </span>
                            </div>
                          </div>

                        </div>
                      </router-link>
                   </div>
                 </transition-group>
                 
                 <div v-if="project.aktivitas.length > 2" class="mt-6 pl-[50px] sm:pl-[60px]">
                    <button 
                      @click="showAllActivities = !showAllActivities"
                      class="group flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-all focus:outline-none bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 w-fit"
                    >
                      <span v-if="!showAllActivities">Lihat {{ project.aktivitas.length - 2 }} aktivitas lainnya</span>
                      <span v-else>Tutup aktivitas lama</span>
                      <svg class="w-3 h-3 transition-transform duration-300 group-hover:translate-y-0.5" :class="showAllActivities ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                 </div>

              </div>

              <div v-else class="text-center py-16 bg-gray-50 dark:bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center">
                 <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3 text-3xl opacity-50 grayscale">📅</div>
                 <p class="text-gray-900 dark:text-white font-medium">Belum ada aktivitas</p>
                 <p class="text-xs text-gray-500">Aktivitas yang dibuat dalam project ini akan muncul di sini.</p>
              </div>
            </div>

            <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-10"></div>

            <!-- DOCUMENTS SECTION -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               <!-- LEFT: UPLOAD BUTTON & INFO -->
               <div class="lg:col-span-1 space-y-6">
                  <!-- Upload Button -->
                  <div v-if="isAnggotaTim || isAuthorized" class="relative group transform transition-all duration-300 hover:-translate-y-1 active:scale-[0.99]">
                     <div class="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                     <button 
                      @click="isUnifiedModalOpen = true"
                      class="relative w-full flex items-center justify-center gap-4 py-4 bg-white dark:bg-gray-800 hover:bg-green-50/50 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-xl border border-green-100 dark:border-green-900/30 transition-all shadow-sm group-hover:shadow-md"
                    >
                      <div class="bg-green-100 dark:bg-green-900/50 p-2.5 rounded-full text-green-600 dark:text-green-300 ring-4 ring-white dark:ring-gray-800 group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      </div>
                      <div class="text-left">
                        <span class="block font-bold text-base text-green-700 dark:text-green-300">Upload Dokumen Project</span>
                        <span class="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">Drag & drop file atau link</span>
                      </div>
                    </button>
                  </div>

                  <!-- Guide Card -->
                  <div class="bg-gray-50/80 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                     <h4 class="text-sm font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                       <span class="text-lg">ℹ️</span> Informasi
                     </h4>
                     <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                       Dokumen yang diunggah di sini adalah dokumen level project (misal: KAK, SK Tim, Laporan Akhir). Untuk dokumen spesifik per kegiatan, mohon unggah di detail aktivitas masing-masing.
                     </p>
                  </div>
               </div>

               <!-- RIGHT: FILE LIST -->
               <div class="lg:col-span-2">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-700 mb-4">
                    <span class="text-2xl">📂</span> File Project
                    <span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
                      {{ Object.values(groupedDocuments).flat().length }} File
                    </span>
                  </h3>

                  <div v-if="Object.keys(groupedDocuments).length > 0" class="space-y-4">
                    <div v-for="(files, keterangan) in groupedDocuments" :key="keterangan" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition hover:shadow-md">
                      <div class="bg-gray-50/80 dark:bg-gray-700/40 px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <h4 class="text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300 flex items-center gap-2">
                          <span class="w-1.5 h-3.5 bg-green-500 rounded-full"></span>
                          {{ keterangan }}
                        </h4>
                        <span class="text-[10px] bg-white dark:bg-gray-600 border dark:border-gray-500 px-1.5 rounded text-gray-500 dark:text-gray-300 font-mono">{{ files.length }}</span>
                      </div>

                      <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
                        <div v-for="file in files" :key="file.id" class="px-4 py-3 flex items-center justify-between hover:bg-green-50/30 dark:hover:bg-green-900/10 transition group cursor-pointer" @click="handlePreviewRequest(file)">
                          <div class="flex items-center gap-3 min-w-0">
                            <div class="w-9 h-9 rounded-lg bg-green-100/50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 text-base shadow-sm border border-green-200/50 dark:border-green-800/30">
                              {{ file.tipe === 'LINK' ? '🔗' : '📄' }}
                            </div>
                            <div class="min-w-0">
                              <p class="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[200px] sm:max-w-md">
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
                            class="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition opacity-0 group-hover:opacity-100 shadow-sm"
                            title="Hapus File"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-else class="text-center py-16 bg-gray-50 dark:bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                     <span class="text-4xl opacity-20 mb-3 block grayscale">📂</span>
                     <p class="text-gray-400 dark:text-gray-500 text-sm">Belum ada dokumen Project.</p>
                  </div>
               </div>

            </div>

          </div>
        </div>
        
        <!-- EMPTY STATE (Not Found) -->
        <div v-else class="text-center py-20 bg-white/50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
           <div class="text-5xl mb-4 grayscale opacity-30">📭</div>
           <p class="text-gray-500 font-medium">Data Project tidak ditemukan.</p>
           <router-link to="/project" class="text-blue-600 hover:underline text-sm mt-2 block">Kembali ke Daftar</router-link>
        </div>
      </transition>
    </div>

    <!-- MODALS -->
    <FilePreviewModal :show="isPreviewModalOpen" :file-url="fileToPreview.url" :file-name="fileToPreview.name" :file-type="fileToPreview.type" @close="closePreviewModal" />
    
    <ModalWrapper :show="isUnifiedModalOpen" @close="isUnifiedModalOpen = false" title="Tambah Dokumen Project">
      <UnifiedUploadModal 
        :checklist-options="[]" 
        :existing-groups="existingGroups"
        @close="isUnifiedModalOpen = false"
        @submit="handleUnifiedSubmit"
      />
    </ModalWrapper>

    <ModalWrapper :show="isUploadingFiles" :prevent-close="true" title="Sedang Memproses...">
      <div class="text-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-100 border-t-green-600 mx-auto mb-4"></div>
        <p class="text-lg font-bold text-gray-800 dark:text-white mb-1">Mengunggah File...</p>
        <p class="text-sm text-gray-500">{{ uploadProgressLabel }}</p>
      </div>
    </ModalWrapper>

    <ModalWrapper :show="isEditModalOpen" @close="closeEditModal" title="Edit Project">
      <FormProject tipe="Simpan" :initial-data="project" @close="closeEditModal" @submit="handleUpdateProject" :team-list="teamList"/>
    </ModalWrapper>

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
import UnifiedUploadModal from '@/components/aktivitas/UnifiedUploadModal.vue';
import FilePreviewModal from '@/components/FilePreviewModal.vue';
import FormProject from '@/components/project/FormProject.vue'; 

const baseURL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const router = useRouter();
const toast = useToast();
const projectId = route.params.id;
const authStore = useAuthStore();
const user = computed(() => authStore.user); 

const project = ref(null);
const isLoading = ref(true);
const breadcrumbItems = ref([
  { text: 'Daftar Project', to: '/project' },
  { text: 'Detail Project' }
]);

// Modal States
const isEditModalOpen = ref(false);
const isPreviewModalOpen = ref(false);
const isUnifiedModalOpen = ref(false);
const isUploadingFiles = ref(false);

const fileToPreview = ref({ url: '', name: '', type: '' });
const uploadProgressLabel = ref('');
const teamList = ref([]);

// State Toggle Timeline
const showAllActivities = ref(false);
const displayedActivities = computed(() => {
  if (!project.value?.aktivitas) return [];
  // Sort jika perlu (backend biasanya sudah handle)
  // project.value.aktivitas.sort((a,b) => new Date(b.tanggalMulai) - new Date(a.tanggalMulai)); 
  return showAllActivities.value ? project.value.aktivitas : project.value.aktivitas.slice(0, 2);
});

// Auth
const isAuthorized = computed(() => {
  if (!authStore.user || !project.value) return false;
  const userId = authStore.user.id;
  if (authStore.isAdmin) return true;
  if (project.value.team?.ketuaTimId === userId) return true;
  if (project.value.projectLeaderId === userId) return true;
  return false;
});

const isKetuaTim = computed(() => {
    if (!project.value?.team) return false;
    return project.value.team.ketuaTimId === user.value?.id;
});

const isAnggotaTim = computed(() => {
  if (!project.value?.team?.id || !user.value?.teams) return false;
  return user.value.teams.some(team => team.id === project.value.team.id);
});

// Computed Data
const groupedDocuments = computed(() => {
    if (!project.value?.dokumen) return {};
    const groups = {};
    project.value.dokumen.forEach(doc => {
        const key = doc.keterangan || 'Dokumen Umum';
        if (!groups[key]) groups[key] = [];
        groups[key].push(doc);
    });
    return groups;
});

const existingGroups = computed(() => Object.keys(groupedDocuments.value));

// Utils
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

const getSoftRandomColor = (userId) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6'];
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

// Helpers Timeline
const getTimelineInfo = (aktivitas) => {
  const result = {
    startDay: '', startMonth: '', endString: null, timeString: null
  };
  if (aktivitas.tanggalMulai) {
    const sDate = new Date(aktivitas.tanggalMulai);
    result.startDay = sDate.getDate();
    result.startMonth = sDate.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
    if (aktivitas.tanggalSelesai && aktivitas.tanggalSelesai !== aktivitas.tanggalMulai) {
      const eDate = new Date(aktivitas.tanggalSelesai);
      result.endString = `s.d ${eDate.getDate()} ${eDate.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase()}`;
    }
  } else {
    result.startDay = '--'; result.startMonth = '---';
  }
  if (aktivitas.jamMulai) {
    const start = aktivitas.jamMulai.substring(0, 5);
    let timeStr = start;
    if (aktivitas.jamSelesai) timeStr += ` - ${aktivitas.jamSelesai.substring(0, 5)}`;
    else timeStr += ' WITA';
    result.timeString = timeStr;
  }
  return result;
};

const getTimelineColor = (aktivitas) => {
  const total = aktivitas.daftarDokumenWajib?.length || 0;
  if (total === 0) return { bg: 'bg-gray-300 dark:bg-gray-600' };
  const verified = aktivitas.daftarDokumenWajib.filter(d => d.statusPengecekan).length;
  const uploaded = aktivitas.daftarDokumenWajib.filter(d => d.files && d.files.length > 0).length;
  if (verified === total) return { bg: 'bg-green-500 shadow-green-200' }; 
  if (uploaded > 0) return { bg: 'bg-blue-500 shadow-blue-200' };
  return { bg: 'bg-orange-400 shadow-orange-200' };
};

const getDocCount = (aktivitas) => {
  const total = aktivitas.daftarDokumenWajib?.length || 0;
  if (total === 0) return 'No Docs';
  const verified = aktivitas.daftarDokumenWajib.filter(d => d.statusPengecekan).length;
  return `${verified}/${total}`;
};

const getDocStatusColor = (aktivitas) => {
  const total = aktivitas.daftarDokumenWajib?.length || 0;
  if (total === 0) return 'text-gray-400';
  const verified = aktivitas.daftarDokumenWajib.filter(d => d.statusPengecekan).length;
  if (verified === total) return 'text-green-600 dark:text-green-400';
  return 'text-blue-600 dark:text-blue-400';
};

// API Calls
const fetchDetailProject = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${baseURL}/api/projects/${projectId}`);
    project.value = response.data;
    breadcrumbItems.value[1].text = project.value?.namaProject ?? 'Detail Project';
  } catch (error) {
    toast.error("Gagal memuat detail Project.");
  } finally {
    isLoading.value = false;
  }
};

const fetchTeams = async () => {
  try { const res = await axios.get(`${baseURL}/api/teams/active`); teamList.value = res.data.items; } catch (e) {}
};

onMounted(() => { 
  fetchDetailProject(); 
  fetchTeams();
});

// Handlers
const handleUnifiedSubmit = async (payload) => {
    isUnifiedModalOpen.value = false;
    const { type, files, linkData, keterangan } = payload;

    if (type === 'LINK') {
        try {
            await axios.post(`${baseURL}/api/projects/${projectId}/links`, {
                path_atau_url: linkData.url,
                keterangan: keterangan || linkData.title,
                nama_file_asli: linkData.title,
                tipe: 'LINK'
            });
            toast.success("Link disimpan.");
            fetchDetailProject();
        } catch (e) { toast.error("Gagal simpan link."); }
    } else if (type === 'FILE') {
        isUploadingFiles.value = true;
        let successCount = 0;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            uploadProgressLabel.value = `Mengunggah ${i+1}/${files.length}: ${file.name}`;
            const data = new FormData();
            data.append('file', file);
            data.append('keterangan', keterangan || file.name);
            try {
                await axios.post(`${baseURL}/api/projects/${projectId}/dokumen`, data);
                successCount++;
            } catch (e) { toast.error(`Gagal: ${file.name}`); }
        }
        isUploadingFiles.value = false;
        if (successCount > 0) {
            toast.success(`${successCount} file terunggah.`);
            fetchDetailProject();
        }
    }
};

const confirmDeleteDokumen = (id) => { if(confirm("Hapus file?")) deleteDokumen(id); };
const deleteDokumen = async (id) => {
    try {
        await axios.delete(`${baseURL}/api/dokumen/${id}`);
        toast.success("File dihapus.");
        if (project.value.dokumen) project.value.dokumen = project.value.dokumen.filter(d => d.id !== id);
    } catch(e) { toast.error("Gagal hapus file."); }
};

const openEditModal = () => { isEditModalOpen.value = true; };
const closeEditModal = () => { isEditModalOpen.value = false; };
const handleUpdateProject = async (formData) => {
  try {
    await axios.put(`${baseURL}/api/projects/${projectId}`, formData);
    toast.success("Project diperbarui!");
    closeEditModal();
    fetchDetailProject();
  } catch (error) { toast.error("Gagal update Project."); }
};

const confirmDeleteProject = () => { if (confirm("Hapus Project ini?")) deleteProject(); };
const deleteProject = async () => {
  try {
    await axios.delete(`${baseURL}/api/projects/${projectId}`);
    toast.success("Project dihapus.");
    router.push('/project');
  } catch (error) { toast.error("Gagal hapus Project."); }
};

const openPreviewModal = () => { isPreviewModalOpen.value = true; };
const closePreviewModal = () => {
    if(fileToPreview.value.url) URL.revokeObjectURL(fileToPreview.value.url);
    isPreviewModalOpen.value = false;
    fileToPreview.value = {url:'',name:'',type:''};
};
const handlePreviewRequest = async (doc) => {
    if (doc.tipe === 'LINK') { window.open(doc.pathAtauUrl, '_blank'); return; }
    try {
        const res = await axios.get(`${baseURL}/api/dokumen/${doc.id}/download`, { responseType: 'blob' });
        const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
        fileToPreview.value = { url, name: doc.namaFileAsli, type: res.headers['content-type'] };
        openPreviewModal();
    } catch(e) { toast.error("Gagal preview."); }
};

const handleDownloadAll = async () => {
  const hasProjectFiles = project.value.dokumen && project.value.dokumen.some(d => d.tipe === 'FILE');
  const hasActivityFiles = project.value.aktivitas && project.value.aktivitas.some(akt => akt.dokumen && akt.dokumen.some(d => d.tipe === 'FILE'));

  if (!hasProjectFiles && !hasActivityFiles) { 
    toast.warning("Tidak ada file yang bisa diunduh."); return; 
  }

  if (confirm("Unduh semua file?")) {
    const toastId = toast.info("Mengompres file...", { timeout: false });
    try {
      const res = await axios.get(`${baseURL}/api/projects/${projectId}/download-all`, { responseType: 'blob', timeout: 120000 });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      let fName = `${project.value.namaProject || 'project_files'}.zip`;
      link.setAttribute('download', fName);
      document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
      toast.dismiss(toastId); toast.success("Berhasil diunduh!");
    } catch (e) { toast.dismiss(toastId); toast.error("Gagal download ZIP."); }
  }
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>