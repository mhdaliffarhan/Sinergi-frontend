<template>
  <div class="min-h-screenp-4 p-4 sm:pt-2 pt-2 font-sans transition-colors duration-300">
    
    <div class="max-w-7xl mx-auto">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-32">
        <div class="relative w-20 h-20">
          <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-200 dark:border-blue-900/30 rounded-full opacity-50"></div>
          <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-500 dark:border-blue-400 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="mt-6 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Sedang memuat detail tim...</p>
      </div>

      <div v-else-if="!team" class="text-center py-20">
         <p class="text-gray-500">Data tim tidak ditemukan.</p>
      </div>

      <div v-else class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 relative group animate-fade-in-up transition-all duration-300">
        
        <div class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
           <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent dark:from-blue-500/10 dark:via-indigo-500/5 rounded-bl-full -mr-20 -mt-20 transition-opacity duration-700"></div>
           <div class="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/10 to-transparent dark:from-cyan-500/10 rounded-tr-full -ml-16 -mb-16"></div>
        </div>

        <div class="p-6 sm:p-8 relative z-10">
          
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div class="flex items-start gap-5">
              <div 
                class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-white font-bold text-3xl sm:text-4xl shadow-lg transform hover:scale-105 transition-transform duration-300 ring-4 ring-white dark:ring-gray-800"
                :style="{ backgroundColor: team.warna || '#3b82f6' }"
              >
                {{ team.namaTim?.charAt(0) || '?' }}
              </div>
              
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
                    {{ team.namaTim }}
                  </h1>
                </div>
                
                <div class="flex items-center gap-2 mt-2">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Aktif
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(team.validFrom) }} – {{ formatDate(team.validUntil) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex-shrink-0" v-if="isSuperadminOrKetuaTim">
               <button 
                @click="openEditModal"
                class="group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              ><span class="mr-1 text-lg">✏️</span>
              <span class="font-semibold">Edit Tim</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div class="bg-gradient-to-br from-blue-50 to-indigo-100/50 dark:from-blue-950/30 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
               <div class="absolute top-0 right-0 w-16 h-16 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-xl -mr-4 -mt-4 transition-all group-hover:bg-blue-300/30 dark:group-hover:bg-blue-500/20"></div>
               <div class="flex items-center gap-4 relative z-10">
                 <div class="p-3 bg-white dark:bg-blue-900/30 rounded-xl text-2xl shadow-sm text-blue-600 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-500/30">👥</div>
                 <div>
                   <p class="text-[10px] font-bold uppercase tracking-wider text-blue-600/70 dark:text-blue-300/80 mb-1">Total Anggota</p>
                   <p class="text-3xl font-black text-gray-900 dark:text-white">{{ team.users?.length ?? 0 }}</p>
                 </div>
               </div>
            </div>

            <div class="bg-gradient-to-br from-purple-50 to-fuchsia-100/50 dark:from-purple-950/30 dark:to-fuchsia-900/20 border border-purple-100 dark:border-purple-500/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
               <div class="absolute top-0 right-0 w-16 h-16 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-xl -mr-4 -mt-4 transition-all group-hover:bg-purple-300/30 dark:group-hover:bg-purple-500/20"></div>
               <div class="flex items-center gap-4 relative z-10">
                 <div class="p-3 bg-white dark:bg-purple-900/30 rounded-xl text-2xl shadow-sm text-purple-600 dark:text-purple-400 ring-1 ring-purple-100 dark:ring-purple-500/30">💼</div>
                 <div>
                   <p class="text-[10px] font-bold uppercase tracking-wider text-purple-600/70 dark:text-purple-300/80 mb-1">Project Berjalan</p>
                   <p class="text-3xl font-black text-gray-900 dark:text-white">{{ team.projects?.length ?? 0 }}</p>
                 </div>
               </div>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-950/30 dark:to-emerald-900/20 border border-green-100 dark:border-green-500/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
               <div class="absolute top-0 right-0 w-16 h-16 bg-green-200/20 dark:bg-green-500/10 rounded-full blur-xl -mr-4 -mt-4 transition-all group-hover:bg-green-300/30 dark:group-hover:bg-green-500/20"></div>
               <div class="flex items-center gap-4 relative z-10">
                 <div class="p-3 bg-white dark:bg-green-900/30 rounded-xl text-2xl shadow-sm text-green-600 dark:text-green-400 ring-1 ring-green-100 dark:ring-green-500/30">✅</div>
                 <div>
                   <p class="text-[10px] font-bold uppercase tracking-wider text-green-600/70 dark:text-green-300/80 mb-1">Total Aktivitas</p>
                   <p class="text-3xl font-black text-gray-900 dark:text-white">{{ totalAktivitas }}</p>
                 </div>
               </div>
            </div>
          </div>

          <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-10"></div>

          <div class="mb-10">
             <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span class="text-lg">👥</span> Struktur Tim
              </h2>
              
              <div class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700" v-if="team.users?.length > 0">
                <button 
                  @click="activeTab = 'Ringkasan'"
                  class="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200"
                  :class="activeTab === 'Ringkasan' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm scale-105' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                >
                  Ringkasan
                </button>
                <button 
                  @click="activeTab = 'Daftar Lengkap'"
                  class="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200"
                  :class="activeTab === 'Daftar Lengkap' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm scale-105' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                >
                  Daftar Lengkap
                </button>
              </div>
            </div>

            <div v-if="team.users?.length > 0">
               
               <transition name="slide-fade" mode="out-in">
                 
                 <div v-if="activeTab === 'Ringkasan'" key="ringkasan">
                    
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800">
                      
                      <div v-if="team.ketuaTim" class="flex flex-col items-center justify-center min-w-[120px] flex-shrink-0">
                          <div 
                            class="relative h-20 w-20 rounded-full p-1 border-2 border-green-100 dark:border-green-900 cursor-pointer transition-transform duration-300 hover:scale-110 group"
                            @click="goToUserDetail(team.ketuaTim.id)"
                            :title="team.ketuaTim.namaLengkap + ' (Ketua Tim)'"
                          >
                            <div class="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">LEADER</div>
                            <img v-if="team.ketuaTim.fotoProfilUrl"
                              :src="getProfileUrl(team.ketuaTim.fotoProfilUrl)"
                              class="h-full w-full rounded-full object-cover shadow-sm"
                            />
                            <div v-else
                              class="h-full w-full rounded-full flex items-center justify-center text-white text-xl font-bold bg-green-500 shadow-sm"
                            >
                              {{ getInitials(team.ketuaTim.namaLengkap) }}
                            </div>
                          </div>
                          <div class="mt-3 text-center">
                             <h4 class="text-sm font-bold text-gray-900 dark:text-white leading-tight">{{ team.ketuaTim.namaLengkap }}</h4>
                             <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ketua Tim</p>
                          </div>
                      </div>

                      <div class="hidden sm:block w-px h-24 bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>

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

                 <div v-else-if="activeTab === 'Daftar Lengkap'" key="lengkap" class="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead class="bg-gray-50 dark:bg-gray-800/80">
                        <tr>
                          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Anggota</th>
                          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Peran</th>
                          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Jabatan</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                        <tr v-for="user in [team.ketuaTim, ...filteredUsers]" :key="user.id" @click="goToUserDetail(user.id)" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                          <td class="px-6 py-3 whitespace-nowrap flex items-center gap-3">
                             <div class="flex-shrink-0 h-9 w-9">
                               <img v-if="user.fotoProfilUrl" :src="getProfileUrl(user.fotoProfilUrl)" class="h-9 w-9 rounded-full object-cover shadow-sm"/>
                               <div v-else class="h-9 w-9 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-sm" :style="{ backgroundColor: getSoftRandomColor(user.id) }">{{ getInitials(user.namaLengkap) }}</div>
                             </div>
                             <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.namaLengkap }}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">@{{ user.username }}</p>
                             </div>
                          </td>
                          <td class="px-6 py-3 whitespace-nowrap text-xs">
                             <span v-if="team.ketuaTim?.id === user.id" class="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Ketua Tim</span>
                             <span v-else-if="user.peran == 'operator'" class="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Operator</span>
                             <span v-else class="text-gray-500 dark:text-gray-400">Anggota</span>
                          </td>
                          <td class="px-6 py-3 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300 hidden sm:table-cell">
                             {{ user.jabatan?.namaJabatan || '-' }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                 </div>
               
               </transition> </div>

            <div v-else class="text-center text-gray-500 dark:text-gray-400 p-6">
              Tidak ada anggota yang terdaftar dalam tim ini.
            </div>
          </div>

          <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-10"></div>

          <section class="mt-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-2xl">🚀</span> Proyek & Aktivitas
              </h2>

              <div class="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg border border-gray-200 dark:border-gray-600">
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
                           <span>ID: {{ project.id }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-3 mt-3 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                       <div class="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                          <span class="font-bold">{{ project.aktivitas?.length ?? 0 }}</span> Aktivitas
                       </div>
                       
                       <div class="p-2 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                          <svg :class="{'rotate-180': expandedProjects[project.id]}" class="w-5 h-5 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                       </div>
                    </div>
                  </div>

                  <transition name="slide-fade">
                    <div v-show="expandedProjects[project.id]" class="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 p-4 sm:p-5">
                       <div v-if="project.aktivitas?.length > 0" class="space-y-3 pl-2 sm:pl-14 relative">
                          <div class="absolute left-[1.75rem] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                          
                          <div v-for="aktivitas in project.aktivitas.slice(0, 3)" :key="aktivitas.id" @click="goToAktivitasDetail(aktivitas.id)" class="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group/item relative z-10">
                             <div class="flex-shrink-0 w-16 text-center hidden sm:block">
                               <p class="text-xs font-bold text-gray-700 dark:text-gray-300">{{ formatActivityDate(aktivitas).day }}</p>
                               <p class="text-[10px] uppercase text-gray-400">{{ formatActivityDate(aktivitas).month }}</p>
                             </div>
                             
                             <div class="flex-1 min-w-0">
                               <h4 class="text-sm font-semibold text-gray-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors truncate">
                                 {{ aktivitas.namaAktivitas }}
                               </h4>
                               <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                 {{ formatActivityDate(aktivitas).fullString }}
                               </p>
                             </div>
                             <svg class="w-4 h-4 text-gray-300 group-hover/item:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                          </div>
                          
                          <router-link :to="{ name: 'project-detail', params: { id: project.id } }" class="inline-block ml-0 sm:ml-14 mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wide">
                             Lihat Semua Aktivitas &rarr;
                          </router-link>
                       </div>
                       <div v-else class="text-center py-6 text-gray-400 dark:text-gray-500 italic text-sm">Belum ada aktivitas.</div>
                    </div>
                  </transition>
                </div>
              </div>

              <div v-if="projectViewMode === 'table'" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <div class="overflow-x-auto">
                  <table class="min-w-full text-sm text-left">
                    <thead class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-medium">
                      <tr>
                        <th class="px-6 py-3 w-8"></th> <th class="px-6 py-3">Nama Proyek</th>
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
                             <span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs font-bold">
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
                           <td colspan="5" class="px-6 py-4 pl-16">
                              <div v-if="project.aktivitas && project.aktivitas.length > 0" class="space-y-2">
                                 <div v-for="aktivitas in project.aktivitas" :key="aktivitas.id" @click="goToAktivitasDetail(aktivitas.id)" class="flex items-center justify-between p-2 hover:bg-white dark:hover:bg-gray-800 rounded border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer transition-all">
                                    <div class="flex items-center gap-3">
                                       <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                                       <span class="text-sm text-gray-700 dark:text-gray-300">{{ aktivitas.namaAktivitas }}</span>
                                    </div>
                                    <span class="text-xs text-gray-400 font-mono">{{ formatActivityDate(aktivitas).fullString }}</span>
                                 </div>
                              </div>
                              <p v-else class="text-xs text-gray-400 italic">Tidak ada aktivitas.</p>
                           </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div
              v-else
              class="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center"
            >
              <span class="text-4xl opacity-20 mb-2 block grayscale">🚀</span>
              <p class="text-gray-500 dark:text-gray-400">Tim ini belum memiliki proyek.</p>
            </div>
          </section>

      </div>

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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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
const projectViewMode = ref('card'); // 'card' | 'table'

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
  return format(date, 'd MMMM yyyy', { locale: id });
};

// Helper Formatter Tanggal yang Konsisten dengan ProjectDetailView
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
    // Logika rentang pintar
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

// Legacy formatter (untuk card stats)
const formatJadwal = (item) => {
    return { tanggal: formatActivityDate(item).fullString, waktu: null };
};

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length === 0) return '';
  const firstInitial = parts[0][0];
  const lastPart = parts[parts.length - 1];
  const lastInitial = lastPart.replace(/[^a-zA-Z]/g, '')[0];
  return (firstInitial + lastInitial).toUpperCase();
};

const getSoftRandomColor = (seed) => {
  const colors = ['#fbcfe8', '#fecaca', '#dbeafe', '#d1d5db', '#c7d2fe'];
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
  if (!path) return "/profile-default.png";
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
</style>