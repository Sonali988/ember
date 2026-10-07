import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openDisplayWindow: () => ipcRenderer.invoke('open-display-window'),
  closeDisplayWindow: () => ipcRenderer.invoke('close-display-window'),
  openStageMonitor: () => ipcRenderer.invoke('open-stage-monitor'),
  closeStageMonitor: () => ipcRenderer.invoke('close-stage-monitor'),
  sendToDisplay: (data: any) => ipcRenderer.invoke('send-to-display', data),
  sendToStageMonitor: (data: any) => ipcRenderer.invoke('send-to-stage-monitor', data),
  getWindowType: () => ipcRenderer.invoke('get-window-type'),
  onDisplayUpdate: (callback: (data: any) => void) => {
    ipcRenderer.on('display-update', (_, data) => callback(data))
  },
  onStageUpdate: (callback: (data: any) => void) => {
    ipcRenderer.on('stage-update', (_, data) => callback(data))
  },
})

declare global {
  interface Window {
    electronAPI?: {
      openDisplayWindow: () => Promise<void>
      closeDisplayWindow: () => Promise<void>
      openStageMonitor: () => Promise<void>
      closeStageMonitor: () => Promise<void>
      sendToDisplay: (data: any) => Promise<void>
      sendToStageMonitor: (data: any) => Promise<void>
      getWindowType: () => Promise<string>
      onDisplayUpdate: (callback: (data: any) => void) => void
      onStageUpdate: (callback: (data: any) => void) => void
    }
  }
}
