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
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 text-left align-middle shadow-2xl transition-all relative">
              
              <!-- Tombol Close (Pojok Kanan Atas) -->
              <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- Konten Tutorial -->
              <div class="mt-2 text-center">
                
                <!-- Ilustrasi / Icon Besar -->
                <div class="mb-6 flex justify-center">
                  <div class="w-24 h-24 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-6xl animate-bounce-slow">
                    {{ steps[currentStep].icon }}
                  </div>
                </div>

                <DialogTitle as="h3" class="text-2xl font-bold leading-6 text-gray-900 dark:text-white mb-3">
                  {{ steps[currentStep].title }}
                </DialogTitle>
                
                <div class="mt-2">
                  <p class="text-base text-gray-500 dark:text-gray-300 leading-relaxed">
                    {{ steps[currentStep].description }}
                  </p>
                </div>

                <!-- Indikator Step (Dots) -->
                <div class="flex justify-center gap-2 mt-8 mb-4">
                  <span 
                    v-for="(step, index) in steps" 
                    :key="index"
                    class="h-2 rounded-full transition-all duration-300"
                    :class="index === currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300 dark:bg-gray-600'"
                  ></span>
                </div>

              </div>

              <!-- Navigasi Bawah -->
              <div class="mt-8 flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-6">
                
                <!-- Tombol Skip/Back -->
                <button 
                  v-if="currentStep > 0"
                  @click="prevStep"
                  class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Kembali
                </button>
                <button 
                  v-else
                  @click="closeModal"
                  class="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  Lewati
                </button>

                <div class="flex gap-3">
                  <!-- Tombol Download Buku Panduan (Hanya di step terakhir) -->
                  <a 
                    v-if="currentStep === steps.length - 1"
                    href="/BukuPedoman.pdf" 
                    target="_blank"
                    class="inline-flex justify-center rounded-xl border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 transition-all"
                  >
                    📚 Unduh Buku Panduan
                  </a>

                  <!-- Tombol Next/Finish -->
                  <button
                    @click="nextStep"
                    class="inline-flex justify-center rounded-xl border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all shadow-lg shadow-blue-500/30"
                  >
                    {{ currentStep === steps.length - 1 ? 'Mulai Bekerja 🚀' : 'Lanjut' }}
                  </button>
                </div>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const currentStep = ref(0);

const steps = [
  {
    icon: '👋',
    title: 'Selamat Datang di SINERGI',
    description: 'Sistem Informasi Manajemen Aktivitas Harian dan Pengumpulan Dokumen Pegawai. Aplikasi ini dirancang untuk mempermudah pencatatan aktivitas harian, pengelolaan tim, pemantauan project tim, dan pengarsipan dokumen.'
  },
  {
    icon: '👤',
    title: 'Lengkapi Profil Anda',
    description: 'Langkah pertama yang penting: Pastikan Nomor HP Anda sudah terdaftar di menu Profil. Ini memungkinkan Anda menerima notifikasi WhatsApp real-time untuk tugas dan pengingat penting.'
  },
  {
    icon: '👥',
    title: 'Definisikan Tim dan Project',
    description: 'Pastikan Anda sudah terdaftar dalam tim Anda untuk dapat melakukan pencatatan aktivitas. Jika belum, silakan menghubungi ketua tim atau operator tim Anda untuk ditambahkan ke dalam tim.'
  },
  {
    icon: '📝',
    title: 'Catat Aktivitas Harian',
    description: 'Gunakan tombol "+ Buat Aktivitas" di Dashboard atau halaman Aktivitas untuk melaporkan kegiatan Anda. Anda bisa melampirkan dokumen pendukung berupa file PDF atau foto.'
  },
  {
    icon: '🚀',
    title: 'Kolaborasi Tim & Project',
    description: 'Pantau pekerjaan tim Anda melalui menu Kalender, Tim, dan Project. Anda bisa melihat progres rekan kerja, berbagi dokumen, dan mengatur tenggat waktu bersama-sama.'
  },
  {
    icon: '📚',
    title: 'Siap Memulai?',
    description: 'Anda sudah siap! Jika butuh panduan lebih detail, Anda bisa membuka Buku Pedoman Penggunaan lengkap melalui tombol di bawah ini.'
  }
];

// Reset step saat modal dibuka kembali
watch(() => props.isOpen, (val) => {
  if (val) currentStep.value = 0;
});

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  } else {
    closeModal();
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.animate-bounce-slow {
  animation: bounce 3s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
  50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
}
</style>