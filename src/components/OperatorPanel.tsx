import React, { useEffect, useRef, useState } from 'react'
import { Button, Drawer, Input, Tooltip, message } from 'antd'
import {
  DesktopOutlined,
  MonitorOutlined,
  PlusOutlined,
  SearchOutlined,
  FolderOpenOutlined,
  AppstoreOutlined,
  SoundOutlined,
  MessageOutlined,
  FieldTimeOutlined,
  PictureOutlined,
} from '@ant-design/icons'
import { usePresentationStore } from '@store/presentationStore'
import { useUIStore } from '@store/uiStore'
import { apiService } from '@services/api'
import { FileImportService } from '@services/fileImport'
import { sampleLibrary } from '@/data/sampleLibrary'
import { Song, Slide } from '../types/index'
import { SongEditor } from './SongEditor'
import { SlideManager } from './SlideManager'
import { SlideCanvas } from './SlideCanvas'
import { NotesEditor } from './NotesEditor'
import { LiveVerseDetector } from './LiveVerseDetector'
import './OperatorPanel.css'

const NAV_ITEMS = [
  { key: 'library', icon: <FolderOpenOutlined />, label: 'Library' },
  { key: 'media', icon: <PictureOutlined />, label: 'Media' },
  { key: 'audio', icon: <SoundOutlined />, label: 'Audio' },
  { key: 'messages', icon: <MessageOutlined />, label: 'Messages' },
  { key: 'timers', icon: <FieldTimeOutlined />, label: 'Timers' },
  { key: 'stage', icon: <AppstoreOutlined />, label: 'Stage' },
] as const

export const OperatorPanel: React.FC = () => {
  const {
    songs,
    currentSong,
    displayState,
    setSongs,
    setCurrentSong,
    addSong,
    nextSlide,
    previousSlide,
    blank,
    unblank,
    goLive,
    setPreviewSlide,
    clearAll,
  } = usePresentationStore()

  const { selectedSongId, setSelectedSongId, editingSlideId, setEditingSlideId } = useUIStore()
  const [query, setQuery] = useState('')
  const [nav, setNav] = useState<(typeof NAV_ITEMS)[number]['key']>('library')
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadLibrary()
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        previousSlide()
      } else if (e.key === 'b' || e.key === 'B' || e.key === 'Escape') {
        if (displayState.isBlank) unblank()
        else blank()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        goLive()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [displayState.isBlank, nextSlide, previousSlide, blank, unblank, goLive])

  const loadLibrary = async () => {
    try {
      const data = await apiService.getSongs()
      const library = data.length ? data : sampleLibrary
      setSongs(library)
      if (library[0]) {
        setSelectedSongId(library[0].id)
        setCurrentSong(library[0])
      }
    } catch {
      setSongs(sampleLibrary)
      setSelectedSongId(sampleLibrary[0].id)
      setCurrentSong(sampleLibrary[0])
    }
  }

  const handleImportFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList)
    if (!files.length) return

    const imported: Song[] = []
    for (const file of files) {
      try {
        const songsFromFile = await FileImportService.importFile(file)
        imported.push(...songsFromFile)
      } catch (error) {
        const detail = error instanceof Error ? error.message : 'Unknown error'
        message.error(`${file.name}: ${detail}`)
      }
    }

    if (!imported.length) return

    imported.forEach((song) => addSong(song))
    const first = imported[0]
    setSelectedSongId(first.id)
    setCurrentSong(first)
    message.success(
      imported.length === 1
        ? `Imported “${first.title}”`
        : `Imported ${imported.length} presentations`
    )
  }

  const handleSelectSong = (song: Song) => {
    setSelectedSongId(song.id)
    setCurrentSong(song)
  }

  const handleSelectSlide = (slide: Slide) => {
    setPreviewSlide(slide)
  }

  const handleGoLive = (slide?: Slide) => {
    goLive(slide)
    window.electronAPI?.sendToDisplay({
      type: 'play',
      song: currentSong,
      slide: slide || displayState.previewSlide,
    })
  }

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(query.toLowerCase())
  )

  const liveSlide = displayState.isBlank ? null : displayState.currentSlide
  const previewSlide = displayState.previewSlide

  return (
    <div
      className={`pp-app ${dragging ? 'is-dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (e.dataTransfer.files.length) handleImportFiles(e.dataTransfer.files)
      }}
    >
      <header className="pp-toolbar">
        <div className="pp-brand">
          <span className="pp-logo">E</span>
          <span>Ember</span>
        </div>

        <div className="pp-toolbar-actions">
          <Tooltip title="Import .pro / .pro6 / .pptx">
            <Button size="small" onClick={() => fileInputRef.current?.click()}>
              Import
            </Button>
          </Tooltip>
          <Button size="small" icon={<PlusOutlined />} onClick={() => setEditingSlideId('new')}>
            New
          </Button>
          <span className="pp-toolbar-sep" />
          <Button size="small" danger onClick={clearAll}>
            Clear All
          </Button>
          <Button size="small" onClick={() => (displayState.isBlank ? unblank() : blank())}>
            {displayState.isBlank ? 'Unclear' : 'Clear Slide'}
          </Button>
          <span className="pp-toolbar-sep" />
          <Tooltip title="Open audience display">
            <Button
              size="small"
              icon={<DesktopOutlined />}
              onClick={() => window.electronAPI?.openDisplayWindow()}
            >
              Audience
            </Button>
          </Tooltip>
          <Tooltip title="Open stage display">
            <Button
              size="small"
              icon={<MonitorOutlined />}
              onClick={() => window.electronAPI?.openStageMonitor()}
            >
              Stage
            </Button>
          </Tooltip>
        </div>
      </header>

      <div className="pp-body">
        <nav className="pp-rail">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`pp-rail-btn ${nav === item.key ? 'is-active' : ''}`}
              onClick={() => setNav(item.key)}
              title={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <aside className="pp-library">
          <div className="pp-library-header">Library</div>
          <Input
            size="small"
            prefix={<SearchOutlined />}
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pp-search"
          />
          <div className="pp-library-list">
            {filteredSongs.map((song) => (
              <button
                key={song.id}
                type="button"
                className={`pp-library-item ${selectedSongId === song.id ? 'is-active' : ''}`}
                onClick={() => handleSelectSong(song)}
              >
                <span className="pp-library-title">{song.title}</span>
                <span className="pp-library-meta">
                  {song.artist || 'Presentation'} · {song.slides.length} slides
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="pp-import-drop"
            onClick={() => fileInputRef.current?.click()}
          >
            Import .pro file
          </button>
        </aside>

        <main className="pp-workspace">
          {nav !== 'library' ? (
            <div className="pp-empty">
              {NAV_ITEMS.find((item) => item.key === nav)?.label} is empty.
            </div>
          ) : currentSong ? (
            <>
              <div className="pp-workspace-header">
                <div>
                  <h2>{currentSong.title}</h2>
                  <p>
                    {currentSong.artist || 'Library'}
                    {currentSong.ccli ? ` · CCLI ${currentSong.ccli}` : ''}
                    {' · Click live · Right-click Preview'}
                  </p>
                </div>
                <div className="pp-go-cluster">
                  <Button onClick={previousSlide}>Prev</Button>
                  <Button type="primary" className="pp-go" onClick={() => handleGoLive()}>
                    Go
                  </Button>
                  <Button onClick={nextSlide}>Next</Button>
                </div>
              </div>
              <div className="pp-workspace-scroll">
                <SlideManager
                  song={currentSong}
                  previewSlideId={previewSlide?.id}
                  liveSlideId={liveSlide?.id}
                  onSelect={handleSelectSlide}
                  onGoLive={(slide) => handleGoLive(slide)}
                />
              </div>
            </>
          ) : (
            <div className="pp-empty">
              Select a presentation from the library, or import a .pro file.
            </div>
          )}
        </main>

        <aside className="pp-outputs">
          <div className={`pp-output audience ${displayState.isBlank ? 'is-cleared' : ''}`}>
            <div className="pp-output-label">Audience</div>
            <SlideCanvas slide={liveSlide} blank={displayState.isBlank} size="preview" />
          </div>
          <div className="pp-output preview">
            <div className="pp-output-label">Preview</div>
            <SlideCanvas slide={previewSlide} size="preview" />
          </div>
          <div className="pp-sermon">
            <LiveVerseDetector />
            <NotesEditor />
          </div>
        </aside>
      </div>

      <footer className="pp-playlist">
        {songs.slice(0, 12).map((song) => (
          <button
            key={`pl-${song.id}`}
            type="button"
            className={`pp-playlist-item ${selectedSongId === song.id ? 'is-active' : ''}`}
            onClick={() => handleSelectSong(song)}
          >
            <SlideCanvas slide={song.slides[0] || null} size="thumb" />
            <span>{song.title}</span>
          </button>
        ))}
      </footer>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        accept=".pro,.pro6,.pro5,.pro5x,.probundle,.pptx,.json"
        onChange={(e) => {
          if (e.target.files) handleImportFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {dragging && <div className="pp-drop-overlay">Drop a .pro file to import</div>}

      {editingSlideId && (
        <Drawer
          title="New Presentation"
          placement="right"
          onClose={() => setEditingSlideId(null)}
          width={480}
          open
        >
          <SongEditor
            song={editingSlideId === 'new' ? undefined : currentSong || undefined}
            onSave={(song) => {
              addSong(song)
              setSelectedSongId(song.id)
              setCurrentSong(song)
              setEditingSlideId(null)
            }}
          />
        </Drawer>
      )}
    </div>
  )
}
