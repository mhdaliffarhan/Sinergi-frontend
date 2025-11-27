<template>
  <div class="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4">
    <div 
      class="absolute inset-0 bg-cover bg-center z-0"
      style="background-image: url('/kantor-bg.jpg');"
    ></div>
    
    <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 opacity-80 dark:opacity-90 z-10"></div>
    
    <div 
      :class="isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
      class="relative z-20 max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-2xl transition-all duration-500 ease-out"
    >
      
      <div v-if="!isSubmitted">
        <h2 class="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Reset Password Anda
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Masukkan username Anda. Kami akan mengirimkan link reset ke nomor WhatsApp Anda yang terdaftar.
        </p>

        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div v-if="errorMessage" class="p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-md">
            <p class="text-sm text-red-700 dark:text-red-300">{{ errorMessage }}</p>
          </div>

          <div class="relative">
            <input 
              id="username"
              type="text" 
              v-model="username"
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer"
              placeholder=" "
            />
            <label 
              for="username"
              class="absolute left-4 -top-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-1 transition-all
                     peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                     peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-400"
            >
              Username
            </label>
          </div>
          
          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                   bg-gradient-to-r from-blue-600 to-green-500 
                   hover:from-blue-700 hover:to-green-600 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {{ isLoading ? 'Memproses...' : 'Kirim Link Reset' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <router-link 
            to="/login" 
            class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            &larr; Kembali ke Login
          </router-link>
        </div>
        </div>
      
      <div v-else class="text-center space-y-4">
        <span class="text-7xl">📨</span>
        <h2 class="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Silakan Cek WhatsApp Anda
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Jika akun Anda terdaftar dengan nomor WA, Anda akan menerima link reset password yang berlaku selama 15 menit.
        </p>
        <router-link 
          to="/login" 
          class="inline-block pt-4 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; Kembali ke Login
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const toast = useToast();

const username = ref('');
const isLoading = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref(null);
const isMounted = ref(false); // Untuk animasi

onMounted(() => {
  setTimeout(() => { isMounted.value = true; }, 100);
});

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    // Panggil endpoint backend
    await axios.post(`${baseURL}/api/auth/forgot-password`, {
      username: username.value
    });
    
    // Apapun hasilnya, tampilkan pesan sukses (demi keamanan)
    isSubmitted.value = true;
    
  } catch (error) {
    // Kita tetap tampilkan sukses, tapi catat error di konsol untuk debugging
    console.error("Error forgot password:", error);
    isSubmitted.value = true; 
  } finally {
    isLoading.value = false;
  }
};
</script>