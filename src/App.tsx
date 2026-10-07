import React, { useEffect } from 'react'
import { useUIStore } from '@store/uiStore'
import { OperatorPanel } from '@components/OperatorPanel'
import { DisplayPage } from '@pages/DisplayPage'
import { StageMonitorPage } from '@pages/StageMonitorPage'
import { ConfigProvider, theme } from 'antd'
import enUS from 'antd/locale/en_US'

const App: React.FC = () => {
  const { setWindowType } = useUIStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const windowType = (params.get('window') as 'main' | 'display' | 'stage-monitor') || 'main'
    setWindowType(windowType)
  }, [setWindowType])

  const windowType = useUIStore((state) => state.windowType)

  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#3d8bfd',
          colorBgBase: '#1c1c1c',
          borderRadius: 4,
        },
      }}
    >
      {windowType === 'display' && <DisplayPage />}
      {windowType === 'stage-monitor' && <StageMonitorPage />}
      {windowType === 'main' && <OperatorPanel />}
    </ConfigProvider>
  )
}

export default App
