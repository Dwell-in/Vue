<script setup>
import { onMounted, ref, watch } from 'vue'
import { marked } from '@/lib/markedSetup'

const props = defineProps({
  url: String,
})

const markdown = ref('# hello')
const html = ref()
const markdownToHtml = async () => {
  const output = marked(markdown.value, {
    pedantic: false,
    gfm: true,
    mangle: false,
    headerIds: false,
  })
  return output
}

const mdParsing = async () => {
  if (!props.url) return
  const res = await fetch(props.url)
  const text = await res.text()
  markdown.value = text
  html.value = await markdownToHtml()
}

onMounted(async () => {
  await mdParsing()
})

watch(
  () => props.url,
  async () => {
    await mdParsing()
  },
)
</script>

<template>
  <div class="md" v-if="html" v-html="html"></div>
</template>

<style>
.hljs {
  background: #def4fe !important;
}
blockquote {
  background-color: #f8f9fa;
  margin: 0;
  padding: 20px 40px;
  border-left: 5px solid #20c997;
}
code:not(pre > code) {
  background-color: #e9ecef;
  padding: 3px 5px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 0.9rem;
}
</style>

<style scoped>
:deep(img) {
  max-width: 100%;
}
:deep(table) {
  border-collapse: collapse;
}
:deep(th),
:deep(td) {
  border: 1px solid #adb5bd;
  padding: 20px;
}
:deep(thead) {
  border-bottom: 3px solid #adb5bd;
}
</style>
