import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { usePresentationStore } from '@store/presentationStore'
import { apiService } from '@services/api'
import { DetectedVerse } from '../types/index'

interface SpeechResultEvent {
  resultIndex: number
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>
}

interface BrowserSpeech {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: SpeechResultEvent) => void) | null
  onerror: ((event: { error?: string }) => void) | null
  onend: (() => void) | null
}

function getRecognizer(): BrowserSpeech | null {
  const ctor = (window as Window & {
    SpeechRecognition?: new () => BrowserSpeech
    webkitSpeechRecognition?: new () => BrowserSpeech
  }).SpeechRecognition || (window as Window & { webkitSpeechRecognition?: new () => BrowserSpeech }).webkitSpeechRecognition
  return ctor ? new ctor() : null
}

export const LiveVerseDetector: React.FC = () => {
  const {
    detectedVerse,
    liveVerse,
    verseLanguage,
    sermonNotes,
    serviceOrderId,
    setDetectedVerse,
    setLiveVerse,
    setVerseLanguage,
  } = usePresentationStore()
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState('')
  const recognizer = useRef<BrowserSpeech | null>(null)
  const pending = useRef<number | null>(null)

  const publish = (verse: DetectedVerse | null, language = verseLanguage) => {
    window.electronAPI?.sendToStageMonitor({
      type: verse ? 'verse' : 'verse-clear',
      verse,
      language,
      notes: sermonNotes,
    })
    window.electronAPI?.sendToDisplay(
      verse ? { type: 'verse', verse, language } : { type: 'verse-clear' }
    )
  }

  const showVerse = (verse: DetectedVerse) => {
    setLiveVerse(verse)
    publish(verse)
  }

  const inspect = (text: string) => {
    const spoken = text.trim()
    if (spoken.length < 6) return
    if (pending.current) window.clearTimeout(pending.current)
    pending.current = window.setTimeout(async () => {
      setStatus('Checking…')
      try {
        const verse = await apiService.detectVerse(spoken, serviceOrderId)
        setDetectedVerse(verse)
        if (!verse) {
          setStatus('No verse in that line')
          return
        }
        setStatus(verse.matchType === 'reference' ? 'Reference found' : 'Suggested from wording')
        if (verse.matchType === 'reference') showVerse(verse)
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Verse lookup failed')
      }
    }, 700)
  }

  const toggleListen = () => {
    if (listening) {
      recognizer.current?.stop()
      setListening(false)
      return
    }
    const next = getRecognizer()
    if (!next) {
      setStatus('Speech recognition is not available in this window')
      return
    }
    next.continuous = true
    next.interimResults = true
    next.lang = verseLanguage === 'hi' ? 'hi-IN' : 'en-US'
    next.onresult = (event) => {
      let line = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        line += event.results[i][0].transcript
      }
      setTranscript(line)
      const last = event.results[event.results.length - 1]
      if (last?.isFinal) inspect(line)
    }
    next.onerror = (event) => setStatus(event.error || 'Microphone error')
    next.onend = () => setListening(false)
    recognizer.current = next
    next.start()
    setListening(true)
    setStatus('Listening')
  }

  const clearVerse = () => {
    setLiveVerse(null)
    setDetectedVerse(null)
    publish(null)
    setStatus('')
  }

  return (
    <section className="pp-sermon-block">
      <header>Verse</header>
      <div className="pp-verse-tools">
        <Button size="small" type={listening ? 'primary' : 'default'} danger={listening} onClick={toggleListen}>
          {listening ? 'Stop' : 'Listen'}
        </Button>
        <Button
          size="small"
          onClick={() => {
            const language = verseLanguage === 'en' ? 'hi' : 'en'
            setVerseLanguage(language)
            if (liveVerse) publish(liveVerse, language)
          }}
        >
          {verseLanguage === 'en' ? 'AMP' : 'HHBD'}
        </Button>
        <Button size="small" onClick={clearVerse} disabled={!liveVerse && !detectedVerse}>
          Clear
        </Button>
      </div>
      <textarea
        value={transcript}
        placeholder="Speak, or type a line such as John 3:16"
        onChange={(event) => {
          setTranscript(event.target.value)
          inspect(event.target.value)
        }}
      />
      {status && <p className="pp-verse-status">{status}</p>}
      {detectedVerse && (
        <div className="pp-verse-card">
          <strong>{detectedVerse.reference}</strong>
          <p>{verseLanguage === 'hi' ? detectedVerse.textHI : detectedVerse.textEN}</p>
          {detectedVerse.matchType === 'text' && detectedVerse.reference !== liveVerse?.reference && (
            <Button size="small" type="primary" onClick={() => showVerse(detectedVerse)}>
              Show on screens
            </Button>
          )}
        </div>
      )}
    </section>
  )
}
