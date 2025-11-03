import { configureStore } from '@reduxjs/toolkit'

import {
  analyticsMiddleware,
  debounceMiddleware,
  errorHandlerMiddleware,
  localStorageMiddleware,
  loggerMiddleware,
  performanceMiddleware,
} from '../features/middleware/middlewareExamples'
import { api } from '../features/rtkQuery/api'
import tasksReducer from '../features/tasks/tasksSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    // 添加 RTK Query 生成的 reducer
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // 添加 RTK Query 中间件（必需）
      .concat(api.middleware)
      // 添加自定义中间件
      .concat(loggerMiddleware)
      .concat(performanceMiddleware)
      .concat(errorHandlerMiddleware)
      .concat(analyticsMiddleware)
      .concat(debounceMiddleware())
      .concat(localStorageMiddleware()),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

