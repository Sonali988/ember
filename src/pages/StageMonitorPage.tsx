import React, { useEffect, useState } from 'react'
import { StageMonitor } from '@components/StageMonitor'
import { usePresentationStore } from '@store/presentationStore'
import { ScreenMessage, Slide } from '@types/index'

export const StageMonitorPage: React.FC = () => {
  const {
    displayState,
    currentSong,
    sermonNotes,
    liveVerse,
    detectedVerse,
    verseLanguage,
    setSermonNotes,
    setLiveVerse,
    setDetectedVerse,
    setVerseLanguage,
  } = usePresentationStore()
  const [nextSlide, setNextSlide] = useState<Slide | null>(null)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    // Find next slide
    if (currentSong && displayState.currentSlide) {
      const currentIdx = currentSong.slides.findIndex(
        (s) => s.id === displayState.currentSlide?.id
      )
      if (currentIdx !== -1 && currentIdx < currentSong.slides.length - 1) {
        setNextSlide(currentSong.slides[currentIdx + 1])
      }
    }
  }, [displayState.currentSlide, currentSong])

  useEffect(() => {
    window.electronAPI?.onStageUpdate((payload) => {
      const data = payload as ScreenMessage
      if (typeof data.notes === 'string') setSermonNotes(data.notes)
      if (data.language) setVerseLanguage(data.language)
      if (data.type === 'verse') {
        setDetectedVerse(data.verse || null)
        setLiveVerse(data.verse || null)
      }
      if (data.type === 'verse-clear') {
        setLiveVerse(null)
        setDetectedVerse(null)
      }
    })
  }, [setDetectedVerse, setLiveVerse, setSermonNotes, setVerseLanguage])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <StageMonitor
      currentSlide={displayState.currentSlide || null}
      nextSlide={nextSlide}
      currentTime={timer}
      totalTime={1000}
      notes={sermonNotes || displayState.currentSlide?.notes}
      verse={liveVerse || detectedVerse}
      verseLanguage={verseLanguage}
    />
  )
}
