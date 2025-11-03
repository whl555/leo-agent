/**
 * Redux 性能优化演示组件
 * 展示 selector 优化、批量更新、memoization 等技术
 */

import { useCallback, useMemo, useState } from 'react'
import { createSelector } from '@reduxjs/toolkit'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addTask, tasksSelectors } from '../tasks/tasksSlice'

/**
 * 未优化的 selector - 每次都创建新数组
 */
const useUnoptimizedCompletedTasks = () => {
  return useAppSelector((state) => {
    console.log('❌ 未优化 selector 执行')
    return Object.values(state.tasks.entities).filter((task) => task?.completed)
  })
}

/**
 * 优化的 selector - 使用 createSelector 进行 memoization
 */
const selectCompletedTasks = createSelector(
  [tasksSelectors.selectAll],
  (tasks) => {
    console.log('✅ 优化 selector 执行（memoized）')
    return tasks.filter((task) => task.completed)
  },
)

const selectHighPriorityTasks = createSelector(
  [tasksSelectors.selectAll],
  (tasks) => {
    console.log('✅ 高优先级任务 selector 执行')
    return tasks.filter((task) => task.priority === 'high')
  },
)

/**
 * 复杂计算的 selector - 统计任务信息
 */
const selectTaskStats = createSelector([tasksSelectors.selectAll], (tasks) => {
  console.log('✅ 统计 selector 执行（包含复杂计算）')

  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    active: tasks.filter((t) => !t.completed).length,
    byPriority: {
      high: tasks.filter((t) => t.priority === 'high').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      low: tasks.filter((t) => t.priority === 'low').length,
    },
  }
})

export function PerformanceDemo() {
  const dispatch = useAppDispatch()
  const [useOptimized, setUseOptimized] = useState(true)
  const [renderCount, setRenderCount] = useState(0)

  // 使用优化或未优化的 selector
  const completedTasks = useOptimized
    ? useAppSelector(selectCompletedTasks)
    : useUnoptimizedCompletedTasks()

  const highPriorityTasks = useAppSelector(selectHighPriorityTasks)
  const stats = useAppSelector(selectTaskStats)

  // 跟踪渲染次数
  useMemo(() => {
    setRenderCount((prev) => prev + 1)
  }, [])

  /**
   * 未优化的回调 - 每次渲染都创建新函数
   */
  const handleAddTaskUnoptimized = () => {
    dispatch(addTask('未优化的任务', 'medium'))
  }

  /**
   * 优化的回调 - 使用 useCallback
   */
  const handleAddTaskOptimized = useCallback(() => {
    dispatch(addTask('优化的任务', 'medium'))
  }, [dispatch])

  /**
   * 批量添加任务 - React 18 自动批处理
   */
  const handleBatchAdd = useCallback(() => {
    console.log('🔄 开始批量添加任务')

    // React 18+ 会自动批处理这些更新
    dispatch(addTask('批量任务 1', 'high'))
    dispatch(addTask('批量任务 2', 'medium'))
    dispatch(addTask('批量任务 3', 'low'))

    console.log('✅ 批量添加完成（只会触发一次重渲染）')
  }, [dispatch])

  /**
   * 大量计算的派生数据 - 使用 useMemo
   */
  const expensiveComputation = useMemo(() => {
    console.log('💰 执行昂贵计算...')
    // 模拟复杂计算
    let result = 0
    for (let i = 0; i < 1000000; i++) {
      result += i
    }
    return result
  }, [completedTasks.length]) // 只在依赖变化时重新计算

  return (
    <div className="card">
      <h2>⚡ 性能优化演示</h2>

      <div className="performance-info">
        <div className="render-count">
          <strong>组件渲染次数：</strong>
          <span className="badge">{renderCount}</span>
        </div>

        <div className="optimization-toggle">
          <label>
            <input
              type="checkbox"
              checked={useOptimized}
              onChange={(e) => setUseOptimized(e.target.checked)}
            />
            使用优化的 Selector
          </label>
          <p className="hint">
            {useOptimized
              ? '✅ 使用 createSelector 进行 memoization'
              : '❌ 每次都创建新数组（查看控制台日志）'}
          </p>
        </div>
      </div>

      <div className="demo-section">
        <h3>1. Selector 优化</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>已完成任务</h4>
            <p className="stat-value">{completedTasks.length}</p>
            <p className="stat-label">使用 {useOptimized ? 'memoized' : '未优化'} selector</p>
          </div>

          <div className="stat-card">
            <h4>高优先级任务</h4>
            <p className="stat-value">{highPriorityTasks.length}</p>
            <p className="stat-label">始终使用 memoized selector</p>
          </div>
        </div>

        <div className="code-example">
          <h4>对比：</h4>
          <pre>{`// ❌ 未优化 - 每次都创建新数组
const tasks = useAppSelector(state =>
  Object.values(state.tasks.entities).filter(t => t?.completed)
)

// ✅ 优化 - 使用 createSelector
const selectCompleted = createSelector(
  [tasksSelectors.selectAll],
  tasks => tasks.filter(t => t.completed)
)

const tasks = useAppSelector(selectCompleted)`}</pre>
        </div>
      </div>

      <div className="demo-section">
        <h3>2. 回调函数优化</h3>
        <div className="button-group">
          <button onClick={handleAddTaskUnoptimized} className="btn-warning">
            ❌ 未优化的回调（每次渲染都创建）
          </button>

          <button onClick={handleAddTaskOptimized} className="btn-primary">
            ✅ useCallback 优化
          </button>
        </div>

        <div className="code-example">
          <pre>{`// ❌ 未优化
const handleClick = () => {
  dispatch(addTask('任务'))
}

// ✅ 使用 useCallback
const handleClick = useCallback(() => {
  dispatch(addTask('任务'))
}, [dispatch])`}</pre>
        </div>
      </div>

      <div className="demo-section">
        <h3>3. 批量更新（React 18 自动批处理）</h3>
        <button onClick={handleBatchAdd} className="btn-accent">
          📦 批量添加 3 个任务
        </button>
        <p className="hint">React 18+ 会自动批处理多个 dispatch，只触发一次重渲染</p>

        <div className="code-example">
          <pre>{`// React 18+ 自动批处理
const handleBatchAdd = () => {
  dispatch(action1())  // \
  dispatch(action2())  //  } 只触发一次重渲染
  dispatch(action3())  // /
}`}</pre>
        </div>
      </div>

      <div className="demo-section">
        <h3>4. 复杂计算的 Memoization</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>任务统计</h4>
            <div className="task-stats">
              <p>
                总计：<strong>{stats.total}</strong>
              </p>
              <p>
                完成：<strong>{stats.completed}</strong>
              </p>
              <p>
                进行中：<strong>{stats.active}</strong>
              </p>
              <p>
                高优先级：<strong>{stats.byPriority.high}</strong>
              </p>
            </div>
            <p className="stat-label">使用 createSelector 缓存计算结果</p>
          </div>

          <div className="stat-card">
            <h4>昂贵计算结果</h4>
            <p className="stat-value">{expensiveComputation.toLocaleString()}</p>
            <p className="stat-label">
              使用 useMemo，只在 completedTasks 变化时重新计算
            </p>
          </div>
        </div>

        <div className="code-example">
          <pre>{`// 复杂的派生数据
const selectStats = createSelector(
  [tasksSelectors.selectAll],
  (tasks) => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    // ... 更多统计
  })
)

// 昂贵计算使用 useMemo
const result = useMemo(() => {
  // 复杂计算...
  return expensiveOperation(data)
}, [dependencies])`}</pre>
        </div>
      </div>

      <div className="best-practices">
        <h3>性能优化最佳实践：</h3>
        <ul>
          <li>
            <strong>使用 createSelector</strong>：缓存派生数据，避免不必要的重新计算
          </li>
          <li>
            <strong>拆分 useSelector</strong>：使用多个小的 selector 而不是一个大的
          </li>
          <li>
            <strong>useCallback</strong>：缓存回调函数，避免子组件不必要的重渲染
          </li>
          <li>
            <strong>useMemo</strong>：缓存复杂计算结果
          </li>
          <li>
            <strong>React.memo</strong>：包裹组件，避免不必要的重渲染
          </li>
          <li>
            <strong>规范化 State</strong>：使用 createEntityAdapter 扁平化数据
          </li>
          <li>
            <strong>批量更新</strong>：React 18+ 自动批处理，不需要手动优化
          </li>
        </ul>
      </div>
    </div>
  )
}
