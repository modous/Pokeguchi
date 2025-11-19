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
        <p>🧠 Intelligence: {{ creatureStore.intelligence }}</p>
        <p>💪 Strength: {{ creatureStore.strength }}</p>
        <p>😊 Happiness: {{ creatureStore.happiness }}</p>
        <p>🍗 Hunger: {{ creatureStore.hunger }}</p>
        <p>✨ Evolution: {{ creatureStore.evolutionStage }}</p>
      </div>

      <XPBar />
    </div>

    <div v-else class="text-gray-400 mb-6">No creature yet. Hatch one first!</div>

    <button
      @click="startBattle"
      class="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded text-white font-semibold"
    >
      Start Battle ⚔️
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCreatureStore } from '@/stores/creature'
import { useInventoryStore } from '@/stores/inventory'
import CreatureDisplay from '@/components/CreatureDisplay.vue'
import XPBar from '@/components/XPBar.vue'
import { supabase } from '@/lib/supabase'

const creatureStore = useCreatureStore()
const inventoryStore = useInventoryStore()

interface Ability {
  name: string
  type: string
  power: number
  speed: number
  accuracy: number
}

interface Opponent {
  name: string
  level: number
  strength: number
  health: number
  intelligence: number
  speed: number
  luck: number
  abilities: Ability[]
}

// Random ability generator
function randomAbility(stats: Pick<Opponent, 'strength' | 'speed' | 'luck'>): Ability {
  const names = ['Fire Pulse', 'Toxic Slam', 'Ice Wave', 'Shadow Bite', 'Lightning Fang']
  return {
    name: names[Math.floor(Math.random() * names.length)]!,
    type: ['Fire', 'Water', 'Earth', 'Air', 'Light', 'Dark'][Math.floor(Math.random() * 6)]!,
    power: Math.floor(20 + Math.random() * stats.strength * 1.5),
    speed: Math.floor(10 + Math.random() * stats.speed * 1.3),
    accuracy: Math.floor(70 + Math.random() * stats.luck),
  }
}

// Random opponent scaled to level ±3
function generateOpponent(level: number): Opponent {
  const lvl = Math.max(1, level + Math.floor(Math.random() * 7) - 3)
  const base = {
    strength: lvl * (4 + Math.random() * 3),
    health: lvl * (40 + Math.random() * 10),
    intelligence: lvl * (3 + Math.random() * 2),
    speed: lvl * (3 + Math.random() * 2),
    luck: lvl * (2 + Math.random() * 3),
  }

  return {
    name: ['Bliznox', 'Pyron', 'Leafor', 'Shadowmutt', 'Crystix'][Math.floor(Math.random() * 5)]!,
    level: lvl,
    ...base,
    abilities: [randomAbility(base), randomAbility(base), randomAbility(base)],
  }
}

async function startBattle() {
  if (!creatureStore || !creatureStore.level) {
    alert('You must hatch a creature first!')
    return
  }

  const player = creatureStore
  const opponent = generateOpponent(player.level)
  let playerHP = 100 + player.strength * 3
  let enemyHP = opponent.health
  const playerPower = player.strength + player.level * 2
  const enemyPower = opponent.strength + opponent.level * 2

  while (playerHP > 0 && enemyHP > 0) {
    enemyHP -= playerPower * (0.8 + Math.random() * 0.4)
    if (enemyHP <= 0) break
    playerHP -= enemyPower * (0.8 + Math.random() * 0.4)
  }

  if (playerHP > 0) {
    alert(`🎉 You defeated ${opponent.name}!`)
    player.winBattle()
    await giveLoot()
  } else {
    player.happiness = Math.max(0, player.happiness - 10)
    alert(`💀 ${opponent.name} defeated you!`)
  }
}

async function giveLoot() {
  const possibleLoot = [
    { item_name: 'Iron Sword', strength: 2, intelligence: 0, speed: 3, luck: 0, health: 0 },
    { item_name: 'Swift Boots', strength: 0, intelligence: 0, speed: 5, luck: 0, health: 0 },
    { item_name: 'Arcane Tome', strength: 0, intelligence: 4, speed: 0, luck: 0, health: 0 },
    { item_name: 'Lucky Charm', strength: 0, intelligence: 0, speed: 0, luck: 3, health: 0 },
    { item_name: 'Vital Amulet', strength: 0, intelligence: 0, speed: 0, luck: 0, health: 25 },
  ]

  const loot = possibleLoot[Math.floor(Math.random() * possibleLoot.length)]!

  // ✅ get user from supabase auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    alert('Not logged in — can’t save loot.')
    return
  }
  const userId = user.id

  // ✅ add to DB & apply to creature
  const added = await inventoryStore.addItem(userId, loot)
  if (added) {
    await creatureStore.updateCreature({
      strength: creatureStore.strength + loot.strength,
      speed: creatureStore.speed + loot.speed,
      intelligence: creatureStore.intelligence + loot.intelligence,
      luck: creatureStore.luck + loot.luck,
      health: creatureStore.health + loot.health,
    })
    alert(
      `🎁 You found a ${loot.item_name}!\n\n` +
        `+${loot.strength} STR | +${loot.intelligence} INT | ` +
        `+${loot.speed} SPD | +${loot.luck} LUCK | +${loot.health} HP`,
    )
  } else {
    console.error('Inventory error:', inventoryStore.error)
    alert('Failed to add item to inventory.')
  }
}
</script>
