import { assign, fromPromise, setup } from 'xstate'

/**
 * 数据获取状态机
 * 展示：异步操作、重试逻辑、取消操作
 */

type User = {
  id: number
  name: string
  email: string
}

type FetchContext = {
  users: User[]
  error: string | null
  retryCount: number
}

type FetchEvents =
  | { type: 'FETCH' }
  | { type: 'RETRY' }
  | { type: 'CANCEL' }
  | { type: 'REFRESH' }

const fetchUsersAPI = async (retryCount: number): Promise<User[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  
  // 前两次尝试失败，展示重试逻辑
  if (retryCount < 2) {
    throw new Error(`网络错误 (尝试 ${retryCount + 1}/3)`)
  }
  
  return [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
    { id: 3, name: '王五', email: 'wangwu@example.com' },
  ]
}

export const fetchMachine = setup({
  types: {
    context: {} as FetchContext,
    events: {} as FetchEvents,
  },
  guards: {
    canRetry: ({ context }) => context.retryCount < 3,
  },
  actions: {
    incrementRetry: assign({
      retryCount: ({ context }) => context.retryCount + 1,
    }),
    resetRetry: assign({
      retryCount: 0,
      error: null,
    }),
  },
  actors: {
    fetchUsers: fromPromise(async ({ input }: { input: { retryCount: number } }) => {
      return await fetchUsersAPI(input.retryCount)
    }),
  },
}).createMachine({
  id: 'fetch',
  initial: 'idle',
  context: {
    users: [],
    error: null,
    retryCount: 0,
  },
  states: {
    idle: {
      on: {
        FETCH: 'loading',
      },
    },
    loading: {
      invoke: {
        src: 'fetchUsers',
        input: ({ context }) => ({ retryCount: context.retryCount }),
        onDone: {
          target: 'success',
          actions: assign({
            users: ({ event }) => event.output,
            error: null,
            retryCount: 0,
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: ({ event }) => (event.error as Error).message,
          }),
        },
      },
      on: {
        CANCEL: 'idle',
      },
    },
    success: {
      on: {
        REFRESH: {
          target: 'loading',
          actions: { type: 'resetRetry' },
        },
      },
    },
    failure: {
      on: {
        RETRY: {
          target: 'loading',
          guard: { type: 'canRetry' },
          actions: { type: 'incrementRetry' },
        },
        FETCH: {
          target: 'loading',
          actions: { type: 'resetRetry' },
        },
      },
    },
  },
})

