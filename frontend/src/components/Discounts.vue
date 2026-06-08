<template>
  <div class="container" v-if="hasAnyItem()">
    <div class="header rowItem">
      <span>Найменування</span>
      <span>Дисконт</span>
      <span>Стара ціна</span>
      <span>Нова ціна</span>
      <span>Посилання</span>
    </div>
    <hr />
    <div v-for="(shopItem, index) in data" :key="index">
      <div class="shopName">{{ getShop(shopItem[0] || {}) }} </div>
      <div v-for="item in shopItem" class="rowItem" :key="item.name">
        <span>{{ item.name }}</span>
        <span class="discount">{{ item.discount }}%</span>
        <span>{{ item.oldPrice }} грн</span>
        <span>{{ item.price }} грн</span>
        <a target="_blank" :href="item.link">Перейти</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types/product';
import { type PropType } from 'vue'

const props = defineProps({
  data: {
    type: Array as PropType<Product[]>,
    required: true
  }
})

const getShop = (product: Product): string => {
  if (!product.link) return ''

  const match = product.link.match(/(?<=https?:\/\/)([^\.\/]+)/);

  return match?.[0]
}

const hasAnyItem = (): boolean => {
  return props.data.flat().some((product: Product) => product);
}
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    grid-template-columns: repeat(5, 20%);
    gap: 1rem;
    height: auto;
    background-color: #fff;
    opacity: 0.9;
    border-radius: 5px;
    padding: 1rem 2rem;
    font-family: 'FixelVariable', sans-serif;
    box-sizing: border-box;
    
    hr {
      margin: 0.5rem 0rem 2rem 0rem;
    }
    
    .rowItem {
      display: grid;
      grid-template-columns: 50% 10% 10% 10% 20%;
      gap: 1rem;
      padding-bottom: 0.4rem;
      
      a {
        color: #006cff;
        text-decoration: initial;
      }
    }
  }
  
  .shopName {
    text-transform: capitalize;
    margin: 1.5rem 0rem;
    color: #006cff;
  }
  
  .discount {
    color: red;
  }
</style>
