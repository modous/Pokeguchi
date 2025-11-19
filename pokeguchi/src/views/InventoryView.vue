<template>
  <div class="max-w-md mx-auto text-center mt-6">
    <h2 class="text-2xl font-bold mb-4">🎒 Inventory</h2>
    <div v-if="inventory.items.length">
      <div
        v-for="item in inventory.items"
        :key="item.id"
        class="bg-white/10 text-gray-200 p-3 rounded mb-2"
      >
        <p class="font-semibold">{{ item.item_name }}</p>
        <small>
          💪 {{ item.strength }} | 🧠 {{ item.intelligence }} | ⚡ {{ item.speed }} | 🍀
          {{ item.luck }} | ❤️ {{ item.health }}
        </small>
      </div>
    </div>
    <p v-else class="text-gray-400">No items yet.</p>
  </div>
</template>

<script setup lang="ts">
import { useInventoryStore } from '@/stores/inventory'
import { onMounted } from 'vue'

const inventory = useInventoryStore()

onMounted(async () => {
  const userId = localStorage.getItem('user_id') || ''
  await inventory.fetchInventory(userId)
})
</script>
