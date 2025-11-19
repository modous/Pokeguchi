<template>
  <div v-if="hasXp" class="w-full max-w-sm mx-auto mt-2">
    <div class="flex justify-between text-xs text-gray-300 mb-1">
      <span>Lvl {{ creature.level }}</span>
      <span>{{ creature.experience }} / {{ creature.experienceToNext }}</span>
    </div>
    <div class="h-3 bg-slate-700 rounded overflow-hidden relative">
      <div
        class="h-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 transition-all duration-500"
        :style="{ width: percent + '%' }"
      />
      <div
        v-if="percent >= 95"
        class="absolute inset-0 animate-pulse bg-pink-500/20 pointer-events-none"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCreatureStore } from '@/stores/creature'
const creature = useCreatureStore()

const hasXp = computed(
  () => typeof creature.experience === 'number' && typeof creature.experienceToNext === 'number',
)

const percent = computed(() => {
  if (!hasXp.value) return 0
  if (!creature.experienceToNext) return 0
  return Math.min(100, Math.round(((creature.experience || 0) / creature.experienceToNext) * 100))
})
</script>

<style scoped>
.h-3 div {
  background-size: 200% 100%;
  animation: xpFlow 5s linear infinite;
}
@keyframes xpFlow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>
