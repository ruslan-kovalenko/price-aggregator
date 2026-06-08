<template>
  <figure>
    <input
      type="text"
      name="request"
      v-model="inputRequest"
      @keyup.enter="executeRequest"
      :disabled="loading"
    />
    <img v-if="loading" src="@/assets/spinner.gif" alt="spinner" />
    <figcaption>Введіть категорію товару, або найменування для здійснення пошуку</figcaption>
  </figure>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputRequest = ref('')
const loading = ref(false)

const props = defineProps({
  callback: {
    type: Function as PropType<object>,
    required: true,
  },
})

const executeRequest = async () => {
  loading.value = true
  const result = await props.callback(inputRequest.value)

  if (result) {
  }

  loading.value = false
}
</script>

<style lang="scss" scoped>
figure {
  width: 100%;
  max-width: 100%;
  padding: 1rem;

  .success-message {
    font-size: 1.3rem;
    color: red;
    font-weight: 700;
    opacity: 0;
    transition: opacity 0.5s ease-out;
  }

  input {
    // width: clamp(20rem, 80vw, 80rem);
    width: 100%;
    min-height: 90px;
    opacity: 0.9;
    outline: none;
    border: none;
    border-radius: 5px;
    color: #000;
    font-size: 2.2rem;
    padding: 0px 20px;
    box-sizing: border-box;

    &::placeholder {
      color: #726363;
      font-size: 2rem;
    }
  }

  img {
    position: absolute;
    transform: translateY(25%);
    right: 17px;
  }

  figcaption {
    margin-top: 10px;
    font-style: italic;
    color: #000;
  }
}
</style>
