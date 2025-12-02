<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-4 sm:pt-6 font-sans transition-colors duration-300 relative overflow-hidden">
    
    <!-- BACKGROUND DECORATIONS -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl opacity-60 dark:opacity-20"></div>
        <div class="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-3xl opacity-60 dark:opacity-20"></div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="relative z-10 max-w-6xl mx-auto pb-20">
      
      <!-- HEADER PROFILE -->
      <div class="flex flex-col items-center text-center space-y-6 mb-12">
        <div class="relative group">
           <!-- Profile Ring -->
           <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
           <div class="relative p-1 bg-white dark:bg-gray-900 rounded-full">
             <ProfilePicture :user="authStore" class="w-32 h-32 sm:w-40 sm:h-40" />
           </div>
           <div class="absolute bottom-2 right-2 bg-green-500 border-4 border-white dark:border-gray-900 w-6 h-6 rounded-full" title="Online"></div>
        </div>

        <div>
          <h1 class="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {{ authStore.user?.namaLengkap || 'Pengguna' }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1 font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full inline-block text-sm">
            {{ authStore.user?.jabatan?.namaJabatan || 'Jabatan Tidak Diketahui' }}
          </p>
        </div>

        <!-- Alert No HP -->
        <Transition name="slide-fade">
          <div 
            v-if="!authStore.user?.nohp" 
            class="max-w-2xl w-full bg-red-50/90 dark:bg-red-900/20 backdrop-blur-sm border-l-4 border-red-500 text-red-800 dark:text-red-200 p-4 rounded-r-xl shadow-sm text-left flex items-start gap-3" 
            role="alert"
          >
            <div class="flex-shrink-0 mt-0.5">
               <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <p class="font-bold text-sm sm:text-base">Profil Belum Lengkap</p>
              <p class="text-xs sm:text-sm mt-1 opacity-90 leading-relaxed">
                Mohon lengkapi <strong>No. HP (WhatsApp)</strong> agar Anda dapat menerima notifikasi penting dan mengakses fitur tim. Klik tombol <span class="font-bold">Edit</span> di kartu Informasi Akun.
              </p>
            </div>
          </div>
        </Transition>
      </div>

      <!-- GRID CONTENT -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- CARD 1: INFORMASI AKUN -->
        <div class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700 overflow-hidden flex flex-col h-full">
          <!-- Decorative Top -->
          <div class="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          
          <div class="p-6 sm:p-8 flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-2xl">🆔</span> Informasi Akun
              </h2>
              <button
                @click="toggleEditMode"
                class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 border"
                :class="isEditMode 
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' 
                  : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'"
              >
                {{ isEditMode ? 'Batal Edit' : '✏️ Edit Profil' }}
              </button>
            </div>

            <!-- VIEW MODE -->
            <div v-if="!isEditMode" class="space-y-5 animate-fade-in">
              
              <div class="group">
                <p class="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Username</p>
                <div class="flex items-center gap-3">
                   <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                   </div>
                   <p class="font-mono text-gray-800 dark:text-gray-200 font-medium break-all">@{{ authStore.user?.username }}</p>
                </div>
              </div>

              <!-- PERBAIKAN: Menggunakan grid-cols-1 pada mobile agar tidak berhimpitan, sm:grid-cols-2 pada layar besar -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="group">
                  <p class="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">NIP</p>
                  <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                     <p class="font-medium text-gray-800 dark:text-gray-200 tracking-wide break-all">{{ authStore.user?.nip || '-' }}</p>
                  </div>
                </div>
                <div class="group">
                  <p class="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">NIP BPS</p>
                  <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                     <p class="font-medium text-gray-800 dark:text-gray-200 tracking-wide break-all">{{ authStore.user?.nipbps || '-' }}</p>
                  </div>
                </div>
              </div>

              <div class="group">
                <p class="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">WhatsApp</p>
                <div class="flex items-center gap-3">
                   <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                   </div>
                   <p class="font-mono text-gray-800 dark:text-gray-200 font-medium tracking-wide">
                     {{ authStore.user?.nohp || '-' }}
                   </p>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-100 dark:border-gray-700/50">
                 <p class="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Tim & Peran</p>
                 <div v-if="authStore.user?.teams?.length > 0" class="flex flex-wrap gap-2">
                    <span 
                      v-for="(tim, index) in authStore.user.teams" 
                      :key="index"
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {{ tim.namaTim }} ({{ tim.peran }})
                    </span>
                 </div>
                 <p v-else class="text-sm text-gray-400 italic">Belum tergabung dalam tim.</p>
              </div>

            </div>

            <!-- EDIT MODE -->
            <form v-else @submit.prevent="handleProfileUpdate" class="space-y-5 animate-fade-in">
              <div class="space-y-1">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Nama Lengkap</label>
                <input
                  v-model="profileForm.namaLengkap"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all sm:text-sm"
                />
                <p v-if="formErrors.namaLengkap" class="text-xs text-red-500 mt-1 ml-1">{{ formErrors.namaLengkap }}</p>
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">No. HP (WhatsApp)</label>
                <input
                  v-model="profileForm.nohp"
                  type="text"
                  placeholder="Contoh: 628123456789"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all sm:text-sm font-mono"
                />
                <p v-if="formErrors.nohp" class="text-xs text-red-500 mt-1 ml-1">{{ formErrors.nohp }}</p>
                <p class="text-[10px] text-gray-400 ml-1">Format: 628xxx (Tanpa spasi/dash)</p>
              </div>

              <div class="pt-4">
                <button
                  type="submit"
                  class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- CARD 2: GANTI PASSWORD -->
        <div class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700 overflow-hidden flex flex-col h-full">
          <!-- Decorative Top -->
          <div class="h-1.5 bg-gradient-to-r from-yellow-500 to-orange-500"></div>

          <div class="p-6 sm:p-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span class="text-2xl">🔒</span> Keamanan Akun
            </h2>

            <form @submit.prevent="updatePassword" class="space-y-5">
              
              <!-- Old Password -->
              <div class="space-y-1">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Password Lama</label>
                <div class="relative">
                  <input
                    v-model="form.oldPassword"
                    :type="showOldPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all sm:text-sm"
                    placeholder="Masukkan password lama"
                  />
                  <button type="button" @click="showOldPassword = !showOldPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg v-if="!showOldPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 013.999-5.325m-3.641-3.641L21 21m-2.458-6.138A10.05 10.05 0 0012 5c-1.39 0-2.733.29-3.953.815" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </button>
                </div>
              </div>

              <!-- New Password -->
              <div class="space-y-1">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Password Baru</label>
                <div class="relative">
                  <input
                    v-model="form.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all sm:text-sm"
                    placeholder="Minimal 8 karakter"
                  />
                  <button type="button" @click="showNewPassword = !showNewPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg v-if="!showNewPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 013.999-5.325m-3.641-3.641L21 21m-2.458-6.138A10.05 10.05 0 0012 5c-1.39 0-2.733.29-3.953.815" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </button>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-1">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Konfirmasi Password Baru</label>
                <div class="relative">
                  <input
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all sm:text-sm"
                    placeholder="Ulangi password baru"
                  />
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg v-if="!showConfirmPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 013.999-5.325m-3.641-3.641L21 21m-2.458-6.138A10.05 10.05 0 0012 5c-1.39 0-2.733.29-3.953.815" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </button>
                </div>
              </div>

              <div class="pt-4">
                <button
                  type="submit"
                  class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-yellow-500/20 text-sm font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Update Password
                </button>
              </div>
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

const isEditMode = ref(false);
const profileForm = ref({ namaLengkap: '', nohp: '' });
const formErrors = ref({});

// Password Form
const form = ref({ oldPassword: "", newPassword: "", confirmPassword: "" });
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

watch(() => authStore.user, (newUser) => {
  if (newUser && !isEditMode.value) {
    profileForm.value.namaLengkap = newUser.namaLengkap || '';
    profileForm.value.nohp = newUser.nohp || '';
  }
}, { immediate: true });

const toggleEditMode = () => {
  if (isEditMode.value) {
    // Revert changes
    profileForm.value.namaLengkap = authStore.user?.namaLengkap || '';
    profileForm.value.nohp = authStore.user?.nohp || '';
  }
  isEditMode.value = !isEditMode.value;
};

const validateProfileForm = () => {
  formErrors.value = {};
  const { namaLengkap, nohp } = profileForm.value;
  let isValid = true;

  if (!namaLengkap || namaLengkap.trim() === "") {
    formErrors.value.namaLengkap = "Nama lengkap tidak boleh kosong.";
    isValid = false;
  }

  if (nohp && nohp.trim() !== "") {
    const nohpNumeric = nohp.replace(/\D/g, ''); 
    if (!nohpNumeric.startsWith('62')) {
      formErrors.value.nohp = 'No. HP harus diawali dengan 62.';
      isValid = false;
    } else if (nohpNumeric.length < 12 || nohpNumeric.length > 14) {
      formErrors.value.nohp = 'Panjang No. HP harus 12-14 digit.';
      isValid = false;
    }
  }
  return isValid;
};

const handleProfileUpdate = async () => {
  if (!validateProfileForm()) {
    toast.error("Data tidak valid. Periksa form.");
    return;
  }

  try {
    const payload = {
      nama_lengkap: profileForm.value.namaLengkap,
      nohp: profileForm.value.nohp ? profileForm.value.nohp.replace(/\D/g, '') : null
    };

    await axios.put(`${baseURL}/api/users/me/profile`, payload);
    await authStore.fetchUser(); 
    toast.success("Profil berhasil diperbarui!");
    isEditMode.value = false;
    formErrors.value = {}; 

  } catch (err) {
    if (err.response?.status === 422) {
      err.response.data.detail.forEach(e => {
        const fieldName = e.loc[e.loc.length - 1];
        if (formErrors.value.hasOwnProperty(fieldName)) {
          formErrors.value[fieldName] = e.msg; 
        }
      });
      toast.error("Validasi gagal.");
    } else {
      toast.error(err?.response?.data?.detail || "Gagal memperbarui profil.");
    }
  }
};

const updatePassword = async () => {
  if (form.value.newPassword !== form.value.confirmPassword) {
    toast.error("Password baru tidak cocok.");
    return;
  }
  if (form.value.newPassword.length < 8) {
    toast.error("Password minimal 8 karakter.");
    return;
  }
  const hasLetter = /[a-zA-Z]/.test(form.value.newPassword);
  const hasNumber = /[0-9]/.test(form.value.newPassword);
  if (!hasLetter || !hasNumber) {
    toast.error("Password harus mengandung huruf dan angka.");
    return;
  }
  try {
    await axios.put(`${baseURL}/api/users/${authStore.user.id}/password`, {
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword
    });
    toast.success("Password berhasil diubah!");
    form.value = { oldPassword: "", newPassword: "", confirmPassword: "" };
  } catch (err) {
    toast.error(err?.response?.data?.detail || "Gagal mengubah password.");
  }
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>