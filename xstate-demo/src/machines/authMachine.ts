import { assign, fromPromise, setup } from 'xstate'

/**
 * 用户认证状态机
 * 展示：基础状态转换、context管理、错误处理
 */

type AuthContext = {
  username: string
  password: string
  error: string | null
  user: { id: string; name: string } | null
}

type AuthEvents =
  | { type: 'LOGIN'; username: string; password: string }
  | { type: 'LOGOUT' }
  | { type: 'RETRY' }

// 模拟API调用
const loginAPI = async (username: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  
  if (username === 'admin' && password === 'admin') {
    return { id: '1', name: 'Admin User' }
  }
  
  throw new Error('用户名或密码错误')
}

export const authMachine = setup({
  types: {
    context: {} as AuthContext,
    events: {} as AuthEvents,
  },
  guards: {
    hasValidCredentials: ({ context }) => {
      return context.username.length > 0 && context.password.length > 0
    },
  },
  actions: {
    setCredentials: assign(({ event }) => {
      if (event.type === 'LOGIN') {
        return {
          username: event.username,
          password: event.password,
          error: null,
        }
      }
      return {}
    }),
    clearAuth: assign({
      user: null,
      username: '',
      password: '',
      error: null,
    }),
  },
  actors: {
    loginService: fromPromise(async ({ input }: { input: { username: string; password: string } }) => {
      return await loginAPI(input.username, input.password)
    }),
  },
}).createMachine({
  id: 'auth',
  initial: 'idle',
  context: {
    username: '',
    password: '',
    error: null,
    user: null,
  },
  states: {
    idle: {
      on: {
        LOGIN: {
          target: 'loading',
          actions: { type: 'setCredentials' },
          guard: { type: 'hasValidCredentials' },
        },
      },
    },
    loading: {
      invoke: {
        src: 'loginService',
        input: ({ context }) => ({
          username: context.username,
          password: context.password,
        }),
        onDone: {
          target: 'authenticated',
          actions: assign({
            user: ({ event }) => event.output,
            error: null,
          }),
        },
        onError: {
          target: 'error',
          actions: assign({
            error: ({ event }) => (event.error as Error).message,
          }),
        },
      },
    },
    authenticated: {
      on: {
        LOGOUT: {
          target: 'idle',
          actions: { type: 'clearAuth' },
        },
      },
    },
    error: {
      on: {
        RETRY: 'loading',
        LOGIN: {
          target: 'loading',
          actions: { type: 'setCredentials' },
          guard: { type: 'hasValidCredentials' },
        },
      },
    },
  },
})

