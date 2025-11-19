<template>
  <div class="min-h-[calc(100vh-120px)] flex items-center justify-center px-6 pt-[70px] pb-10">
    <div
      class="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 w-full max-w-md shadow-xl text-center"
    >
      <h2 class="text-3xl font-bold text-pink-400 mb-6">Welcome to Pokeguchi</h2>

      <p class="text-gray-400 mb-8">
        {{ isLogin ? 'Log in to your account' : 'Create your Pokeguchi account' }}
      </p>

      <form @submit.prevent="handleAuth" class="flex flex-col space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          class="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <button
          type="submit"
          class="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-800 transition-all py-3 rounded-lg font-semibold text-white shadow-md"
          :disabled="auth.loading"
        >
          {{ auth.loading ? 'Loading...' : isLogin ? 'Login' : 'Register' }}
        </button>
      </form>

      <p
        class="mt-6 text-sm text-gray-400 cursor-pointer hover:text-pink-300 transition"
        @click="toggleMode"
      >
        {{ isLogin ? 'No account? Register here' : 'Already have an account? Login here' }}
      </p>

      <p v-if="errorMsg" class="mt-4 text-red-400">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const isLogin = ref(true)
const errorMsg = ref('')

const toggleMode = () => {
  isLogin.value = !isLogin.value
  errorMsg.value = ''
}

const handleAuth = async () => {
  errorMsg.value = ''
  if (isLogin.value) {
    await auth.signIn(email.value, password.value)
  } else {
    await auth.signUp(email.value, password.value)
  }

  if (auth.error) {
    errorMsg.value = auth.error
  } else if (auth.user && isLogin.value) {
    router.push('/') // ✅ redirect na login
  } else if (!isLogin.value) {
    errorMsg.value = '✅ Account created! Check your email for verification.'
  }
}
</script>
