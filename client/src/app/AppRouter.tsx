import { Navigate, Route, Routes } from 'react-router-dom'

import { AiChatPage } from '../components/ai-chat/AiChatPage'
import { VoiceCallPage } from '../components/voice-chat/VoiceCallPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/ai-chat" element={<AiChatPage />} />
      <Route path="/voice-chat" element={<VoiceCallPage />} />
      <Route path="/" element={<Navigate to="/ai-chat" replace />} />
      <Route path="*" element={<Navigate to="/ai-chat" replace />} />
    </Routes>
  )
}


