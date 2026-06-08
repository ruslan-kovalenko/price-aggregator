<template>
  <main>
    <picture>
      <source media="(min-width: 1201px)" srcset="./assets/background-xl.jpg" />
      <source media="(min-width: 768px)" srcset="./assets/background-l.jpg" />
      <img src="./assets/background-sm.jpg" alt="Background" />
    </picture>
    <div class="content">
      <InputRequest :callback="requestCallback" />
      <Discounts :data="data" />
    </div>
  </main>
</template>

<script setup lang="ts">
import Product from '../types/product'
import InputRequest from './components/InputRequest.vue'
import Discounts from './components/Discounts.vue'
import { ref } from 'vue'

const data = ref<Product[]>([])

const requestCallback = async (input: string): Promise<Product[]> => {
  const apiUrl = import.meta.env.VITE_API_URL

  try {
    const fetchResponse = await fetch(`${apiUrl}/products?input=${input}`)
    data.value = await fetchResponse.json()
  } catch (err: Error) {
    console.log(err)
    data.value = []
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'FixelVariable';
  src: url('@/assets/FixelVariable.ttf') format('ttf');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

main {
  position: relative;
  width: 100%;
  overflow: hidden;
}

picture,
img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.65;
  z-index: 0;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  z-index: 1;
  position: relative;
  width: clamp(20rem, 80vw, 80rem);
  margin: 0 auto;
}
</style>
