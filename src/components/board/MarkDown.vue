<script setup>
import { onMounted, ref, watch } from 'vue'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const props = defineProps({
  url: String,
})

const markdown = ref('# h')
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
  const res = await fetch(props.url)
  const text = await res.text()
  markdown.value = text
  html.value = await markdownToHtml()
}

onMounted(async () => {
  marked.use(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
      },
    }),
  )
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
</style>
