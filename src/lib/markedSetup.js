import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
// import 'highlight.js/styles/github.css'
import 'highlight.js/styles/github-dark.css'

let initialized = false

const setupMarked = () => {
  if (!initialized) {
    marked.use(
      markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext'
          return hljs.highlight(code, { language }).value
        },
      }),
    )
    initialized = true
  }
}

setupMarked()

export { marked }
