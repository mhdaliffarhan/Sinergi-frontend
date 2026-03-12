<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/90 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-500 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-300 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-sm transform overflow-hidden transition-all text-left align-middle flex flex-col gap-4">
              <!-- THE WRAPPED CARD (9:16 ASPECT RATIO) -->
              <div id="wrapped-card" class="relative bg-white rounded-3xl overflow-hidden flex flex-col items-center shadow-2xl" style="aspect-ratio: 9/16; width: 100%;">
                
                <!-- TOP HEADER BAR -->
                <div class="w-full h-2 bg-blue-600"></div>

                <div class="p-8 w-full flex flex-col h-full">
                  <!-- LOGO & YEAR -->
                  <div class="flex justify-between items-start mb-8">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">S</div>
                      <div class="flex flex-col">
                        <span class="text-gray-900 font-black text-xs uppercase leading-none">SATSET</span>
                        <span class="text-blue-600 font-bold text-[8px] uppercase tracking-widest">Dashboard</span>
                      </div>
                    </div>
                    <div class="bg-gray-100 px-3 py-1 rounded-full">
                      <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ data?.year }} WRAPPED</span>
                    </div>
                  </div>

                  <!-- TITLE -->
                  <div class="mb-10">
                    <h2 class="text-4xl font-black text-gray-900 leading-none">Pencapaian<br/><span class="text-blue-600">Terbanyak.</span></h2>
                    <p class="text-gray-400 text-xs mt-4 font-medium uppercase tracking-widest">Rekap Perjalanan Tahunan</p>
                  </div>

                  <!-- CONTENT AREA -->
                  <div class="flex-grow space-y-8 w-full">
                    
                    <!-- BIG STAT -->
                    <div class="flex flex-col">
                       <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Aktivitas</span>
                       <div class="text-7xl font-black text-gray-900 -ml-1">{{ data?.totalAktivitasTahunIni || 0 }}</div>
                       <p class="text-xs text-gray-500 mt-2 italic">Aktivitas yang telah Anda selesaikan tahun ini.</p>
                    </div>

                    <!-- TOP PROJECTS LIST -->
                    <div class="space-y-4">
                       <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Proyek Paling Aktif</span>
                       <div class="space-y-3">
                          <div v-for="(p, idx) in sortedProjects" :key="idx" class="flex items-center justify-between group">
                            <div class="flex items-center gap-3 overflow-hidden">
                              <span class="text-xl font-black text-blue-100 group-hover:text-blue-200 transition-colors">{{ idx + 1 }}</span>
                              <span class="text-sm font-bold text-gray-700 truncate">{{ p.namaProject }}</span>
                            </div>
                            <span class="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{{ p.count }}</span>
                          </div>
                          <div v-if="!data?.topProjects?.length" class="text-gray-300 text-[10px] uppercase font-bold italic py-2">Belum ada proyek...</div>
                       </div>
                    </div>

                    <!-- TEAMS PROGRESS -->
                    <div class="pt-4">
                       <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Kontribusi Tim</span>
                       <div class="flex flex-wrap gap-2">
                          <div v-for="team in data?.aktivitasPerTim" :key="team.namaTim" 
                               class="bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl flex flex-col">
                             <span class="text-[9px] font-bold text-gray-400 truncate max-w-[80px]">{{ team.namaTim }}</span>
                             <span class="text-sm font-black text-gray-900">{{ team.count }}</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <!-- FOOTER -->
                  <div class="mt-8 pt-8 border-t border-gray-100 flex flex-col items-center">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Sinergi Dalam Aksi</p>
                    <div class="flex items-center gap-1 opacity-20">
                      <div class="w-1 h-1 rounded-full bg-blue-600"></div>
                      <div class="w-1 h-1 rounded-full bg-blue-600"></div>
                      <div class="w-1 h-1 rounded-full bg-blue-600"></div>
                    </div>
                  </div>
                </div>

                <!-- WATERMARK -->
                <div class="absolute bottom-6 right-6 opacity-5 pointer-events-none select-none">
                   <h1 class="text-6xl font-black italic">SATSET</h1>
                </div>
              </div>

              <!-- ACTIONS (OUTSIDE CARD) -->
              <div class="flex gap-2">
                <button 
                  @click="downloadAsImage" 
                  :disabled="isGenerating"
                  class="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 rounded-3xl shadow-xl transition-all flex items-center justify-center gap-2 border border-gray-100 active:scale-95 disabled:opacity-50"
                >
                   <span v-if="isGenerating" class="animate-spin">🌀</span>
                   <span v-else>💾 Simpan & Bagikan</span>
                </button>
                <button 
                  @click="closeModal" 
                  class="w-16 bg-gray-800 text-white font-bold py-4 rounded-3xl shadow-xl transition-all flex items-center justify-center active:scale-95"
                >
                   ✕
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'
import { toPng } from 'html-to-image/lib/index'
import { useToast } from 'vue-toastification'

const props = defineProps({
  isOpen: Boolean,
  data: Object
})

const emit = defineEmits(['close'])
const toast = useToast()
const isGenerating = ref(false)

const sortedProjects = computed(() => {
  if (!props.data?.topProjects) return []
  return [...props.data.topProjects].sort((a, b) => b.count - a.count)
})

const closeModal = () => {
  emit('close')
}

const downloadAsImage = async () => {
  isGenerating.value = true
  try {
    const node = document.getElementById('wrapped-card')
    if (!node) throw new Error('Elemen tidak ditemukan')
    
    // Konfigurasi untuk Story IG/WA (Tinggi & Beresolusi Baik)
    const dataUrl = await toPng(node, {
      pixelRatio: 3, // High quality
      backgroundColor: '#ffffff',
      cacheBust: true,
    })

    const link = document.createElement('a')
    link.download = `SATSET-Wrapped-${new Date().getFullYear()}.png`
    link.href = dataUrl
    link.click()
    
    toast.success('Pencapaian Anda telah diunduh! 🚀')
  } catch (err) {
    console.error('Download error:', err)
    toast.error('Gagal mengunduh gambar.')
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
#wrapped-card {
  font-family: 'Inter', sans-serif;
}

/* Custom shadow for premium feel */
.shadow-2xl {
  shadow-color: rgba(30, 64, 175, 0.1);
}
</style>
