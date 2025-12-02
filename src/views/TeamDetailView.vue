<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-4 sm:pt-6 font-sans transition-colors duration-300 relative overflow-hidden">
    
    <!-- BACKGROUND DECORATIONS -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl opacity-60 dark:opacity-20"></div>
        <div class="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl opacity-60 dark:opacity-20"></div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="relative z-10 max-w-7xl mx-auto pb-20">
      
      <!-- LOADING STATE -->
      <transition name="fade" mode="out-in">
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-white/20 shadow-sm">
          <div class="relative w-20 h-20">
            <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-100 dark:border-blue-900/30 rounded-full opacity-50"></div>
            <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p class="mt-6 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Sedang memuat detail tim...</p>
        </div>

        <!-- EMPTY STATE -->
        <div v-else-if="!team" class="text-center py-20 bg-white/50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
           <div class="text-5xl mb-4 grayscale opacity-30">🏳️</div>
           <p class="text-gray-500 font-medium">Data tim tidak ditemukan.</p>
        </div>

        <!-- CONTENT CARD -->
        <div v-else class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700 relative overflow-hidden animate-fade-in-up">
          
          <!-- Decorative Top Bar -->
          <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <div class="p-6 sm:p-8 md:p-10 relative z-10">
            
            <!-- HEADER SECTION -->
            <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-10">
              <div class="flex items-start gap-6">
                
                <!-- Team Logo/Initial -->
                <div 
                  class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-white font-bold text-3xl sm:text-4xl shadow-lg transform hover:scale-105 transition-transform duration-300 ring-4 ring-white dark:ring-gray-800 relative overflow-hidden"
                  :style="{ backgroundColor: team.warna || '#3b82f6' }"
                >
                  <div class="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                  {{ team.namaTim?.charAt(0) || '?' }}
                </div>

                <div class="flex-1 space-y-2">
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50">
                      Detail Tim
                    </span>
                    <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50 flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Aktif
                    </span>
                  </div>
                  
                  <h1 class="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                    {{ team.namaTim }}
                  </h1>
                  
                  <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg w-fit border border-gray-200 dark:border-gray-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {{ formatDate(team.validFrom) }} – {{ formatDate(team.validUntil) }}
                  </div>
                </div>
              </div>

              <!-- Action Button (Menu) -->
              <div class="flex-shrink-0 relative z-20" v-if="isSuperadminOrKetuaTim">
                <Menu as="div" class="relative inline-block text-left">
                  <MenuButton class="inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:shadow-md active:scale-95">
                    <span>Kelola Tim</span>
                    <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" /></svg>
                  </MenuButton>

                  <transition enter-active-class="transition ease-out duration-200" enter-from-class="transform opacity-0 scale-95 -translate-y-2" enter-to-class="transform opacity-100 scale-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="transform opacity-100 scale-100 translate-y-0" leave-to-class="transform opacity-0 scale-95 -translate-y-2">
                    <MenuItems class="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden border border-gray-200 dark:border-gray-700">
                      <div class="py-1">
                        <MenuItem v-slot="{ active }">
                          <button @click="openEditModal" :class="[active ? 'bg-blue-50 dark:bg-blue-900/20' : '', 'group flex w-full items-center px-4 py-2.5 text-sm text-blue-600 dark:text-blue-400 font-medium transition-colors']">
                            <span class="mr-3 text-lg opacity-80">✏️</span> Edit Data Tim
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
            </div>

            <!-- INFO GRID -->
            <!-- Palette: Biru (Anggota), Kuning (Project), Hijau (Aktivitas) -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              
              <!-- 1. ANGGOTA (Blue) -->
              <div class="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100/30 dark:from-blue-900/20 dark:to-indigo-950/30 border border-blue-200/60 dark:border-blue-700/30 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg class="w-20 h-20 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                </div>
                <div class="flex items-center gap-4 relative z-10">
                  <div class="p-3 bg-white dark:bg-blue-900/30 rounded-xl text-2xl shadow-sm text-blue-600 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-500/30">👥</div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-blue-600/70 dark:text-blue-300/80 mb-1">Total Anggota</p>
                    <p class="text-3xl font-black text-gray-900 dark:text-white">{{ team.users?.length ?? 0 }}</p>
                  </div>
                </div>
              </div>

              <!-- 2. PROJECT (Yellow) -->
              <div class="group relative overflow-hidden bg-gradient-to-br from-yellow-50 to-amber-100/30 dark:from-yellow-900/20 dark:to-amber-950/30 border border-yellow-200/60 dark:border-yellow-700/30 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg class="w-20 h-20 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                </div>
                <div class="flex items-center gap-4 relative z-10">
                  <div class="p-3 bg-white dark:bg-yellow-900/30 rounded-xl text-2xl shadow-sm text-yellow-600 dark:text-yellow-400 ring-1 ring-yellow-100 dark:ring-yellow-500/30">💼</div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-yellow-600/70 dark:text-yellow-300/80 mb-1">Project Berjalan</p>
                    <p class="text-3xl font-black text-gray-900 dark:text-white">{{ team.projects?.length ?? 0 }}</p>
                  </div>
                </div>
              </div>

              <!-- 3. AKTIVITAS (Green) -->
              <div class="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100/30 dark:from-green-900/20 dark:to-emerald-950/30 border border-green-200/60 dark:border-green-700/30 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <svg class="w-20 h-20 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>
                </div>
                <div class="flex items-center gap-4 relative z-10">
                  <div class="p-3 bg-white dark:bg-green-900/30 rounded-xl text-2xl shadow-sm text-green-600 dark:text-green-400 ring-1 ring-green-100 dark:ring-green-500/30">📊</div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-green-600/70 dark:text-green-300/80 mb-1">Total Aktivitas</p>
                    <p class="text-3xl font-black text-gray-900 dark:text-white">{{ totalAktivitas }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-10"></div>

            <!-- MEMBERS SECTION -->
            <div class="mb-10">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <span class="text-lg">👥</span> Struktur Tim
                </h2>
                
                <div class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700" v-if="team.users?.length > 0">
                  <button 
                    @click="activeTab = 'Ringkasan'"
                    class="px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200"
                    :class="activeTab === 'Ringkasan' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
                  >
                    Grid
                  </button>
                  <button 
                    @click="activeTab = 'Daftar Lengkap'"
                    class="px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200"
                    :class="activeTab === 'Daftar Lengkap' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
                  >
                    List
                  </button>
                </div>
              </div>

              <div v-if="team.users?.length > 0">
                <transition name="slide-fade" mode="out-in">
                  
                  <!-- GRID VIEW -->
                  <div v-if="activeTab === 'Ringkasan'" key="ringkasan">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                      
                      <!-- Leader Column -->
                      <div v-if="team.ketuaTim" class="flex flex-col items-center justify-center min-w-[120px] flex-shrink-0">
                          <div 
                            class="relative h-20 w-20 rounded-full p-1 border-2 border-blue-200 dark:border-blue-800 cursor-pointer transition-transform duration-300 hover:scale-110 group"
                            @click="goToUserDetail(team.ketuaTim.id)"
                            :title="team.ketuaTim.namaLengkap + ' (Ketua Tim)'"
                          >
                            <div class="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10 border border-white dark:border-gray-900">LEADER</div>
                            <img v-if="team.ketuaTim.fotoProfilUrl"
                              :src="getProfileUrl(team.ketuaTim.fotoProfilUrl)"
                              class="h-full w-full rounded-full object-cover shadow-sm"
                            />
                            <div v-else
                              class="h-full w-full rounded-full flex items-center justify-center text-white text-xl font-bold bg-blue-500 shadow-sm"
                            >
                              {{ getInitials(team.ketuaTim.namaLengkap) }}
                            </div>
                          </div>
                          <div class="mt-3 text-center">
                             <h4 class="text-sm font-bold text-gray-900 dark:text-white leading-tight max-w-[120px] truncate">{{ team.ketuaTim.namaLengkap }}</h4>
                             <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wide">Ketua Tim</p>
                          </div>
                      </div>

                      <div class="hidden sm:block w-px h-24 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

                      <!-- Members Column -->
                      <div class="flex-1 w-full">
                          <div class="flex items-center justify-between mb-3">
                             <h5 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Anggota Tim ({{ filteredUsers.length }})</h5>
                             <button 
                               v-if="filteredUsers.length > 10" 
                               @click="activeTab = 'Daftar Lengkap'"
                               class="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                             >
                               Lihat Semua &rarr;
                             </button>
                          </div>

                          <div class="flex flex-wrap gap-3">
                           <div 
                             v-for="(user, index) in filteredUsers.slice(0, 11)" 
                             :key="user.id" 
                             class="relative group" 
                           >
                             <div 
                               class="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full border-2 border-white dark:border-gray-800 shadow-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 hover:border-blue-400 dark:hover:border-blue-500 overflow-hidden peer"
                               @click="goToUserDetail(user.id)"
                             >
                               <img v-if="user.fotoProfilUrl"
                                 :src="getProfileUrl(user.fotoProfilUrl)"
                                 class="h-full w-full object-cover"
                               />
                               <div v-else
                                 class="h-full w-full flex items-center justify-center text-xs font-bold text-white"
                                 :style="{ backgroundColor: getSoftRandomColor(user.id) }"
                               >
                                 {{ getInitials(user.namaLengkap) }}
                               </div>
                             </div>
                             <!-- Tooltip -->
                             <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 peer-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                               {{ user.namaLengkap }}
                               <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                             </div>
                           </div>

                           <div 
                             v-if="filteredUsers.length > 11"
                             class="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                             @click="activeTab = 'Daftar Lengkap'"
                             title="Lihat anggota lainnya"
                           >
                             +{{ filteredUsers.length - 11 }}
                           </div>
                         </div>
                          
                          <p v-if="filteredUsers.length === 0" class="text-sm text-gray-400 italic mt-2">Belum ada anggota tambahan.</p>
                      </div>
                    </div>
                  </div>

                  <!-- LIST VIEW -->
                  <div v-else-if="activeTab === 'Daftar Lengkap'" key="lengkap" class="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800">
                    <div class="overflow-x-auto">
                      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-800/80">
                          <tr>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Anggota</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Peran</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                          <tr v-for="user in [team.ketuaTim, ...filteredUsers]" :key="user.id" @click="goToUserDetail(user.id)" class="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer">
                            <td class="px-6 py-3 whitespace-nowrap flex items-center gap-3">
                               <div class="flex-shrink-0 h-9 w-9">
                                 <img v-if="user.fotoProfilUrl" :src="getProfileUrl(user.fotoProfilUrl)" class="h-9 w-9 rounded-full object-cover shadow-sm"/>
                                 <div v-else class="h-9 w-9 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-sm" :style="{ backgroundColor: getSoftRandomColor(user.id) }">{{ getInitials(user.namaLengkap) }}</div>
                               </div>
                               <div>
                                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.namaLengkap }}</p>
                                  <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">@{{ user.username }}</p>
                               </div>
                            </td>
                            <td class="px-6 py-3 whitespace-nowrap text-xs">
                               <span v-if="team.ketuaTim?.id === user.id" class="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">Ketua Tim</span>
                               <span v-else-if="user.peran == 'operator'" class="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Operator</span>
                               <span v-else class="text-gray-500 dark:text-gray-400">Anggota</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </transition> 
              </div>

              <div v-else class="text-center text-gray-500 dark:text-gray-400 p-6 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                Tidak ada anggota yang terdaftar dalam tim ini.
              </div>
            </div>

            <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-10"></div>

            <!-- PROJECTS SECTION -->
            <section class="mt-8">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span class="text-2xl">🚀</span> Proyek & Aktivitas
                </h2>

                <div class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                  <button 
                    @click="projectViewMode = 'card'"
                    class="p-2 rounded-md transition-all"
                    :class="projectViewMode === 'card' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
                    title="Tampilan Kartu"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  </button>
                  <button 
                    @click="projectViewMode = 'table'"
                    class="p-2 rounded-md transition-all"
                    :class="projectViewMode === 'table' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
                    title="Tampilan Tabel Compact"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                  </button>
                </div>
              </div>

              <div v-if="team.projects?.length > 0">
                
                <!-- CARD VIEW -->
                <div v-if="projectViewMode === 'card'" class="space-y-4">
                  <div
                    v-for="project in team.projects"
                    :key="project.id"
                    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
                  >
                    <div 
                      class="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      @click="toggleProject(project.id)"
                    >
                      <div class="flex items-center gap-4">
                        <div class="relative hidden sm:block">
                          <img v-if="project.projectLeader?.fotoProfilUrl"
                            :src="getProfileUrl(project.projectLeader.fotoProfilUrl)"
                            class="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                          />
                          <div v-else
                            class="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            :style="{ backgroundColor: getSoftRandomColor(project.projectLeader?.id) }"
                          >
                            {{ getInitials(project.projectLeader?.namaLengkap) }}
                          </div>
                        </div>

                        <div>
                          <router-link
                            :to="{ name: 'project-detail', params: { id: project.id } }"
                            class="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
                            @click.stop
                          >
                            {{ project.namaProject }}
                          </router-link>
                          <div class="flex items-center gap-2 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                             <span>Leader: {{ project.projectLeader?.namaLengkap }}</span>
                             <span class="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-300"></span>
                             <span class="font-mono">ID: {{ project.id }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="flex items-center gap-3 mt-3 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                         <div class="flex items-center gap-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-full text-xs font-medium text-yellow-700 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-800">
                            <span class="font-bold">{{ project.aktivitas?.length ?? 0 }}</span> Aktivitas
                         </div>
                         
                         <div class="p-2 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <svg :class="{'rotate-180': expandedProjects[project.id]}" class="w-5 h-5 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                         </div>
                      </div>
                    </div>

                    <transition name="slide-fade">
                      <div v-show="expandedProjects[project.id]" class="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 p-4 sm:p-5">
                         
                         <!-- LIST AKTIVITAS DALAM CARD PROYEK (Menggunakan Style Timeline Compact) -->
                         <div v-if="project.aktivitas?.length > 0" class="space-y-3 relative">
                            <div class="absolute left-[2.25rem] top-4 bottom-4 w-px border-l-2 border-dashed border-gray-300 dark:border-gray-700/50"></div>
                            
                            <div v-for="aktivitas in project.aktivitas.slice(0, 5)" :key="aktivitas.id" class="relative flex items-center gap-4 group/item">
                               <!-- Dot -->
                               <div class="flex-shrink-0 w-4 h-4 ml-6 rounded-full border-2 border-white dark:border-gray-800 shadow-sm z-10 transition-all duration-300 group-hover/item:scale-125 bg-blue-500"></div>
                               
                               <!-- Card Kecil -->
                               <router-link :to="`/aktivitas/detail/${aktivitas.id}`" class="flex-1 flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm transition-all hover:-translate-x-[-2px]">
                                  <div class="min-w-0">
                                     <h4 class="text-sm font-bold text-gray-800 dark:text-white truncate">{{ aktivitas.namaAktivitas }}</h4>
                                     <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                                        <span class="font-mono">{{ formatActivityDate(aktivitas).fullString }}</span>
                                     </p>
                                  </div>
                                  <svg class="w-4 h-4 text-gray-300 group-hover/item:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                               </router-link>
                            </div>

                            <router-link :to="{ name: 'project-detail', params: { id: project.id } }" class="block ml-14 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-2 uppercase tracking-wide">
                               Lihat Semua Aktivitas &rarr;
                            </router-link>
                         </div>
                         <div v-else class="text-center py-6 text-gray-400 dark:text-gray-500 italic text-sm">Belum ada aktivitas.</div>
                      </div>
                    </transition>
                  </div>
                </div>

                <!-- TABLE VIEW -->
                <div v-if="projectViewMode === 'table'" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                  <div class="overflow-x-auto">
                    <table class="min-w-full text-sm text-left">
                      <thead class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-medium">
                        <tr>
                          <th class="px-6 py-3 w-8"></th> 
                          <th class="px-6 py-3">Nama Proyek</th>
                          <th class="px-6 py-3">Leader</th>
                          <th class="px-6 py-3 text-center">Aktivitas</th>
                          <th class="px-6 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                        <template v-for="project in team.projects" :key="project.id">
                          <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer" @click="toggleProject(project.id)">
                             <td class="px-6 py-4 text-gray-400">
                                <svg :class="{'rotate-90': expandedProjects[project.id]}" class="w-4 h-4 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                             </td>
                             <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                               {{ project.namaProject }}
                             </td>
                             <td class="px-6 py-4 text-gray-600 dark:text-gray-300">
                               {{ project.projectLeader?.namaLengkap }}
                             </td>
                             <td class="px-6 py-4 text-center">
                               <span class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full text-xs font-bold border border-yellow-200 dark:border-yellow-800">
                                 {{ project.aktivitas?.length || 0 }}
                               </span>
                             </td>
                             <td class="px-6 py-4 text-right">
                               <router-link :to="{ name: 'project-detail', params: { id: project.id } }" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-xs uppercase" @click.stop>
                                 Detail
                               </router-link>
                             </td>
                          </tr>
                          
                          <tr v-if="expandedProjects[project.id]" class="bg-gray-50/50 dark:bg-gray-900/30">
                             <td colspan="5" class="px-6 py-4">
                                <div v-if="project.aktivitas && project.aktivitas.length > 0" class="flex flex-wrap gap-2 pl-8">
                                   <router-link 
                                      v-for="aktivitas in project.aktivitas.slice(0,5)" 
                                      :key="aktivitas.id" 
                                      :to="`/aktivitas/detail/${aktivitas.id}`"
                                      class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs hover:border-blue-400 transition shadow-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]"
                                   >
                                      {{ aktivitas.namaAktivitas }}
                                   </router-link>
                                   <router-link :to="{ name: 'project-detail', params: { id: project.id } }" class="px-3 py-1.5 text-xs font-bold text-blue-600 hover:underline flex items-center">Lihat Semua &rarr;</router-link>
                                </div>
                                <p v-else class="text-xs text-gray-400 italic pl-8">Tidak ada aktivitas.</p>
                             </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              <div v-else class="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
                <span class="text-4xl opacity-20 mb-2 block grayscale">🚀</span>
                <p class="text-gray-500 dark:text-gray-400">Tim ini belum memiliki proyek.</p>
              </div>
            </section>

          </div>
        </div>
      </transition>

      <ModalWrapper :show="isEditModalOpen" @close="closeModal" title="Kelola Tim">
        <TeamDetailModal
          v-if="team && allUsers.length > 0"
          :team="team"
          :user-list="allUsers"
          @close="closeModal"
          @teamUpdated="handleUpdateTeamDetails"
          @addMember="addMemberToTeam"
          @removeMember="removeMemberFromTeam"
        />
      </ModalWrapper>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';

import ModalWrapper from '@/components/ModalWrapper.vue';
import { useAuthStore } from '@/stores/auth';
import TeamDetailModal from '@/components/admin/TeamDetailModal.vue';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const team = ref(null);
const isLoading = ref(true);
const isEditModalOpen = ref(false);
const expandedProjects = ref({});
const allUsers = ref([]);
const activeTab = ref('Ringkasan');
const projectViewMode = ref('card');

const isSuperadminOrKetuaTim = computed(() => {
  return authStore.user?.sistemRole.namaRole === 'Superadmin' || authStore.user?.id === team.value?.ketuaTim?.id;
});

const totalAktivitas = computed(() => {
  if (!team.value || !team.value.projects) return 0;
  return team.value.projects.reduce((sum, project) => sum + (project.aktivitas?.length ?? 0), 0);
});

const filteredUsers = computed(() => {
  if (!team.value?.users) return [];
  return team.value.users.filter(user => user.id !== team.value.ketuaTim?.id);
});

const toggleProject = (projectId) => {
  expandedProjects.value[projectId] = !expandedProjects.value[projectId];
};

const goToAktivitasDetail = (id) => {
  router.push({ name: 'aktivitas-detail', params: { id } });
};

const goToUserDetail = (userId) => {
  router.push({ name: 'user-detail', params: { id: userId } });
};

const fetchTeamDetails = async () => {
  try {
    const teamId = route.params.id;
    const [teamRes, usersRes] = await Promise.all([
      axios.get(`${baseURL}/api/teams/${teamId}/details`),
      axios.get(`${baseURL}/api/users`, { params: { limit: 10000 } })
    ]);
    team.value = teamRes.data;
    allUsers.value = usersRes.data.items;
  } catch (error) {
    toast.error("Gagal memuat detail tim.");
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return format(date, 'd MMM yyyy', { locale: id });
};

const formatActivityDate = (aktivitas) => {
  const start = aktivitas.tanggalMulai;
  const end = aktivitas.tanggalSelesai;
  
  if (!start) return { day: '--', month: '--', fullString: 'Jadwal belum ditentukan' };
  
  const sDate = new Date(start);
  const day = sDate.getDate();
  const month = sDate.toLocaleDateString('id-ID', { month: 'short' });
  
  let fullString = format(sDate, 'd MMM yyyy', { locale: id });
  
  if (end && end !== start) {
    const eDate = new Date(end);
    if (sDate.getMonth() === eDate.getMonth() && sDate.getFullYear() === eDate.getFullYear()) {
       fullString = `${format(sDate, 'd')} - ${format(eDate, 'd MMM yyyy', { locale: id })}`;
    } else {
       fullString = `${format(sDate, 'd MMM')} - ${format(eDate, 'd MMM yyyy', { locale: id })}`;
    }
  }

  if (aktivitas.jamMulai) {
     const jam = aktivitas.jamMulai.substring(0, 5);
     fullString += ` • ${jam}`;
     if (aktivitas.jamSelesai) fullString += `-${aktivitas.jamSelesai.substring(0,5)}`;
     fullString += ' WITA';
  }

  return { day, month, fullString };
};

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length === 0) return '';
  const firstInitial = parts[0][0];
  if(parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      const lastInitial = lastPart.replace(/[^a-zA-Z]/g, '')[0];
      return (firstInitial + lastInitial).toUpperCase();
  }
  return firstInitial.toUpperCase();
};

const getSoftRandomColor = (seed) => {
  const colors = ['#60A5FA', '#34D399', '#F472B6', '#A78BFA', '#FBBF24'];
  return colors[seed % colors.length];
};

const openEditModal = () => { isEditModalOpen.value = true; };
const closeModal = () => { isEditModalOpen.value = false; };

const handleUpdateTeamDetails = async (formData) => {
  try {
    const payload = { ...formData, id: team.value.id };
    await axios.put(`${baseURL}/api/teams/${team.value.id}`, payload);
    toast.success("Detail tim berhasil diperbarui!");
    closeModal();
    await fetchTeamDetails();
  } catch (error) {
    toast.error("Gagal memperbarui detail tim.");
  }
};

const addMemberToTeam = async (user) => {
  try {
    const response = await axios.post(`${baseURL}/api/teams/${team.value.id}/members?user_id=${user.id}`);
    team.value.users = response.data.users;
    toast.success(`"${user.namaLengkap}" berhasil ditambahkan.`);
  } catch (error) {
    toast.error("Gagal menambahkan anggota.");
  }
};

const removeMemberFromTeam = async (user) => {
  try {
    const response = await axios.delete(`${baseURL}/api/teams/${team.value.id}/members/${user.id}`);
    team.value.users = response.data.users;
    toast.success(`"${user.namaLengkap}" berhasil dikeluarkan.`);
  } catch (error) {
    toast.error("Gagal mengeluarkan anggota.");
  }
};

onMounted(() => {
  fetchTeamDetails();
});

const getProfileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("./")) {
    return `${baseURL}/${path.replace("./", "")}`;
  }
  return path;
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>