import { useState } from 'react'
import './App.css'
import { AuthDemo } from './components/AuthDemo'
import { FormDemo } from './components/FormDemo'
import { FetchDemo } from './components/FetchDemo'
import { TimerDemo } from './components/TimerDemo'
import { WizardDemo } from './components/WizardDemo'

type DemoType = 'auth' | 'form' | 'fetch' | 'timer' | 'wizard' | 'all'

function App() {
  const [activeDemo, setActiveDemo] = useState<DemoType>('all')

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 XState React 最佳实践示例</h1>
        <p className="subtitle">
          探索有限状态机 (FSM) 在 React 中的强大应用
        </p>
      </header>

      <nav className="demo-nav">
        <button
          className={activeDemo === 'all' ? 'active' : ''}
          onClick={() => setActiveDemo('all')}
        >
          全部展示
        </button>
        <button
          className={activeDemo === 'auth' ? 'active' : ''}
          onClick={() => setActiveDemo('auth')}
        >
          认证
        </button>
        <button
          className={activeDemo === 'form' ? 'active' : ''}
          onClick={() => setActiveDemo('form')}
        >
          表单
        </button>
        <button
          className={activeDemo === 'fetch' ? 'active' : ''}
          onClick={() => setActiveDemo('fetch')}
        >
          数据获取
        </button>
        <button
          className={activeDemo === 'timer' ? 'active' : ''}
          onClick={() => setActiveDemo('timer')}
        >
          计时器
        </button>
        <button
          className={activeDemo === 'wizard' ? 'active' : ''}
          onClick={() => setActiveDemo('wizard')}
        >
          向导
        </button>
      </nav>

      <main className="demo-container">
        {(activeDemo === 'all' || activeDemo === 'auth') && <AuthDemo />}
        {(activeDemo === 'all' || activeDemo === 'form') && <FormDemo />}
        {(activeDemo === 'all' || activeDemo === 'fetch') && <FetchDemo />}
        {(activeDemo === 'all' || activeDemo === 'timer') && <TimerDemo />}
        {(activeDemo === 'all' || activeDemo === 'wizard') && <WizardDemo />}
      </main>

      <footer className="app-footer">
        <p>
          💡 每个示例都展示了 XState 的核心概念：状态、转换、guards、actions、context 等
        </p>
        <p>
          <a href="https://xstate.js.org" target="_blank" rel="noopener noreferrer">
            XState 官方文档
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
