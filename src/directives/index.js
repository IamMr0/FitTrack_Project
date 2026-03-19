export const vFocus = {
  mounted: (el) => el.focus()
}

export const vHighlight = {
  mounted: (el, binding) => {
    el.style.backgroundColor = binding.value || '#e8f5e9'
    el.style.borderRadius = '4px'
    el.style.padding = '2px 4px'
  },
  updated: (el, binding) => {
    el.style.backgroundColor = binding.value || '#e8f5e9'
  }
}
