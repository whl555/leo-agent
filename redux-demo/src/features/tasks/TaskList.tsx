import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectFilteredTasks } from './tasksSelectors'
import { clearCompleted, fetchTasks, selectTaskError, selectTaskStatus, toggleTask } from './tasksSlice'

export function TaskList() {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(selectFilteredTasks)
  const status = useAppSelector(selectTaskStatus)
  const error = useAppSelector(selectTaskError)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks())
    }
  }, [dispatch, status])

  return (
    <section className="card list" aria-label="任务列表">
      <header className="list-header">
        <h2>任务列表</h2>
        <button type="button" className="ghost" onClick={() => dispatch(clearCompleted())}>
          清除已完成
        </button>
      </header>
      {status === 'loading' && <p className="muted">加载中...</p>}
      {status === 'failed' && <p className="error">{error}</p>}
      {tasks.length === 0 && status === 'succeeded' ? (
        <div className="empty">
          <p>暂无匹配任务，试着调整筛选条件吧。</p>
        </div>
      ) : (
        <ul className="tasks">
          {tasks.map((task) => (
            <li key={task.id}>
              <label className={task.completed ? 'completed' : undefined}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => dispatch(toggleTask(task.id))}
                />
                <span>{task.title}</span>
              </label>
              <span className={`pill ${task.priority}`}>{task.priority}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

