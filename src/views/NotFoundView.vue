<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
    <div class="max-w-md w-full">
      <svg class="w-40 h-40 mx-auto text-blue-500" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
      
      <h1 class="mt-8 text-5xl font-extrabold text-gray-900 dark:text-white">
        404
      </h1>
      <h2 class="mt-2 text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Halaman Tidak Ditemukan
      </h2>
      <p class="mt-4 text-gray-500 dark:text-gray-400">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      
      <div class="mt-8">
        <router-link 
          to="/dashboard" 
          class="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
          Kembali ke Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// Tidak perlu script khusus untuk halaman ini
</script>