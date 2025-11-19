<template>
  <div
    class="relative mx-auto w-[300px] h-[300px] flex items-end justify-center"
    :style="{ overflow: 'hidden' }"
  >
    <img
      :src="creature.imageFront || '/monsters/default2.png'"
      alt="Creature"
      class="absolute w-28 h-28 transition-transform duration-700 ease-in-out"
      :style="{
        transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
      }"
    />

    <div
      v-if="speech"
      class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/80 text-black text-sm px-2 py-1 rounded shadow-md animate-fade"
    >
      {{ speech }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCreatureStore } from '@/stores/creature'

const creature = useCreatureStore()

const position = ref({ x: 0, y: -40 })
const scale = ref(1)
const rotation = ref(0)
const speech = ref<string | null>(null)
const isWalking = ref(false)

let behaviorTimeout: ReturnType<typeof setTimeout> | null = null
let speakInterval: ReturnType<typeof setInterval> | null = null
let hungerInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  nextBehavior()
  speakInterval = setInterval(trySpeak, 4000)
  // Gradual hunger decay to make hunger visible over time
  hungerInterval = setInterval(() => {
    if (creature.hunger > 0) creature.hunger = Math.max(0, creature.hunger - 1)
  }, 15000)
})
onUnmounted(() => {
  if (behaviorTimeout) clearTimeout(behaviorTimeout)
  if (speakInterval) clearInterval(speakInterval)
  if (hungerInterval) clearInterval(hungerInterval)
})

// 🧠 Behavior
function nextBehavior() {
  const shouldIdle = Math.random() < 0.2
  if (shouldIdle) {
    idle()
    const idleTime = 2000 + Math.random() * 8000
    behaviorTimeout = setTimeout(nextBehavior, idleTime)
    return
  }
  walkAround()
  const delay = 3000 + Math.random() * 3000
  behaviorTimeout = setTimeout(nextBehavior, delay)
}

// 🐾 Walk left/right
function walkAround() {
  const hungerFactor = Math.max(creature.hunger, 10) / 100
  const happinessFactor = Math.max(creature.happiness, 10) / 100
  const speedModifier = 0.5 + 0.5 * hungerFactor * happinessFactor

  isWalking.value = true
  const maxX = 120 * happinessFactor
  const newX = position.value.x + (Math.random() * maxX - maxX / 2)
  position.value.x = Math.max(-maxX, Math.min(maxX, newX))
  position.value.y = -40

  rotation.value = Math.random() * 10 - 5
  scale.value = 1 + Math.random() * 0.1

  if (Math.random() < 0.05) setTimeout(() => fallOver(), 500)
  if (Math.random() < 0.02) setTimeout(() => jump(), 10000)

  setTimeout(() => (isWalking.value = false), 2000 / speedModifier)
}

// 💤 Idle
function idle() {
  isWalking.value = false
  rotation.value = 0
  scale.value = 1
}

// 💬 Speak
function trySpeak() {
  if (Math.random() < 0.15) speak()
}

function speak() {
  let lines: string[] = []
  if (creature.hunger < 30) lines.push('I’m starving...', 'Feed me, please...')
  if (creature.happiness < 30) lines.push('I feel lonely...', 'Can we play?')
  if (lines.length === 0)
    lines = ['Hi there!', 'Wanna play?', 'I feel strong!', 'Zzz...', 'Hello friend!']
  speech.value = lines[Math.floor(Math.random() * lines.length)] ?? null
  setTimeout(() => (speech.value = null), 2500)
}

// 😵 Fall down
function fallOver() {
  rotation.value = -40
  speech.value = 'Oops!'
  setTimeout(() => {
    rotation.value = 0
    speech.value = null
  }, 1500)
}

// 🦘 Jump
function jump() {
  const originalY = position.value.y
  speech.value = 'Boing!'
  position.value.y = originalY - 60
  setTimeout(() => {
    position.value.y = originalY
    speech.value = null
  }, 600)
}
</script>

<style scoped>
img {
  filter: drop-shadow(0 0 10px rgba(244, 114, 182, 0.6));
}

/* 🗨️ Speech bubble fade */
.animate-fade {
  animation: fadeInOut 2s ease-in-out;
}
@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(5px);
  }
  20%,
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-5px);
  }
}
</style>
