import { reactive } from 'vue'

export function useFloatingWindow({ x = 420, y = 120 } = {}) {
  const popup = reactive({ show: false, x, y })
  let active = false
  let offsetX = 0
  let offsetY = 0
  let width = 0
  let height = 0

  const open = (next = {}) => {
    Object.assign(popup, { show: true, ...next })
  }

  const close = () => {
    popup.show = false
  }

  const style = () => ({ left: `${popup.x}px`, top: `${popup.y}px` })

  const startDrag = (event) => {
    if (event.button !== 0 || event.target.closest('button')) return
    const modal = event.currentTarget.closest('.fm-window')
    if (!modal) return
    const rect = modal.getBoundingClientRect()
    active = true
    offsetX = event.clientX - rect.left
    offsetY = event.clientY - rect.top
    width = rect.width
    height = rect.height
    document.body.classList.add('fm-window-dragging')
    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', stopDrag)
  }

  const drag = (event) => {
    if (!active) return
    const maxX = Math.max(window.innerWidth - width - 8, 8)
    const maxY = Math.max(window.innerHeight - height - 8, 8)
    popup.x = Math.min(Math.max(event.clientX - offsetX, 8), maxX)
    popup.y = Math.min(Math.max(event.clientY - offsetY, 8), maxY)
  }

  const stopDrag = () => {
    active = false
    document.body.classList.remove('fm-window-dragging')
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('mouseup', stopDrag)
  }

  return { popup, open, close, style, startDrag, stopDrag }
}
