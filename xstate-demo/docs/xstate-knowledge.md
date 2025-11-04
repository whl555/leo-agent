# XState 在 React 中的最佳实践

## 目录
1. [什么是 XState](#什么是-xstate)
2. [核心概念](#核心概念)
3. [为什么使用状态机](#为什么使用状态机)
4. [XState 最佳实践](#xstate-最佳实践)
5. [与 React 集成](#与-react-集成)
6. [常见使用场景](#常见使用场景)

## 什么是 XState

XState 是一个用于创建、解释和执行有限状态机（FSM）和状态图的 JavaScript/TypeScript 库。它基于 SCXML（State Chart XML）规范，提供了一种声明式的方式来管理应用程序的状态逻辑。

### 核心优势

- **可视化**：状态机可以可视化，易于理解和沟通
- **可预测**：明确的状态转换，避免意外状态
- **可测试**：状态机逻辑易于测试
- **可维护**：状态逻辑集中管理，易于维护

## 核心概念

### 1. 状态 (States)

状态是系统在某一时刻的条件或情况。

```typescript
states: {
  idle: {},      // 空闲状态
  loading: {},   // 加载状态
  success: {},   // 成功状态
  error: {}      // 错误状态
}
```

### 2. 事件 (Events)

事件触发状态之间的转换。

```typescript
type Events = 
  | { type: 'FETCH' }
  | { type: 'RETRY' }
  | { type: 'CANCEL' }
```

### 3. 转换 (Transitions)

转换定义了从一个状态到另一个状态的规则。

```typescript
idle: {
  on: {
    FETCH: 'loading'  // 收到 FETCH 事件，转换到 loading 状态
  }
}
```

### 4. Context

Context 是状态机的扩展状态数据。

```typescript
context: {
  users: [],
  error: null,
  retryCount: 0
}
```

### 5. Actions

Actions 是状态机响应转换时执行的副作用。

```typescript
actions: {
  setError: assign({
    error: (_, params) => params.error.message
  })
}
```

### 6. Guards

Guards 是条件函数，决定是否允许某个转换。

```typescript
guards: {
  canRetry: ({ context }) => context.retryCount < 3
}
```

### 7. Services (Actors)

Services 是调用异步操作（如 API 调用）的方式。

```typescript
actors: {
  fetchData: async ({ context }) => {
    return await api.fetchUsers()
  }
}
```

## 为什么使用状态机

### 传统状态管理的问题

```typescript
// ❌ 传统方式：容易出现不一致的状态
const [isLoading, setIsLoading] = useState(false)
const [isError, setIsError] = useState(false)
const [data, setData] = useState(null)

// 可能出现：isLoading=true 且 isError=true 的无效状态
```

### 状态机的解决方案

```typescript
// ✅ 状态机：互斥状态，避免不一致
states: {
  idle: {},
  loading: {},   // 不可能同时是 loading 和 error
  success: {},
  error: {}
}
```

### 状态爆炸问题

随着应用复杂度增加，传统方式需要管理的布尔标志指数增长：

- 2 个布尔值 = 4 种可能状态
- 3 个布尔值 = 8 种可能状态
- 5 个布尔值 = 32 种可能状态（多数无效）

状态机只定义有效状态，避免状态爆炸。

## XState 最佳实践

### 1. 使用 setup() 函数

```typescript
export const myMachine = setup({
  types: {
    context: {} as MyContext,
    events: {} as MyEvents
  },
  guards: { /* ... */ },
  actions: { /* ... */ },
  actors: { /* ... */ }
}).createMachine({
  // 机器定义
})
```

**优势**：
- 类型安全
- 逻辑复用
- 更好的组织结构

### 2. 为状态机命名

```typescript
createMachine({
  id: 'auth',  // 给状态机一个有意义的 ID
  // ...
})
```

### 3. 使用 assign() 更新 context

```typescript
actions: {
  setUser: assign({
    user: (_, params) => params.data
  })
}
```

### 4. 分离状态机定义和 React 组件

```
src/
  machines/
    authMachine.ts      # 状态机定义
  components/
    AuthDemo.tsx        # React 组件
```

### 5. 使用 TypeScript

```typescript
type Context = {
  count: number
  error: string | null
}

type Events = 
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
```

### 6. 善用 guards 进行条件转换

```typescript
guards: {
  isValidEmail: ({ context }) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(context.email)
}

// 使用 guard
on: {
  SUBMIT: {
    target: 'submitting',
    guard: 'isValidEmail'
  }
}
```

### 7. 使用层次状态处理复杂逻辑

```typescript
states: {
  form: {
    initial: 'editing',
    states: {
      editing: {},
      validating: {},
      submitting: {}
    }
  }
}
```

### 8. 合理使用 invoke

```typescript
loading: {
  invoke: {
    src: 'fetchUsers',
    onDone: {
      target: 'success',
      actions: 'setUsers'
    },
    onError: {
      target: 'error',
      actions: 'setError'
    }
  }
}
```

## 与 React 集成

### 使用 @xstate/react

```typescript
import { useMachine } from '@xstate/react'
import { myMachine } from './machines/myMachine'

function MyComponent() {
  const [state, send] = useMachine(myMachine)
  
  return (
    <div>
      <p>Current state: {state.value}</p>
      <button onClick={() => send({ type: 'NEXT' })}>
        Next
      </button>
    </div>
  )
}
```

### 访问 context

```typescript
const [state, send] = useMachine(myMachine)

// 访问 context
console.log(state.context.user)
console.log(state.context.error)
```

### 检查状态

```typescript
// 检查当前状态
const isLoading = state.matches('loading')
const isAuthenticated = state.matches('authenticated')

// 条件渲染
{isLoading && <Spinner />}
{isAuthenticated && <Dashboard />}
```

### 发送事件

```typescript
// 简单事件
send({ type: 'FETCH' })

// 带参数的事件
send({ 
  type: 'LOGIN', 
  username: 'admin', 
  password: 'secret' 
})
```

## 常见使用场景

### 1. 用户认证流程

- 状态：idle → loading → authenticated/error
- 处理登录、登出、错误重试

### 2. 表单验证

- 多字段验证
- 实时错误提示
- 提交状态管理

### 3. 数据获取

- 加载状态
- 错误处理
- 重试逻辑
- 取消请求

### 4. 多步骤向导

- 顺序步骤
- 前进/后退导航
- 数据收集和验证
- 最终提交

### 5. 计时器/定时任务

- 启动/暂停/重置
- 延迟转换
- 时间相关状态

## 常见模式

### 1. 重试模式

```typescript
guards: {
  canRetry: ({ context }) => context.retryCount < MAX_RETRIES
},
actions: {
  incrementRetry: assign({
    retryCount: ({ context }) => context.retryCount + 1
  })
},
states: {
  error: {
    on: {
      RETRY: {
        target: 'loading',
        guard: 'canRetry',
        actions: 'incrementRetry'
      }
    }
  }
}
```

### 2. 乐观更新模式

```typescript
states: {
  optimisticUpdate: {
    entry: 'applyOptimisticUpdate',
    invoke: {
      src: 'saveData',
      onDone: 'success',
      onError: {
        target: 'error',
        actions: 'revertOptimisticUpdate'
      }
    }
  }
}
```

### 3. 防抖模式

```typescript
states: {
  idle: {
    on: {
      INPUT: 'debouncing'
    }
  },
  debouncing: {
    after: {
      500: 'searching'  // 500ms 后转换
    },
    on: {
      INPUT: {
        target: 'debouncing',
        reenter: true  // 重新进入状态，重置计时器
      }
    }
  }
}
```

## 调试技巧

### 1. 使用 XState Inspector

```typescript
import { inspect } from '@xstate/inspect'

inspect({ iframe: false })

const [state, send] = useMachine(myMachine, {
  devTools: true
})
```

### 2. 记录状态转换

```typescript
const [state, send] = useMachine(myMachine, {
  actions: {
    logTransition: ({ context, event }) => {
      console.log('Transition:', event.type, context)
    }
  }
})
```

## 总结

XState 提供了一种强大且可靠的方式来管理复杂的状态逻辑：

✅ **明确的状态定义**：避免不一致状态  
✅ **可视化**：状态机可图形化展示  
✅ **可测试**：状态逻辑易于单元测试  
✅ **可维护**：逻辑集中，易于理解和修改  
✅ **类型安全**：完整的 TypeScript 支持  

通过本示例项目中的 5 个实际案例，你可以学习到 XState 在 React 应用中的核心用法和最佳实践。






