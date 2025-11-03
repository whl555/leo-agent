/**
 * Redux 中间件示例
 * 展示各种常用中间件的实现和用法
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AnyAction, Middleware } from '@reduxjs/toolkit'

/**
 * Logger 中间件 - 记录每个 action 和状态变化
 */
export const loggerMiddleware: Middleware = (store) => (next) => (action: any) => {
  console.group(`%c Action: ${action.type}`, 'color: #4CAF50; font-weight: bold')
  console.log('%c Previous State:', 'color: #9E9E9E; font-weight: bold', store.getState())
  console.log('%c Action:', 'color: #03A9F4; font-weight: bold', action)

  const result = next(action)

  console.log('%c Next State:', 'color: #4CAF50; font-weight: bold', store.getState())
  console.groupEnd()

  return result
}

/**
 * 性能监控中间件 - 测量 action 处理时间
 */
export const performanceMiddleware: Middleware = (_store) => (next) => (action: any) => {
  const start = performance.now()

  const result = next(action)

  const end = performance.now()
  const duration = end - start

  if (duration > 10) {
    console.warn(
      `%c Slow Action: ${action.type} took ${duration.toFixed(2)}ms`,
      'color: #FF9800; font-weight: bold',
    )
  }

  return result
}

/**
 * 错误处理中间件 - 捕获和处理 reducer 中的错误
 */
export const errorHandlerMiddleware: Middleware = (store) => (next) => (action: any) => {
  try {
    return next(action)
  } catch (err) {
    console.error('❌ Caught an exception!', err)

    // 可以 dispatch 一个错误 action
    store.dispatch({
      type: 'APP_ERROR',
      payload: {
        error: err instanceof Error ? err.message : 'Unknown error',
        action: action.type,
      },
    })

    // 可以选择是否重新抛出错误
    // throw err
  }
}

/**
 * Analytics 中间件 - 发送分析数据
 */
export const analyticsMiddleware: Middleware = (_store) => (next) => (action: any) => {
  // 检查 action 是否包含 analytics meta 数据
  if (action.meta?.analytics) {
    console.log('📊 Analytics:', {
      event: action.type,
      ...action.meta.analytics,
    })

    // 实际项目中，这里会调用分析服务
    // window.gtag?.('event', action.type, action.meta.analytics)
  }

  return next(action)
}

/**
 * 防抖中间件 - 防止频繁 dispatch 相同 action
 */
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>()

export const debounceMiddleware =
  (delay = 300): Middleware =>
  (_store) =>
  (next) =>
  (action: any) => {
    // 只对特定 action 进行防抖
    if (action.meta?.debounce) {
      const key = action.type

      // 清除之前的定时器
      if (debounceTimers.has(key)) {
        clearTimeout(debounceTimers.get(key)!)
      }

      // 设置新的定时器
      const timer = setTimeout(() => {
        next(action)
        debounceTimers.delete(key)
      }, delay)

      debounceTimers.set(key, timer)

      return
    }

    return next(action)
  }

/**
 * 本地存储中间件 - 自动保存状态到 localStorage
 */
export const localStorageMiddleware =
  (key = 'reduxState'): Middleware =>
  (store) =>
  (next) =>
  (action: any) => {
    const result = next(action)

    // 在某些 action 后保存状态
    if (action.meta?.persist) {
      try {
        const state = store.getState()
        localStorage.setItem(key, JSON.stringify(state))
        console.log('💾 State saved to localStorage')
      } catch (err) {
        console.error('Failed to save state:', err)
      }
    }

    return result
  }

/**
 * API 中间件 - 处理 API 请求 action
 */
export const apiMiddleware: Middleware = (store) => (next) => (action: any) => {
  // 只处理包含 API 请求的 action
  if (!action.payload?.url) {
    return next(action)
  }

  const { url, method = 'GET', body, onSuccess, onError } = action.payload

  // 先 dispatch 原始 action
  next(action)

  // 发起 API 请求
  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
    .then((res) => res.json())
    .then((data) => {
      if (onSuccess) {
        store.dispatch({
          type: onSuccess,
          payload: data,
        })
      }
    })
    .catch((error) => {
      if (onError) {
        store.dispatch({
          type: onError,
          payload: error.message,
        })
      }
    })
}

/**
 * Action 转换中间件 - 将旧 action 转换为新 action
 */
export const actionTransformMiddleware: Middleware = (_store) => (next) => (action: any) => {
  // 将旧的 action 类型转换为新的
  if (action.type === 'LEGACY_ACTION') {
    return next({
      type: 'NEW_ACTION',
      payload: action.payload,
    })
  }

  // 过滤掉某些 action
  if (action.type === 'IGNORED_ACTION') {
    console.log('🚫 Action ignored:', action.type)
    return
  }

  return next(action)
}

/**
 * 批处理中间件 - 批量处理多个 action
 */
let batchedActions: AnyAction[] = []
let batchTimer: ReturnType<typeof setTimeout> | null = null

export const batchMiddleware: Middleware = (_store) => (next) => (action: any) => {
  if (action.type === 'BATCH_ACTIONS') {
    // 批量 dispatch actions
    action.payload.forEach((batchedAction: any) => {
      next(batchedAction)
    })
    return
  }

  if (action.meta?.batch) {
    batchedActions.push(action)

    if (batchTimer) {
      clearTimeout(batchTimer)
    }

    batchTimer = setTimeout(() => {
      if (batchedActions.length > 0) {
        console.log(`📦 Batching ${batchedActions.length} actions`)
        batchedActions.forEach((batchedAction) => next(batchedAction))
        batchedActions = []
      }
      batchTimer = null
    }, 10)

    return
  }

  return next(action)
}

/**
 * Crash Reporter 中间件 - 发送错误报告
 */
export const crashReporterMiddleware: Middleware = (store) => (next) => (action) => {
  try {
    return next(action)
  } catch (err) {
    console.error('💥 Sending crash report...')

    // 实际项目中，这里会发送到错误追踪服务（如 Sentry）
    const errorReport = {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      action,
      state: store.getState(),
      timestamp: new Date().toISOString(),
    }

    console.error('Crash Report:', errorReport)

    // 模拟发送到服务器
    // fetch('/api/crash-report', {
    //   method: 'POST',
    //   body: JSON.stringify(errorReport)
    // })

    throw err
  }
}
