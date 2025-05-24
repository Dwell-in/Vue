<script setup>
import PropertyFilter from './PropertyFilter.vue';
</script>

<template>
  <div class="detail-property">
    <PropertyFilter />
    <div>
      list
    </div>
  </div>
</template>


<style lang="scss" scoped>
*{
  color: white;
}
.detail-property{
  display: flex;
  & .filter{
    width: 30%;
  }
}
</style>
