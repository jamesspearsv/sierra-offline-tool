<script setup lang="ts">
import { ref } from 'vue'
import FeatherIcon from '@/components/FeatherIcon.vue'
import { SERVER_URL } from '@/host'

const inputValue = ref('')
const patronBarcode = ref('')
const itemBarcodes = ref<string[]>([])
const error = ref('')

function handleSubmit() {
  if (inputValue.value) {
    if (!patronBarcode.value) patronBarcode.value = inputValue.value
    else itemBarcodes.value.push(inputValue.value)

    inputValue.value = ''
  }
}

function resetCheckout() {
  inputValue.value = ''
  patronBarcode.value = ''
  itemBarcodes.value = []
  error.value = ''
}

function removeItem(index: number) {
  error.value = ''
  itemBarcodes.value.splice(index, 1)
}

function submitCheckout() {
  const url = `http://${SERVER_URL}/api/checkouts`

  async function postCheckout() {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        patronBarcode: patronBarcode.value,
        itemBarcodes: itemBarcodes.value,
      }),
    })

    const json = await res.json()

    if (!json.success) {
      // TODO: Improve error handling
      error.value = 'Unable to save checkout. Try again'
    } else {
      resetCheckout()
    }
  }

  postCheckout()
}
</script>

<template>
  <main>
    <section class="form-section">
      <form @submit.prevent="handleSubmit">
        <fieldset>
          <label for="barcode">{{ !patronBarcode ? 'Patron' : 'Item' }} Barcode</label>
          <input type="text" name="barcode" v-model.trim="inputValue" autocomplete="off" />
        </fieldset>
      </form>
      <button
        :class="{ 'hidden-element': !patronBarcode, 'reset-button': true }"
        @click="resetCheckout"
      >
        <FeatherIcon icon="refresh-cw" />
        <span>Reset</span>
      </button>
    </section>
    <section :class="{ 'checkout-section': true, 'hidden-element': !patronBarcode }">
      <h3>Current Checkout</h3>
      <div>
        Patron Barcode: <span>{{ patronBarcode }}</span>
      </div>
      <div>
        <div>Item Barcodes</div>
        <div v-for="(item, index) in itemBarcodes">
          <div :key="index" class="item-barcode">
            <button @click="() => removeItem(index)"><FeatherIcon icon="x" /></button>
            <span>
              {{ item }}
            </span>
          </div>
        </div>
      </div>
      <div class="button-container">
        <button
          v-if="itemBarcodes.length > 0 && patronBarcode"
          @click="submitCheckout"
          class="submit-button"
        >
          Submit checkout
        </button>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </section>
  </main>
</template>
<style scoped>
main {
  display: flex;
  /* gap: 1rem; */
  padding: var(--sp-0);
  position: absolute;
  bottom: 0;
  top: var(--sp-4);
  left: 0;
  right: 0;
  overflow-x: hidden;
}

section {
  transition: all 200ms ease-in-out;
}

.form-section:has(+ .checkout-section.hidden-element) {
  width: 100%;
}

.form-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* height: 100%; */
  width: 70%;
}

.reset-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkout-section.hidden-element {
  margin-right: -30%;
}

.checkout-section {
  display: flex;
  flex-direction: column;
  gap: var(--sp-00);
  width: 30%;
  height: 100%;
  background-color: var(--pico-card-sectioning-background-color);
  padding: var(--sp-1);
  border-radius: 0.5rem;
}

.button-container {
  margin-top: auto;
  display: flex;
  justify-content: center;
}

.item-barcode {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.item-barcode > button {
  padding: 0.25rem;
}

.item-barcode svg {
  height: 14px;
  width: 14px;
}

.hidden-element {
  opacity: 0;
}

.error-message {
  width: 100%;
  text-align: center;
  color: var(--c-danger);
  font-size: 0.75rem;
  font-style: italic;
}
</style>
