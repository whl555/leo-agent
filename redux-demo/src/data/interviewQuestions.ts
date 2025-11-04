/**
 * Redux 面试题集合
 */

export type InterviewQuestion = {
  id: number
  category: string
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  keywords: string[]
}

export const reduxInterviewQuestions: InterviewQuestion[] = [
  // Redux 基础概念
  {
    id: 1,
    category: 'Redux 基础',
    question: '什么是 Redux？它解决了什么问题？',
    answer: `Redux 是一个可预测的状态容器，用于 JavaScript 应用。它解决了以下问题：

1. 状态共享：在大型应用中，多个组件需要访问和修改同一份状态
2. 状态可预测性：通过严格的单向数据流和 pure function，使状态变化可追踪
3. 状态管理复杂度：提供统一的状态管理方案，避免 props 层层传递
4. 时间旅行调试：可以记录每次状态变化，方便调试和回溯

核心原则：
- 单一数据源（Single source of truth）
- State 是只读的（State is read-only）
- 使用纯函数进行修改（Changes are made with pure functions）`,
    difficulty: 'easy',
    keywords: ['基础概念', '三大原则', '状态管理'],
  },
  {
    id: 2,
    category: 'Redux 基础',
    question: 'Redux 的三大核心组成部分是什么？它们之间如何协作？',
    answer: `Redux 的三大核心部分：

1. **Store**：
   - 保存整个应用的 state tree
   - 提供 getState() 获取 state
   - 提供 dispatch(action) 更新 state
   - 通过 subscribe(listener) 注册监听器

2. **Action**：
   - 描述"发生了什么"的普通对象
   - 必须有 type 属性
   - 可以携带其他数据（payload）

3. **Reducer**：
   - 纯函数：(state, action) => newState
   - 根据 action.type 决定如何更新 state
   - 不能修改原 state，必须返回新对象

协作流程：
1. 组件 dispatch(action)
2. Store 调用 reducer(currentState, action)
3. Reducer 返回新的 state
4. Store 保存新 state 并通知订阅者
5. 组件重新渲染`,
    difficulty: 'easy',
    keywords: ['Store', 'Action', 'Reducer', '数据流'],
  },
  {
    id: 3,
    category: 'Redux Toolkit',
    question: '为什么推荐使用 Redux Toolkit 而不是原生 Redux？',
    answer: `Redux Toolkit (RTK) 是 Redux 官方推荐的标准方式，原因如下：

1. **减少样板代码**：
   - createSlice 自动生成 action creators 和 action types
   - 不需要手动编写 switch-case

2. **内置最佳实践**：
   - 集成 Immer，可以"直接修改" state（实际是不可变更新）
   - 默认配置包含 Redux DevTools 和 thunk 中间件

3. **简化配置**：
   - configureStore 自动配置中间件和 DevTools
   - createAsyncThunk 简化异步逻辑

4. **TypeScript 友好**：
   - 更好的类型推断
   - 减少类型定义的重复

5. **包含实用工具**：
   - createEntityAdapter：标准化实体管理
   - RTK Query：强大的数据获取和缓存工具

示例对比：
// 传统 Redux：需要定义 types, action creators, reducer
// RTK：一个 createSlice 搞定所有`,
    difficulty: 'medium',
    keywords: ['Redux Toolkit', 'createSlice', 'Immer', '最佳实践'],
  },
  {
    id: 4,
    category: '中间件',
    question: '什么是 Redux 中间件？常用的中间件有哪些？',
    answer: `Redux 中间件是一个扩展 Redux dispatch 功能的方式，位于 action 被发起之后、到达 reducer 之前。

**中间件的作用**：
- 拦截 action
- 执行副作用（如异步请求、日志记录）
- 修改或取消 action
- 延迟 dispatch

**常用中间件**：

1. **redux-thunk**（RTK 默认包含）：
   - 允许 dispatch 函数而不是对象
   - 用于处理异步逻辑

2. **redux-logger**：
   - 记录每次 action 和 state 变化
   - 便于开发调试

3. **redux-saga**：
   - 使用 Generator 函数处理副作用
   - 更适合复杂的异步流程控制

4. **redux-observable**：
   - 基于 RxJS 的中间件
   - 使用 Observable 处理异步

**中间件原理**：
const middleware = (store) => (next) => (action) => {
  // 前置逻辑
  const result = next(action)
  // 后置逻辑
  return result
}`,
    difficulty: 'medium',
    keywords: ['中间件', 'thunk', 'saga', '异步处理'],
  },
  {
    id: 5,
    category: '性能优化',
    question: '如何优化 React-Redux 应用的性能？',
    answer: `React-Redux 性能优化策略：

1. **使用 Selector 优化**：
   - 使用 reselect 创建 memoized selector
   - 避免在 mapStateToProps 中创建新对象/数组
   - 使用 createSelector 缓存计算结果

2. **useSelector 优化**：
   - 使用多个 useSelector 而不是一个返回对象的 selector
   - 使用 shallowEqual 比较（React-Redux v7.1+）
   - 返回基本类型而不是对象（避免引用变化）

3. **组件优化**：
   - 使用 React.memo 包裹组件
   - 使用 useCallback 缓存回调函数
   - 拆分大组件，只订阅需要的 state

4. **Reducer 优化**：
   - 使用 createEntityAdapter 规范化数据
   - 避免嵌套过深的 state 结构
   - 使用 Immer（RTK 内置）简化不可变更新

5. **批量更新**：
   - React 18 自动批处理（automatic batching）
   - 使用 batch() 批量 dispatch（React-Redux v7+）

6. **代码分割**：
   - 使用动态 import 懒加载 reducer
   - injectReducer 模式动态注册 reducer

示例：
// ❌ 性能差：每次都创建新数组
const todos = useSelector(state =>
  state.todos.filter(t => t.completed)
)

// ✅ 优化：使用 memoized selector
const selectCompletedTodos = createSelector(
  state => state.todos,
  todos => todos.filter(t => t.completed)
)`,
    difficulty: 'hard',
    keywords: ['性能优化', 'reselect', 'memoization', '批处理'],
  },
  {
    id: 6,
    category: '最佳实践',
    question: 'Redux 的 state 应该如何设计？什么数据应该放在 Redux 中？',
    answer: `Redux State 设计原则：

**应该放入 Redux 的数据**：
1. 需要在多个组件间共享的数据
2. 需要持久化的数据
3. 需要在不同路由间保持的数据
4. 复杂的 UI 状态（如多步骤表单）
5. 服务器缓存数据

**不应该放入 Redux 的数据**：
1. 仅单个组件使用的数据（用 useState）
2. 派生数据（用 selector 计算）
3. 可以从 props 获取的数据
4. 表单输入值（除非需要跨组件共享）
5. 非序列化数据（函数、Promise、Symbol）

**State 结构设计**：
1. **扁平化**：避免深层嵌套
   - 使用 normalized state（规范化状态）
   - createEntityAdapter 自动处理

2. **按领域划分**：
   {
     users: { byId: {}, allIds: [] },
     posts: { byId: {}, allIds: [] },
     ui: { modal: {}, loading: {} }
   }

3. **关注点分离**：
   - domain data（领域数据）
   - app state（应用状态：当前路由、选中项）
   - ui state（UI 状态：modal 显示、loading）

4. **避免冗余**：
   - 不要存储可计算的数据
   - 使用 selector 进行派生计算

**实战建议**：
- 优先考虑本地状态（useState）
- 当 props drilling 超过 2-3 层时考虑 Redux
- 使用 Context API 作为轻量级替代方案`,
    difficulty: 'hard',
    keywords: ['State 设计', '规范化', '最佳实践', 'Normalized State'],
  },
  {
    id: 7,
    category: 'Redux Toolkit',
    question: 'createSlice 的 prepare callback 有什么作用？',
    answer: `prepare callback 用于自定义 action payload 的生成逻辑。

**作用**：
1. 在 action 被 dispatch 前处理参数
2. 生成唯一 ID（如使用 nanoid）
3. 添加元数据（如时间戳）
4. 参数验证和转换

**基本用法**：
const slice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: {
      // prepare 接收调用时的参数
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            createdAt: Date.now()
          }
        }
      },
      // reducer 接收 prepare 返回的 payload
      reducer(state, action: PayloadAction<{
        id: string
        title: string
        createdAt: number
      }>) {
        state.push(action.payload)
      }
    }
  }
})

// 使用：只需传入 title
dispatch(addTodo('Learn Redux'))
// 实际 action: {
//   type: 'todos/addTodo',
//   payload: { id: 'abc', title: 'Learn Redux', createdAt: 1234567890 }
// }

**为什么需要 prepare**：
- Reducer 必须是纯函数，不能生成随机值或时间戳
- prepare 在 reducer 外执行，可以包含非纯操作
- 分离关注点：参数处理 vs 状态更新`,
    difficulty: 'medium',
    keywords: ['createSlice', 'prepare', 'action creator', '纯函数'],
  },
  {
    id: 8,
    category: '异步处理',
    question: 'createAsyncThunk 是如何工作的？它自动生成哪些 action types？',
    answer: `createAsyncThunk 是 RTK 提供的用于处理异步逻辑的工具。

**自动生成的 Action Types**：
对于 createAsyncThunk('users/fetch', fetchUserFn)，会生成：
1. **pending**: 'users/fetch/pending' - 请求开始
2. **fulfilled**: 'users/fetch/fulfilled' - 请求成功
3. **rejected**: 'users/fetch/rejected' - 请求失败

**基本用法**：
export const fetchUsers = createAsyncThunk(
  'users/fetch',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(\`/api/users/\${userId}\`)
      return await response.json()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// 在 slice 中处理
extraReducers: (builder) => {
  builder
    .addCase(fetchUsers.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    })
    .addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
}

**thunkAPI 参数**：
第二个参数提供了有用的工具：
- dispatch: 用于 dispatch 其他 action
- getState: 获取当前 state
- rejectWithValue: 返回自定义错误
- fulfillWithValue: 返回自定义成功值
- signal: AbortController.signal 用于取消请求

**生命周期**：
1. dispatch(fetchUsers(id))
2. 立即 dispatch pending action
3. 执行 payload creator 函数
4. 成功则 dispatch fulfilled，失败则 dispatch rejected

**与普通 thunk 对比**：
- 自动处理 loading 状态
- 自动生成 action types
- 内置错误处理
- TypeScript 类型支持更好`,
    difficulty: 'medium',
    keywords: ['createAsyncThunk', '异步', 'pending', 'fulfilled', 'rejected'],
  },
  {
    id: 9,
    category: 'RTK Query',
    question: '什么是 RTK Query？它相比传统数据获取方式有什么优势？',
    answer: `RTK Query 是 Redux Toolkit 内置的强大数据获取和缓存工具。

**核心优势**：

1. **自动缓存管理**：
   - 自动存储和管理服务器数据
   - 智能缓存失效和更新
   - 减少不必要的网络请求

2. **减少样板代码**：
   - 不需要手写 action、reducer、thunk
   - 自动生成 hooks（useQuery、useMutation）
   - 一行代码完成数据获取

3. **优化性能**：
   - 自动去重并发请求
   - 标签化缓存失效（tag-based invalidation）
   - Optimistic updates（乐观更新）
   - 自动重新获取（polling、refetchOnFocus）

4. **强大的 TypeScript 支持**：
   - 自动类型推导
   - 端到端类型安全

**基本用法**：
// 1. 定义 API
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',
      providesTags: ['Post']
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: 'posts',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Post']
    })
  })
})

export const { useGetPostsQuery, useAddPostMutation } = api

// 2. 在组件中使用
function Posts() {
  const { data, isLoading, error } = useGetPostsQuery()
  const [addPost] = useAddPostMutation()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error!</div>

  return (
    <div>
      {data?.map(post => <div key={post.id}>{post.title}</div>)}
      <button onClick={() => addPost({ title: 'New' })}>
        Add Post
      </button>
    </div>
  )
}

**特性对比**：
| 特性 | 传统方式 | RTK Query |
|-----|---------|-----------|
| 样板代码 | 大量 | 极少 |
| 缓存 | 手动实现 | 自动 |
| 请求状态 | 手动管理 | 自动 |
| 重复请求 | 需处理 | 自动去重 |
| 缓存失效 | 复杂 | 标签系统 |

**何时使用**：
✅ 需要从服务器获取数据
✅ 需要缓存和状态管理
✅ 需要自动重新获取
❌ 不需要缓存的简单请求可以用普通 fetch`,
    difficulty: 'hard',
    keywords: ['RTK Query', '缓存', 'API', 'useQuery', 'useMutation'],
  },
  {
    id: 10,
    category: 'Hooks',
    question: 'useSelector 和 useDispatch 的使用注意事项？',
    answer: `React-Redux Hooks 的最佳实践：

**useSelector 注意事项**：

1. **避免返回新对象**：
❌ 错误：每次都返回新对象引用
const data = useSelector(state => ({
  user: state.user,
  posts: state.posts
}))

✅ 正确：使用多个 selector
const user = useSelector(state => state.user)
const posts = useSelector(state => state.posts)

✅ 或使用 shallowEqual
import { shallowEqual } from 'react-redux'
const data = useSelector(
  state => ({ user: state.user, posts: state.posts }),
  shallowEqual
)

2. **使用 memoized selector**：
import { createSelector } from '@reduxjs/toolkit'

const selectCompletedTodos = createSelector(
  [(state) => state.todos],
  (todos) => todos.filter(t => t.completed)
)

3. **避免在 selector 中执行昂贵计算**：
- 使用 reselect 缓存计算结果
- 将复杂计算移到 selector 外部

**useDispatch 注意事项**：

1. **使用 useCallback 缓存 dispatch 函数**：
const dispatch = useDispatch()

// ❌ 每次渲染都创建新函数
<button onClick={() => dispatch(increment())}>+</button>

// ✅ 使用 useCallback
const handleIncrement = useCallback(() => {
  dispatch(increment())
}, [dispatch])

<button onClick={handleIncrement}>+</button>

2. **类型化 dispatch**（TypeScript）：
// app/hooks.ts
import { useDispatch } from 'react-redux'
import type { AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()

3. **批量 dispatch**（React 18+）：
// 自动批处理
const handleSubmit = () => {
  dispatch(action1())
  dispatch(action2())
  dispatch(action3())
  // 只触发一次重渲染
}

**性能优化建议**：
1. 只订阅需要的 state 片段
2. 使用 React.memo 包裹组件
3. 避免在 render 中创建新的 selector
4. 使用 Redux DevTools 监控性能

**常见错误**：
❌ 在 useSelector 中使用 props
const todo = useSelector(state =>
  state.todos.find(t => t.id === props.id) // 错误！
)

✅ 使用工厂函数创建 selector
const selectTodoById = (id) => (state) =>
  state.todos.find(t => t.id === id)

const todo = useSelector(selectTodoById(props.id))`,
    difficulty: 'medium',
    keywords: ['useSelector', 'useDispatch', 'hooks', '性能优化'],
  },
  {
    id: 11,
    category: '中间件',
    question: '如何实现一个自定义的 Redux 中间件？',
    answer: `Redux 中间件实现原理和示例：

**中间件签名**：
const middleware = (storeAPI) => (next) => (action) => {
  // 中间件逻辑
  return next(action)
}

参数说明：
- storeAPI: { dispatch, getState }
- next: 下一个中间件或 reducer
- action: 当前 dispatch 的 action

**示例 1：Logger 中间件**：
const logger = (store) => (next) => (action) => {
  console.group(action.type)
  console.info('dispatching', action)

  const result = next(action)

  console.log('next state', store.getState())
  console.groupEnd()

  return result
}

**示例 2：Error Handler 中间件**：
const errorHandler = (store) => (next) => (action) => {
  try {
    return next(action)
  } catch (err) {
    console.error('Action error:', err)
    store.dispatch({
      type: 'ERROR_OCCURRED',
      payload: err.message
    })
    throw err
  }
}

**示例 3：Async Action 中间件**：
const asyncActionMiddleware = (store) => (next) => (action) => {
  // 如果 action 有 promise 字段，处理异步
  if (action.promise) {
    const { types, promise, ...rest } = action
    const [REQUEST, SUCCESS, FAILURE] = types

    // Dispatch request action
    store.dispatch({ ...rest, type: REQUEST })

    // 处理 promise
    return promise
      .then(result => {
        store.dispatch({ ...rest, type: SUCCESS, payload: result })
        return result
      })
      .catch(error => {
        store.dispatch({ ...rest, type: FAILURE, payload: error })
        throw error
      })
  }

  return next(action)
}

**示例 4：Action 过滤/转换中间件**：
const actionTransform = (store) => (next) => (action) => {
  // 过滤某些 action
  if (action.type === 'IGNORE_THIS') {
    return
  }

  // 转换 action
  if (action.type === 'OLD_ACTION') {
    return next({
      type: 'NEW_ACTION',
      payload: action.payload
    })
  }

  return next(action)
}

**示例 5：Analytics 中间件**：
const analytics = (store) => (next) => (action) => {
  // 发送分析数据
  if (action.meta?.analytics) {
    window.gtag('event', action.type, {
      ...action.meta.analytics
    })
  }

  return next(action)
}

**使用中间件**：
// Redux Toolkit
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger, analytics)
})

// 传统 Redux
import { createStore, applyMiddleware } from 'redux'

const store = createStore(
  reducer,
  applyMiddleware(logger, errorHandler, asyncActionMiddleware)
)

**中间件执行顺序**：
applyMiddleware(a, b, c)
dispatch(action) → a → b → c → reducer

**注意事项**：
1. 必须调用 next(action) 否则 action 不会到达 reducer
2. 可以 dispatch 新的 action（但要避免无限循环）
3. 中间件是可组合的
4. 异步操作在中间件中处理，reducer 保持纯净`,
    difficulty: 'hard',
    keywords: ['中间件', '自定义中间件', 'middleware', '插件'],
  },
  {
    id: 12,
    category: '最佳实践',
    question: 'Redux 中如何处理副作用（side effects）？',
    answer: `Redux 处理副作用的多种方式：

**1. Redux Thunk（最常用）**：
// Action creator 返回函数
export const fetchUser = (userId) => {
  return async (dispatch, getState) => {
    dispatch({ type: 'FETCH_USER_REQUEST' })

    try {
      const response = await fetch(\`/api/users/\${userId}\`)
      const data = await response.json()
      dispatch({ type: 'FETCH_USER_SUCCESS', payload: data })
    } catch (error) {
      dispatch({ type: 'FETCH_USER_FAILURE', payload: error })
    }
  }
}

// RTK 版本
export const fetchUser = createAsyncThunk(
  'users/fetch',
  async (userId: number) => {
    const response = await fetch(\`/api/users/\${userId}\`)
    return response.json()
  }
)

**2. Redux Saga（复杂场景）**：
import { call, put, takeEvery } from 'redux-saga/effects'

function* fetchUserSaga(action) {
  try {
    const user = yield call(api.fetchUser, action.payload)
    yield put({ type: 'FETCH_USER_SUCCESS', payload: user })
  } catch (error) {
    yield put({ type: 'FETCH_USER_FAILURE', payload: error })
  }
}

function* watchFetchUser() {
  yield takeEvery('FETCH_USER_REQUEST', fetchUserSaga)
}

**3. RTK Query（数据获取）**：
const api = createApi({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => \`users/\${id}\`,
    })
  })
})

const { data, isLoading } = useGetUserQuery(userId)

**4. Listener Middleware（RTK 1.9+）**：
import { createListenerMiddleware } from '@reduxjs/toolkit'

const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  actionCreator: todoAdded,
  effect: async (action, listenerApi) => {
    // 执行副作用
    await api.saveTodo(action.payload)

    // 可以 dispatch 新 action
    listenerApi.dispatch(todoSaved())
  }
})

**5. 中间件**：
const apiMiddleware = (store) => (next) => (action) => {
  if (action.type === 'API_REQUEST') {
    fetch(action.url)
      .then(res => res.json())
      .then(data => store.dispatch({
        type: 'API_SUCCESS',
        payload: data
      }))
  }

  return next(action)
}

**方案对比**：

| 方案 | 适用场景 | 学习曲线 | 功能强大度 |
|-----|---------|---------|-----------|
| Thunk | 简单异步 | 低 | 中 |
| createAsyncThunk | 标准异步 | 低 | 中 |
| RTK Query | 数据获取/缓存 | 中 | 高 |
| Saga | 复杂流程控制 | 高 | 非常高 |
| Listener | 响应式副作用 | 中 | 高 |

**推荐方案**：
1. 默认使用 createAsyncThunk（RTK）
2. 数据获取用 RTK Query
3. 复杂场景考虑 Redux Saga
4. 新项目可尝试 Listener Middleware

**核心原则**：
- Reducer 必须保持纯净
- 副作用在中间件层处理
- 不要在 reducer 中执行异步操作`,
    difficulty: 'hard',
    keywords: ['副作用', 'thunk', 'saga', 'RTK Query', '异步'],
  },
]
