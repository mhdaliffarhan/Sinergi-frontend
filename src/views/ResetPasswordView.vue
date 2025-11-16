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
          Atur Password Baru Anda
        </h2>
        
        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div v-if="errorMessage" class="p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-md">
            <p class="text-sm text-red-700 dark:text-red-300">{{ errorMessage }}</p>
          </div>

          <div class="relative">
            <input 
              id="new_password" 
              type="password" 
              v-model="newPassword" 
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg ... peer"
              placeholder=" "
            />
            <label 
              for="new_password"
              class="absolute left-4 -top-2.5 text-xs ... bg-white dark:bg-gray-800 px-1 ...
                     peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                     peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600 ..."
            >
              Password Baru (Min. 8 karakter)
            </label>
          </div>
          
          <div class="relative">
            <input 
              id="confirm_password" 
              type="password" 
              v-model="confirmPassword" 
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg ... peer"
              placeholder=" "
            />
            <label 
              for="confirm_password"
              class="absolute left-4 -top-2.5 text-xs ... bg-white dark:bg-gray-800 px-1 ...
                     peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                     peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600 ..."
            >
              Konfirmasi Password Baru
            </label>
          </div>
          
          <button 
            type="submit"
            :disabled="isLoading || !token"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                   bg-gradient-to-r from-blue-600 to-green-500 
                   hover:from-blue-700 hover:to-green-600 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {{ isLoading ? 'Menyimpan...' : 'Simpan Password Baru' }}
          </button>
        </form>
      </div>
      
      <div v-else class="text-center space-y-4">
        <span class="text-7xl">✅</span>
        <h2 class="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Password Berhasil Direset!
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Anda sekarang dapat login dengan password baru Anda.
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
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const router = useRouter();

const token = ref(null);
const newPassword = ref('');
const confirmPassword = ref('');

const isLoading = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref(null);
const isMounted = ref(false); // Untuk animasi

onMounted(() => {
  setTimeout(() => { isMounted.value = true; }, 100);
  
  // Ambil token dari URL query parameter
  token.value = route.query.token;
  if (!token.value) {
    errorMessage.value = "Token tidak ditemukan. Link mungkin tidak valid atau kedaluwarsa.";
  }
});

const handleSubmit = async () => {
  errorMessage.value = null;
  
  // Validasi frontend
  if (newPassword.value.length < 8) {
    errorMessage.value = "Password baru harus minimal 8 karakter.";
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "Password baru dan konfirmasi tidak cocok.";
    return;
  }
  if (!token.value) {
    errorMessage.value = "Token tidak valid. Silakan ulangi proses lupa password.";
    return;
  }
  
  isLoading.value = true;
  try {
    // Panggil endpoint backend
    await axios.post(`${baseURL}/api/auth/reset-password`, {
      token: token.value,
      new_password: newPassword.value
    });
    
    // Tampilkan pesan sukses
    isSubmitted.value = true;
    
  } catch (error) {
    errorMessage.value = error.response?.data?.detail || "Token tidak valid atau telah kedaluwarsa.";
  } finally {
    isLoading.value = false;
  }
};
</script>