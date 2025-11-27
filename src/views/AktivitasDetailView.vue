<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:pt-2 pt-2 font-sans transition-colors duration-300">
    <div class="mb-6">
      <Breadcrumbs :items="breadcrumbItems" />
    </div>

    <div class="max-w-7xl mx-auto">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-32">
        <div class="relative w-20 h-20">
          <div class="absolute top-0 left-0 w-full h-full border-4 border-orange-200 dark:border-orange-900/30 rounded-full opacity-50"></div>
          <div class="absolute top-0 left-0 w-full h-full border-4 border-orange-500 dark:border-orange-400 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="mt-6 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Sedang memuat detail aktivitas...</p>
      </div>

      <div v-else-if="aktivitas" class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 relative group animate-fade-in-up transition-all duration-300">
        
        <div class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
           <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-purple-500/5 to-transparent dark:from-blue-500/10 dark:via-purple-500/5 rounded-bl-full -mr-20 -mt-20 transition-opacity duration-700"></div>
           <div class="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-500/10 to-transparent dark:from-orange-500/10 rounded-tr-full -ml-16 -mb-16"></div>
        </div>

        <div class="p-6 sm:p-8 relative z-10">
          
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/60 dark:to-blue-800/60 dark:text-blue-200 shadow-sm border border-blue-200 dark:border-blue-700/30">
                  Detail Aktivitas
                </span>
                <span v-if="aktivitas.publicId" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-green-100 to-green-200 text-green-700 dark:from-emerald-900/60 dark:to-emerald-800/60 dark:text-emerald-200 flex items-center gap-1 shadow-sm border border-green-200 dark:border-emerald-700/30">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Publik
                </span>
              </div>
              <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
                {{ aktivitas.namaAktivitas }}
              </h1>
              <div class="mt-4 prose dark:prose-invert max-w-4xl text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                {{ aktivitas.deskripsi || 'Tidak ada deskripsi tambahan.' }}
              </div>
            </div>

            <div class="flex-shrink-0 relative z-50">
              <Menu as="div" class="relative inline-block text-left">
                <MenuButton class="inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50 hover:shadow-md">
                  <span>Tindakan</span>
                  <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" /></svg>
                </MenuButton>

                <transition enter-active-class="transition ease-out duration-200" enter-from-class="transform opacity-0 scale-95 -translate-y-2" enter-to-class="transform opacity-100 scale-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="transform opacity-100 scale-100 translate-y-0" leave-to-class="transform opacity-0 scale-95 -translate-y-2">
                  <MenuItems class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div class="py-1">
                      <MenuItem v-slot="{ active }">
                        <button @click="handleDownloadAll" :class="[active ? 'bg-gray-50 dark:bg-gray-700/50' : '', 'group flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200']">
                          <span class="mr-3 text-lg">📦</span> Unduh Semua (ZIP)
                        </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button @click="copyPublicLink" :class="[active ? 'bg-gray-50 dark:bg-gray-700/50' : '', 'group flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200']">
                          <span class="mr-3 text-lg">🔗</span> Salin Link Publik
                        </button>
                      </MenuItem>
                    </div>
                    <div class="py-1" v-if="isAuthorized">
                      <MenuItem v-slot="{ active }">
                        <button @click="openEditModal" :class="[active ? 'bg-blue-50 dark:bg-blue-900/20' : '', 'group flex w-full items-center px-4 py-2.5 text-sm text-blue-600 dark:text-blue-400']">
                          <span class="mr-3 text-lg">✏️</span> Edit Aktivitas
                        </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button @click="confirmDeleteActivity" :class="[active ? 'bg-red-50 dark:bg-red-900/20' : '', 'group flex w-full items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400']">
                          <span class="mr-3 text-lg">🗑️</span> Hapus Aktivitas
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            
            <div class="h-full bg-gradient-to-br from-orange-50 to-amber-100/50 dark:from-orange-950/30 dark:to-amber-900/20 border border-orange-100 dark:border-orange-500/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
              <div class="absolute top-0 right-0 w-16 h-16 bg-orange-200/20 dark:bg-orange-500/10 rounded-full blur-xl -mr-4 -mt-4 transition-all group-hover:bg-orange-300/30 dark:group-hover:bg-orange-500/20"></div>
              <div class="flex items-start gap-4 h-full relative z-10">
                <div class="p-3 bg-white dark:bg-orange-900/30 rounded-xl text-2xl shadow-sm text-orange-500 dark:text-orange-400 ring-1 ring-orange-100 dark:ring-orange-500/30">🗓️</div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-wider text-orange-600/70 dark:text-orange-300/80 mb-1">Waktu Pelaksanaan</p>
                  <p class="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-tight">
                    {{ formattedWaktuPelaksanaan.tanggal }}
                  </p>
                  <p v-if="formattedWaktuPelaksanaan.waktu" class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-md inline-block">
                    {{ formattedWaktuPelaksanaan.waktu }}
                  </p>
                </div>
              </div>
            </div>
            
            <div class="h-full bg-gradient-to-br from-blue-50 to-indigo-100/50 dark:from-blue-950/30 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
              <div class="absolute top-0 right-0 w-16 h-16 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-xl -mr-4 -mt-4 transition-all group-hover:bg-blue-300/30 dark:group-hover:bg-blue-500/20"></div>
              <div class="flex items-start gap-4 h-full relative z-10">
                <div class="p-3 bg-white dark:bg-blue-900/30 rounded-xl text-2xl shadow-sm text-blue-500 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-500/30">👥</div>
                <div class="flex-1 flex flex-col h-full justify-between">
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-blue-600/70 dark:text-blue-300/80 mb-1">Penyelenggara</p>
                    <router-link :to="{ name: 'team-detail', params: { id: aktivitas.team?.id } }" class="font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-sm sm:text-base block mb-0.5">
                      {{ aktivitas.team?.namaTim || 'Tidak ada tim' }}
                    </router-link>
                    <span class="text-[10px] text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-black/20 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-500/20">
                      Ketua: {{ aktivitas.team?.ketuaTim?.namaLengkap || '-' }}
                    </span>
                  </div>

                  <div v-if="aktivitas.timTerkait && aktivitas.timTerkait.length > 0" class="mt-3 pt-2 border-t border-blue-200/50 dark:border-blue-500/20">
                    <p class="text-[10px] font-bold text-blue-500/80 dark:text-blue-400 mb-1">Kolaborasi Dengan:</p>
                    <div class="flex flex-wrap gap-1">
                      <router-link 
                        v-for="tim in aktivitas.timTerkait.slice(0, 2)" 
                        :key="tim.id"
                        :to="{ name: 'team-detail', params: { id: tim.id } }"
                        class="px-2 py-0.5 bg-white dark:bg-blue-900/40 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-200 rounded text-[10px] font-medium hover:bg-blue-50 dark:hover:bg-blue-800/50 transition shadow-sm"
                      >
                        {{ tim.namaTim }}
                      </router-link>
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
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-wider text-purple-600/70 dark:text-purple-300/80 mb-1">Proyek Induk</p>
                  <router-link :to="{ name: 'project-detail', params: { id: aktivitas.project?.id } }" class="font-bold text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-300 transition-colors text-sm sm:text-base block mb-0.5">
                    {{ aktivitas.project?.namaProject || 'Tidak ada proyek' }}
                  </router-link>
                  <span class="text-[10px] text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-black/20 px-1.5 py-0.5 rounded border border-purple-100 dark:border-purple-500/20">
                    Leader: <span class="font-medium">{{ aktivitas.project?.projectLeader?.namaLengkap || '-' }}</span>
                  </span>
                </div>
              </div>
            </div>

          </div>

          <div class="mt-10">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                <span class="mr-2">Pegawai terlibat</span>
                <span class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                  {{ aktivitas.users ? aktivitas.users.length : 0 }} Orang
                </span>
              </h2>
              
              <div class="flex bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg" v-if="aktivitas.users && aktivitas.users.length > 0">
                <button 
                  @click="activeMemberTab = 'summary'"
                  class="px-3 py-1 text-xs font-medium rounded-md transition-all"
                  :class="activeMemberTab === 'summary' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
                >
                  Ringkasan
                </button>
                <button 
                  @click="activeMemberTab = 'list'"
                  class="px-3 py-1 text-xs font-medium rounded-md transition-all"
                  :class="activeMemberTab === 'list' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
                >
                  Daftar Lengkap
                </button>
              </div>
            </div>
            
            <div v-if="aktivitas.users && aktivitas.users.length > 0">
              
              <div v-if="activeMemberTab === 'summary'" class="animate-fade-in">
                 
                 <div class="flex flex-wrap items-center gap-2">
                   
                   <div 
                    v-for="user in aktivitas.users" 
                    :key="user.id" 
                    class="relative group cursor-help"
                    :title="user.namaLengkap"
                  >
                    <div class="relative h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 shadow-sm transition-transform hover:scale-110 hover:z-10 hover:border-blue-300 dark:hover:border-blue-500">
                      <img v-if="user.fotoProfilUrl"
                        :src="getProfileUrl(user.fotoProfilUrl)"
                        class="h-full w-full rounded-full object-cover"
                      />
                      <div v-else
                        class="h-full w-full rounded-full flex items-center justify-center text-xs font-bold text-white"
                        :style="{ backgroundColor: getSoftRandomColor(user.id) }"
                      >
                        {{ getInitials(user.namaLengkap) }}
                      </div>
                    </div>
                    
                    </div>

                 </div>
              </div>

              <div v-else class="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl animate-fade-in shadow-sm">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-800/80">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Pegawai</th>
                      <!-- <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jabatan</th> -->
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Username</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="user in aktivitas.users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td class="px-4 py-2.5 whitespace-nowrap flex items-center gap-3">
                        <div class="flex-shrink-0 h-8 w-8">
                           <img v-if="user.fotoProfilUrl" :src="getProfileUrl(user.fotoProfilUrl)" class="h-8 w-8 rounded-full object-cover shadow-sm"/>
                           <div v-else class="h-8 w-8 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-sm" :style="{ backgroundColor: getSoftRandomColor(user.id) }">{{ getInitials(user.namaLengkap) }}</div>
                        </div>
                        <div class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ user.namaLengkap }}</div>
                      </td>
                      <!-- <td class="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                        <span class="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">{{ user.jabatan?.namaJabatan || '-' }}</span>
                      </td> -->
                      <td class="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 hidden sm:table-cell font-mono">
                        @{{ user.username }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
            <p v-else class="text-sm text-gray-400 italic mt-2">Tidak ada anggota yang ditambahkan.</p>
          </div>
          
          <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-10"></div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div class="lg:col-span-2 space-y-6">
              
              <div v-if="isAnggotaTim" class="relative group transform transition-all duration-300 hover:-translate-y-1">
                 <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                 <button 
                  @click="isUnifiedModalOpen = true"
                  class="relative w-full flex items-center justify-center gap-4 py-4 bg-white dark:bg-gray-800 hover:bg-blue-50/50 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-xl border border-blue-100 dark:border-blue-900/30 transition-all shadow-sm group-hover:shadow-md"
                >
                  <div class="bg-blue-100 dark:bg-blue-900/50 p-2.5 rounded-full text-blue-600 dark:text-blue-400 ring-4 ring-white dark:ring-gray-800 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  </div>
                  <div class="text-left">
                    <span class="block font-bold text-base text-blue-700 dark:text-blue-300">Upload Dokumen / Link</span>
                    <span class="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">Drag & drop file di sini atau klik untuk memilih</span>
                  </div>
                </button>
              </div>
              
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span class="text-2xl">📝</span> Checklist Dokumen Wajib
                </h2>
                <span class="text-xs font-bold px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-600">
                  {{ aktivitas.daftarDokumenWajib?.length || 0 }} Item
                </span>
              </div>
              
              <div v-if="aktivitas.daftarDokumenWajib && aktivitas.daftarDokumenWajib.length > 0" class="space-y-3">
                <div 
                  v-for="item in aktivitas.daftarDokumenWajib" 
                  :key="item.id"
                  class="rounded-xl transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
                  :class="[
                    // LOGIKA WARNA DARK MODE DIPERBAIKI
                    // 1. Hijau (Sudah Divalidasi)
                    item.statusPengecekan 
                      ? 'bg-green-50 border border-green-200 dark:bg-emerald-900/20 dark:border-emerald-500/30' 
                      // 2. Merah (Belum ada file)
                      : (!item.files || item.files.length === 0)
                        ? 'bg-red-50 border border-red-200 dark:bg-rose-900/20 dark:border-rose-500/30'
                        // 3. Default (Ada file, belum validasi)
                        : 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  ]"
                >
                  <ChecklistItem
                    :item="item"
                    :is-authorized="isAuthorized" 
                    @check="handleCheckDoc"
                    @preview="handlePreviewRequest"
                    @delete-file="confirmDeleteDokumen"
                    class="bg-transparent border-none shadow-none" 
                  />
                </div>
              </div>
              
              <div v-else class="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p class="text-gray-400 dark:text-gray-500 text-sm">Tidak ada daftar dokumen wajib untuk aktivitas ini.</p>
              </div>

            </div>

            <div class="lg:col-span-1 space-y-4">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
                <span class="text-2xl">📂</span> File Lainnya
              </h3>

              <div v-if="Object.keys(groupedOtherDocuments).length > 0" class="space-y-4">
                <div v-for="(files, keterangan) in groupedOtherDocuments" :key="keterangan" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition hover:shadow-md">
                  <div class="bg-gray-50 dark:bg-gray-700/40 px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h4 class="text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                      {{ keterangan }}
                    </h4>
                    <span class="text-[10px] bg-white dark:bg-gray-600 border dark:border-gray-500 px-1.5 rounded text-gray-500 dark:text-gray-300 font-mono">{{ files.length }}</span>
                  </div>

                  <div class="divide-y divide-gray-100 dark:divide-gray-700">
                    <div v-for="file in files" :key="file.id" class="px-4 py-3 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/10 transition group cursor-pointer" @click="handlePreviewRequest(file)">
                      <div class="flex items-center gap-3 min-w-0">
                        <div class="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 text-base shadow-sm">
                          {{ file.tipe === 'LINK' ? '🔗' : '📄' }}
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
                            {{ file.namaFileAsli || file.pathAtauUrl }}
                          </p>
                          <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase">
                            {{ formatFileDate(file.diunggahPada) }}
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        v-if="isAuthorized"
                        @click.stop="confirmDeleteDokumen(file.id)" 
                        class="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition opacity-0 group-hover:opacity-100 shadow-sm"
                        title="Hapus"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                 <span class="text-3xl opacity-20 mb-2 block grayscale">📂</span>
                 <p class="text-gray-400 dark:text-gray-500 text-sm">Belum ada file tambahan.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

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
import FormTambahLink from '@/components/aktivitas/FormTambahLink.vue';
import ChecklistItem from '@/components/aktivitas/ChecklistItem.vue';
import DropzoneUploader from '@/components/aktivitas/DropzoneUploader.vue';
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
  { text: 'Dashboard', to: '/dashboard' },
  { text: 'Daftar Aktivitas', to: '/aktivitas/daftar' },
  { text: 'Project', to: ''},
  { text: 'Detail Aktivitas' }
]);

// Modal States
const isEditModalOpen = ref(false);
const isLinkModalOpen = ref(false);
const isFileModalOpen = ref(false);
const isReplaceModalOpen = ref(false);
const isPreviewModalOpen = ref(false);
const isUnifiedModalOpen = ref(false);

// Upload States
const fileToUpload = ref(null);
const replaceFileInput = ref(null);
const checklistItemIdToUpload = ref(null); // Menyimpan ID item checklist target
const itemToReplace = ref(null);
const isUploadingFiles = ref(false);
const uploadProgressLabel = ref('');
const fileToPreview = ref({ url: '', name: '', type: '' });

// Data Pendukung Edit
const teamList = ref([]);
const projectList = ref([]);
const pegawaiList = ref([]);
const teamMembers = ref([]); // Diperlukan jika FormAktivitas butuh ini (biasanya untuk project leader)

// --- AUTHORIZATION ---
const isAuthorized = computed(() => {
  if (!user.value || !aktivitas.value) return false;
  const userId = user.value.id;

  // 1. Admin
  if (authStore.isAdmin) return true;
  
  // 2. Ketua Tim Penyelenggara
  const ketuaTimId = aktivitas.value.team?.ketuaTimId || aktivitas.value.team?.ketua_tim_id;
  if (ketuaTimId === userId) return true;

  // 3. Project Leader
  const projectLeaderId = aktivitas.value.project?.projectLeaderId || aktivitas.value.project?.project_leader_id;
  if (projectLeaderId === userId) return true;
  
  // 4. Ketua Tim Terkait
  // Pastikan backend mengirim 'timTerkait' (camelCase) atau 'tim_terkait'
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

// --- DATA PREPARATION UNTUK MODAL (DISEMPURNAKAN) ---
const checklistOptions = computed(() => {
  // Pastikan ini mengembalikan array objek yang valid
  // Struktur objek harus: { id, namaDokumen, files }
  if (!aktivitas.value || !aktivitas.value.daftarDokumenWajib) {
      return [];
  }
  return aktivitas.value.daftarDokumenWajib;
});

const existingGroups = computed(() => {
  // Ambil kunci unik dari groupedOtherDocuments
  return Object.keys(groupedOtherDocuments.value);
});

// --- HANDLER UNIFIED SUBMIT (Logic Inti) ---
const handleUnifiedSubmit = async (payload) => {
  // Tutup modal
  isUnifiedModalOpen.value = false;

  console.log("Menerima Payload di View:", payload); // Debugging

  const { type, files, linkData, targetType, checklistItemId, keterangan } = payload;

  // 1. Tentukan Keterangan Akhir (Penting!)
  let finalKeterangan = keterangan;
  
  if (targetType === 'checklist') {
    // Cari nama dokumen dari list checklist berdasarkan ID
    const item = aktivitas.value.daftarDokumenWajib.find(i => i.id === checklistItemId);
    if (item) {
        finalKeterangan = item.namaDokumen;
    } else {
        // Fallback jika tidak ketemu (seharusnya tidak terjadi)
        finalKeterangan = 'Dokumen Wajib'; 
    }
  }

  // 2. Eksekusi berdasarkan Tipe
  if (type === 'LINK') {
    
    try {
          const postData = {
          path_atau_url: linkData.url,
          keterangan: finalKeterangan || linkData.title, 
          nama_file_asli: linkData.title, 
          tipe: 'LINK',
          checklist_item_id: checklistItemId // <-- Ini akan ditangkap oleh schema baru
        };
        await axios.post(`${baseURL}/api/aktivitas/${aktivitasId}/link`, postData);
        toast.success("Link berhasil disimpan!");
        fetchDetailAktivitas();
    } catch (e) { toast.error("Gagal simpan link"); }
  } 
  
  else if (type === 'FILE') {
    isUploadingFiles.value = true;
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      uploadProgressLabel.value = `Mengunggah ${i+1}/${files.length}: ${file.name}`;

      const formData = new FormData();
      formData.append('file', file);
      // Gunakan finalKeterangan yang sudah dihitung di atas
      formData.append('keterangan', finalKeterangan); 
      
      if (checklistItemId) {
        formData.append('checklist_item_id', checklistItemId);
      }

      try {
        await axios.post(`${baseURL}/api/aktivitas/${aktivitasId}/dokumen`, formData);
        successCount++;
      } catch (e) {
        console.error(e);
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

// --- UTILS ---
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

// --- COMPUTED DATA ---
const unfulfilledChecklistItems = computed(() =>
  aktivitas.value?.daftarDokumenWajib?.filter(item => (!item.files || item.files.length === 0)) || []
);

const otherDocumentsRaw = computed(() => {
  if (!aktivitas.value?.dokumen) return [];
  // Filter dokumen yang BUKAN checklist
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
    
    // Update Breadcrumbs
    breadcrumbItems.value[2] = {
      text: aktivitas.value.project?.namaProject || 'Proyek',
      to: aktivitas.value.project ? `/project/detail/${aktivitas.value.project.id}` : '#'
    };
    breadcrumbItems.value[3].text = aktivitas.value?.namaAktivitas ?? 'Detail Aktivitas';
  } catch (error) {
    toast.error("Gagal memuat detail aktivitas.");
  } finally {
    isLoading.value = false;
  }
};

const fetchTeams = async () => {
  try { const res = await axios.get(`${baseURL}/api/teams/active`); teamList.value = res.data.items; } catch (e) {}
};
const fetchProjects = async () => {
  try { const res = await axios.get(`${baseURL}/api/projects`, {params:{limit:1000}}); projectList.value = res.data.items; } catch (e) {}
};
const fetchPegawai = async () => {
  try { const res = await axios.get(`${baseURL}/api/users`, {params:{limit:10000}}); pegawaiList.value = res.data.items; } catch (e) {}
};

onMounted(() => { 
  fetchDetailAktivitas(); fetchTeams(); fetchProjects(); fetchPegawai();
});

// --- HANDLERS: EDIT & HAPUS ---
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

// --- HANDLER: DOKUMEN (Hapus) ---
const confirmDeleteDokumen = (id) => { if(confirm("Hapus file ini?")) deleteDokumen(id); };
const deleteDokumen = async (id) => {
  try {
    await axios.delete(`${baseURL}/api/dokumen/${id}`);
    toast.success("File dihapus.");
    
    // Update State Lokal (Optimistic UI)
    // 1. Hapus dari dokumen biasa
    if (aktivitas.value.dokumen) {
      aktivitas.value.dokumen = aktivitas.value.dokumen.filter(d => d.id !== id);
    }
    // 2. Hapus dari checklist
    if (aktivitas.value.daftarDokumenWajib) {
      aktivitas.value.daftarDokumenWajib.forEach(item => {
        if (item.files) item.files = item.files.filter(f => f.id !== id);
      });
    }
  } catch(e) { toast.error("Gagal hapus file."); }
};

// --- HANDLER: UPLOAD FILE (UMUM & CHECKLIST) ---
const closeFileModal = () => { isFileModalOpen.value = false; fileToUpload.value = null; checklistItemIdToUpload.value = null; };

// Trigger dari Checklist Item: Buka Modal Dropzone dengan ID target
const handleUploadRequest = (itemId) => {
  checklistItemIdToUpload.value = itemId; // Set ID item checklist (bisa null jika upload umum)
  isFileModalOpen.value = true; 
};

// Logic Upload Utama (Multi-file)
// Menerima { files: [], keterangan: string } dari Dropzone
const handleFileUploadSubmit = async (formData) => {
  const filesToUpload = formData.files;
  if (!filesToUpload || filesToUpload.length === 0) return;

  isUploadingFiles.value = true;
  let successCount = 0;
  const total = filesToUpload.length;

  // Target checklist ID (jika ada dari state global)
  const targetChecklistId = checklistItemIdToUpload.value;

  for (let i = 0; i < total; i++) {
    const file = filesToUpload[i];
    uploadProgressLabel.value = `Mengunggah ${i + 1}/${total}: ${file.name}`;
    
    const data = new FormData();
    data.append('file', file);
    
    // Logika Keterangan:
    // 1. Jika upload ke checklist -> gunakan nama dokumen checklist
    // 2. Jika upload umum -> gunakan input user atau nama file
    let keterangan = formData.keterangan || file.name;
    
    if (targetChecklistId) {
        data.append('checklist_item_id', targetChecklistId);
        const item = aktivitas.value.daftarDokumenWajib.find(i => i.id === targetChecklistId);
        if (item) keterangan = item.namaDokumen;
    }
    data.append('keterangan', keterangan);

    try {
      const response = await axios.post(`${baseURL}/api/aktivitas/${aktivitasId}/dokumen`, data);
      successCount++;
      
      // Update state lokal (tambahkan file baru)
      if (targetChecklistId) {
          const item = aktivitas.value.daftarDokumenWajib.find(i => i.id === targetChecklistId);
          if(item) {
              if(!item.files) item.files = [];
              item.files.push(response.data);
          }
      } else {
          if(!aktivitas.value.dokumen) aktivitas.value.dokumen = [];
          aktivitas.value.dokumen.push(response.data);
      }

    } catch (e) {
      toast.error(`Gagal: ${file.name}`);
      console.error(e);
    }
  }

  isUploadingFiles.value = false;
  uploadProgressLabel.value = '';
  if (successCount > 0) {
    toast.success(`${successCount} file terunggah.`);
    closeFileModal();
    // fetchDetailAktivitas(); // Tidak perlu fetch, state lokal sudah diupdate
  }
};

// --- HANDLER UNIFIED SUBMIT (Logic Inti) ---

// --- HANDLER: LINK ---
const openLinkModal = () => isLinkModalOpen.value = true;
const closeLinkModal = () => isLinkModalOpen.value = false;
const handleLinkSubmit = async (fd) => {
    try { 
        const res = await axios.post(`${baseURL}/api/aktivitas/${aktivitasId}/link`, {...fd, tipe:'LINK'}); 
        toast.success("Link ditambah"); 
        if(!aktivitas.value.dokumen) aktivitas.value.dokumen = [];
        aktivitas.value.dokumen.push(res.data); // Update lokal
        closeLinkModal(); 
    } catch(e) { toast.error("Gagal tambah link"); }
};

// --- HANDLER: CEK/VALIDASI ---
const handleCheckDoc = async ({ id, value }) => {
    try {
        const { data } = await axios.patch(`${baseURL}/api/daftar_dokumen/${id}/cek`, { statusPengecekan: value });
        const target = aktivitas.value.daftarDokumenWajib.find(d => d.id === id);
        if(target) target.statusPengecekan = data.statusPengecekan;
        toast.success(value ? "Divalidasi" : "Validasi dibatalkan");
    } catch(e) { toast.error("Gagal update status."); }
};

// --- HANDLER: PREVIEW ---
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

// --- HANDLER: DOWNLOAD ZIP ---
const handleDownloadAll = async () => {
  // 1. Cek Dokumen Biasa (Tipe FILE)
  const hasOtherFiles = aktivitas.value.dokumen && aktivitas.value.dokumen.some(d => d.tipe === 'FILE');
  
  // 2. Cek Dokumen Checklist (Deep Check ke dalam array 'files')
  // Karena struktur baru one-to-many: item.files adalah array
  const hasChecklistFiles = aktivitas.value.daftarDokumenWajib && aktivitas.value.daftarDokumenWajib.some(item => 
      item.files && item.files.some(f => f.tipe === 'FILE')
  );

  if (!hasOtherFiles && !hasChecklistFiles) {
    toast.warning("Tidak ada file yang bisa diunduh untuk aktivitas ini.");
    return; 
  }

  if (window.confirm(`Apakah Anda yakin ingin mengunduh semua file untuk aktivitas ini?`)) {
    const toastId = toast.info("Sedang mempersiapkan file ZIP, mohon tunggu...", { timeout: false });
    
    try {
      const response = await axios.get(`${baseURL}/api/aktivitas/${aktivitasId}/download-all`, {
        responseType: 'blob',
        timeout: 60000, // Timeout 1 menit
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Nama file default atau dari header
      let fileName = `${aktivitas.value.namaAktivitas || 'dokumen'}.zip`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.dismiss(toastId);
      toast.success("File ZIP berhasil diunduh!");

    } catch (error) {
      toast.dismiss(toastId);
      console.error("Gagal mengunduh semua file:", error);
      
      // Pesan error yang lebih spesifik
      const errorMsg = error.response?.data?.detail || "Gagal mengunduh file ZIP. Pastikan file fisik tersedia di server.";
      toast.error(errorMsg);
    }
  }
};

// --- HANDLER: REPLACE (GANTI FILE) ---
// const openReplaceModal = () => { isReplaceModalOpen.value = true; };
// const closeReplaceModal = () => { isReplaceModalOpen.value = false; itemToReplace.value = null; };
// const handleGantiRequest = (item) => {
//   itemToReplace.value = item;
//   openReplaceModal();
// };
// const handleReplaceActionChosen = (action) => {
//   if (!itemToReplace.value) return;
//   itemToReplace.value.old_file_action = action;
//   closeReplaceModal();
//   replaceFileInput.value.click();
// };
// const handleReplaceFileSelected = async (event) => {
//   const newFile = event.target.files[0];
//   if (!newFile || !itemToReplace.value) return;
//   const data = new FormData(); 
//   data.append('file', newFile);
//   data.append('old_file_action', itemToReplace.value.old_file_action);
//   try {
//     await axios.post(`${baseURL}/api/checklist/${itemToReplace.value.id}/replace`, data);
//     toast.success("File berhasil diganti!");
//     await fetchDetailAktivitas();
//   } catch (error) {
//     toast.error("Gagal mengganti file.");
//     console.error(error);
//   } finally {
//     itemToReplace.value = null;
//     event.target.value = '';
//   }
// };
</script>