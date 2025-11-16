import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

import LoginView from '../views/LoginView.vue'
import TeamView from '@/views/TeamView.vue'
import AktivitasDashboardView from '../views/AktivitasDashboardView.vue'
import AktivitasDaftarView from '../views/AktivitasDaftarView.vue'
import ProfileView from '@/views/ProfileView.vue' 
import ProjectView from '@/views/ProjectView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue')
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/ResetPasswordView.vue')
    },
    {
      path: '/public/aktivitas/:public_id',
      name: 'public-aktivitas-detail',
      component: () => import('../views/PublicAktivitasView.vue')
    },
    {
      path: '/profil',
      name: 'profil',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/kalender',
      name: 'kalender',
      component: () => import('../views/KalenderView.vue'),
      meta: { requiredAuth: true }
    },
    {
      path: '/team',
      name: 'team',
      component: TeamView,
      meta: { requiredAuth: true }
    },
    {
      path: '/team/detail/:id',
      name: 'team-detail',
      component: () => import('../views/TeamDetailView.vue'),
      meta: { requiredAuth: true }
    },
    {
      path: '/project',
      name: 'project',
      component: ProjectView,
      meta: { requiredAuth: true }
    },
    {
      path: '/project/detail/:id',
      name: 'project-detail',
      component: () => import('../views/ProjectDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/aktivitas/dashboard',
      name: 'aktivitas-dashboard',
      component: AktivitasDashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/aktivitas/daftar',
      name: 'aktivitas-daftar',
      component: AktivitasDaftarView,
      meta: { requiresAuth: true }
    },
    {
      path: '/aktivitas/detail/:id',
      name: 'aktivitas-detail',
      component: () => import('../views/AktivitasDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/kalender-pegawai',
      name: 'kalender-pegawai',
      component: () => import('../views/KalenderPegawaiView.vue'),
      meta: { requiredAuth: true }
    },
    {
      path: '/admin/users',
      name: 'manajemen-user',
      component: () => import('../views/admin/UserManagementView.vue'),
      meta: {
        requiresAuth: true,
        requiredRoles: ['Superadmin', 'Admin']
      }
    },
    {
      path: '/admin/teams',
      name: 'admin-teams',
      component: () => import('../views/admin/TeamManagementView.vue'),
      meta: {
        requiresAuth: true,
        requiredRoles: ['Superadmin', 'Admin']
      }
    },
    {
      path: '/notifikasi',
      name: 'notifikasi-semua',
      component: () => import('../views/NotifikasiView.vue'), // File baru
      meta: { requiredAuth: true }
    },
    {
      path: '/:pathMatch(.*)*', 
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const toast = useToast();

  // 'restoreSession' sudah berjalan di main.js, jadi kita tidak perlu
  // memanggil 'fetchUser' di sini. Kita cukup cek hasilnya.
  
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.sistemRole?.namaRole;

  // 1. Cek Rute yang Butuh Login
  // Jika rute butuh auth TAPI user TIDAK terautentikasi
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login' });
  }

  // 2. Cek jika user login tapi ke halaman Login
  if (to.name === 'login' && isAuthenticated) {
    return next({ name: 'dashboard' });
  }

  // 3. (POIN 1 ANDA) Cek Paksa Isi Profil (HANYA jika sudah login)
  if (isAuthenticated && !authStore.user?.nohp) {
    // Jika No. HP kosong
    if (to.name !== 'profil' && to.name !== 'login') {
      // Dan user mencoba pergi ke halaman SELAIN profil
      // (Kita hapus toast di sini agar tidak spam)
      return next({ name: 'profil' }); // Paksa ke /profil
    }
  }

  // 4. Cek Role (HANYA jika sudah login)
  if (to.meta.requiredRoles && isAuthenticated) {
    if (!userRole || !to.meta.requiredRoles.includes(userRole)) {
      toast.error("Anda tidak memiliki hak akses ke halaman ini.");
      return next({ name: 'dashboard' });
    }
  }

  // 5. Jika lolos semua
  next();
});

export default router
