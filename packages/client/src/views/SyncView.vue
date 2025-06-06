<script setup lang="ts">
import { onMounted, ref } from 'vue'
type Checkout = {
  id: number
  patronBarcode: string
  itemBarcode: string
  checkoutDate: string
}

const checkouts = ref<Checkout[] | null>(null)

onMounted(fetchCheckouts)

async function fetchCheckouts() {
  const url = `/api/checkouts`
  const res = await fetch('/api/checkouts')
  const result = await res.json()
  if (result.success) {
    checkouts.value = result.data as Checkout[]
  }
}

function exportCheckouts() {
  const confirmation = confirm(
    'Are you sure you want to export? These checkouts will be marked as synced and hidden from view?',
  )

  if (confirmation) {
    let link = document.createElement('a')
    link.download = `offline_checkout_${new Date().toISOString()}.csv`
    let checkoutsString = 'checkout_id,patron_barcode,item_barcode\n'

    checkouts.value?.forEach((checkout) => {
      checkoutsString =
        checkoutsString + `${checkout.id},${checkout.patronBarcode},${checkout.itemBarcode}\n`
    })

    const blob = new Blob([checkoutsString], { type: 'text/csv' })
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
    link.remove()
    updateCheckouts()
  }
}

async function updateCheckouts() {
  if (!checkouts.value || !checkouts.value?.length) return
  const checkoutIDs = checkouts.value.map((checkout) => checkout.id)
  const res = await fetch('/api/sync', {
    method: 'POST',
    body: JSON.stringify(checkoutIDs),
  })
  const result = await res.json()
  if (!result.success) {
    return
  }

  await fetchCheckouts()
}
</script>
<template>
  <main>
    <section>
      <div class="action-bar">
        <article v-if="checkouts">
          <div class="summary-card">
            <span>Total Unsynced Checkouts:</span>
            <span>{{ checkouts.length }}</span>
          </div>
        </article>
        <button @click="exportCheckouts" :disabled="!checkouts?.length">Export CSV</button>
      </div>
    </section>
    <table>
      <thead>
        <tr>
          <th>Checkout Date</th>
          <th>Patron Barcode</th>
          <th>Item Barcode</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="checkout in checkouts">
          <td>{{ new Date(checkout.checkoutDate).toLocaleString() }}</td>
          <td>{{ checkout.patronBarcode }}</td>
          <td>{{ checkout.itemBarcode }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>
<style scoped>
main {
  width: 75%;
  margin: auto;
}

.action-bar {
  min-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

article {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.summary-card > span:first-child {
  margin-right: var(--sp-00);
}

th,
td {
  text-align: center;
}
</style>
