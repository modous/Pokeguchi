<template>
  <div class="relative mx-auto w-[300px] h-[300px] flex items-end justify-center select-none">
    <img
      :src="creature.imageFront || '/monsters/default2.png'"
      alt="Creature"
      class="absolute w-28 h-28 transition-transform duration-700 ease-in-out"
      :class="{
        'animate-rumble': creature.hunger < 30 && !isTripping,
        'animate-happy': creature.happiness > 80,
        'opacity-70': creature.happiness < 15,
      }"
      :style="{
        transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
      }"
    />

    <div
      v-if="speech"
      class="absolute left-1/2 transform -translate-x-1/2 bg-white/80 text-black text-sm px-2 py-1 rounded shadow-md animate-fade"
      :style="{
        bottom: `${110 + position.y}px`, // 💬 appears above creature’s head
      }"
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
const isTripping = ref(false)

let behaviorTimer: ReturnType<typeof setTimeout> | null = null
let microMoveTimer: ReturnType<typeof setInterval> | null = null
let speakInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  loopBehavior()
  microMoveTimer = setInterval(microMove, 100)
  speakInterval = setInterval(trySpeak, 6000)
})
onUnmounted(() => {
  if (behaviorTimer) clearTimeout(behaviorTimer)
  if (microMoveTimer) clearInterval(microMoveTimer)
  if (speakInterval) clearInterval(speakInterval)
})

// 🧬 Main behavior cycle
function loopBehavior() {
  const actions: Array<() => void> = [walk, jump, idle, lookAround]
  const randomAction = actions[Math.floor(Math.random() * actions.length)]!
  randomAction()
  behaviorTimer = setTimeout(loopBehavior, 3000 + Math.random() * 4000)
}

// 🌬️ Small breathing / floating movement
function microMove() {
  const t = Date.now() / 800
  position.value.y = -40 + Math.sin(t) * 4
  rotation.value = Math.sin(t / 2) * 3
  scale.value = 1 + Math.sin(t * 1.5) * 0.02
}

// 🐾 Walk left/right
function walk() {
  const direction = Math.random() < 0.5 ? -1 : 1
  const distance = 40 + Math.random() * 60
  const duration = 2000 + Math.random() * 1000
  const startX = position.value.x
  const endX = Math.max(-100, Math.min(100, startX + distance * direction))

  const start = performance.now()
  const animate = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    position.value.x = startX + (endX - startX) * progress
    if (progress < 1) requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
  // chance to trip mid-walk
  if (Math.random() < 0.12) setTimeout(() => trip(), 400)
}

// 💤 Idle fidget
function idle() {
  rotation.value = Math.random() * 10 - 5
  setTimeout(() => (rotation.value = 0), 1000)
}

// 👀 Look left/right slowly
function lookAround() {
  const tilt = Math.random() * 15 - 7
  rotation.value = tilt
  setTimeout(() => (rotation.value = 0), 1500)
}

// 🦘 Jump
function jump() {
  const baseY = position.value.y
  position.value.y = baseY - 60
  setTimeout(() => (position.value.y = baseY), 400)
  speech.value = 'Boing!'
  setTimeout(() => (speech.value = null), 1200)
}

// 🤕 Trip & fall animation
function trip() {
  if (isTripping.value) return
  isTripping.value = true
  const originalY = position.value.y
  rotation.value = 25 * (Math.random() < 0.5 ? -1 : 1)
  position.value.y = originalY + 10
  speech.value = 'Oops!'
  setTimeout(() => {
    rotation.value = 0
    position.value.y = originalY
    speech.value = null
    isTripping.value = false
  }, 900)
}

// 💬 Speak randomly
function trySpeak() {
  if (Math.random() < 0.3) speak()
}
function speak() {
  const hungryLines = ['Grrr...', 'I need snacks...', 'My belly rumbles...']
  const sadLines = ['I feel lonely...', 'Can we play?', 'Need a hug...']
  const happyLines = ['Hehe!', 'Let’s play!', 'Boop!', 'Feeling strong!']
  const neutralLines = ['Hi there!', 'What a day!', 'Hmmm...', 'Yawn...']
  let pool: string[] = []
  if (creature.hunger < 25) pool = pool.concat(hungryLines)
  if (creature.happiness < 25) pool = pool.concat(sadLines)
  if (creature.happiness > 75) pool = pool.concat(happyLines)
  if (pool.length === 0) pool = neutralLines
  speech.value = pool[Math.floor(Math.random() * pool.length)] ?? null
  setTimeout(() => (speech.value = null), 2500)
}
</script>

<style scoped>
img {
  filter: drop-shadow(0 0 10px rgba(244, 114, 182, 0.6));
  transform-origin: center bottom;
  will-change: transform;
}

/* Hungry rumble */
.animate-rumble {
  animation: rumble 0.4s infinite;
}
@keyframes rumble {
  0% {
    transform: translate(var(--x), var(--y)) rotate(var(--r));
  }
  25% {
    transform: translate(calc(var(--x) + 2px), calc(var(--y) - 1px)) rotate(calc(var(--r) + 1deg));
  }
  50% {
    transform: translate(calc(var(--x) - 2px), calc(var(--y) + 1px)) rotate(calc(var(--r) - 1deg));
  }
  75% {
    transform: translate(calc(var(--x) + 1px), calc(var(--y) - 2px)) rotate(calc(var(--r) + 0.5deg));
  }
  100% {
    transform: translate(var(--x), var(--y)) rotate(var(--r));
  }
}

/* Very happy subtle pulsing */
.animate-happy {
  animation: happyPulse 2.8s ease-in-out infinite;
}
@keyframes happyPulse {
  0%,
  100% {
    filter: drop-shadow(0 0 10px rgba(244, 114, 182, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 14px rgba(244, 114, 182, 0.9));
  }
}

/* 🗨️ Speech bubble animation */
.animate-fade {
  animation: fadeInOut 2.4s ease-in-out;
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
