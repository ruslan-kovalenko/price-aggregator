<template>
  <main>
    <picture>
      <source media="(min-width: 1201px)" srcset="./assets/background-xl.jpg" />
      <source media="(min-width: 768px)" srcset="./assets/background-l.jpg" />
      <img src="./assets/background-sm.jpg" alt="Background" />
    </picture>
    <InputRequest :callback="requestCallback" />
  </main>
</template>

<script setup lang="ts">
import InputRequest from './components/InputRequest.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios';

const requestCallback = async (input: string): Promise<any> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const data = await fetch(`${apiUrl}/products?input=beer`);
  console.log(await data.json());
}
</script>

<style scoped>
main {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

picture,
img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  opacity: 0.65;
}
</style>
