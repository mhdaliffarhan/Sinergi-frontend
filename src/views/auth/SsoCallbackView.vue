<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const processing = ref(false) // Kunci agar tidak double request

onMounted(async () => {
  if (processing.value) return

  const code = route.query.code
  if (code) {
    processing.value = true
    console.log('Memproses code SSO:', code)

    const success = await authStore.ssoCallback(code)

    // Jangan redirect di sini kalau di store sudah ada window.location.href
  } else {
    router.push('/login')
  }
})
</script>
