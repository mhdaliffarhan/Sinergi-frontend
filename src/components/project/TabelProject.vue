<template>
  <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <!-- KOLOM NO -->
          <th scope="col" class="px-6 py-3 w-16 text-center">
            No
          </th>
          <th scope="col" class="px-6 py-3">
            Nama Project
          </th>
          <th scope="col" class="px-6 py-3 text-center">
            Tim
          </th>
          <th scope="col" class="px-6 py-3">
            Project Leader
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="projects.length === 0">
          <td colspan="4" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
            Tidak ada data project.
          </td>
        </tr>
        <tr 
          v-for="(item, index) in projects" 
          :key="item.id" 
          @click="goToDetail(item.id)"
          class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors">
          <!-- NOMOR URUT -->
          <td class="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">
            {{ (currentPage - 1) * itemsPerPage + index + 1 }}
          </td>

          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ item.namaProject }}
          </th>
          <td class="px-6 py-4 text-center">
            <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full text-white shadow-sm"
              :style="{ backgroundColor: item.team?.warna || '#3b82f6' }">
              {{ item.team?.namaTim || '-' }}
            </span>
          </td>
          <td class="px-6 py-4">
            {{ item.projectLeader?.namaLengkap || '-' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  projects: {
    type: Array,
    required: true,
  },
  // Props baru
  currentPage: {
    type: Number,
    default: 1
  },
  itemsPerPage: {
    type: Number,
    default: 10
  }
});

const router = useRouter();

const goToDetail = (id) => {
  router.push({ name: 'project-detail', params: { id: id } });
};
</script>