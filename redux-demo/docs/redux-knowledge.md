# React-Redux 最佳实践速览

本文档梳理项目中使用到的核心 Redux/React-Redux 能力点，帮助你快速回顾并迁移到自己的业务场景。

## 1. Redux Toolkit 作为默认选择

- **`configureStore`**：在 `src/app/store.ts` 中集中创建 store，自动集成 Redux DevTools、`redux-thunk`，并完成 reducer 聚合。
- **模块化 reducer**：每个业务域用独立 slice（例如 `tasksSlice`），保持关注点分离。

## 2. `createSlice`：状态与 reducer 的集中声明

- **初始状态 + reducer**：在 `tasksSlice` 中，使用 `createSlice` 将同步 reducer 与初始状态放在一起，便于阅读与重构。
- **`prepare` 回调**：`addTask` 使用 `prepare` 构建带有 `id`、`createdAt` 的 payload，同时保持 reducer 函数只关注业务逻辑。
- **可变写法 + Immer**：slice 中直接修改 `state`（如 `task.completed = !task.completed`），由 Toolkit 内置的 Immer 负责生成不可变新状态。

## 3. `createAsyncThunk`：标准化异步流

- 在 `fetchTasks` 中声明异步请求，自动生成 `pending/fulfilled/rejected` 三种 action。
- `extraReducers` 按生命周期更新 `status`、`error` 等派生状态，组件只需订阅 `status` 即可渲染加载态或错误态。

## 4. `createEntityAdapter`：管理实体集合

- `tasksAdapter` 提供 `upsertOne`、`setAll`、`removeMany` 等操作，简化列表型数据的增删改。
- 配置 `sortComparer` 确保实体集合有序，避免组件层进行重复排序。

## 5. 类型安全的 hooks 封装

- `useAppDispatch` / `useAppSelector` 定义于 `src/app/hooks.ts`，对外暴露带类型的 dispatch 与 selector，避免在组件中多次重复泛型注解。
- 组件只需 `const dispatch = useAppDispatch()` 即可获得正确的 `AppDispatch` 类型。

## 6. `createSelector` 构建高性能派生数据

- `tasksSelectors.ts` 使用 `createSelector` 组合基本选择器与筛选条件（`selectFilteredTasks`）。
- 由于使用 memoization，仅当依赖数据发生变化时才重新计算，减少不必要的重新渲染。

## 7. React-Redux Hooks 组件模式

- **容器 + 展示拆分**：`TaskComposer`、`TaskFilters`、`TaskList`、`TaskStats` 按职责划分组件，每个组件仅订阅自身需要的数据。
- **批量 dispatch**：组件通过 `useAppDispatch()` 派发同步或异步 action，业务流程集中在 slice 中定义，组件保持轻量。

## 8. 全局接入 Provider

- 在 `src/main.tsx` 里用 `<Provider store={store}>` 包裹 `<App />`，确保全局组件均可访问 Redux store。

## 9. 文件结构建议

- `app/`：存放 store、hooks、通用类型。
- `features/<domain>/`：业务域目录，包含 slice、selectors、UI 组件。
- `docs/`：记录架构、约定、最佳实践等文档（本文位置）。

通过上述策略，项目实现了：

1. 较少的样板代码（Template Code），新增 feature 时成本低；
2. 数据流清晰：异步逻辑 → slice → selector → 组件；
3. 类型无缝贯通：从 store 到组件的类型推导完整；
4. 高可扩展性：可继续接入 RTK Query、listenerMiddleware 等高级能力。

若你在生产项目中采用 Redux，推荐从本结构出发演进，逐步引入团队自定义的中间件、错误上报、埋点等能力。

