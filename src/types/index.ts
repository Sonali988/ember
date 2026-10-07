// Slide types
export interface TextStyle {
  fontFamily: string
  fontSize: number
  fontWeight: 'normal' | 'bold' | 'lighter'
  color: string
  textAlign: 'left' | 'center' | 'right'
  lineHeight: number
  letterSpacing: number
}

export interface BackgroundMedia {
  type: 'color' | 'image' | 'video'
  value: string // hex color, image path, or video path
  opacity: number
}

export interface Slide {
  id: string
  title: string
  content: string
  group?: string
  groupColor?: string
  backgroundColor?: BackgroundMedia
  textStyle: TextStyle
  notes?: string
  order: number
}

// Song/Service structure
export interface Verse {
  id: string
  type: 'verse' | 'chorus' | 'bridge' | 'pre-chorus' | 'outro'
  number?: number
  content: string
}

export interface Song {
  id: string
  title: string
  artist?: string
  ccli?: string
  verses: Verse[]
  slides: Slide[]
  order: number
  createdAt: Date
  updatedAt: Date
}

// Announcement
export interface Announcement {
  id: string
  title: string
  content: string
  backgroundColor?: BackgroundMedia
  textStyle: TextStyle
  duration: number // seconds
  order: number
}

// Scripture
export interface Scripture {
  id: string
  book: string
  chapter: number
  startVerse: number
  endVerse: number
  text: string
  translation: string
  textStyle: TextStyle
  backgroundColor?: BackgroundMedia
}

// Playlist & Service Order
export interface ServiceItem {
  id: string
  type: 'song' | 'announcement' | 'scripture' | 'media'
  itemId: string // references Song, Announcement, Scripture, or Media
  duration?: number
  notes?: string
  order: number
}

export interface ServiceOrder {
  id: string
  name: string
  date: Date
  items: ServiceItem[]
  createdAt: Date
  updatedAt: Date
}

export interface Playlist {
  id: string
  name: string
  songs: Song[]
  createdAt: Date
  updatedAt: Date
}

// Display state
export interface DisplayState {
  currentSlide: Slide | null
  previewSlide: Slide | null
  currentServiceItem: ServiceItem | null
  isBlank: boolean
  isPaused: boolean
  playbackTime: number
}

// Media
export interface MediaFile {
  id: string
  name: string
  path: string
  type: 'image' | 'video' | 'audio'
  duration?: number
  createdAt: Date
}

export type VerseLanguage = 'en' | 'hi'

export interface SermonNote {
  id: string
  content: string
  timestamp: string
  serviceOrderId: string
}

export interface DetectedVerse {
  id?: string
  reference: string
  usfm: string
  book: string
  chapter: number
  startVerse: number
  endVerse: number
  textEN: string
  textHI: string
  attributionEN?: string
  attributionHI?: string
  confidence: number
  matchType: 'reference' | 'text'
  rawSpeech: string
}

export interface ScreenMessage {
  type: 'verse' | 'verse-clear' | 'notes' | 'play'
  verse?: DetectedVerse | null
  language?: VerseLanguage
  notes?: string
  song?: Song
  slide?: Slide
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
