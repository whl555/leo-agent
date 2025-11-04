/**
 * 中间件演示组件
 */

import { useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addTask } from '../tasks/tasksSlice'

export function MiddlewareDemo() {
  const [taskTitle, setTaskTitle] = useState('')
  const dispatch = useAppDispatch()
  const tasks = useAppSelector((state) => state.tasks.entities)

  const handleAddTask = () => {
    if (!taskTitle.trim()) return

    // 普通 action - 会被 logger 中间件记录
    dispatch(
      addTask(taskTitle, 'medium', {
        analytics: {
          category: 'Task Management',
          label: 'Task Created via Middleware Demo',
        },
      }),
    )

    setTaskTitle('')
  }

  const handleAddTaskWithDebounce = () => {
    if (!taskTitle.trim()) return

    // 带防抖的 action
    dispatch(
      addTask(taskTitle, 'low', {
        debounce: true,
        analytics: {
          category: 'Task Management',
          label: 'Debounced Task',
        },
      }),
    )

    setTaskTitle('')
  }

  const handleAddTaskWithPersist = () => {
    if (!taskTitle.trim()) return

    // 会触发本地存储的 action
    dispatch(
      addTask(taskTitle, 'high', {
        persist: true,
        analytics: {
          category: 'Task Management',
          label: 'Persisted Task',
        },
      }),
    )

    setTaskTitle('')
  }

  const handleBatchAdd = () => {
    // 批量添加任务
    const titles = ['任务1', '任务2', '任务3']

    titles.forEach((title) => {
      dispatch(
        addTask(title, 'medium', {
          batch: true,
        }),
      )
    })
  }

  const handleSlowOperation = () => {
    // 模拟慢操作 - 会被性能中间件捕获
    dispatch({
      type: 'SLOW_OPERATION',
      payload: {
        data: new Array(10000).fill(0).map((_, i) => i),
      },
    })
  }

  const handleErrorAction = () => {
    // 模拟错误 - 会被错误处理中间件捕获
    dispatch({
      type: 'ERROR_ACTION',
      payload: { throwError: true },
    })
  }

  return (
    <div className="card">
      <h2>🔌 中间件演示</h2>

      <div className="middleware-info">
        <p>
          本演示展示了多种 Redux 中间件的功能。打开浏览器控制台查看中间件日志输出！
        </p>

        <div className="middleware-list">
          <h3>已启用的中间件：</h3>
          <ul>
            <li>
              <strong>Logger 中间件</strong>：记录每个 action 和状态变化
            </li>
            <li>
              <strong>性能监控中间件</strong>：测量 action 处理时间
            </li>
            <li>
              <strong>Analytics 中间件</strong>：发送分析数据
            </li>
            <li>
              <strong>错误处理中间件</strong>：捕获和处理错误
            </li>
            <li>
              <strong>防抖中间件</strong>：防止频繁 dispatch
            </li>
            <li>
              <strong>本地存储中间件</strong>：自动保存状态
            </li>
          </ul>
        </div>
      </div>

      <div className="demo-section">
        <h3>测试不同的中间件功能：</h3>

        <div className="input-group">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="输入任务标题..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTask()
            }}
          />
        </div>

        <div className="button-group">
          <button onClick={handleAddTask} className="btn-primary">
            📝 添加任务（带日志）
          </button>

          <button onClick={handleAddTaskWithDebounce} className="btn-secondary">
            ⏱️ 添加任务（防抖）
          </button>

          <button onClick={handleAddTaskWithPersist} className="btn-accent">
            💾 添加任务（持久化）
          </button>

          <button onClick={handleBatchAdd} className="btn-info">
            📦 批量添加 3 个任务
          </button>

          <button onClick={handleSlowOperation} className="btn-warning">
            🐌 慢操作（性能监控）
          </button>

          <button onClick={handleErrorAction} className="btn-danger">
            💥 触发错误（错误捕获）
          </button>
        </div>

        <div className="current-tasks">
          <h4>当前任务数量：{Object.keys(tasks).length}</h4>
          <p className="hint">
            💡 提示：每次点击按钮都会在控制台输出中间件日志，可以看到完整的数据流！
          </p>
        </div>
      </div>

      <div className="code-example">
        <h3>中间件使用示例：</h3>
        <pre>
          {`// 在 store 配置中添加中间件
import { configureStore } from '@reduxjs/toolkit'
import { loggerMiddleware, performanceMiddleware } from './middleware'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(loggerMiddleware)
      .concat(performanceMiddleware)
})

// 在 action 中使用中间件元数据
dispatch(addTask('任务', 'high', {
  analytics: { category: 'Task' },  // Analytics 中间件
  debounce: true,                    // 防抖中间件
  persist: true                      // 本地存储中间件
}))`}
        </pre>
      </div>
    </div>
  )
}
