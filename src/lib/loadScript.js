// src/utils/loadScript.js
export function loadScript(src, crossorigin = false) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    if (crossorigin) script.crossOrigin = 'anonymous'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}
