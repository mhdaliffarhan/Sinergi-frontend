<template>
  <div class="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
    
    <!-- BACKGROUND & OVERLAY -->
    <div class="absolute inset-0 z-0 overflow-hidden">
      <!-- Image Background -->
      <div 
        class="absolute inset-0 bg-cover bg-center transition-transform duration-[30s] ease-linear transform scale-110 hover:scale-100"
        style="background-image: url('/kantor-bg.jpg');"
      ></div>
      
      <!-- Gradient Overlay (Biru - Hijau - Nuansa Kuning/Emas Gelap) -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-green-900/90 to-yellow-900/80 backdrop-blur-sm"></div>
    </div>

    <!-- DECORATIVE BLOBS (Kuning - Hijau - Biru) -->
    <!-- Blob Biru (Kiri Atas) -->
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/40 rounded-full blur-3xl animate-pulse"></div>
    <!-- Blob Hijau (Kanan Atas/Tengah) -->
    <div class="absolute top-[20%] right-[-10%] w-80 h-80 bg-green-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>
    <!-- Blob Kuning (Bawah) -->
    <div class="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-yellow-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
    
    <!-- LOGIN CARD -->
    <div 
      :class="isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
      class="relative z-20 max-w-md w-full mx-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700 p-8 sm:p-10 rounded-3xl shadow-2xl transition-all duration-700 ease-out"
    >
      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <div class="inline-block p-3 rounded-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-700 dark:to-gray-600 mb-4 shadow-sm">
           <img class="h-16 w-auto" src="/logo.png" alt="Logo" />
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Selamat Datang
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Akses sistem <span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600">SINERGI</span> BPS NTB
        </p>
      </div>

      <!-- Alert Error -->
      <transition name="fade">
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
          <svg class="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p class="text-sm text-red-700 dark:text-red-200 font-medium">{{ errorMessage }}</p>
        </div>
      </transition>

      <!-- Form -->
      <form class="space-y-6" @submit.prevent="handleSubmit">
        
        <!-- Username Input -->
        <div class="space-y-1">
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Username</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input 
              id="username"
              type="text" 
              v-model="username"
              required
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 
                     hover:border-green-400 dark:hover:border-green-500
                     transition-all sm:text-sm"
              placeholder="Masukkan username Anda"
            />
          </div>
        </div>
        
        <!-- Password Input -->
        <div class="space-y-1">
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input 
              id="password"
              :type="showPassword ? 'text' : 'password'" 
              v-model="password"
              required
              class="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 
                     hover:border-green-400 dark:hover:border-green-500
                     transition-all sm:text-sm"
              placeholder="Masukkan password Anda"
            />
            <!-- Toggle Show Password -->
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-600 dark:hover:text-green-400 focus:outline-none transition-colors"
            >
              <svg v-if="!showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 013.999-5.325m-3.641-3.641L21 21m-2.458-6.138A10.05 10.05 0 0012 5c-1.39 0-2.733.29-3.953.815" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <div class="flex items-center">
            <input 
              id="remember-me" 
              v-model="rememberMe" 
              type="checkbox" 
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none group">
              <span class="group-hover:text-green-600 transition-colors">Ingat Saya</span>
            </label>
          </div>
          <div class="text-sm">
            <router-link 
              :to="{ name: 'forgot-password' }" 
              class="font-semibold text-blue-600 hover:text-green-600 dark:text-blue-400 dark:hover:text-green-400 transition-colors"
            >
              Lupa password?
            </router-link>
          </div>
        </div>
        
        <!-- BUTTON GRADIENT (Biru -> Hijau -> Kuning) -->
        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-green-500/20 text-sm font-bold text-white 
                 bg-gradient-to-r from-blue-600 via-green-500 to-yellow-500 
                 hover:from-blue-700 hover:via-green-600 hover:to-yellow-600 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                 disabled:opacity-70 disabled:cursor-not-allowed
                 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Masuk...
          </span>
          <span v-else>Masuk Sekarang</span>
        </button>
      </form>
      
      <!-- Footer Copyright -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-400 dark:text-gray-500">
          &copy; {{ new Date().getFullYear() }} Sinergi BPS NTB. All rights reserved.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router'; 

const authStore = useAuthStore();
const router = useRouter(); 

// State form
const username = ref('');
const password = ref('');
const rememberMe = ref(false); 
const showPassword = ref(false); 

// State UI
const errorMessage = ref(null);
const isLoading = ref(false);
const isMounted = ref(false); 

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true;
  }, 100);
});

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    await authStore.login(username.value, password.value, rememberMe.value);
    // Router push biasanya di handle di store, atau disini:
    // router.push({ name: 'dashboard' });
  } catch (error) {
    errorMessage.value = error.message || 'Username atau password salah. Silakan coba lagi.';
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Transisi Fade untuk Alert */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>