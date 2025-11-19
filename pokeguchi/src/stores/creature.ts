import { defineStore } from 'pinia'

export const useCreatureStore = defineStore('creature', {
  state: () => ({
    name: 'Fluffi',
    level: 1,
    hunger: 50, // 0 = starving, 100 = full
    happiness: 50, // 0 = sad, 100 = ecstatic
    strength: 10,
    evolutionStage: 1,
  }),

  getters: {
    moodDescription: (state) => {
      if (state.happiness > 80) return '😄 Very happy'
      if (state.happiness > 50) return '🙂 Content'
      if (state.happiness > 30) return '😐 Neutral'
      return '😢 Sad'
    },
  },

  actions: {
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
