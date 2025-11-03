import './App.css'

import { useState } from 'react'

import { InterviewQuestions } from './features/interview/InterviewQuestions'
import { MiddlewareDemo } from './features/middleware/MiddlewareDemo'
import { PerformanceDemo } from './features/performance/PerformanceDemo'
import { RTKQueryDemo } from './features/rtkQuery/RTKQueryDemo'
import { TaskComposer } from './features/tasks/TaskComposer'
import { TaskFilters } from './features/tasks/TaskFilters'
import { TaskList } from './features/tasks/TaskList'
import { TaskStats } from './features/tasks/TaskStats'

type Tab = 'tasks' | 'interview' | 'middleware' | 'performance' | 'rtk-query'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks')

  return (
    <div className="container">
      <header>
        <h1>React-Redux 最佳实践与面试题示例</h1>
        <p>
          项目采用 Redux Toolkit + React-Redux hooks 的推荐结构，演示领域切片、实体适配器、
          memoized selectors、中间件、性能优化、RTK Query 以及完整的面试题库，让你快速对齐官方最佳实践并准备面试！
        </p>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          📝 任务管理
        </button>
        <button
          className={`tab ${activeTab === 'interview' ? 'active' : ''}`}
          onClick={() => setActiveTab('interview')}
        >
          📚 面试题库
        </button>
        <button
          className={`tab ${activeTab === 'middleware' ? 'active' : ''}`}
          onClick={() => setActiveTab('middleware')}
        >
          🔌 中间件演示
        </button>
        <button
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          ⚡ 性能优化
        </button>
        <button
          className={`tab ${activeTab === 'rtk-query' ? 'active' : ''}`}
          onClick={() => setActiveTab('rtk-query')}
        >
          🔄 RTK Query
        </button>
      </nav>

      <main className="content">
        {activeTab === 'tasks' && (
          <div className="layout">
            <div className="column">
              <TaskComposer />
              <TaskFilters />
            </div>
            <div className="column">
              <TaskList />
              <TaskStats />
            </div>
          </div>
        )}

        {activeTab === 'interview' && <InterviewQuestions />}

        {activeTab === 'middleware' && <MiddlewareDemo />}

        {activeTab === 'performance' && <PerformanceDemo />}

        {activeTab === 'rtk-query' && <RTKQueryDemo />}
      </main>

      <footer className="footer">
        <p>
          💡 提示：打开浏览器控制台查看 Redux 中间件的日志输出，更好地理解数据流！
        </p>
      </footer>
    </div>
  )
}

export default App
