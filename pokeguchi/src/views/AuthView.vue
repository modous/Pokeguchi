<template>
  <div class="max-w-md mx-auto mt-20 bg-slate-900 p-6 rounded-lg shadow-lg text-white text-center">
    <h2 class="text-2xl font-bold mb-4">Login / Register</h2>

    <form @submit.prevent="handleAuth">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full p-2 mb-3 rounded bg-slate-800 border border-slate-700"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full p-2 mb-3 rounded bg-slate-800 border border-slate-700"
      />
      <button type="submit" class="bg-pink-500 hover:bg-pink-600 w-full py-2 rounded font-semibold">
        {{ isLogin ? 'Login' : 'Register' }}
      </button>
    </form>

    <p class="mt-4 text-sm text-gray-400 cursor-pointer" @click="isLogin = !isLogin">
      {{ isLogin ? 'No account? Register here' : 'Already have an account? Login here' }}
    </p>

    <p v-if="auth.error" class="mt-2 text-red-400">{{ auth.error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const isLogin = ref(true)

const handleAuth = async () => {
  if (isLogin.value) await auth.signIn(email.value, password.value)
  else await auth.signUp(email.value, password.value)
}
</script>
