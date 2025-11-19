<template>
  <div class="text-center">
    <h2 class="text-3xl font-bold mb-4">Battle Arena</h2>
    <p class="text-gray-300 mb-6">Send your Pokeguchi into AI-generated battles!</p>

    <div v-if="creatureStore" class="mb-6">
      <h3 class="text-2xl font-semibold text-pink-400">{{ creatureStore.name }}</h3>
      <p class="text-sm text-gray-400">
        Level {{ creatureStore.level }} • {{ creatureStore.moodDescription }}
      </p>
      <CreatureDisplay />
      <div class="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-300 max-w-xs mx-auto">
        <p>💪 Strength: {{ creatureStore.strength }}</p>
        <p>😊 Happiness: {{ creatureStore.happiness }}</p>
        <p>🍗 Hunger: {{ creatureStore.hunger }}</p>
        <p>✨ Evolution: {{ creatureStore.evolutionStage }}</p>
      </div>
    </div>

    <div v-else class="text-gray-400 mb-6">No creature yet. Hatch one first!</div>

    <button class="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded">Start Battle ⚔️</button>
  </div>
</template>

<script setup lang="ts">
import { useCreatureStore } from '@/stores/creature'
import CreatureDisplay from '@/components/CreatureDisplay.vue'
const creatureStore = useCreatureStore()
</script>
