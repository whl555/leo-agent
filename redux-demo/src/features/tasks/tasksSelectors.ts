import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '../../app/store'
import { tasksSelectors } from './tasksSlice'

const selectFilters = (state: RootState) => state.tasks

export const selectAllTasks = tasksSelectors.selectAll

export const selectFilteredTasks = createSelector([selectAllTasks, selectFilters], (tasks, filters) => {
  return tasks.filter((task) => {
    const statusOk =
      filters.filter === 'all' || (filters.filter === 'completed' ? task.completed : !task.completed)
    const priorityOk = filters.priorityFilter === 'all' || filters.priorityFilter === task.priority

    return statusOk && priorityOk
  })
})

export const selectTaskStats = createSelector([selectAllTasks], (tasks) => {
  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  const active = total - completed

  return {
    total,
    completed,
    active,
    completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
  }
})

