import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async signUp(email: string, password: string) {
      this.loading = true
      const { data, error } = await supabase.auth.signUp({ email, password })
      this.loading = false
      if (error) this.error = error.message
      else this.user = data.user
    },

    async signIn(email: string, password: string) {
      this.loading = true
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      this.loading = false
      if (error) this.error = error.message
      else this.user = data.user
    },

    async signOut() {
      await supabase.auth.signOut()
      this.user = null
    },

    async fetchUser() {
      const { data } = await supabase.auth.getUser()
      this.user = data.user
    },
  },
})
