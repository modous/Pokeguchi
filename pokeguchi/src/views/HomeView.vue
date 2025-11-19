<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] pt-[70px]">
    <div v-if="loading" class="text-pink-300 animate-pulse text-lg">Loading...</div>

    <div v-else>
      <!-- Geen creature -->
      <div v-if="!creature" class="text-center">
        <h2 class="text-3xl font-bold text-pink-400 mb-6">You found a mysterious egg 🥚</h2>
        <button
          @click="hatchEgg"
          class="bg-pink-500 hover:bg-pink-600 active:bg-pink-700 transition-all px-6 py-3 rounded-lg font-semibold text-white shadow-md"
          :disabled="hatching"
        >
          {{ hatching ? 'Hatching...' : 'Hatch your egg!' }}
        </button>
      </div>

      <!-- Creature bestaat -->
      <div v-else class="flex flex-col items-center space-y-4">
        <h2 class="text-3xl font-bold text-pink-400 mb-2">{{ creature.name }}</h2>
        <p class="text-gray-400 text-sm mb-2">Level {{ creature.level }} • {{ creatureType }}</p>

        <CreatureDisplay />

        <div class="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-300">
          <p>💪 Strength: {{ creature.strength }}</p>
          <p>😊 Happiness: {{ creature.happiness }}</p>
          <p>🍗 Hunger: {{ creature.hunger }}</p>
          <p>✨ Evolution: {{ creature.evolution_stage }}</p>
        </div>

        <!-- 🗑️ Release button -->
        <button
          @click="deleteCreature"
          class="mt-6 text-sm text-gray-400 hover:text-red-400 underline transition"
        >
          Release creature 🐉
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { useCreatureStore } from '@/stores/creature'
import CreatureDisplay from '@/components/CreatureDisplay.vue'

interface Creature {
  id: string
  user_id: string
  name: string
  level: number
  hunger: number
  happiness: number
  strength: number
  evolution_stage: number
  image_front: string
  inserted_at: string
  type: string
}

const auth = useAuthStore()
const creature = ref<Creature | null>(null)
const creatureStore = useCreatureStore()
const loading = ref(true)
const hatching = ref(false)
const deleting = ref(false)

const creatureType = computed(() => {
  if (!creature.value) return ''
  const name = creature.value.name.toLowerCase()
  if (name.includes('fire')) return '🔥 Fire type'
  if (name.includes('water')) return '💧 Water type'
  if (name.includes('grass')) return '🌿 Grass type'
  if (name.includes('electric')) return '⚡ Electric type'
  return '✨ Unknown type'
})

onMounted(async () => {
  if (!auth.user) return
  const { data } = await supabase.from('creatures').select('*').eq('user_id', auth.user.id).single()
  creature.value = data
  if (data) creatureStore.loadFromDb(data)
  loading.value = false
})

async function hatchEgg(): Promise<void> {
  try {
    hatching.value = true

    const types = ['fire', 'water', 'grass', 'electric'] as const
    const randomType = types[Math.floor(Math.random() * types.length)] ?? 'fire'
    const userId = auth.user?.id
    if (!userId) return

    const name = randomType.charAt(0).toUpperCase() + randomType.slice(1) + 'guchi'

    // 🧠 TEMP: Commented out AI image generation
    // const prompts = [...]
    // const urls: string[] = []
    // (AI generation code removed)

    // 🧩 Use a placeholder image instead
    const image_front = `/monsters/default2.png`

    // 🧩 Save creature in DB
    const { data, error } = await supabase
      .from('creatures')
      .insert({
        user_id: userId,
        name,
        type: randomType,
        level: 1,
        hunger: 100,
        happiness: 100,
        strength: 10,
        evolution_stage: 1,
        image_front,
      })
      .select()
      .single()

    if (error) throw error
    creature.value = data
    creatureStore.loadFromDb(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Hatch error:', err)
    alert(`Failed to hatch creature 🥺\n${message}`)
  } finally {
    hatching.value = false
  }
}

async function deleteCreature() {
  if (!creature.value || !auth.user) return
  if (!confirm('Release this creature? This cannot be undone.')) return
  try {
    deleting.value = true
    const { error } = await supabase
      .from('creatures')
      .delete()
      .eq('id', creature.value.id)
      .eq('user_id', auth.user.id)

    if (error) throw error
    creature.value = null
    creatureStore.reset()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Delete error:', err)
    alert(`Failed to release creature.\n${message}`)
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
img {
  filter: drop-shadow(0 0 10px rgba(244, 114, 182, 0.6));
}
</style>
