import React, { useEffect, useRef } from 'react'
import { usePresentationStore } from '@store/presentationStore'
import { apiService } from '@services/api'

export const NotesEditor: React.FC = () => {
  const notes = usePresentationStore((state) => state.sermonNotes)
  const noteId = usePresentationStore((state) => state.sermonNoteId)
  const serviceOrderId = usePresentationStore((state) => state.serviceOrderId)
  const liveVerse = usePresentationStore((state) => state.liveVerse)
  const verseLanguage = usePresentationStore((state) => state.verseLanguage)
  const setSermonNotes = usePresentationStore((state) => state.setSermonNotes)
  const setSermonNoteMeta = usePresentationStore((state) => state.setSermonNoteMeta)
  const timer = useRef<number | null>(null)

  const pushStage = (content: string) => {
    window.electronAPI?.sendToStageMonitor({
      type: 'notes',
      notes: content,
      verse: liveVerse,
      language: verseLanguage,
    })
  }

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  const onChange = (content: string) => {
    setSermonNotes(content)
    pushStage(content)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(async () => {
      try {
        const saved = await apiService.saveNote({
          id: noteId,
          content,
          serviceOrderId,
        })
        setSermonNoteMeta(saved.id, saved.serviceOrderId)
      } catch (error) {
        console.error('Notes were not saved', error)
      }
    }, 500)
  }

  return (
    <section className="pp-sermon-block">
      <header>Sermon notes</header>
      <textarea
        value={notes}
        placeholder="Type notes for the stage monitor…"
        onChange={(event) => onChange(event.target.value)}
      />
    </section>
  )
}
