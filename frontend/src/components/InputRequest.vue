<template>
  <figure>
    <input
      type="text"
      name="request"
      placeholder="наприклад: пиво"
      v-model="inputRequest"
      @keyup.enter="executeRequest"
      :disabled="loading"
    />
    <img v-if="loading" src="@/assets/spinner.gif" alt="spinner" />
    <figcaption>
      Введіть категорію товару, або найменування для здійснення пошуку
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputRequest = ref('')
const loading = ref(false)

const props = defineProps({
  callback: {
    type: Function as PropType<Object>,
    required: true
  }
})

const executeRequest = async () => {
  loading.value = true
  const result = await props.callback(inputRequest.value)

  if (result) {

  }

  loading.value = false
}

const unsetResultOpacity = () => {
}
</script>

<style lang="scss" scoped>
figure {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .success-message {
    font-size: 1.3rem;
    color: red;
    font-weight: 700;
    opacity: 0;
    transition: opacity 0.5s ease-out;
  }

  input {
    width: 80vw;
    min-height: 90px;
    opacity: 0.9;
    outline: none;
    border: none;
    border-radius: 5px;
    color: #000;
    font-size: 2.2rem;
    padding: 0px 20px;

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

@media (max-width: 767px) {
  figure input {
    width: 96vw;
  }
}
</style>
