/// <reference types="vite/client" />

interface ElectronAPI {
  openDisplayWindow: () => Promise<void>
  closeDisplayWindow: () => Promise<void>
  openStageMonitor: () => Promise<void>
  closeStageMonitor: () => Promise<void>
  sendToDisplay: (data: unknown) => Promise<void>
  sendToStageMonitor: (data: unknown) => Promise<void>
  getWindowType: () => Promise<string>
  onDisplayUpdate: (callback: (data: unknown) => void) => void
  onStageUpdate: (callback: (data: unknown) => void) => void
}

interface Window {
  electronAPI?: ElectronAPI
}
