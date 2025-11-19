<template>
  <div class="text-center">
    <h2 class="text-3xl font-bold mb-4">Care for {{ creature.name }}</h2>

    <div class="mb-6">
      <p>🍗 Hunger: {{ creature.hunger }}</p>
      <p>💖 Happiness: {{ creature.happiness }}</p>
      <p>💪 Strength: {{ creature.strength }}</p>
      <p>⚡ Level: {{ creature.level }}</p>
      <p>{{ creature.moodDescription }}</p>
    </div>

    <div class="flex justify-center space-x-4">
      <button @click="creature.feed()" class="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded">
        Feed 🍖
      </button>
      <button @click="creature.play()" class="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded">
        Play 🎮
      </button>
      <button @click="creature.train()" class="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded">
        Train 🏋️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCreatureStore } from '../stores/creature'
const creature = useCreatureStore()
</script>
