<template>
  <aside
    class="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed top-0 left-0 h-screen pt-16 z-30 transition-all duration-300 overflow-y-auto"
    :class="{
      'w-64': uiStore.isSidebarOpen, 
      'w-20': !uiStore.isSidebarOpen,
      'transform -translate-x-full': !uiStore.isSidebarOpen && isMobile,
    }"
  >
    <div class="p-4">
      <nav class="flex flex-col gap-1">
        <div v-for="item in menuItems" :key="item.label">

          <!-- External Link -->
          <a 
            v-if="item.external" 
            :href="item.href" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-600 dark:text-gray-300 font-medium hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
            :class="{ 'justify-center': !uiStore.isSidebarOpen }"
          >
            <span v-html="item.icon" class="text-xl"></span>
            <span v-if="uiStore.isSidebarOpen">{{ item.label }}</span>
          </a>
          
          <!-- Router Link (Single Item) -->
          <router-link 
            v-else-if="!item.children" 
            :to="item.to" 
            v-slot="{ isActive, isExactActive }"
            custom
          >
            <a
              :href="item.to"
              @click.prevent="!isActive && $router.push(item.to)"
              class="flex items-center gap-3 px-4 py-2.5 rounded-md font-medium transition-colors"
              :class="[
                !uiStore.isSidebarOpen ? 'justify-center' : '',
                isActive 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 cursor-default pointer-events-none' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
              ]"
            >
              <span v-html="item.icon" class="text-xl"></span>
              <span v-if="uiStore.isSidebarOpen">{{ item.label }}</span>
            </a>
          </router-link>
          
          <!-- Dropdown Menu -->
          <div v-else>
            <button 
              @click="toggleDropdown(item.label)" 
              class="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-md text-gray-600 dark:text-gray-300 font-medium hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
              :class="{ 
                'justify-center': !uiStore.isSidebarOpen,
                'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white': openDropdowns[item.label] // Highlight parent if open
              }"
            >
              <div class="flex items-center gap-3">
                <span v-html="item.icon" class="text-xl"></span>
                <span v-if="uiStore.isSidebarOpen">{{ item.label }}</span>
              </div>
              <svg v-if="uiStore.isSidebarOpen" class="h-4 w-4 transition-transform duration-200" :class="{ 'rotate-90': openDropdowns[item.label] }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            
            <transition name="expand">
              <div v-if="openDropdowns[item.label] && uiStore.isSidebarOpen" class="mt-1 ml-7 pl-3 border-l-2 border-gray-200 dark:border-gray-600 overflow-hidden">
                <router-link 
                  v-for="child in item.children" 
                  :key="child.label" 
                  :to="child.to" 
                  v-slot="{ isActive }"
                  custom
                >
                  <a
                    :href="child.to"
                    @click.prevent="!isActive && $router.push(child.to)"
                    class="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors block"
                    :class="[
                      isActive 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10 cursor-default pointer-events-none' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    ]"
                  >
                    {{ child.label }}
                  </a>
                </router-link>
              </div>
            </transition>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { useUIStore } from '@/stores/ui';
import { onMounted, onUnmounted, ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';

const uiStore = useUIStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Logika untuk mendeteksi layar mobile
const isMobile = ref(window.innerWidth < 768);
const updateIsMobile = () => { isMobile.value = window.innerWidth < 768; };
onMounted(() => window.addEventListener('resize', updateIsMobile));
onUnmounted(() => window.removeEventListener('resize', updateIsMobile));

// Struktur Menu
const menuItems = computed(() => {
  const baseMenu = [
    { label: 'Dashboard', to: '/dashboard', icon: '📊' },
    { label: 'Kalender', to: '/kalender', icon: '📅' },
    { label: 'Tim', to: '/team', icon: '👥'},
    { label: 'Project', to: '/project', icon: '🚀'},
    { label: 'Aktivitas', to: '/aktivitas/daftar', icon: '🗂️' },
    { label: 'Feedback', external:true, href: "https://docs.google.com/forms/d/e/1FAIpQLSd__LfvPoMKVeGiaFS_SMhYFr5DF_g-gaI7fvJGCgzdyj8svQ/viewform?usp=header", icon: '⭐'}
  ];
  if (authStore.isAdmin) {
    baseMenu.push({
      label: 'Admin', 
      icon: '⚙️',
      children: [
        { label: 'Manajemen User', to: '/admin/users' },
        { label: 'Manajemen Tim', to: '/admin/teams'},
      ]
    });
  }
  return baseMenu;
});

const openDropdowns = ref({});

const toggleDropdown = (label) => {
  const isCurrentlyOpen = openDropdowns.value[label];
  // Tutup yang lain (accordion style) - Opsional, jika ingin multi-open hapus baris ini
  // openDropdowns.value = {}; 
  
  // Toggle
  if (isCurrentlyOpen) {
     delete openDropdowns.value[label]; // Tutup
  } else {
     openDropdowns.value[label] = true; // Buka
  }
};

// Otomatis buka dropdown jika child aktif saat load/navigasi
watch(
  () => route.path,
  () => {
    menuItems.value.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => route.path.startsWith(child.to));
        if (hasActiveChild) {
          openDropdowns.value[item.label] = true;
        }
      }
    });
  },
  { immediate: true }
);

</script>

<style scoped>
/* CSS untuk transisi expand/collapse yang halus */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 200px;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
</style>