<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span class="text-3xl">👥</span> Manajemen Pengguna
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Kelola akun pegawai, peran, dan hak akses sistem.
        </p>
      </div>
      
      <div class="mt-4 sm:mt-0 flex-shrink-0">
        <button 
          @click="openCreateModal" 
          class="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span class="text-xl font-bold">+</span>
          <span class="font-semibold">Tambah Pengguna</span>
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 mb-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
      <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl"></div>

      <div class="flex flex-col md:flex-row gap-5 justify-between items-center relative z-10">
        
        <div class="relative w-full md:max-w-lg group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Cari berdasarkan nama, username, atau NIP..."
            class="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-purple-500 transition-all shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
          />
        </div>

      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th scope="col" class="px-6 py-4 font-semibold">Nama Lengkap</th>
              <th scope="col" class="px-6 py-4 font-semibold">Username</th>
              <th scope="col" class="px-6 py-4 font-semibold">No HP</th>
              <th scope="col" class="px-6 py-4 font-semibold">Peran</th>
              <th scope="col" class="px-6 py-4 font-semibold">Terakhir Login</th>
              <th scope="col" class="px-6 py-4 font-semibold">Status</th>
              <th scope="col" class="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <tr 
              v-for="user in users" 
              :key="user.id" 
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 group"
            >
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <div class="flex items-center">
                  
                  <div class="h-8 w-8 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 border border-gray-200 dark:border-gray-600">
                    <img 
                      v-if="user.fotoProfilUrl" 
                      :src="getProfileUrl(user.fotoProfilUrl)" 
                      alt="Foto Profil"
                      class="h-full w-full object-cover"
                      @error="$event.target.src = '/profile-default.png'"
                    />
                    <div 
                      v-else 
                      class="h-full w-full flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold"
                    >
                      {{ user.namaLengkap ? user.namaLengkap.charAt(0).toUpperCase() : '?' }}
                    </div>
                  </div>
                  
                  {{ user.namaLengkap }}
                </div>
              </th>
              <td class="px-6 py-4">{{ user.username }}</td>
              <td class="px-6 py-4 text-gray-500">{{ user.nohp || '-' }}</td>
              <td class="px-6 py-4">
                <span v-if="user.sistemRole" class="px-2.5 py-0.5 text-xs font-medium rounded-full border" :class="getRoleClass(user.sistemRole.namaRole)">
                  {{ user.sistemRole.namaRole }}
                </span>
              </td>
              
              <td class="px-6 py-4">
                <div v-if="user.lastLogin" class="flex flex-col text-xs">
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatTime(user.lastLogin) }}</span>
                  <span class="text-gray-500">{{ formatDate(user.lastLogin) }}</span>
                </div>
                <span v-else class="text-xs text-gray-400 italic">Belum login</span>
              </td>

              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200" 
                  :class="user.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'">
                  <span class="w-1.5 h-1.5 rounded-full" :class="user.isActive ? 'bg-green-500' : 'bg-red-500'"></span>
                  {{ user.isActive ? 'Aktif' : 'Non-Aktif' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button 
                    @click="openEditModal(user)" 
                    class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    title="Edit User"
                  >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  <button 
                    v-if="authStore.isSuperAdmin" 
                    @click="confirmDeleteUser(user)" 
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    title="Hapus User"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="users.length === 0" class="bg-white dark:bg-gray-800">
              <td colspan="7" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-4xl mb-3">🔍</span>
                  <p>Tidak ada pengguna ditemukan.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <Pagination
        v-if="totalUsers > 0"
        :current-page="currentPage"
        :total-items="totalUsers"
        :items-per-page="itemsPerPage"
        @page-changed="handlePageChange"
        class="mt-1"
      />

    <ModalWrapper :show="isModalOpen" @close="closeModal" :title="modalTitle">
      <FormUser
        :is-edit-mode="isEditMode"
        :initial-data="userToEdit"
        :sistem-roles="sistemRoles"
        :jabatan-list="jabatanList"
        @close="closeModal"
        @submit="handleUserSubmit"
      />
    </ModalWrapper>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import ModalWrapper from '@/components/ModalWrapper.vue';
import FormUser from '@/components/admin/FormUser.vue';
import Pagination from '@/components/Pagination.vue';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const authStore = useAuthStore();
const toast = useToast();
const users = ref([]);
const isModalOpen = ref(false);
const sistemRoles = ref([]);
const jabatanList = ref([]);
const isEditMode = ref(false);
const userToEdit = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalUsers = ref(0);
const searchQuery = ref('');
let debounceTimer = null;

const modalTitle = computed(() => isEditMode.value ? 'Edit Pengguna' : 'Tambah Pengguna Baru');

const fetchData = async () => {
  try {
    const skip = (currentPage.value - 1) * itemsPerPage.value;

    const usersResponse = await axios.get(`${baseURL}/api/users`, {
      params: {
        skip: skip,
        limit: itemsPerPage.value,
        search: searchQuery.value
      }
    });
    users.value = usersResponse.data.items;
    totalUsers.value = usersResponse.data.total;

    if (sistemRoles.value.length === 0) {
      const rolesResponse = await axios.get(`${baseURL}/api/sistem-roles`);
      sistemRoles.value = rolesResponse.data;
    }
    if (jabatanList.value.length === 0) {
      const jabatanResponse = await axios.get(`${baseURL}/api/jabatan`);
      jabatanList.value = jabatanResponse.data;
    }
  } catch (error) {
    toast.error("Gagal memuat data administrasi.");
    console.error("Gagal mengambil data:", error);
  }
};

watch(searchQuery, (newQuery) => {
  currentPage.value = 1; 
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchData();
  }, 500);
});

onMounted(() => {
  fetchData();
});

const getProfileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // Handle relative paths from backend, e.g. "./profile-picture/..." -> "baseURL/profile-picture/..."
  return `${baseURL}/${path.replace(/^\.\//, '')}`;
};

// HELPER TANGGAL & WAKTU (Last Login)
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return format(new Date(dateString), 'd MMMM yyyy', { locale: id });
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'HH:mm', { locale: id });
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchData();
};

const openCreateModal = () => {
  isEditMode.value = false;
  userToEdit.value = null;
  isModalOpen.value = true;
};

const openEditModal = (user) => {
  isEditMode.value = true;
  userToEdit.value = user;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  userToEdit.value = null;
};

const deleteUser = async (userId, username) => {
  try {
    await axios.delete(`${baseURL}/api/users/${userId}`);
    toast.success(`Pengguna "${username}" berhasil dihapus.`);
    await fetchData();
  } catch (error) {
    const errorMsg = error.response?.data?.detail || "Gagal menghapus pengguna.";
    toast.error(errorMsg);
    console.error(error);
  }
};

const confirmDeleteUser = (user) => {
  if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.username}"? Tindakan ini tidak dapat dibatalkan.`)) {
    closeModal();
    deleteUser(user.id, user.username);
  }
};

const handleUserSubmit = async (formData) => {
  const payload = { ...formData };
  // Simpan password baru untuk logika reset (jika ada)
  const newPassword = payload.password;
  
  // Hapus password dari payload utama untuk update profil biasa 
  // (karena endpoint update user biasanya tidak menghandle password secara langsung jika dipisah)
  if (isEditMode.value) {
    delete payload.password;
  }

  try {
    if (isEditMode.value) {
      // 1. Update Data Profil (PUT /api/users/{id})
      await axios.put(`${baseURL}/api/users/${userToEdit.value.id}`, payload);
      
      // 2. Reset Password (PUT /api/admin/users/{id}/reset-password) - Jika diisi dan admin punya akses
      if (newPassword && newPassword.trim() !== '') {
        // Panggil endpoint khusus admin reset password
        await axios.put(
          `${baseURL}/api/admin/users/${userToEdit.value.id}/reset-password`,
          { new_password: newPassword }
        );
        toast.success(`Data & Password pengguna "${payload.username}" berhasil diperbarui.`);
      } else {
        toast.success(`Data pengguna "${payload.username}" berhasil diperbarui.`);
      }

    } else {
      // Create Mode (Password wajib ada di payload)
      // Pastikan payload create user sesuai skema backend
      await axios.post(`${baseURL}/api/users`, payload);
      toast.success(`Pengguna "${payload.username}" berhasil dibuat.`);
    }
    
    closeModal();
    await fetchData(); 
  } catch (error) {
    if (error.response && error.response.status === 422) {
      const validationErrors = error.response.data.detail;
      if (Array.isArray(validationErrors)) {
        const firstError = validationErrors[0];
        // Clean field name for display if it's nested
        const fieldName = firstError.loc[firstError.loc.length - 1];
        const errorMsg = firstError.msg;
        toast.error(`Validasi Gagal: ${fieldName} - ${errorMsg}`);
      } else {
        toast.error("Terjadi error validasi input.");
      }
    } else {
      const errorMsg = error.response?.data?.detail || "Terjadi kesalahan sistem.";
      toast.error(errorMsg);
    }
  }
};

const getRoleClass = (roleName) => {
  if (roleName === 'Superadmin') return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800';
  if (roleName === 'Admin') return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800';
  return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
};
</script>