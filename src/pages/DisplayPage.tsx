import React, { useEffect } from 'react'
import { DisplayEngine } from '@components/DisplayEngine'
import { usePresentationStore } from '@store/presentationStore'
import { ScreenMessage } from '@types/index'

export const DisplayPage: React.FC = () => {
  const { displayState, liveVerse, verseLanguage, setLiveVerse, setVerseLanguage } = usePresentationStore()

  useEffect(() => {
    window.electronAPI?.onDisplayUpdate((payload) => {
      const data = payload as ScreenMessage
      if (data.type === 'verse' && data.verse) {
        setLiveVerse(data.verse)
        if (data.language) setVerseLanguage(data.language)
      }
      if (data.type === 'verse-clear') setLiveVerse(null)
    })
  }, [setLiveVerse, setVerseLanguage])

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <DisplayEngine
        slide={displayState.currentSlide || null}
        isBlank={displayState.isBlank}
        backgroundMedia={displayState.currentSlide?.backgroundColor}
        verse={liveVerse}
        verseLanguage={verseLanguage}
      />
    </div>
  )
}
