<template>
  <div
    class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
  >
    <div class="max-w-6xl mx-auto space-y-10">
      <!-- Header -->
      <div class="flex flex-col items-center text-center space-y-4">
        <ProfilePicture :user="authStore" />
        <div>
          <h1
            class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 transition-colors"
          >
            Profil Saya
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
            Kelola informasi akun dan keamanan Anda
          </p>
        </div>
      </div>

      <!-- Konten utama: Informasi Akun & Ganti Password -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Card 1: Informasi Akun -->
        <div
          class="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl rounded-2xl p-6 sm:p-8 transition-all duration-300 border border-gray-100 dark:border-gray-700"
        >
          <h2
            class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2"
          >
            <span class="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
            Informasi Akun
          </h2>

          <div class="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
            <div class="py-2">
              <p class="text-gray-600 dark:text-gray-400 text-sm">Username</p>
              <p
                class="font-medium text-gray-900 dark:text-gray-100 break-words"
              >
                {{ authStore.user?.username }}
              </p>
            </div>

            <div class="py-2">
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Nama Lengkap
              </p>
              <p
                class="font-medium text-gray-900 dark:text-gray-100 break-words"
              >
                {{ authStore.user?.namaLengkap }}
              </p>
            </div>

            <div
              v-if="user.role_sistem === 'admin' || user.role_sistem === 'superadmin'"
              class="py-2"
            >
              <p class="text-gray-600 dark:text-gray-400 text-sm">Role Sistem</p>
              <p class="font-medium text-gray-900 dark:text-gray-100 capitalize">
                {{ user.role_sistem }}
              </p>
            </div>

            <div
              v-for="(tim, index) in user.tim_aktif"
              :key="index"
              class="py-2"
            >
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Tim {{ index + 1 }}
              </p>
              <p class="font-medium text-gray-900 dark:text-gray-100">
                {{ tim.nama }} ({{ tim.jabatan }})
              </p>
            </div>
          </div>
        </div>

        <!-- Card 2: Ganti Password -->
        <div
          class="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl rounded-2xl p-6 sm:p-8 transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col justify-between"
        >
          <div>
            <h2
              class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2"
            >
              <span class="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
              Ganti Password
            </h2>

            <form @submit.prevent="updatePassword" class="space-y-5">
              <div class="space-y-2">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Password Lama</label
                >
                <input
                  v-model="form.oldPassword"
                  type="password"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white transition duration-200"
                />
              </div>

              <div class="space-y-2">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Password Baru</label
                >
                <input
                  v-model="form.newPassword"
                  type="password"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white transition duration-200"
                />
              </div>

              <div class="space-y-2">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Konfirmasi Password Baru</label
                >
                <input
                  v-model="form.confirmPassword"
                  type="password"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white transition duration-200"
                />
              </div>

              <button
                type="submit"
                class="w-full inline-flex justify-center py-3 px-6 text-sm font-semibold rounded-xl shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Simpan Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




<script setup>
import { ref } from "vue";
import axios from "axios";
import ProfilePicture from "@/components/profile/ProfilePicture.vue";
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authStore = useAuthStore();
const toast = useToast();
const user = ref({
  id: null,
  username: "",
  namaLengkap: "",
  roleSistem: "",
  foto_profil_url: "",
  tim_aktif: []
});

const form = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});


const updatePassword = async () => {
  if (form.value.newPassword !== form.value.confirmPassword) {
    toast.error("Password baru dan konfirmasi tidak cocok.");
    return;
  }
  if (form.value.newPassword.length < 8) {
    toast.error("Password baru harus minimal 8 karakter.");
    return;
  }
  const hasLetter = /[a-zA-Z]/.test(form.value.newPassword);
  const hasNumber = /[0-9]/.test(form.value.newPassword);
  if (!hasLetter || !hasNumber) {
    toast.error("Password baru harus mengandung huruf dan angka.");
    return;
  }
  try {
    await axios.put(`${baseURL}/api/users/${authStore.user.id}/password`, {
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword
    });
    toast.success("Password berhasil diperbarui");
    form.value = { oldPassword: "", newPassword: "", confirmPassword: "" };
  } catch (err) {
    toast.error(err?.response?.data?.detail || "Terjadi kesalahan");
  }
};

</script>
