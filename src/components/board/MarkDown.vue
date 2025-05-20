<script setup>
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const props = defineProps({
  url: String,
})

const markdown = ref('# h')
const html = ref('')
const markdownToHtml = async () => {
  marked.use(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
      },
    }),
  )
  const output = await marked(markdown.value, {
    async: true,
    pedantic: false,
    gfm: true,
    mangle: false,
    headerIds: false,
  })
  return output
}

onMounted(async () => {
  const res = await fetch(props.url)
  const text = await res.text()
  markdown.value = text
  html.value = await markdownToHtml()
})
</script>

<template>
  <div class="md" v-html="html"></div>
</template>

<style>
.hljs {
  background: #def4fe !important;
}
</style>
