import { useState } from 'react'
import type { FormEvent } from 'react'

import { useAppDispatch } from '../../app/hooks'
import { addTask } from './tasksSlice'

const priorities = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
] as const

export function TaskComposer() {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<(typeof priorities)[number]['value']>('medium')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      return
    }

    dispatch(addTask(title.trim(), priority))
    setTitle('')
    setPriority('medium')
  }

  return (
    <form className="card composer" onSubmit={handleSubmit} aria-label="新建任务">
      <h2>新增任务</h2>
      <div className="field">
        <label htmlFor="task-title">任务标题</label>
        <input
          id="task-title"
          type="text"
          placeholder="例如：梳理 Redux 架构层次"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div className="field">
        <span>优先级</span>
        <div className="radios">
          {priorities.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="priority"
                value={option.value}
                checked={priority === option.value}
                onChange={() => setPriority(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
      <button type="submit">添加任务</button>
    </form>
  )
}

