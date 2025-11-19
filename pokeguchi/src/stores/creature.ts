import { defineStore } from 'pinia'

export interface CreatureState {
  name: string
  level: number
  hunger: number
  happiness: number
  strength: number
  evolutionStage: number
  imageFront?: string
  imageBack?: string
  imageSide?: string
}

export const useCreatureStore = defineStore('creature', {
  state: (): CreatureState => ({
    name: 'Fluffi',
    level: 1,
    hunger: 50, // 0 = starving, 100 = full
    happiness: 50, // 0 = sad, 100 = ecstatic
    strength: 10,
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
    loadFromDb(row: Partial<CreatureState> & { evolution_stage?: number }) {
      // Map DB snake_case to store camelCase
      if (row.name !== undefined) this.name = row.name
      if (row.level !== undefined) this.level = row.level
      if (row.hunger !== undefined) this.hunger = row.hunger
      if (row.happiness !== undefined) this.happiness = row.happiness
      if (row.strength !== undefined) this.strength = row.strength
      if (row.evolutionStage !== undefined) this.evolutionStage = row.evolutionStage
      if (row.evolution_stage !== undefined) this.evolutionStage = row.evolution_stage
      // images (DB fields likely image_front/back/side)
      // Access possible snake_case image fields without using 'any'
      const imageFrontKey = (row as Record<string, unknown>)['image_front']
      const imageBackKey = (row as Record<string, unknown>)['image_back']
      const imageSideKey = (row as Record<string, unknown>)['image_side']
      if (typeof imageFrontKey === 'string') this.imageFront = imageFrontKey
      if (typeof imageBackKey === 'string') this.imageBack = imageBackKey
      if (typeof imageSideKey === 'string') this.imageSide = imageSideKey
    },
    reset() {
      this.name = 'Fluffi'
      this.level = 1
      this.hunger = 50
      this.happiness = 50
      this.strength = 10
      this.evolutionStage = 1
      this.imageFront = undefined
      this.imageBack = undefined
      this.imageSide = undefined
    },
    feed() {
      this.hunger = Math.min(this.hunger + 20, 100)
      this.happiness = Math.min(this.happiness + 5, 100)
    },
    play() {
      this.happiness = Math.min(this.happiness + 15, 100)
      this.hunger = Math.max(this.hunger - 10, 0)
    },
    train() {
      this.strength += 1
      this.hunger = Math.max(this.hunger - 15, 0)
      this.happiness = Math.max(this.happiness - 5, 0)
      if (this.strength % 5 === 0) this.levelUp()
    },
    levelUp() {
      this.level++
      this.evolutionStage = Math.min(this.evolutionStage + 1, 3)
    },
  },
})
