import { create } from 'zustand'
import { Slide, Song, DisplayState, ServiceOrder, Announcement, Scripture, DetectedVerse, VerseLanguage } from '@types/index'

interface PresentationStore {
  // Current display state
  displayState: DisplayState
  currentSong: Song | null
  currentServiceOrder: ServiceOrder | null
  currentServiceItemIndex: number

  // Collections
  songs: Song[]
  serviceOrders: ServiceOrder[]
  announcements: Announcement[]
  scriptures: Scripture[]
  sermonNotes: string
  sermonNoteId: string | null
  serviceOrderId: string | null
  detectedVerse: DetectedVerse | null
  liveVerse: DetectedVerse | null
  verseLanguage: VerseLanguage

  // Actions
  setDisplayState: (state: Partial<DisplayState>) => void
  setCurrentSlide: (slide: Slide | null) => void
  setPreviewSlide: (slide: Slide | null) => void
  setCurrentSong: (song: Song | null) => void
  setCurrentServiceOrder: (order: ServiceOrder | null) => void
  setCurrentServiceItemIndex: (index: number) => void

  // Navigation
  nextSlide: () => void
  previousSlide: () => void
  goToSlide: (index: number) => void
  goLive: (slide?: Slide | null) => void
  clearAll: () => void
  
  // Song management
  setSongs: (songs: Song[]) => void
  addSong: (song: Song) => void
  updateSong: (id: string, song: Partial<Song>) => void
  deleteSong: (id: string) => void

  // Service order management
  setServiceOrders: (orders: ServiceOrder[]) => void
  addServiceOrder: (order: ServiceOrder) => void
  updateServiceOrder: (id: string, order: Partial<ServiceOrder>) => void
  deleteServiceOrder: (id: string) => void

  // Announcements
  setAnnouncements: (announcements: Announcement[]) => void
  addAnnouncement: (announcement: Announcement) => void

  // Scriptures
  setScriptures: (scriptures: Scripture[]) => void
  addScripture: (scripture: Scripture) => void

  setSermonNotes: (content: string) => void
  setSermonNoteMeta: (noteId: string | null, serviceOrderId: string | null) => void
  setDetectedVerse: (verse: DetectedVerse | null) => void
  setLiveVerse: (verse: DetectedVerse | null) => void
  setVerseLanguage: (language: VerseLanguage) => void

  // Playback control
  play: () => void
  pause: () => void
  blank: () => void
  unblank: () => void
  reset: () => void
}

export const usePresentationStore = create<PresentationStore>((set, get) => ({
  displayState: {
    currentSlide: null,
    previewSlide: null,
    currentServiceItem: null,
    isBlank: false,
    isPaused: false,
    playbackTime: 0,
  },
  currentSong: null,
  currentServiceOrder: null,
  currentServiceItemIndex: 0,
  songs: [],
  serviceOrders: [],
  announcements: [],
  scriptures: [],
  sermonNotes: '',
  sermonNoteId: null,
  serviceOrderId: null,
  detectedVerse: null,
  liveVerse: null,
  verseLanguage: 'en',

  setDisplayState: (state) =>
    set((prev) => ({
      displayState: { ...prev.displayState, ...state },
    })),

  setCurrentSlide: (slide) =>
    set((prev) => ({
      displayState: { ...prev.displayState, currentSlide: slide },
    })),

  setPreviewSlide: (slide) =>
    set((prev) => ({
      displayState: { ...prev.displayState, previewSlide: slide },
    })),

  setCurrentSong: (song) => {
    const first = song?.slides?.[0] ?? null
    set((prev) => ({
      currentSong: song,
      displayState: {
        ...prev.displayState,
        previewSlide: first,
      },
    }))
  },
  setCurrentServiceOrder: (order) => set({ currentServiceOrder: order }),
  setCurrentServiceItemIndex: (index) => set({ currentServiceItemIndex: index }),

  nextSlide: () => {
    const { currentSong, displayState } = get()
    if (!currentSong?.slides.length) return

    const liveId = displayState.currentSlide?.id || displayState.previewSlide?.id
    const currentIndex = currentSong.slides.findIndex((s) => s.id === liveId)
    const nextIndex = currentIndex < 0 ? 0 : Math.min(currentIndex + 1, currentSong.slides.length - 1)
    const next = currentSong.slides[nextIndex]
    get().goLive(next)
  },

  previousSlide: () => {
    const { currentSong, displayState } = get()
    if (!currentSong?.slides.length) return

    const liveId = displayState.currentSlide?.id || displayState.previewSlide?.id
    const currentIndex = currentSong.slides.findIndex((s) => s.id === liveId)
    const prevIndex = currentIndex <= 0 ? 0 : currentIndex - 1
    get().goLive(currentSong.slides[prevIndex])
  },

  goToSlide: (index) => {
    const { currentSong } = get()
    if (!currentSong || index < 0 || index >= currentSong.slides.length) return
    get().goLive(currentSong.slides[index])
  },

  goLive: (slide) => {
    const { currentSong, displayState } = get()
    const target = slide ?? displayState.previewSlide
    if (!target) return

    const index = currentSong?.slides.findIndex((s) => s.id === target.id) ?? -1
    const nextPreview =
      currentSong && index >= 0 && index < currentSong.slides.length - 1
        ? currentSong.slides[index + 1]
        : target

    set((prev) => ({
      displayState: {
        ...prev.displayState,
        currentSlide: target,
        previewSlide: nextPreview,
        isBlank: false,
        isPaused: false,
      },
    }))
  },

  clearAll: () =>
    set((prev) => ({
      displayState: { ...prev.displayState, isBlank: true },
    })),

  setSongs: (songs) => set({ songs }),
  addSong: (song) => set((prev) => ({ songs: [...prev.songs, song] })),
  updateSong: (id, song) =>
    set((prev) => ({
      songs: prev.songs.map((s) => (s.id === id ? { ...s, ...song } : s)),
    })),
  deleteSong: (id) =>
    set((prev) => ({
      songs: prev.songs.filter((s) => s.id !== id),
    })),

  setServiceOrders: (orders) => set({ serviceOrders: orders }),
  addServiceOrder: (order) =>
    set((prev) => ({ serviceOrders: [...prev.serviceOrders, order] })),
  updateServiceOrder: (id, order) =>
    set((prev) => ({
      serviceOrders: prev.serviceOrders.map((o) =>
        o.id === id ? { ...o, ...order } : o
      ),
    })),
  deleteServiceOrder: (id) =>
    set((prev) => ({
      serviceOrders: prev.serviceOrders.filter((o) => o.id !== id),
    })),

  setAnnouncements: (announcements) => set({ announcements }),
  addAnnouncement: (announcement) =>
    set((prev) => ({ announcements: [...prev.announcements, announcement] })),

  setScriptures: (scriptures) => set({ scriptures }),
  addScripture: (scripture) =>
    set((prev) => ({ scriptures: [...prev.scriptures, scripture] })),

  setSermonNotes: (content) => set({ sermonNotes: content }),
  setSermonNoteMeta: (noteId, serviceOrderId) => set({ sermonNoteId: noteId, serviceOrderId }),
  setDetectedVerse: (verse) => set({ detectedVerse: verse }),
  setLiveVerse: (verse) => set({ liveVerse: verse }),
  setVerseLanguage: (language) => set({ verseLanguage: language }),

  play: () =>
    set((prev) => ({
      displayState: { ...prev.displayState, isPaused: false },
    })),

  pause: () =>
    set((prev) => ({
      displayState: { ...prev.displayState, isPaused: true },
    })),

  blank: () =>
    set((prev) => ({
      displayState: { ...prev.displayState, isBlank: true },
    })),

  unblank: () =>
    set((prev) => ({
      displayState: { ...prev.displayState, isBlank: false },
    })),

  reset: () =>
    set({
      displayState: {
        currentSlide: null,
        previewSlide: null,
        currentServiceItem: null,
        isBlank: false,
        isPaused: false,
        playbackTime: 0,
      },
      currentSong: null,
      currentServiceOrder: null,
      currentServiceItemIndex: 0,
    }),
}))
