import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase' // 👈 add this import if not present

export interface CreatureState {
  name: string
  level: number
  experience?: number
  experienceToNext?: number
  hunger: number
  happiness: number
  strength: number
  speed: number
  intelligence: number
  luck: number
  health: number
  evolutionStage: number
  imageFront?: string
  imageBack?: string
  imageSide?: string
  id?: string // 👈 optional if stored in DB
}

export const useCreatureStore = defineStore('creature', {
  state: (): CreatureState => ({
    name: 'Fluffi',
    level: 1,
    experience: 0,
    experienceToNext: 100,
    hunger: 50,
    happiness: 50,
    strength: 10,
    speed: 5,
    intelligence: 5,
    luck: 5,
    health: 100,
    evolutionStage: 1,
    imageFront: undefined,
    imageBack: undefined,
    imageSide: undefined,
  }),

  getters: {
    moodDescription: (state: CreatureState): string => {
      if (state.happiness > 80) return '😄 Very happy'
      if (state.happiness > 50) return '🙂 Content'
      if (state.happiness > 30) return '😐 Neutral'
      return '😢 Sad'
    },
  },

  actions: {
    async updateCreature(updates: Partial<CreatureState>) {
      // Skip if not linked to a DB record
      if (!this.id) {
        Object.assign(this, updates)
        return
      }

      const { error } = await supabase.from('creatures').update(updates).eq('id', this.id)

      if (error) {
        console.error('❌ Failed to update creature in DB:', error.message)
      } else {
        Object.assign(this, updates)
      }
    },

    loadFromDb(row: Partial<CreatureState> & { evolution_stage?: number }) {
      if (row.name !== undefined) this.name = row.name
      if (row.level !== undefined) this.level = row.level
      if (row.hunger !== undefined) this.hunger = row.hunger
      if (row.happiness !== undefined) this.happiness = row.happiness
      if (row.strength !== undefined) this.strength = row.strength
      if (row.speed !== undefined) this.speed = row.speed
      if (row.intelligence !== undefined) this.intelligence = row.intelligence
      if (row.luck !== undefined) this.luck = row.luck
      if (row.health !== undefined) this.health = row.health
      if (row.evolutionStage !== undefined) this.evolutionStage = row.evolutionStage
      if (row.evolution_stage !== undefined) this.evolutionStage = row.evolution_stage

      const imageFrontKey = (row as Record<string, unknown>)['image_front']
      const imageBackKey = (row as Record<string, unknown>)['image_back']
      const imageSideKey = (row as Record<string, unknown>)['image_side']
      if (typeof imageFrontKey === 'string') this.imageFront = imageFrontKey
      if (typeof imageBackKey === 'string') this.imageBack = imageBackKey
      if (typeof imageSideKey === 'string') this.imageSide = imageSideKey

      if ((row as Record<string, unknown>)['id'])
        this.id = (row as Record<string, unknown>)['id'] as string
    },

    reset() {
      this.name = 'Fluffi'
      this.level = 1
      this.experience = 0
      this.experienceToNext = 100
      this.hunger = 50
      this.happiness = 50
      this.strength = 10
      this.speed = 5
      this.intelligence = 5
      this.luck = 5
      this.health = 100
      this.evolutionStage = 1
      this.imageFront = undefined
      this.imageBack = undefined
      this.imageSide = undefined
    },

    feed() {
      this.hunger = Math.min(this.hunger + 25, 100)
      this.happiness = Math.min(this.happiness + 10, 100)
      this.gainExperience(5)
    },

    play() {
      this.happiness = Math.min(this.happiness + 15, 100)
      this.hunger = Math.max(this.hunger - 10, 0)
    },

    train() {
      this.strength += 1
      this.hunger = Math.max(this.hunger - 20, 0)
      this.happiness = Math.min(this.happiness + 7, 100)
      this.gainExperience(15)
    },

    winBattle() {
      this.happiness = Math.min(this.happiness + 20, 100)
      this.gainExperience(40)
      this.strength += 2
    },

    gainExperience(amount: number) {
      if (!this.experience || !this.experienceToNext) return
      this.experience += amount
      if (this.experience >= this.experienceToNext) {
        this.experience -= this.experienceToNext
        this.levelUp()
        this.experienceToNext = Math.round(this.experienceToNext * 1.15)
      }
    },

    levelUp() {
      this.level++
      this.evolutionStage = Math.min(this.evolutionStage + 1, 3)
    },

    startLifecycle() {
      const self = this as unknown as { _decayInterval?: ReturnType<typeof setInterval> }
      if (self._decayInterval) return
      self._decayInterval = setInterval(() => {
        this.hunger = Math.max(0, this.hunger - 5)
        this.happiness = Math.max(0, this.happiness - 7)
      }, 60_000)
    },

    stopLifecycle() {
      const self = this as unknown as { _decayInterval?: ReturnType<typeof setInterval> }
      const handle = self._decayInterval
      if (handle) clearInterval(handle)
      self._decayInterval = undefined
    },
  },
})
