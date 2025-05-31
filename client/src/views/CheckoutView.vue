<script setup lang="ts">
import { ref } from 'vue'
import FeatherIcon from '@/components/FeatherIcon.vue'

const inputValue = ref('')
const patronBarcode = ref('12345')
const itemBarcodes = ref<string[]>(['12345'])
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
}

function removeItem(index: number) {
  itemBarcodes.value.splice(index, 1)
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
      <button :class="{ 'hidden-element': !patronBarcode }" @click="resetCheckout">
        <FeatherIcon icon="refresh-cw" />
      </button>
    </section>
    <section :class="{ 'checkout-section': true, 'hidden-element': !patronBarcode }">
      <h3>Current Checkout</h3>
      <div>
        Patron: <span>{{ patronBarcode }}</span>
      </div>
      <div>
        Items
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
        <!-- TODO: Add server action to submit checkout -->
        <button v-if="itemBarcodes.length > 0 && patronBarcode" class="submit-button">
          Submit checkout
        </button>
      </div>
    </section>
  </main>
</template>
<style scoped>
main {
  display: flex;
  margin: 2rem;
  gap: 1rem;
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
  height: calc(100dvh - 5rem);
  width: 70%;
}

.checkout-section.hidden-element {
  margin-right: -30%;
}

.checkout-section {
  width: 30%;
  position: relative;
  background-color: color-mix(in srgb, var(--pico-background-color), #ffffff 4%);
  padding: 2rem;
  overflow-y: scroll;
  border-radius: 0.5rem;
}

.checkout-section > .button-container {
  display: flex;
  justify-content: center;
  position: absolute;
  top: 90%;
  left: 0;
  right: 0;
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
</style>
