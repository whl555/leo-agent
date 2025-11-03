# React-Redux Best Practice Demo

该示例基于 React + Vite，聚焦 React-Redux 官方最佳实践：采用 Redux Toolkit、领域切片、实体适配器、类型安全 hooks、派发/选择器分层等推荐模式。

## 快速开始

```bash
npm install
npm run dev
```

访问终端中输出的本地地址即可体验示例。

## 项目结构

- `src/app/store.ts`：集中创建 Redux store，按领域注册 reducer。
- `src/app/hooks.ts`：封装类型安全的 `useAppDispatch`/`useAppSelector`，避免组件重复推断类型。
- `src/features/tasks/tasksSlice.ts`：使用 `createEntityAdapter` 管理任务实体，包含异步加载、筛选状态及同步 reducer。
- `src/features/tasks/tasksSelectors.ts`：通过 `createSelector` 构建可组合的 memoized selector。
- `src/features/tasks/Task*.tsx`：按职责拆分 UI（Composer/Filters/List/Stats），组件只关心所在职责，均使用封装后的 hooks。
- `src/App.tsx`：组织页面布局，体现「容器少、展示组件多」的 hooks 写法。
- `docs/redux-knowledge.md`：总结示例中涉及的 Redux 知识点与实践建议，便于团队培训或复用。

## 包含哪些最佳实践

- **Redux Toolkit 优先**：通过 `createSlice`、`createAsyncThunk`、`createEntityAdapter` 管理状态与异步逻辑，减少样板代码。
- **类型安全的 hooks**：在 `app/hooks.ts` 中统一导出，加强可维护性。
- **领域驱动的文件结构**：按 feature 目录组织 slice、selector、组件，方便扩展。
- **选择器分层**：`tasksSelectors.ts` 中的 `selectFilteredTasks`/`selectTaskStats` 提供 memoized 计算，避免重复渲染。
- **分离 UI 与数据获取**：组件只通过 hooks 与 store 通信，提交/读取数据都集中在 slice 与 selector 中，保持关注分离。

## 如何使用本示例

- 新建任务：在左侧表单输入标题、选择优先级后提交，slice 内通过 `prepare` 回调构造带 `id` 的 payload。
- 筛选任务：状态、优先级筛选会调用 `updateFilters`，由 selector 决定最终展示列表。
- 加载数据：页面初始化时触发 `fetchTasks` 异步 thunk，演示请求状态管理。
- 统计信息：右侧统计卡片依赖 memoized selector，展示总数、完成数等指标。

通过这套结构，你可以快速对齐 React-Redux 在函数组件时代的最佳实践，并在此基础上继续扩展更多 feature、引入 RTK Query 等高级能力。

更多细节：详见 `docs/redux-knowledge.md`。
