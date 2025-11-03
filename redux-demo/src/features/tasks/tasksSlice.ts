import { createAsyncThunk, createEntityAdapter, createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../../app/store'

export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
  id: string
  title: string
  completed: boolean
  priority: TaskPriority
  createdAt: string
}

export type StatusFilter = 'all' | 'active' | 'completed'

export type PriorityFilter = 'all' | TaskPriority

const tasksAdapter = createEntityAdapter<Task>({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
})

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  await new Promise((resolve) => setTimeout(resolve, 320))

  const now = Date.now()

  return [
    {
      id: nanoid(),
      title: '了解 React-Redux 官方推荐的编程模型',
      completed: true,
      priority: 'medium' satisfies TaskPriority,
      createdAt: new Date(now - 1000 * 60 * 60).toISOString(),
    },
    {
      id: nanoid(),
      title: '设计领域切片并编写单独的 selectors',
      completed: false,
      priority: 'high' satisfies TaskPriority,
      createdAt: new Date(now - 1000 * 60 * 25).toISOString(),
    },
    {
      id: nanoid(),
      title: '使用批处理 dispatch 组合业务流程',
      completed: false,
      priority: 'low' satisfies TaskPriority,
      createdAt: new Date(now - 1000 * 60 * 5).toISOString(),
    },
  ] as Task[]
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState({
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: undefined as string | undefined,
    filter: 'all' as StatusFilter,
    priorityFilter: 'all' as PriorityFilter,
  }),
  reducers: {
    addTask: {
      prepare(title: string, priority: TaskPriority) {
        return {
          payload: {
            id: nanoid(),
            title,
            priority,
            completed: false,
            createdAt: new Date().toISOString(),
          } satisfies Task,
        }
      },
      reducer: (state, action: PayloadAction<Task>) => {
        tasksAdapter.addOne(state, action.payload)
      },
    },
    toggleTask(state, action: PayloadAction<string>) {
      const id = action.payload
      const task = state.entities[id]

      if (task) {
        task.completed = !task.completed
      }
    },
    updateFilters(
      state,
      action: PayloadAction<Partial<{ status: StatusFilter; priority: PriorityFilter }>>,
    ) {
      const { status, priority } = action.payload

      if (status) {
        state.filter = status
      }

      if (priority) {
        state.priorityFilter = priority
      }
    },
    clearCompleted(state) {
      const completedIds = Object.values(state.entities)
        .filter((task): task is Task => Boolean(task?.completed))
        .map((task) => task.id)

      tasksAdapter.removeMany(state, completedIds)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        tasksAdapter.setAll(state, action.payload)
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? '无法加载任务'
      })
  },
})

export const { addTask, toggleTask, updateFilters, clearCompleted } = tasksSlice.actions

export const tasksSelectors = tasksAdapter.getSelectors<RootState>((state) => state.tasks)

export const selectTaskFilters = (state: RootState) => ({
  status: state.tasks.filter,
  priority: state.tasks.priorityFilter,
})

export const selectTaskStatus = (state: RootState) => state.tasks.status
export const selectTaskError = (state: RootState) => state.tasks.error

export default tasksSlice.reducer

