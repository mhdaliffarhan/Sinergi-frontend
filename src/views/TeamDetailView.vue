<template>
  <div class="container mx-auto p-4">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <svg class="animate-spin -ml-1 mr-3 h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="!team" class="text-center text-gray-500 dark:text-gray-400 py-10">
      Tim tidak ditemukan.
    </div>

    <div v-else>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-all">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <!-- Info Tim -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <!-- Warna Tim -->
            <div
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md"
              :style="{ backgroundColor: team.warna || '#3b82f6' }"
            >
              {{ team.namaTim?.charAt(0) || '?' }}
            </div>

            <!-- Nama & Info -->
            <div>
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {{ team.namaTim }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                <span class="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                Aktif: {{ formatDate(team.validFrom) }} – {{ formatDate(team.validUntil) }}
              </p>
            </div>
          </div>

          <!-- Tombol Edit -->
          <div class="flex items-center justify-end sm:justify-center md:justify-end w-full sm:w-auto">
            <button
              v-if="isSuperadminOrKetuaTim"
              @click="openEditModal"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                
              Edit Tim
            </button>
          </div>
        </div>
      </div>

      <section class="mt-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <!-- Anggota -->
          <div class="flex items-center gap-6 p-4 bg-white dark:bg-gray-800  border border-gray-200 dark:border-gray-700 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200" >
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-2xl"
            >
              👥
            </div>
            <div>
              <span class="text-xl font-bold text-gray-900 dark:text-white">{{ team.users?.length ?? 0 }}</span>
              <p class="text-sm text-gray-500 dark:text-gray-400">Anggota</p>
            </div>
          </div>

          <!-- Project -->
          <div
            class="flex items-center gap-6 p-4 bg-white dark:bg-gray-800  border border-gray-200 dark:border-gray-700 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-2xl"
            >
              💼
            </div>
            <div>
              <span class="text-xl font-bold text-gray-900 dark:text-white">{{ team.projects?.length ?? 0 }}</span>
              <p class="text-sm text-gray-500 dark:text-gray-400">Project</p>
            </div>
          </div>

          <!-- Aktivitas -->
          <div
            class="flex items-center gap-6 p-4 bg-white dark:bg-gray-800  border border-gray-200 dark:border-gray-700 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 text-2xl"
            >
              ✅
            </div>
            <div>
              <span class="text-xl font-bold text-gray-900 dark:text-white">{{ totalAktivitas }}</span>
              <p class="text-sm text-gray-500 dark:text-gray-400">Aktivitas</p>
            </div>
          </div>
        </div>

        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Ketua Tim & Anggota</h2>
        <div v-if="team.users?.length > 0">
          <!-- Tabs -->
          <div class="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            <button
              v-for="tab in ['Ringkasan', 'Daftar Lengkap']"
              :key="tab"
              @click="activeTab = tab"
              :class="[
                'px-4 py-2 text-sm font-medium transition-colors duration-150',
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              ]"
            >
              {{ tab }}
            </button>
          </div>

          <!-- Ringkasan -->
          <div v-if="activeTab === 'Ringkasan'" class="flex flex-wrap items-center gap-4">
            <div v-if="team.ketuaTim" class="flex flex-col items-center">
              <div 
                class="relative h-16 w-16 rounded-full flex items-center justify-center text-base font-semibold text-gray-600 dark:text-gray-300 ring-4 ring-green-500 transition duration-150 transform hover:scale-110 hover:z-10 cursor-pointer"
                :title="team.ketuaTim.namaLengkap + ' (Ketua Tim)'"
                @click="goToUserDetail(team.ketuaTim.id)"
              >
                <img v-if="team.ketuaTim.fotoProfilUrl"
                  :src="getProfileUrl(team.ketuaTim.fotoProfilUrl)"
                  alt="Profil"
                  class="h-full w-full rounded-full object-cover"
                />
                <div v-else
                  class="h-full w-full rounded-full flex items-center justify-center text-white text-base"
                  :style="{ backgroundColor: getSoftRandomColor(team.ketuaTim.id) }"
                >
                  {{ getInitials(team.ketuaTim.namaLengkap) }}
                </div>
              </div>
              <p class="text-xs text-green-500 font-bold mt-2 text-center">Ketua Tim</p>
            </div>

            <div class="flex flex-wrap -space-x-3">
              <div 
                v-for="user in filteredUsers" 
                :key="user.id" 
                class="relative h-12 w-12 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800 transition duration-150 transform hover:scale-110 hover:z-10 cursor-pointer"
                :title="user.namaLengkap"
                @click="goToUserDetail(user.id)"
              >
                <img v-if="user.fotoProfilUrl"
                  :src="getProfileUrl(user.fotoProfilUrl)"
                  alt="Profil"
                  class="h-full w-full rounded-full object-cover"
                />
                <div v-else
                  class="h-full w-full rounded-full flex items-center justify-center text-white"
                  :style="{ backgroundColor: getSoftRandomColor(user.id) }"
                >
                  {{ getInitials(user.namaLengkap) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Daftar Lengkap -->
          <div v-else-if="activeTab === 'Daftar Lengkap'" class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <table class="min-w-full text-sm text-left text-gray-600 dark:text-gray-300">
              <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-4 py-3 w-16 text-center">Foto</th>
                  <th scope="col" class="px-4 py-3">Nama Lengkap</th>
                  <th scope="col" class="px-4 py-3 text-center hidden sm:table-cell">Peran</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in [team.ketuaTim, ...filteredUsers]"
                  :key="user.id"
                  @click="goToUserDetail(user.id)"
                  class="cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td class="px-4 py-3 text-center">
                    <div class="h-10 w-10 rounded-full overflow-hidden mx-auto">
                      <img v-if="user.fotoProfilUrl"
                        :src="getProfileUrl(user.fotoProfilUrl)"
                        alt="Profil"
                        class="h-full w-full object-cover"
                      />
                      <div
                        v-else
                        class="h-full w-full flex items-center justify-center text-xs font-semibold text-white rounded-full"
                        :style="{ backgroundColor: getSoftRandomColor(user.id) }"
                      >
                        {{ getInitials(user.namaLengkap) }}
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {{ user.namaLengkap }}
                  </td>
                  <td class="px-4 py-3 text-center hidden sm:table-cell">
                    <span
                      v-if="team.ketuaTim?.id === user.id"
                      class="text-green-600 dark:text-green-400 font-semibold"
                    >
                      Ketua Tim
                    </span>
                    <span v-else-if="user.peran == 'member'" class="text-gray-500 dark:text-gray-400">Anggota</span>
                    <span v-else-if="user.peran == 'operator'" class="text-gray-500 dark:text-gray-400">Operator</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="text-center text-gray-500 dark:text-gray-400 p-6">
          Tidak ada anggota yang terdaftar dalam tim ini.
        </div>

      </section>
      <section class="mt-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Proyek dan Aktivitas</h2>

        <div v-if="team.projects?.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="project in team.projects"
            :key="project.id"
            class="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition hover:shadow-lg"
          >
            <!-- Header Proyek -->
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-5 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
              @click="toggleProject(project.id)"
            >
              <div class="flex flex-col gap-1 w-full sm:w-auto">
                <router-link
                  :to="{ name: 'project-detail', params: { id: project.id } }"
                  class="text-base font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
                >
                  {{ project.namaProject }}
                </router-link>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  👤 {{ project.projectLeader?.namaLengkap || 'Tidak ada leader' }}
                </span>
              </div>

              <div class="flex items-center gap-2 mt-2 sm:mt-0">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {{ project.aktivitas?.length ?? 0 }} Aktivitas
                </span>
                <svg
                  :class="{'rotate-180': expandedProjects[project.id]}"
                  class="w-4 h-4 text-gray-400 transform transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <!-- Daftar Aktivitas Mini -->
            <transition name="fade">
              <div
                v-show="expandedProjects[project.id]"
                class="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-3 sm:p-4 text-sm"
              >
                <div v-if="project.aktivitas?.length > 0" class="space-y-2">
                  <div
                    v-for="aktivitas in project.aktivitas.slice(0, 3)"
                    :key="aktivitas.id"
                    @click="goToAktivitasDetail(aktivitas.id)"
                    class="flex justify-between items-start bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                  >
                    <div class="flex flex-col">
                      <span class="text-gray-900 dark:text-white font-medium line-clamp-1">
                        {{ aktivitas.namaAktivitas }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        🗓️ {{ formatJadwal(aktivitas).tanggal }}
                        <span v-if="formatJadwal(aktivitas).waktu">• {{ formatJadwal(aktivitas).waktu }}</span>
                      </span>
                    </div>
                  </div>

                  <!-- Link Lihat Semua -->
                  <router-link
                    :to="{ name: 'project-detail', params: { id: project.id } }"
                    class="block text-center text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 font-medium"
                  >
                    Lihat Semua Aktivitas →
                  </router-link>
                </div>

                <div v-else class="text-center text-gray-500 dark:text-gray-400 py-2">
                  Belum ada aktivitas.
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Tidak ada proyek -->
        <div
          v-else
          class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center text-gray-500 dark:text-gray-400"
        >
          Tim ini belum memiliki proyek atau aktivitas.
        </div>
      </section>

      <ModalWrapper :show="isEditModalOpen" @close="closeModal" title="Kelola Tim">
        <TeamDetailModal
          v-if="team && allUsers.length > 0"
          :team="team"
          :user-list="allUsers"
          @close="closeModal"
          @teamUpdated="handleUpdateTeamDetails"
          @addMember="addMemberToTeam"
          @removeMember="removeMemberFromTeam"
        />
      </ModalWrapper>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import ModalWrapper from '@/components/ModalWrapper.vue';
import { useAuthStore } from '@/stores/auth';
import TeamDetailModal from '@/components/admin/TeamDetailModal.vue';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const team = ref(null);
const isLoading = ref(true);
const isEditModalOpen = ref(false);
const expandedProjects = ref({});
const allUsers = ref([]);
const activeTab = ref('Ringkasan');

const isSuperadminOrKetuaTim = computed(() => {
  return authStore.user?.sistemRole.namaRole === 'Superadmin' || authStore.user?.id === team.value?.ketuaTim?.id;
});

const totalAktivitas = computed(() => {
  if (!team.value || !team.value.projects) return 0;
  return team.value.projects.reduce((sum, project) => sum + (project.aktivitas?.length ?? 0), 0);
});

const filteredUsers = computed(() => {
  if (!team.value?.users) return [];
  return team.value.users.filter(user => user.id !== team.value.ketuaTim?.id);
});

const toggleProject = (projectId) => {
  expandedProjects.value[projectId] = !expandedProjects.value[projectId];
};

const goToAktivitasDetail = (id) => {
  router.push({ name: 'aktivitas-detail', params: { id } });
};

const goToUserDetail = (userId) => {
  router.push({ name: 'user-detail', params: { id: userId } });
};

const fetchTeamDetails = async () => {
  try {
    const teamId = route.params.id;
    const [teamRes, usersRes] = await Promise.all([
      axios.get(`${baseURL}/api/teams/${teamId}/details`),
      axios.get(`${baseURL}/api/users`, { params: { limit: 10000 } })
    ]);
    team.value = teamRes.data;
    allUsers.value = usersRes.data.items;
    console.log("Data tim : ", team.value);
  } catch (error) {
    toast.error("Gagal memuat detail tim.");
    console.error("Error fetching team details:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return format(date, 'd MMMM yyyy', { locale: id });
};

const formatJadwal = (item) => {
  if (!item.tanggalMulai) return { tanggal: '-', waktu: null };
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  let tanggalTampil = '';
  let waktuTampil = null;
  const tglMulai = new Date(item.tanggalMulai);
  if (item.tanggalSelesai) {
    const tglSelesai = new Date(item.tanggalSelesai);
    tanggalTampil = `${tglMulai.toLocaleDateString('id-ID', options)} - ${tglSelesai.toLocaleDateString('id-ID', options)}`;
  } else {
    tanggalTampil = tglMulai.toLocaleDateString('id-ID', options);
  }
  if (item.jamMulai) {
    const jamMulai = item.jamMulai.substring(0, 5);
    const jamSelesai = item.jamSelesai ? item.jamSelesai.substring(0, 5) : null;
    waktuTampil = `${jamMulai} - ${jamSelesai} WITA`;
  }
  return { tanggal: tanggalTampil, waktu: waktuTampil };
};

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length === 0) return '';
  const firstInitial = parts[0][0];
  const lastPart = parts[parts.length - 1];
  const lastInitial = lastPart.replace(/[^a-zA-Z]/g, '')[0];
  return (firstInitial + lastInitial).toUpperCase();
};

const getSoftRandomColor = (seed) => {
  const colors = [
    '#fbcfe8', '#fecaca', '#dbeafe', '#d1d5db', '#c7d2fe'
  ];
  return colors[seed % colors.length];
};

const openEditModal = () => { isEditModalOpen.value = true; };
const closeModal = () => { isEditModalOpen.value = false; };

// Fungsi untuk update detail tim
const handleUpdateTeamDetails = async (formData) => {
  try {
    const payload = { ...formData, id: team.value.id };
    await axios.put(`${baseURL}/api/teams/${team.value.id}`, payload);
    toast.success("Detail tim berhasil diperbarui!");
    closeModal();
    await fetchTeamDetails();
  } catch (error) {
    const errorMsg = error.response?.data?.detail?.[0]?.msg || "Gagal memperbarui detail tim.";
    toast.error(errorMsg);
    console.error("Error updating team details:", error.response?.data || error.message);
  }
};

// Fungsi untuk menambah anggota tim
const addMemberToTeam = async (user) => {
  try {
    const response = await axios.post(`${baseURL}/api/teams/${team.value.id}/members?user_id=${user.id}`);
    team.value.users = response.data.users; // Update daftar anggota
    toast.success(`"${user.namaLengkap}" berhasil ditambahkan.`);
  } catch (error) {
    toast.error("Gagal menambahkan anggota.");
  }
};

// Fungsi untuk menghapus anggota tim
const removeMemberFromTeam = async (user) => {
  try {
    const response = await axios.delete(`${baseURL}/api/teams/${team.value.id}/members/${user.id}`);
    team.value.users = response.data.users; // Update daftar anggota
    toast.success(`"${user.namaLengkap}" berhasil dikeluarkan.`);
  } catch (error) {
    toast.error("Gagal mengeluarkan anggota.");
  }
};

onMounted(() => {
  fetchTeamDetails();
});

const getProfileUrl = (path) => {
  if (!path) return "/profile-default.png";
  if (path.startsWith("./")) {
    return `${baseURL}/${path.replace("./", "")}`;
  }
  return path;
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}


.fade-scale-enter-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

</style>