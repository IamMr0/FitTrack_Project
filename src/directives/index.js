export const vFocus = {
  mounted: (el) => el.focus()
}

export const vHighlight = {
  mounted: (el, binding) => {
    const val = binding.value
    // Use themed variables if the standard Stage 2 color is used
    if (val === '#e8f5e9' || !val) {
      el.style.backgroundColor = 'var(--highlight-bg, #e8f5e9)'
      el.style.setProperty('color', 'var(--highlight-text, #0f172a)', 'important')
    } else {
      el.style.backgroundColor = val
    }
    el.style.borderRadius = '4px'
    el.style.padding = '2px 4px'
  },
  updated: (el, binding) => {
    const val = binding.value
    if (val === '#e8f5e9' || !val) {
      el.style.backgroundColor = 'var(--highlight-bg, #e8f5e9)'
      el.style.setProperty('color', 'var(--highlight-text, #0f172a)', 'important')
    } else {
      el.style.backgroundColor = val
    }
  }
}
