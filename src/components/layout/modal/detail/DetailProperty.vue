<script setup>
import PropertyFilter from './PropertyFilter.vue'
import DealCard from './DealCard.vue'
</script>

<template>
  <div class="detail-property">
    <PropertyFilter />
    <div>list</div>
    <DealCard></DealCard>
  </div>
</template>

<style lang="scss" scoped>
* {
  color: white;
}
.detail-property {
  display: flex;
  & .filter {
    width: 30%;
  }
}
</style>
