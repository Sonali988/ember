import { usePresentationStore } from '@store/presentationStore'

export const setupHotkeys = () => {
  const { nextSlide, previousSlide, blank, unblank, displayState } = usePresentationStore()

  const handleKeyDown = (e: KeyboardEvent) => {
    // Prevent hotkeys when typing in inputs
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return
    }

    // Navigation
    if (e.code === 'Space' || e.code === 'ArrowRight') {
      e.preventDefault()
      nextSlide()
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault()
      previousSlide()
    }
    // Blank screen
    else if (e.key.toLowerCase() === 'b') {
      e.preventDefault()
      if (displayState.isBlank) {
        unblank()
      } else {
        blank()
      }
    }
    // Clear (End key)
    else if (e.code === 'End') {
      e.preventDefault()
      blank()
    }
  }

  window.addEventListener('keydown', handleKeyDown)

  return () => {
    window.removeEventListener('keydown', handleKeyDown)
  }
}
