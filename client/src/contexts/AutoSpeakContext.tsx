import { createContext, useContext, useState, ReactNode } from 'react'

interface AutoSpeakContextType {
  autoSpeak: boolean
  toggleAutoSpeak: () => void
}

const AutoSpeakContext = createContext<AutoSpeakContextType | undefined>(undefined)

export function AutoSpeakProvider({ children }: { children: ReactNode }) {
  const [autoSpeak, setAutoSpeak] = useState(true)

  const toggleAutoSpeak = () => {
    setAutoSpeak(prev => !prev)
  }

  return (
    <AutoSpeakContext.Provider value={{ autoSpeak, toggleAutoSpeak }}>
      {children}
    </AutoSpeakContext.Provider>
  )
}

export function useAutoSpeak() {
  const context = useContext(AutoSpeakContext)
  if (context === undefined) {
    throw new Error('useAutoSpeak must be used within an AutoSpeakProvider')
  }
  return context
}

