<template>
  <div class="p-1 text-gray-800 dark:text-gray-200">
    
    <!-- PILIHAN TIPE INPUT -->
    <div v-if="!inputType" class="grid grid-cols-2 gap-4 mb-6">
      <button 
        @click="inputType = 'FILE'"
        class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
      >
        <span class="text-4xl mb-2 group-hover:scale-110 transition-transform">📄</span>
        <span class="font-bold text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Upload File</span>
        <span class="text-xs text-gray-400 text-center mt-1">PDF, Gambar, Dokumen Office, zip, dll</span>
      </button>

      <button 
        @click="inputType = 'LINK'"
        class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
      >
        <span class="text-4xl mb-2 group-hover:scale-110 transition-transform">🔗</span>
        <span class="font-bold text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Tambah Link</span>
        <span class="text-xs text-gray-400 text-center mt-1">Google Drive, Website, dll</span>
      </button>
    </div>

    <!-- FORM INPUT -->
    <div v-else>
      <button @click="inputType = null" class="mb-4 text-xs text-blue-600 hover:underline flex items-center">
        &larr; Kembali pilih jenis
      </button>

      <!-- MODE FILE -->
      <div v-if="inputType === 'FILE'" class="mb-6">
        
        <!-- INFO KETENTUAN (TAMPILAN DIPERBAIKI) -->
        <div class="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
           <div class="flex items-start gap-3">
              <span class="text-xl">ℹ️</span>
              <div class="text-blue-800 dark:text-blue-200">
                 <p class="font-bold mb-1">Ketentuan Upload:</p>
                 <ul class="list-disc list-inside space-y-0.5 text-xs text-blue-700 dark:text-blue-300">
                    <li>Gambar (JPG/PNG) akan <strong>dikompres otomatis</strong>.</li>
                    <li>PDF maksimal <strong>5 MB</strong>.</li>
                    <li>File lainnya maksimal <strong>10 MB</strong>.</li>
                 </ul>
              </div>
           </div>
        </div>

        <div 
          class="border-2 border-dashed rounded-xl p-6 text-center transition-all relative overflow-hidden"
          :class="isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="!isProcessing && $refs.fileInput.click()"
        >
          <!-- Loading Overlay -->
          <div v-if="isProcessing" class="absolute inset-0 bg-white/90 dark:bg-gray-800/90 z-10 flex flex-col items-center justify-center">
             <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
             <p class="text-xs font-bold text-blue-600 animate-pulse">Mengoptimalkan File...</p>
          </div>

          <input type="file" ref="fileInput" class="hidden" @change="handleFileSelect" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip,.rar" />
          
          <div v-if="selectedFiles.length === 0" class="py-4 cursor-pointer">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
              Klik atau Drag & Drop file di sini
            </p>
          </div>
          <div v-else class="text-left space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
            <div v-for="(file, idx) in selectedFiles" :key="idx" class="flex justify-between items-center text-sm bg-white dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600">
              <div class="flex items-center gap-2 overflow-hidden max-w-[85%]">
                <span class="truncate font-medium">{{ file.name }}</span>
                <span v-if="file.isCompressed" class="text-[10px] bg-green-100 text-green-700 px-1 rounded font-bold">KOMPRES</span>
                <span class="text-xs text-gray-400">({{ formatFileSize(file.size) }})</span>
              </div>
              <button @click.stop="removeFile(idx)" class="text-red-500 hover:text-red-700 font-bold px-2">&times;</button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODE LINK -->
      <div v-if="inputType === 'LINK'" class="mb-6 space-y-3">
        <div>
          <label class="block text-sm font-medium mb-1">URL / Tautan <span class="text-red-500">*</span></label>
          <input 
            v-model="linkUrl" 
            type="url" 
            placeholder="https://..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Judul Link <span class="text-red-500">*</span></label>
          <input 
            v-model="linkTitle" 
            type="text" 
            placeholder="Contoh: Folder Drive Foto"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <!-- TARGET SIMPAN -->
      <div class="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 class="font-bold text-sm">Simpan Ke:</h4>
        
        <div class="grid grid-cols-1 gap-3">
          <!-- Opsi Checklist -->
          <div class="space-y-2">
            <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" :class="targetType === 'checklist' ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'">
              <input type="radio" v-model="targetType" value="checklist" class="mr-3">
              <span class="font-medium text-sm">Checklist Dokumen Wajib</span>
            </label>
            
            <div v-if="targetType === 'checklist'" class="ml-7 animate-fade-in">
              <select 
                v-model="selectedChecklistId" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none"
              >
                <option :value="null" disabled>-- Pilih Item Checklist --</option>
                <option v-for="item in checklistOptions" :key="item.id" :value="item.id">
                  {{ item.namaDokumen }} {{ item.files && item.files.length > 0 ? '✅' : '' }}
                </option>
              </select>
            </div>
          </div>

          <!-- Opsi Dokumen Lain -->
          <div class="space-y-2">
            <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" :class="targetType === 'other' ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'">
              <input type="radio" v-model="targetType" value="other" class="mr-3">
              <span class="font-medium text-sm">Dokumen & Materi Lainnya</span>
            </label>

            <div v-if="targetType === 'other'" class="ml-7 space-y-3 animate-fade-in">
              <div v-if="existingGroups.length > 0">
                <p class="text-xs text-gray-500 mb-1">Pilih Grup:</p>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="group in existingGroups" 
                    :key="group"
                    type="button"
                    @click="customKeterangan = group"
                    class="px-3 py-1 text-xs rounded-full border transition-colors"
                    :class="customKeterangan === group 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500 hover:border-blue-400'"
                  >
                    {{ group }}
                  </button>
                </div>
              </div>

              <div>
                <p class="text-xs text-gray-500 mb-1">Atau Buat Baru:</p>
                <input 
                  v-model="customKeterangan" 
                  type="text" 
                  placeholder="Nama Keterangan / Grup..."
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TOMBOL AKSI -->
      <div class="mt-6 flex justify-end gap-3">
        <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition" :disabled="isProcessing">Batal</button>
        <button 
          type="button"
          @click="submitForm"
          :disabled="!isFormValid || isProcessing"
          class="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <span v-if="isProcessing" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ isProcessing ? 'Memproses...' : 'Simpan' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import imageCompression from 'browser-image-compression';

const props = defineProps({
  files: { type: Array, default: () => [] },
  linkData: { type: Object, default: null }, 
  checklistOptions: { type: Array, default: () => [] },
  existingGroups: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'submit']);
const toast = useToast();

// State UI
const inputType = ref(null); // 'FILE' | 'LINK' | null
const targetType = ref(props.checklistOptions.length > 0 ? 'checklist' : 'other');
const selectedChecklistId = ref(null);
const customKeterangan = ref('');
const isDragging = ref(false);
const isProcessing = ref(false); // State untuk loading kompresi

// Data Input
const selectedFiles = ref([]);
const linkUrl = ref('');
const linkTitle = ref('');

// Constants Validasi
const MAX_PDF_SIZE_MB = 5;
const MAX_OTHER_SIZE_MB = 10;
const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;
const MAX_OTHER_SIZE_BYTES = MAX_OTHER_SIZE_MB * 1024 * 1024;

/**
 * FUNGSI UTAMA: Proses File (Validasi & Kompresi)
 */
const processFile = async (file) => {
  // 1. Gambar (JPG/PNG) -> Kompresi
  if (file.type.startsWith('image/')) {
    try {
      const options = {
        maxSizeMB: 1,           // Target max 1MB
        maxWidthOrHeight: 1920, // Resize dimensi aman
        useWebWorker: true,
        fileType: file.type
      };
      
      const compressedBlob = await imageCompression(file, options);
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
        lastModified: Date.now()
      });
      
      compressedFile.isCompressed = true; // Flag untuk UI
      return compressedFile;

    } catch (error) {
      console.warn(`Gagal kompresi ${file.name}, pakai file asli.`);
      return file;
    }
  }
  
  // 2. PDF -> Validasi Ukuran
  else if (file.type === 'application/pdf') {
    if (file.size > MAX_PDF_SIZE_BYTES) {
      toast.error(`PDF "${file.name}" terlalu besar! Maks ${MAX_PDF_SIZE_MB}MB.`);
      return null; // Reject
    }
    return file;
  }
  
  // 3. File Lain -> Validasi Ukuran
  else {
    if (file.size > MAX_OTHER_SIZE_BYTES) {
      toast.error(`File "${file.name}" terlalu besar! Maks ${MAX_OTHER_SIZE_MB}MB.`);
      return null; // Reject
    }
    return file;
  }
};

// Handlers File (Async untuk proses kompresi)
const handleFileSelect = async (e) => {
  const filesRaw = Array.from(e.target.files);
  if (filesRaw.length === 0) return;
  
  await processFilesAndAdd(filesRaw);
  e.target.value = ''; // Reset input agar bisa select file sama
};

const handleDrop = async (e) => {
  isDragging.value = false;
  const filesRaw = Array.from(e.dataTransfer.files);
  if (filesRaw.length === 0) return;

  await processFilesAndAdd(filesRaw);
};

const processFilesAndAdd = async (filesRaw) => {
  isProcessing.value = true;
  try {
    const promises = filesRaw.map(f => processFile(f));
    const results = await Promise.all(promises);
    const validFiles = results.filter(f => f !== null);
    
    selectedFiles.value = [...selectedFiles.value, ...validFiles];
    
    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} file berhasil ditambahkan.`);
    }
  } catch (err) {
    console.error(err);
    toast.error("Gagal memproses file.");
  } finally {
    isProcessing.value = false;
  }
};

const removeFile = (index) => selectedFiles.value.splice(index, 1);

// Helpers Formatter
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Validasi Form
const isFormValid = computed(() => {
  if (inputType.value === 'FILE' && selectedFiles.value.length === 0) return false;
  if (inputType.value === 'LINK' && (!linkUrl.value || !linkTitle.value)) return false;

  if (targetType.value === 'checklist') return !!selectedChecklistId.value;
  if (targetType.value === 'other') return !!customKeterangan.value?.trim();

  return false;
});

const submitForm = () => {
  if (!isFormValid.value) return;

  const payload = {
    type: inputType.value,
    files: inputType.value === 'FILE' ? selectedFiles.value : [],
    linkData: inputType.value === 'LINK' ? { url: linkUrl.value, title: linkTitle.value } : null,
    
    targetType: targetType.value,
    checklistItemId: targetType.value === 'checklist' ? selectedChecklistId.value : null,
    keterangan: targetType.value === 'other' ? customKeterangan.value : null
  };
  
  emit('submit', payload);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>