import { ChatProvider } from '../../contexts/ChatContext'

import { AiChatPanel } from './AiChatPanel'

export function AiChatPage() {
  return (
    <ChatProvider>
      <div className="ai-chat-page">
        <AiChatPanel />
      </div>
    </ChatProvider>
  )
}
