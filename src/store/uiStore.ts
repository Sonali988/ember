import { create } from 'zustand'

interface UIStore {
  windowType: 'main' | 'display' | 'stage-monitor'
  sidebarOpen: boolean
  selectedSongId: string | null
  selectedPlaylistId: string | null
  editingSlideId: string | null
  showMediaLibrary: boolean
  showSettings: boolean

  setWindowType: (type: 'main' | 'display' | 'stage-monitor') => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSelectedSongId: (id: string | null) => void
  setSelectedPlaylistId: (id: string | null) => void
  setEditingSlideId: (id: string | null) => void
  toggleMediaLibrary: () => void
  setShowMediaLibrary: (show: boolean) => void
  toggleSettings: () => void
  setShowSettings: (show: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  windowType: 'main',
  sidebarOpen: true,
  selectedSongId: null,
  selectedPlaylistId: null,
  editingSlideId: null,
  showMediaLibrary: false,
  showSettings: false,

  setWindowType: (type) => set({ windowType: type }),
  toggleSidebar: () => set((prev) => ({ sidebarOpen: !prev.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSelectedSongId: (id) => set({ selectedSongId: id }),
  setSelectedPlaylistId: (id) => set({ selectedPlaylistId: id }),
  setEditingSlideId: (id) => set({ editingSlideId: id }),
  toggleMediaLibrary: () =>
    set((prev) => ({ showMediaLibrary: !prev.showMediaLibrary })),
  setShowMediaLibrary: (show) => set({ showMediaLibrary: show }),
  toggleSettings: () => set((prev) => ({ showSettings: !prev.showSettings })),
  setShowSettings: (show) => set({ showSettings: show }),
}))
