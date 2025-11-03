# Redux Demo - React-Redux 最佳实践与面试题库

这是一个完整的 Redux Toolkit + React-Redux 示例项目，包含最佳实践演示、完整的面试题库、中间件演示、性能优化示例和 RTK Query 数据获取，帮助你快速掌握 Redux 并准备面试。

## 🌟 项目特性

### 1. 📝 任务管理系统（原有功能增强）
- Redux Toolkit 的现代化用法
- createSlice 和 createEntityAdapter
- 异步操作（createAsyncThunk）
- Memoized selectors
- 组件分层最佳实践

### 2. 📚 Redux 面试题库（新增）
包含 **12+ 道精选面试题**，覆盖：
- **Redux 基础**：核心概念、三大原则、数据流
- **Redux Toolkit**：createSlice、prepare callback、最佳实践
- **中间件**：thunk、saga、自定义中间件
- **性能优化**：selector 优化、批量更新、memoization
- **RTK Query**：数据获取、缓存、乐观更新
- **Hooks**：useSelector、useDispatch 使用技巧
- **最佳实践**：State 设计、副作用处理

每个题目包含详细答案、代码示例、关键词标签和难度分级，支持按分类、难度、关键词搜索和筛选。

### 3. 🔌 中间件演示（新增）
实现了 **9 种常用中间件**：
- Logger 中间件：记录 action 和状态变化
- 性能监控中间件：测量 action 处理时间
- 错误处理中间件：捕获和处理异常
- Analytics 中间件：发送分析数据
- 防抖中间件：防止频繁 dispatch
- 本地存储中间件：自动持久化状态
- API 中间件、批处理中间件、Crash Reporter 等

可在演示页面测试各种中间件功能，在控制台查看完整的数据流日志。

### 4. ⚡ 性能优化演示（新增）
展示 React-Redux 性能优化技术：
- Selector 优化（createSelector vs 未优化）
- 回调优化（useCallback）
- 批量更新（React 18 自动批处理）
- 复杂计算 Memoization（useMemo）
- 渲染次数追踪

实时对比优化前后的性能差异。

### 5. 🔄 RTK Query 演示（新增）
完整的 RTK Query 数据获取示例：
- 自动缓存和重复请求去重
- CRUD 操作（创建、读取、更新、删除）
- 乐观更新（Optimistic Updates）
- 标签化缓存失效
- Loading 状态和错误处理

## 快速开始

```bash
npm install
npm run dev
```

访问终端中输出的本地地址即可体验示例。

## 📂 项目结构

```
redux-demo/
├── src/
│   ├── app/
│   │   ├── store.ts              # Redux store 配置（集成所有 reducer 和中间件）
│   │   └── hooks.ts              # 类型化的 hooks
│   ├── features/
│   │   ├── tasks/                # 任务管理 feature
│   │   │   ├── tasksSlice.ts    # Redux slice（包含 prepare callback）
│   │   │   ├── tasksSelectors.ts # Memoized selectors
│   │   │   └── [组件]            # TaskComposer、TaskList 等
│   │   ├── interview/            # 📚 面试题展示（新增）
│   │   │   └── InterviewQuestions.tsx
│   │   ├── middleware/           # 🔌 中间件演示（新增）
│   │   │   ├── middlewareExamples.ts  # 9种中间件实现
│   │   │   └── MiddlewareDemo.tsx
│   │   ├── performance/          # ⚡ 性能优化演示（新增）
│   │   │   └── PerformanceDemo.tsx
│   │   └── rtkQuery/             # 🔄 RTK Query 演示（新增）
│   │       ├── api.ts            # API 定义和 endpoints
│   │       └── RTKQueryDemo.tsx
│   ├── data/
│   │   └── interviewQuestions.ts # 📚 面试题数据（新增）
│   ├── App.tsx                   # 主应用（Tab 导航）
│   ├── App.css                   # 样式文件（已扩展）
│   └── main.tsx                  # 应用入口
```

## 💡 核心技术栈

- **React 19** - UI 框架
- **Redux Toolkit 2.9** - 状态管理
- **React-Redux 9.2** - React 绑定
- **TypeScript** - 类型安全
- **Vite** - 构建工具

## 📖 包含哪些最佳实践

### 原有最佳实践
- **Redux Toolkit 优先**：通过 `createSlice`、`createAsyncThunk`、`createEntityAdapter` 管理状态
- **类型安全的 hooks**：在 `app/hooks.ts` 中统一导出
- **领域驱动的文件结构**：按 feature 目录组织
- **选择器分层**：使用 memoized selector 避免重复渲染
- **分离 UI 与数据获取**：关注点分离

### 新增最佳实践
- **中间件架构**：9 种实用中间件演示，包括日志、性能、错误处理等
- **性能优化模式**：createSelector、useCallback、useMemo、批处理
- **RTK Query 集成**：现代化的数据获取和缓存方案
- **面试准备资源**：系统化的面试题和答案

## 🎯 如何使用本示例

### 1. 任务管理（原有功能）
- 新建任务：通过 `prepare` 回调自动生成 ID 和时间戳
- 筛选任务：状态和优先级过滤
- 异步加载：`createAsyncThunk` 演示
- 统计信息：memoized selector 性能优化

### 2. 面试题库（新增）
- 浏览 12+ 道精选面试题
- 按分类、难度筛选
- 搜索关键词
- 查看详细答案和代码示例

### 3. 中间件演示（新增）
- 测试不同类型的中间件功能
- 在控制台查看完整的数据流日志
- 理解中间件的执行顺序
- 学习如何编写自定义中间件

### 4. 性能优化（新增）
- 对比优化前后的性能差异
- 查看组件渲染次数
- 学习 selector 优化技巧
- 理解 React 18 批处理

### 5. RTK Query（新增）
- 体验自动缓存和去重
- 测试 CRUD 操作
- 观察乐观更新效果
- 学习标签化缓存失效

## 📚 学习路径建议

### 初学者
1. 从「任务管理」标签开始，理解基础用法
2. 查看「面试题库」中的简单题目
3. 学习基础概念：Store、Action、Reducer

### 进阶
1. 研究「中间件演示」，理解中间件原理
2. 学习「性能优化」技术
3. 查看中等难度的面试题

### 高级
1. 深入「RTK Query」，掌握数据获取最佳实践
2. 研究困难面试题
3. 阅读源码，理解实现原理

## 🔥 项目亮点

1. **交互式学习**：所有功能都可交互操作，不是静态文档
2. **完整的类型支持**：全程 TypeScript，类型安全
3. **真实的项目结构**：遵循官方最佳实践，可直接用于实际项目
4. **详尽的注释**：每个文件都有清晰的注释和说明
5. **面试友好**：包含系统化的面试题库和答案

## 🤝 相关资源

- [Redux 官方文档](https://redux.js.org/)
- [Redux Toolkit 文档](https://redux-toolkit.js.org/)
- [React-Redux 文档](https://react-redux.js.org/)
- [RTK Query 文档](https://redux-toolkit.js.org/rtk-query/overview)

---

**💡 提示**：打开浏览器控制台可以看到更多中间件日志输出，帮助你更好地理解 Redux 数据流！
