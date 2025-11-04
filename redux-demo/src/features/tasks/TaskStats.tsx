import { useAppSelector } from '../../app/hooks'
import { selectTaskStats } from './tasksSelectors'

export function TaskStats() {
  const stats = useAppSelector(selectTaskStats)

  return (
    <section className="card stats" aria-label="任务统计">
      <h2>当前概览</h2>
      <dl className="stat-grid">
        <div>
          <dt>全部任务</dt>
          <dd>{stats.total}</dd>
        </div>
        <div>
          <dt>未完成</dt>
          <dd>{stats.active}</dd>
        </div>
        <div>
          <dt>已完成</dt>
          <dd>{stats.completed}</dd>
        </div>
        <div>
          <dt>完成率</dt>
          <dd>{stats.completionRate}%</dd>
        </div>
      </dl>
    </section>
  )
}

