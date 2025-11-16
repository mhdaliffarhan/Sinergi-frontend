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
        </div>
        <Transition name="fade-bounce">
          <div 
            v-if="!authStore.user?.nohp" 
            class="bg-red-50 dark:bg-red-900/40 border-l-4 border-red-400 text-red-800 dark:text-red-200 p-4 rounded-lg shadow-md" 
            role="alert"
          >
            <p class="font-bold">Harap Lengkapi Profil Anda</p>
            <p class="text-sm">
              Anda harus mengisi No. HP (WhatsApp) untuk dapat menggunakan fitur notifikasi dan mengakses menu lainnya. Silakan klik "✏️ Edit" pada kartu "Informasi Akun" di bawah.
            </p>
          </div>
        </Transition>
      </div>

      <!-- Konten utama: Informasi Akun & Ganti Password -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Card 1: Informasi Akun -->
        <div
          class="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl rounded-2xl p-6 sm:p-8 transition-all duration-300 border border-gray-100 dark:border-gray-700"
        >
          <div class="flex items-center justify-between mb-5">
            <h2
              class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2"
            >
              <span class="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              Informasi Akun
            </h2>
            <button
              @click="toggleEditMode"
              class="px-3 py-1 text-xs font-medium rounded-md"
              :class="isEditMode 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300' 
                : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200'"
            >
              {{ isEditMode ? 'Batal' : '✏️ Edit' }}
            </button>
          </div>

          <div v-if="!isEditMode" class="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
            <div class="pt-4 first:pt-0">
              <p class="text-gray-600 dark:text-gray-400 text-sm">Username</p>
              <p class="font-medium text-gray-900 dark:text-gray-100 break-words">
                {{ authStore.user?.username }}
              </p>
            </div>

            <div>
              <p class="text-gray-600 dark:text-gray-400 text-sm">Nama Lengkap</p>
              <p class="font-medium text-gray-900 dark:text-gray-100 break-words">
                {{ authStore.user?.namaLengkap }}
              </p>
            </div>

            <div>
              <p class="text-gray-600 dark:text-gray-400 text-sm">NIP</p>
              <p class="font-medium text-gray-900 dark:text-gray-100 break-words">
                {{ authStore.user?.nip || '-' }}
              </p>
            </div>

            <div>
              <p class="text-gray-600 dark:text-gray-400 text-sm">NIP BPS</p>
              <p class="font-medium text-gray-900 dark:text-gray-100 break-words">
                {{ authStore.user?.nipbps || '-' }}
              </p>
            </div>

            <div>
              <p class="text-gray-600 dark:text-gray-400 text-sm">No. HP (WA)</p>
              <p class="font-medium text-gray-900 dark:text-gray-100 break-words">
                {{ authStore.user?.nohp || '-' }}
              </p>
            </div>

            <div v-if="authStore.user?.sistemRole?.namaRole">
              <p class="text-gray-600 dark:text-gray-400 text-sm">Role Sistem</p>
              <p class="font-medium text-gray-900 dark:text-gray-100 capitalize">
                {{ authStore.user.sistemRole.namaRole }}
              </p>
            </div>

            <div
              v-for="(tim, index) in authStore.user?.teams"
              :key="index"
            >
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Tim {{ index + 1 }}
              </p>
              <p class="font-medium text-gray-900 dark:text-gray-100">
                {{ tim.namaTim }} ({{ tim.peran }})
              </p>
            </div>

          </div>

          <form v-else @submit.prevent="handleProfileUpdate" class="space-y-5">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
              <input
                v-model="profileForm.namaLengkap"
                type="text"
                required
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
              <p v-if="formErrors.namaLengkap" class="text-xs text-red-500 mt-1">
                {{ formErrors.namaLengkap }}
              </p>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">No. HP (WhatsApp)</label>
              <input
                v-model="profileForm.nohp"
                type="text"
                placeholder="Gunakan format 62..."
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
              <p v-if="formErrors.nohp" class="text-xs text-red-500 mt-1">
                {{ formErrors.nohp }}
              </p>
            </div>
            <button
              type="submit"
              class="w-full inline-flex justify-center py-3 px-6 text-sm font-semibold rounded-xl shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Simpan Perubahan
            </button>
          </form>

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
import { ref, watch } from "vue";
import axios from "axios";
import ProfilePicture from "@/components/profile/ProfilePicture.vue";
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authStore = useAuthStore();
const toast = useToast();

const form = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});


const isEditMode = ref(false);
const profileForm = ref({
  namaLengkap: authStore.user?.namaLengkap || '',
  nohp: authStore.user?.nohp || ''
});
const formErrors = ref({});

watch(() => authStore.user, (newUser) => {
  if (newUser && !isEditMode.value) {
    profileForm.value.namaLengkap = newUser.namaLengkap || '';
    profileForm.value.nohp = newUser.nohp || '';
  }
}, { immediate: true });

const toggleEditMode = () => {
  if (isEditMode.value) {
    // Jika Batal, kembalikan data form ke data asli dari store
    profileForm.value.namaLengkap = authStore.user?.namaLengkap || '';
    profileForm.value.nohp = authStore.user?.nohp || '';
  }
  isEditMode.value = !isEditMode.value;
};

const validateProfileForm = () => {
  formErrors.value = {}; // Reset errors
  const { namaLengkap, nohp } = profileForm.value;
  let isValid = true;

  if (!namaLengkap || namaLengkap.trim() === "") {
    formErrors.value.namaLengkap = "Nama lengkap tidak boleh kosong.";
    isValid = false;
  }

  // Validasi No. HP
  if (nohp && nohp.trim() !== "") {
    const nohpNumeric = nohp.replace(/\D/g, ''); // Hapus semua non-digit
    
    if (!nohpNumeric.startsWith('62')) {
      formErrors.value.nohp = 'No. HP harus diawali dengan 62 (misal: 62812...).';
      isValid = false;
    } else if (nohpNumeric.length < 12 || nohpNumeric.length > 14) {
      // 62 + 10-12 digit = 12-14 total
      formErrors.value.nohp = 'No. HP harus 12 hingga 14 digit.';
      isValid = false;
    }
  }
  
  return isValid;
};

const handleProfileUpdate = async () => {
  // Jalankan validasi frontend dulu
  if (!validateProfileForm()) {
    toast.error("Form tidak valid. Silakan periksa kembali isian Anda.");
    return;
  }

  try {
    // Siapkan payload (kita juga bersihkan nohp di sini)
    const payload = {
      nama_lengkap: profileForm.value.namaLengkap,
      nohp: profileForm.value.nohp ? profileForm.value.nohp.replace(/\D/g, '') : null
    };

    await axios.put(`${baseURL}/api/users/me/profile`, payload);
    
    await authStore.fetchUser(); 
    toast.success("Profil berhasil diperbarui!");
    isEditMode.value = false;
    formErrors.value = {}; // Bersihkan error

  } catch (err) {
    if (err.response?.status === 422) {
      // Tangkap error validasi dari Pydantic (Backend)
      err.response.data.detail.forEach(e => {
        const fieldName = e.loc[e.loc.length - 1]; // Ambil nama field
        if (formErrors.value.hasOwnProperty(fieldName)) {
          formErrors.value[fieldName] = e.msg; // Tampilkan pesan error dari backend
        }
      });
      toast.error("Data tidak valid, periksa pesan error di form.");
    } else {
      toast.error(err?.response?.data?.detail || "Gagal memperbarui profil.");
    }
  }
};

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

<style scoped>
.fade-bounce-enter-active {
  animation: bounce-in 0.5s ease;
}
.fade-bounce-leave-active {
  animation: bounce-in 0.3s ease reverse;
  opacity: 0;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  80% {
    transform: scale(1.02);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>