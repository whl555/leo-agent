import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectTaskFilters } from './tasksSlice'
import { updateFilters } from './tasksSlice'

export function TaskFilters() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectTaskFilters)

  return (
    <section className="card filters" aria-label="筛选任务">
      <h2>筛选</h2>
      <div className="field">
        <label htmlFor="status-filter">状态</label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(event) =>
            dispatch(updateFilters({ status: event.target.value as typeof filters.status }))
          }
        >
          <option value="all">全部</option>
          <option value="active">未完成</option>
          <option value="completed">已完成</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="priority-filter">优先级</label>
        <select
          id="priority-filter"
          value={filters.priority}
          onChange={(event) =>
            dispatch(updateFilters({ priority: event.target.value as typeof filters.priority }))
          }
        >
          <option value="all">全部</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>
    </section>
  )
}

