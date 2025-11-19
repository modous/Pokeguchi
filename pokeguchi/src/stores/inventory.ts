import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { useCreatureStore } from '@/stores/creature'

export interface InventoryItem {
  id: string
  user_id: string
  item_name: string
  strength: number
  intelligence: number
  speed: number
  luck: number
  health: number
  created_at: string
}

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: [] as InventoryItem[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchInventory(userId: string) {
      this.loading = true
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) this.error = error.message
      else this.items = (data ?? []) as InventoryItem[]

      this.loading = false
    },

    async addItem(userId: string, item: Omit<InventoryItem, 'id' | 'created_at' | 'user_id'>) {
      const { data, error } = await supabase
        .from('inventory')
        .insert([{ user_id: userId, ...item }])
        .select()

      if (error) {
        this.error = error.message
        return null
      }

      if (data && data[0]) this.items.unshift(data[0] as InventoryItem)
      return data[0] as InventoryItem
    },

    async addItemAndApply(
      userId: string,
      item: Omit<InventoryItem, 'id' | 'created_at' | 'user_id'>,
    ) {
      const creature = useCreatureStore()
      const newItem = await this.addItem(userId, item)
      if (newItem) {
        creature.strength += item.strength ?? 0
        creature.intelligence += item.intelligence ?? 0
        creature.speed += item.speed ?? 0
        creature.luck += item.luck ?? 0
        creature.health += item.health ?? 0

        await creature.updateCreature({
          strength: creature.strength,
          intelligence: creature.intelligence,
          speed: creature.speed,
          luck: creature.luck,
          health: creature.health,
        })
      }
      return newItem
    },

    async removeItem(itemId: string) {
      const { error } = await supabase.from('inventory').delete().eq('id', itemId)
      if (!error) this.items = this.items.filter((item) => item.id !== itemId)
      else this.error = error.message
    },

    // 🎲 Random loot generator — scaled by creature level
    generateRandomItem(level: number): Omit<InventoryItem, 'id' | 'created_at' | 'user_id'> {
      const base = Math.max(1, Math.floor(level / 2))
      const types = ['Sword', 'Amulet', 'Boots', 'Ring', 'Helm', 'Potion']
      const name = types[Math.floor(Math.random() * types.length)]

      return {
        item_name: `${name} of Power`,
        strength: Math.floor(Math.random() * base) + 1,
        intelligence: Math.floor(Math.random() * base),
        speed: Math.floor(Math.random() * base),
        luck: Math.floor(Math.random() * base),
        health: Math.floor(Math.random() * base * 5),
      }
    },
  },
})
