import React, { useEffect, useState } from 'react'
import { DetectedVerse, Slide, VerseLanguage } from '../types/index'
import './StageMonitor.css'

interface StageMonitorProps {
  currentSlide: Slide | null
  nextSlide: Slide | null
  currentTime: number
  totalTime: number
  notes?: string
  verse?: DetectedVerse | null
  verseLanguage?: VerseLanguage
}

export const StageMonitor: React.FC<StageMonitorProps> = ({
  currentSlide,
  nextSlide,
  currentTime,
  totalTime,
  notes,
  verse,
  verseLanguage = 'en',
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    setTimeRemaining(totalTime - currentTime)
  }, [currentTime, totalTime])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="stage-monitor">
      <div className="monitor-section current-slide">
        <h2>Now Playing</h2>
        <div className="slide-preview">
          {currentSlide ? (
            <div className="preview-content">
              <p className="preview-text">{currentSlide.content}</p>
              <p className="preview-title">{currentSlide.title}</p>
            </div>
          ) : (
            <p className="empty">No slide</p>
          )}
        </div>
      </div>

      <div className="monitor-section next-slide">
        <h2>Next</h2>
        <div className="slide-preview">
          {nextSlide ? (
            <div className="preview-content">
              <p className="preview-text">{nextSlide.content}</p>
              <p className="preview-title">{nextSlide.title}</p>
            </div>
          ) : (
            <p className="empty">No more slides</p>
          )}
        </div>
      </div>

      <div className="monitor-section timer">
        <h2>Time</h2>
        <div className="time-display">
          <div className="time-box">
            <span className="label">Elapsed</span>
            <span className="time-value">{formatTime(currentTime)}</span>
          </div>
          <div className="time-box">
            <span className="label">Remaining</span>
            <span className="time-value">{formatTime(Math.max(0, timeRemaining))}</span>
          </div>
        </div>
      </div>

      {verse && (
        <div className="monitor-section notes">
          <h2>Verse</h2>
          <div className="notes-content">
            <strong>{verse.reference}</strong>
            <p>{verseLanguage === 'hi' ? verse.textHI : verse.textEN}</p>
          </div>
        </div>
      )}

      <div className="monitor-section notes">
        <h2>Sermon notes</h2>
        <div className="notes-content">{notes || 'No notes yet'}</div>
      </div>
    </div>
  )
}
