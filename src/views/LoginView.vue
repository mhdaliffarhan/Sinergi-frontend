<template>
  <div class="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
    <div 
      class="absolute inset-0 bg-cover bg-center z-0"
      style="background-image: url('/kantor-bg.jpg');"
    ></div>
    
    <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 opacity-80 dark:opacity-90 z-10"></div>
    
    <div 
      :class="isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
      class="relative z-20 max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-2xl transition-all duration-500 ease-out"
    >
      <div>
        <img class="mx-auto h-20 w-auto" src="/logo.png" alt="SINERGI BPS NTB Logo" />
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Selamat Datang di SINERGI
        </h2>
      </div>

      <div class="space-y-6">
        <form class="space-y-6" @submit.prevent="handleSubmit">
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
          
          <div class="relative">
            <input 
              id="password"
              type="password" 
              v-model="password"
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer"
              placeholder=" "
            />
            <label 
              for="password"
              class="absolute left-4 -top-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-1 transition-all
                     peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                     peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-400"
            >
              Password
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember-me" 
                v-model="rememberMe" 
                type="checkbox" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Ingat Saya
              </label>
            </div>
            <div class="text-sm">
              <router-link 
                :to="{ name: 'forgot-password' }" 
                class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Lupa password?
              </router-link>
            </div>
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
            {{ isLoading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router'; // Impor useRouter

const authStore = useAuthStore();
const router = useRouter(); // Inisialisasi router

// State untuk form
const username = ref('');
const password = ref('');
const rememberMe = ref(false); // <-- State baru (Poin 2)

// State untuk UI
const errorMessage = ref(null);
const isLoading = ref(false);
const isMounted = ref(false); // Untuk animasi fade-in

onMounted(() => {
  // Tunda animasi 100ms agar terlihat
  setTimeout(() => {
    isMounted.value = true;
  }, 100);
});

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    // Panggil authStore.login dengan parameter rememberMe
    await authStore.login(username.value, password.value, rememberMe.value);
    
    // (Kita akan tambahkan logika 'paksa isi nohp' di langkah selanjutnya di router)
    
  } catch (error) {
    // Jika login gagal, authStore.login akan melempar error
    errorMessage.value = error.message || 'Username atau password salah.';
    isLoading.value = false;
  }
  
  // isLoading akan di-set ke false oleh authStore jika berhasil,
  // atau oleh blok catch jika gagal.
};
</script>