import './App.css'

import { TaskComposer } from './features/tasks/TaskComposer'
import { TaskFilters } from './features/tasks/TaskFilters'
import { TaskList } from './features/tasks/TaskList'
import { TaskStats } from './features/tasks/TaskStats'

function App() {
  return (
    <div className="container">
      <header>
        <h1>React-Redux 最佳实践示例</h1>
        <p>
          项目采用 Redux Toolkit + React-Redux hooks 的推荐结构，演示领域切片、实体适配器、
          memoized selectors 以及组件分层，让你快速对齐官方最佳实践。
        </p>
      </header>
      <main className="layout">
        <div className="column">
          <TaskComposer />
          <TaskFilters />
        </div>
        <div className="column">
          <TaskList />
          <TaskStats />
        </div>
      </main>
    </div>
  )
}

export default App
