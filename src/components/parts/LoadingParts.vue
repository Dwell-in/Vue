<script setup>
  const props = defineProps({
    size: String,
    background: String
  })
</script>

<template>
  <div class="loading" :class="props.background">
    <i class="fa-solid fa-spinner fa-spin" :class="props.size"></i>
  </div>
</template>

<style lang="scss" scoped>
.loading{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
.black{
  background-color: #0000007a;
}
.x2{
  font-size: 2em;
}
.x3{
  font-size: 3em;
}
.x4{
  font-size: 4em;
}
.x5{
  font-size: 5em;
}
</style>
