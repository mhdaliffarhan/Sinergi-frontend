<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 text-gray-800 dark:text-gray-200">
    
    <!-- BAGIAN 1: INFORMASI DASAR -->
    <div class="space-y-4">
      <div class="relative">
        <label for="nama-aktivitas" class="block text-sm font-medium mb-1 transition-colors" :class="errors.namaAktivitas ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
          Nama Aktivitas <span class="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          id="nama-aktivitas" 
          v-model="form.namaAktivitas"
          class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
          :class="errors.namaAktivitas ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'"
          placeholder="Contoh: Rapat Evaluasi Bulanan"
        />
        <transition name="slide-fade">
          <p v-if="errors.namaAktivitas" class="mt-1 text-xs text-red-500 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            {{ errors.namaAktivitas }}
          </p>
        </transition>
      </div>

      <div>
        <label for="deskripsi" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
        <textarea 
          id="deskripsi" 
          v-model="form.deskripsi"
          rows="3"
          class="block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
          placeholder="Jelaskan tujuan singkat dari aktivitas ini..."
        ></textarea>
      </div>
    </div>

    <!-- BAGIAN 2: KONTEKS & PENGATURAN -->
    <div class="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600 space-y-5">
      <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2 flex items-center gap-2">
        <span>📂</span> Informasi Aktivitas
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <!-- 1. Tim Penyelenggara -->
        <div>
          <label for="tim" class="block text-sm font-medium mb-1 transition-colors" :class="errors.teamId ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
            Tim Penyelenggara <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <select 
              id="tim" 
              v-model="form.teamId"
              class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm appearance-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none cursor-pointer"
              :class="errors.teamId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
            >
              <option disabled value="">-- Pilih Tim --</option>
              <option v-for="tim in daftarTim" :key="tim.id" :value="tim.id">
                {{ tim.namaTim }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          <transition name="slide-fade">
            <p v-if="errors.teamId" class="mt-1 text-xs text-red-500">{{ errors.teamId }}</p>
          </transition>
        </div>

        <!-- 2. Project -->
        <div class="relative min-h-[70px]">
          <transition name="slide-up" mode="out-in">
            <div v-if="form.teamId">
              <label for="project" class="block text-sm font-medium mb-1 transition-colors" :class="errors.projectId ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'">
                Project <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  id="project"
                  v-model="form.projectId"
                  class="block w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm appearance-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none cursor-pointer"
                  :class="errors.projectId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                >
                  <option disabled value="">-- Pilih Project --</option>
                  <option v-for="project in filteredProjects" :key="project.id" :value="project.id">
                    {{ project.namaProject }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              <transition name="slide-fade">
                <p v-if="errors.projectId" class="mt-1 text-xs text-red-500">{{ errors.projectId }}</p>
              </transition>
            </div>
            <div v-else class="flex items-center justify-center h-[46px] mt-6 text-sm text-gray-400 italic border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              Pilih Tim terlebih dahulu
            </div>
          </transition>
        </div>

        <!-- 3. Induk Aktivitas (Parent) -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Induk Aktivitas (Parent) <span class="text-xs text-gray-400 font-normal ml-1">(Opsional)</span>
          </label>
          
          <div class="relative group" v-click-outside="closeParentDropdown">
            <div 
              class="w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm cursor-pointer flex justify-between items-center transition-all duration-200"
              :class="[
                !form.projectId ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : '',
                isParentDropdownOpen ? 'ring-2 ring-blue-500/50 border-blue-500' : 'border-gray-300 dark:border-gray-600'
              ]"
              @click="toggleParentDropdown"
            >
              <span class="truncate" :class="form.parentId ? 'text-gray-900 dark:text-white' : 'text-gray-500'">
                {{ getSelectedParentName || (form.projectId ? '-- Pilih Induk Aktivitas (Cari...) --' : 'Pilih Project Dahulu') }}
              </span>
              <svg class="w-4 h-4 text-gray-500 transition-transform duration-200" :class="{'rotate-180': isParentDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            <transition name="dropdown">
              <div v-if="isParentDropdownOpen && form.projectId" class="absolute z-30 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
                <div class="p-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 sticky top-0">
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input 
                      type="text" 
                      v-model="parentSearchQuery" 
                      placeholder="Cari aktivitas induk..." 
                      class="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors" 
                      ref="parentSearchInput"
                    />
                  </div>
                </div>

                <ul class="overflow-y-auto flex-1 py-1 custom-scrollbar">
                  <li 
                    @click="selectParent(null)"
                    class="px-4 py-2.5 cursor-pointer text-sm text-gray-500 italic hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700/50"
                  >
                    -- Tidak Ada (Aktivitas Utama) --
                  </li>
                  <li 
                    v-for="act in filteredParents" 
                    :key="act.id" 
                    @click="selectParent(act)"
                    class="px-4 py-2.5 cursor-pointer text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex justify-between items-center"
                    :class="{'bg-blue-50 dark:bg-blue-900/30 text-blue-700': form.parentId === act.id}"
                  >
                    <span>{{ act.namaAktivitas }}</span>
                    <span v-if="form.parentId === act.id" class="text-blue-600 text-xs font-bold">✓</span>
                  </li>
                  <li v-if="filteredParents.length === 0" class="px-4 py-6 text-center text-xs text-gray-400">
                    Tidak ada aktivitas lain di proyek ini yang cocok.
                  </li>
                </ul>
              </div>
            </transition>
          </div>
          <p v-if="form.projectId" class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Hanya menampilkan aktivitas dalam proyek yang sama.</p>
        </div>

        <!-- 4. Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Aktivitas</label>
          <div class="relative">
            <select 
              v-model="form.status" 
              class="block w-full pl-4 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              <option value="Belum Selesai">⏳ Belum Selesai</option>
              <option value="Dalam Proses">🚧 Dalam Proses</option>
              <option value="Selesai">✅ Selesai</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <!-- 5. Tampilkan di Kalender -->
        <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          <div>
            <label class="font-medium text-sm text-gray-800 dark:text-gray-200">Tampilkan di Kalender</label>
            <p class="text-[10px] text-gray-500 dark:text-gray-400">Aktifkan agar terlihat di jadwal tim.</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="form.kalenderView" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

      </div>
    </div>

    <div class="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

    <!-- BAGIAN 3: KOLABORASI -->
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <label class="block text-sm font-bold text-gray-800 dark:text-gray-200">
          🤝 Kolaborasi Lintas Tim (Opsional)
        </label>
        <span class="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          {{ form.idTimTerkait.length }} Tim Dipilih
        </span>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto custom-scrollbar p-1">
        <div v-for="tm in teamList" :key="tm.id">
          <template v-if="tm.id !== form.teamId">
            <label 
              :for="`team-terkait-${tm.id}`"
              class="flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 group hover:shadow-sm"
              :class="form.idTimTerkait.includes(tm.id) 
                ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/30 dark:border-blue-500' 
                : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-blue-300'"
            >
              <input 
                type="checkbox" 
                :id="`team-terkait-${tm.id}`"
                :value="tm.id" 
                v-model="form.idTimTerkait" 
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              >
              <span class="ml-3 text-sm font-medium" :class="form.idTimTerkait.includes(tm.id) ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'">
                {{ tm.namaTim }}
              </span>
            </label>
          </template>
        </div>
      </div>
    </div>

    <div class="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

    <!-- BAGIAN 4: JADWAL PELAKSANAAN -->
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-6">
        <label class="inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="form.useDateRange" class="sr-only peer">
          <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Rentang Tanggal</span>
        </label>

        <label class="inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="form.useTime" class="sr-only peer">
          <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Pakai Jam</span>
        </label>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ form.useDateRange ? 'Tanggal Mulai' : 'Tanggal Pelaksanaan' }} <span class="text-red-500">*</span>
          </label>
          <input type="date" v-model="form.tanggalMulai" :class="{ 'border-red-500': errors.tanggalMulai }" class="block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"/>
          <p v-if="errors.tanggalMulai" class="mt-1 text-xs text-red-500">{{ errors.tanggalMulai }}</p>
        </div>
        
        <div v-if="form.useDateRange">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Selesai <span class="text-red-500">*</span></label>
          <input type="date" v-model="form.tanggalSelesai" :class="{ 'border-red-500': errors.tanggalSelesai }" class="block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"/>
          <p v-if="errors.tanggalSelesai" class="mt-1 text-xs text-red-500">{{ errors.tanggalSelesai }}</p>
        </div>
      </div>

      <div v-if="form.useTime" class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jam Mulai <span class="text-red-500">*</span></label>
          <input type="time" v-model="form.jamMulai" :class="{ 'border-red-500': errors.jamMulai }" class="block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"/>
          <p v-if="errors.jamMulai" class="mt-1 text-xs text-red-500">{{ errors.jamMulai }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jam Selesai <span class="text-red-500">*</span></label>
          <input type="time" v-model="form.jamSelesai" :class="{ 'border-red-500': errors.jamSelesai }" class="block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"/>
          <p v-if="errors.jamSelesai" class="mt-1 text-xs text-red-500">{{ errors.jamSelesai }}</p>
        </div>
      </div>
      
    </div>

    <div class="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

    <!-- BAGIAN 5: ANGGOTA (PEGAWAI) -->
    <div class="space-y-4">
      <!-- Toggle Libatkan Kepala -->
      <div 
        class="flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer"
        :class="includeHead 
          ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/20 dark:border-indigo-500' 
          : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'"
        @click="includeHead = !includeHead"
      >
        <div class="flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors"
             :class="includeHead ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400 bg-transparent'">
           <svg v-if="includeHead" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div class="ml-3">
          <span class="block text-sm font-medium" :class="includeHead ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'">
            Libatkan Kepala Kantor
          </span>
          <span class="block text-xs text-gray-500">Otomatis menambahkan Kepala Kantor ke daftar peserta</span>
        </div>
      </div>

      <!-- Shortcut & Selection -->
      <transition name="slide-fade">
        <div v-if="form.teamId" class="flex flex-wrap gap-2 items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">Pintasan:</span>
          <button 
            type="button"
            @click="addMembersByTeam(form.teamId)"
            class="group flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
          >
            <span class="w-4 h-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">+</span>
            Semua Anggota Tim Ini
          </button>
          
          <div class="relative group">
            <select 
              @change="addMembersByTeam($event.target.value); $event.target.value=''" 
              class="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm cursor-pointer focus:outline-none"
            >
              <option value="">+ Dari Tim Lain...</option>
              <option v-for="tm in teamList" :key="tm.id" :value="tm.id">{{ tm.namaTim }}</option>
            </select>
            <div class="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400 group-hover:text-blue-500">
               <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </transition>

      <!-- Multi-select Dropdown for Members -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Pegawai yang Terlibat 
          <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {{ selectedMembers.length }} orang
          </span>
        </label>
        
        <div class="relative group">
          <div 
            class="min-h-[42px] w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 cursor-pointer transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-blue-500/50 group-focus-within:border-blue-500"
            :class="isDropdownOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300 dark:border-gray-600'"
            @click="toggleDropdown"
          >
            <div v-if="selectedMembers.length === 0" class="text-gray-400 text-sm py-0.5">Klik untuk memilih pegawai...</div>
            <div v-else class="flex flex-wrap gap-2">
              <transition-group name="list">
                <span 
                  v-for="member in selectedMembers" 
                  :key="member.id" 
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800 transition-all hover:bg-blue-100"
                >
                  {{ member.namaLengkap }}
                  <button type="button" @click.stop="removeMember(member.id)" class="ml-1.5 text-blue-400 hover:text-blue-600 focus:outline-none">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                  </button>
                </span>
              </transition-group>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <svg class="w-5 h-5 transition-transform duration-200" :class="{'rotate-180': isDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <transition name="dropdown">
            <div v-if="isDropdownOpen" class="absolute z-30 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-72 overflow-hidden flex flex-col">
              <div class="p-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="Cari nama..." 
                    class="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:border-blue-500 transition-colors" 
                    @click.stop
                    ref="searchInput"
                  />
                </div>
              </div>
              
              <div
                class="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex justify-between items-center"
                @click.stop="toggleSelectAllMembers"
              >
                <span>{{ selectAllText }}</span>
                <span v-if="allFilteredSelected" class="text-blue-600">✓</span>
              </div>

              <ul class="overflow-y-auto flex-1 py-1 custom-scrollbar">
                <li 
                  v-for="user in filteredMembers" 
                  :key="user.id" 
                  @click.stop="selectMember(user)" 
                  class="px-4 py-2.5 cursor-pointer text-sm flex justify-between items-center transition-colors border-l-4 border-transparent"
                  :class="isSelected(user.id) 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-blue-500' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'"
                >
                  <div class="flex flex-col">
                    <span class="font-medium">{{ user.namaLengkap }}</span>
                    <span class="text-xs text-gray-500">{{ user.username }}</span>
                  </div>
                  <transition name="scale">
                    <svg v-if="isSelected(user.id)" class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  </transition>
                </li>
              </ul>
              <div v-if="filteredMembers.length === 0" class="p-8 text-center">
                <p class="text-gray-400 text-sm">Tidak ada pegawai ditemukan.</p>
              </div>
            </div>
          </transition>
          
          <div v-if="isDropdownOpen" class="fixed inset-0 z-20" @click="isDropdownOpen = false"></div>
        </div>
      </div>
    </div>

    <div class="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

    <!-- BAGIAN 6: DOKUMEN WAJIB -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grup Dokumen Wajib</label>
      <div class="flex gap-2">
        <input 
          type="text" 
          v-model="namaDokumenBaru"
          @keydown.enter.prevent="tambahDokumen"
          class="flex-grow block px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/50 outline-none sm:text-sm dark:bg-gray-800 dark:text-white"
          placeholder="Contoh: Notulensi, Dokumentasi Foto"
        />
        <button 
          type="button" 
          @click="tambahDokumen" 
          class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
        >
          Tambah
        </button>
      </div>
      
      <transition-group name="list" tag="ul" class="mt-3 space-y-2">
        <li 
          v-for="(dokumen, index) in daftarDokumenWajib" 
          :key="index" 
          class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span class="text-sm text-gray-700 dark:text-gray-200 font-medium">{{ dokumen }}</span>
          </div>
          <button @click="hapusDokumen(index)" type="button" class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </li>
      </transition-group>
      <p v-if="daftarDokumenWajib.length === 0" class="text-xs text-gray-500 italic mt-2 pl-1">Belum ada dokumen wajib ditambahkan.</p>
    </div>

    <!-- NOTIFIKASI WHATSAPP -->
    <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/50">
        <div class="flex items-start gap-3">
          <div class="flex items-center h-5">
            <input
              id="send-whatsapp-akt"
              v-model="form.sendWhatsapp"
              type="checkbox"
              class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="ml-2 text-sm">
            <label for="send-whatsapp-akt" class="font-medium text-gray-900 dark:text-gray-100 select-none cursor-pointer">
              Kirim Notifikasi WhatsApp
            </label>
            <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Kirim pesan WhatsApp ke semua pegawai yang terlibat dalam aktivitas ini.
            </p>
          </div>
        </div>
    </div>

    <!-- Tombol Simpan -->
    <div class="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
      <button type="button" @click="$emit('close')" class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors">
        Batal
      </button>
      <button type="submit" class="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-transparent rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105">
        {{ tipe }} Aktivitas
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch, computed, nextTick, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authStore = useAuthStore();
const toast = useToast();

const props = defineProps({
  initialData: { type: Object, default: null },
  teamList: { type: Array, required: true },
  projectList: { type: Array, required: true },
  pegawaiList: { type: Array, required: true },
  tipe: { type: String, required: true } 
});

const emit = defineEmits(['close', 'submit']);

// --- STATE ---
const isDropdownOpen = ref(false);
const searchQuery = ref('');
const searchInput = ref(null); 
const selectedMembers = ref([]); 
const includeHead = ref(false); 

const namaDokumenBaru = ref('');
const daftarDokumenWajib = ref([]);

// --- STATE FITUR BARU ---
const allActivities = ref([]); 
const isParentDropdownOpen = ref(false);
const parentSearchQuery = ref('');
const parentSearchInput = ref(null);

const form = reactive({
  namaAktivitas: '',
  deskripsi: '',
  teamId: '',
  projectId: '',
  useDateRange: false,
  useTime: false,
  tanggalMulai: '',
  tanggalSelesai: '',
  jamMulai: '',
  jamSelesai: '',
  idTimTerkait: [],
  sendWhatsapp: false,
  
  // Fitur Baru
  status: 'Belum Selesai',
  parentId: null,
  kalenderView: true // Default true sesuai request
});

const errors = reactive({
  namaAktivitas: null,
  teamId: null,
  projectId: null,
  tanggalMulai: null,
  tanggalSelesai: null,
  jamMulai: null,
  jamSelesai: null,
});

// --- COMPUTED ---

const daftarTim = computed(() => {
  // [MODIFIKASI] Logic Superadmin/Admin bisa melihat semua tim
  const userRole = authStore.user?.sistemRole?.namaRole;
  if (['Superadmin', 'Admin'].includes(userRole)) {
    return props.teamList;
  }
  
  // Logic existing untuk user biasa
  if (!props.teamList || !authStore.user?.teams) return [];
  const userTeamIds = authStore.user.teams.map(team => team.id);
  return props.teamList.filter(tim => userTeamIds.includes(tim.id));
});

const filteredProjects = computed(() => {
  if (!form.teamId || !props.projectList) return [];
  return props.projectList.filter(project => project.teamId === form.teamId);
});

// [FITUR BARU] Filter Parent berdasarkan Tim & Project yang dipilih
const filteredParents = computed(() => {
  // Hanya aktif jika project sudah dipilih
  if (!form.projectId) return [];
  
  let parents = allActivities.value.filter(act => {
    // 1. Harus di Project yang sama (otomatis tim sama)
    const matchProject = act.projectId === form.projectId;
    // 2. Tidak boleh memilih diri sendiri (saat edit)
    const notSelf = props.initialData ? act.id !== props.initialData.id : true;
    return matchProject && notSelf;
  });

  // Filter pencarian
  if (parentSearchQuery.value) {
    const q = parentSearchQuery.value.toLowerCase();
    parents = parents.filter(p => p.namaAktivitas.toLowerCase().includes(q));
  }

  return parents;
});

const getSelectedParentName = computed(() => {
  if (!form.parentId) return null;
  const found = allActivities.value.find(a => a.id === form.parentId);
  return found ? found.namaAktivitas : 'Aktivitas Tidak Ditemukan';
});

const kepalaKantorObj = computed(() => {
  if (!props.pegawaiList) return null;
  return props.pegawaiList.find(p => p.jabatan?.namaJabatan === 'Kepala Kantor');
});

const filteredMembers = computed(() => {
  const members = props.pegawaiList || [];
  const query = searchQuery.value.toLowerCase();
  if (!query) return members;
  return members.filter(user =>
    user.namaLengkap.toLowerCase().includes(query) || 
    user.username.toLowerCase().includes(query)
  );
});

const allFilteredSelected = computed(() => {
  if (filteredMembers.value.length === 0) return false;
  return filteredMembers.value.every(member => isSelected(member.id));
});

const selectAllText = computed(() => {
  return allFilteredSelected.value ? 'Batal Pilih Semua' : 'Pilih Semua (Hasil Pencarian)';
});

// --- METHODS ---

// [FITUR BARU] Fetch aktivitas untuk opsi parent
const fetchAllActivities = async () => {
  try {
    // Fetch data lengkap agar bisa filter by project_id & team_id di frontend
    // Gunakan limit besar agar semua opsi muncul
    const response = await axios.get(`${baseURL}/api/aktivitas?limit=5000`);
    allActivities.value = response.data.items || [];
  } catch (e) {
    console.error("Gagal load aktivitas:", e);
  }
};

const toggleParentDropdown = () => {
  if (!form.projectId) return; // Disable jika belum pilih project
  isParentDropdownOpen.value = !isParentDropdownOpen.value;
  if (isParentDropdownOpen.value) {
    nextTick(() => parentSearchInput.value?.focus());
  }
};

const closeParentDropdown = () => {
  isParentDropdownOpen.value = false;
};

const selectParent = (act) => {
  form.parentId = act ? act.id : null;
  closeParentDropdown();
};

const toggleDropdown = () => { 
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) {
    nextTick(() => {
      searchInput.value?.focus();
    });
  }
};

const isSelected = (id) => selectedMembers.value.some(member => member.id === id);

const selectMember = (user) => {
  if (!isSelected(user.id)) {
    selectedMembers.value.push(user);
  } else {
    removeMember(user.id);
  }
};

const removeMember = (id) => {
  selectedMembers.value = selectedMembers.value.filter(member => member.id !== id);
};

const toggleSelectAllMembers = () => {
  if (allFilteredSelected.value) {
    const visibleIds = filteredMembers.value.map(u => u.id);
    selectedMembers.value = selectedMembers.value.filter(m => !visibleIds.includes(m.id));
  } else {
    const newMembers = filteredMembers.value.filter(u => !isSelected(u.id));
    selectedMembers.value = [...selectedMembers.value, ...newMembers];
  }
};

const addMembersByTeam = (targetTeamId) => {
  if (!targetTeamId) return;
  targetTeamId = parseInt(targetTeamId);
  const membersToAdd = props.pegawaiList.filter(user => 
    user.teams && user.teams.some(t => t.id === targetTeamId)
  );

  if (membersToAdd.length === 0) {
    toast.info("Tidak ada anggota tim yang ditemukan (data belum dimuat).");
    return;
  }

  const newOnes = membersToAdd.filter(u => !isSelected(u.id));
  selectedMembers.value = [...selectedMembers.value, ...newOnes];
  toast.success(`Menambahkan ${newOnes.length} anggota.`);
};

const tambahDokumen = () => {
  if (namaDokumenBaru.value.trim()) {
    daftarDokumenWajib.value.push(namaDokumenBaru.value.trim());
    namaDokumenBaru.value = '';
  }
};
const hapusDokumen = (index) => {
  daftarDokumenWajib.value.splice(index, 1);
};

const validate = () => {
  Object.keys(errors).forEach(key => errors[key] = null);
  let isValid = true;

  if (!form.namaAktivitas) { errors.namaAktivitas = 'Wajib diisi.'; isValid = false; }
  if (!form.teamId) { errors.teamId = 'Wajib dipilih.'; isValid = false; }
  if (form.teamId && !form.projectId) { errors.projectId = 'Wajib dipilih.'; isValid = false; }
  
  if (!form.tanggalMulai) { errors.tanggalMulai = 'Wajib diisi.'; isValid = false; }
  
  if (form.useDateRange) {
    if (!form.tanggalSelesai) { errors.tanggalSelesai = 'Wajib diisi.'; isValid = false; }
    if (form.tanggalMulai && form.tanggalSelesai && form.tanggalSelesai < form.tanggalMulai) {
      errors.tanggalSelesai = 'Tanggal selesai tidak boleh sebelum mulai.';
      isValid = false;
    }
  }

  if (form.useTime) {
    if (!form.jamMulai) { errors.jamMulai = 'Wajib diisi.'; isValid = false; }
    if (!form.jamSelesai) { errors.jamSelesai = 'Wajib diisi.'; isValid = false; }
    
    const isSameDay = !form.useDateRange || (form.useDateRange && form.tanggalMulai === form.tanggalSelesai);
    if (form.jamMulai && form.jamSelesai && isSameDay && form.jamSelesai <= form.jamMulai) {
      errors.jamSelesai = 'Jam selesai harus setelah jam mulai.';
      isValid = false;
    }
  }
  return isValid;
};

const handleSubmit = () => {
  if (validate()) {
    const payload = {
      ...form,
      // Handle nullable fields for empty strings
      tanggalSelesai: form.tanggalSelesai === '' ? null : form.tanggalSelesai,
      jamMulai: form.jamMulai === '' ? null : form.jamMulai,
      jamSelesai: form.jamSelesai === '' ? null : form.jamSelesai,

      daftarDokumenWajib: daftarDokumenWajib.value,
      anggota_aktivitas_ids: selectedMembers.value.map(m => m.id),
      sendWhatsapp: form.sendWhatsapp,
      idTimTerkait: form.idTimTerkait, 

      melibatkanKepala: false 
    };
    emit('submit', payload);
  }
};

// --- WATCHERS & INIT ---

onMounted(() => {
  fetchAllActivities();
});

watch(includeHead, (val) => {
  const kaban = kepalaKantorObj.value;
  if (!kaban) return;

  if (val) {
    if (!isSelected(kaban.id)) selectedMembers.value.push(kaban);
  } else {
    removeMember(kaban.id);
  }
});

watch(selectedMembers, (newMembers) => {
  const kaban = kepalaKantorObj.value;
  if (kaban) {
    const kabanExists = newMembers.some(m => m.id === kaban.id);
    if (includeHead.value !== kabanExists) {
      includeHead.value = kabanExists;
    }
  }
}, { deep: true });

watch(() => form.teamId, (newId, oldId) => {
  if (newId !== oldId && props.tipe === 'Buat') { 
    form.projectId = '';
    form.parentId = null; // Reset parent jika tim berubah
  }
});

watch(() => form.projectId, (newVal) => {
  if (props.tipe === 'Buat') {
    form.parentId = null; // Reset parent jika project berubah
  }
});

watch(() => form.useDateRange, (val) => { if(!val) form.tanggalSelesai = ''; });

// INISIALISASI DATA (Edit Mode)
watch(() => props.initialData, (newData) => {
  Object.assign(form, {
    namaAktivitas: '', deskripsi: '', teamId: '', projectId: '',
    useDateRange: false, useTime: false, tanggalMulai: '', tanggalSelesai: '', 
    jamMulai: '', jamSelesai: '', idTimTerkait: [],
    // Defaults baru
    status: 'Belum Selesai', parentId: null, kalenderView: true
  });
  daftarDokumenWajib.value = [];
  selectedMembers.value = [];
  includeHead.value = false;

  if (newData) {
    form.namaAktivitas = newData.namaAktivitas || '';
    form.deskripsi = newData.deskripsi || '';
    form.teamId = newData.teamId || '';
    form.projectId = newData.projectId || '';
    
    // Mapping Data Baru
    form.status = newData.status || 'Belum Selesai';
    form.parentId = newData.parentId || newData.parent_id || null;
    form.kalenderView = (newData.kalenderView !== undefined) ? newData.kalenderView : 
                        (newData.kalender_view !== undefined) ? newData.kalender_view : true;

    // Mapping timTerkait (camelCase from API) -> form.idTimTerkait (camelCase frontend)
    form.idTimTerkait = newData.timTerkait 
      ? newData.timTerkait.map(t => t.id) 
      : [];

    // Fallback for snake_case just in case
    if (form.idTimTerkait.length === 0 && newData.tim_terkait) {
      form.idTimTerkait = newData.tim_terkait.map(t => t.id);
    }

    const isRange = !!newData.tanggalSelesai;
    form.useDateRange = isRange;
    form.tanggalMulai = newData.tanggalMulai ? newData.tanggalMulai.split('T')[0] : '';
    form.tanggalSelesai = isRange && newData.tanggalSelesai ? newData.tanggalSelesai.split('T')[0] : '';

    form.useTime = !!newData.jamMulai;
    form.jamMulai = newData.jamMulai || '';
    form.jamSelesai = newData.jamSelesai || '';
    
    daftarDokumenWajib.value = newData.daftarDokumenWajib ? newData.daftarDokumenWajib.map(d => d.namaDokumen) : [];
    selectedMembers.value = newData.users ? [...newData.users] : [];

    form.sendWhatsapp = false;
  } else {
    form.sendWhatsapp = false;
  }
}, { immediate: true });

// --- DIRECTIVE CLICK OUTSIDE (Sederhana) ---
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
};
</script>

<style scoped>
/* Transitions */
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

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.25s ease-out;
  max-height: 100px;
  opacity: 1;
}
.slide-up-enter-from, .slide-up-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(5px);
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.95);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.scale-enter-active {
  transition: all 0.2s ease;
}
.scale-enter-from {
  opacity: 0;
  transform: scale(0);
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}
</style>