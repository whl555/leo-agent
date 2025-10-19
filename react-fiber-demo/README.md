# React Fiber 架构演示项目

这是一个交互式演示项目，用于深入理解 React Fiber 架构和 JavaScript Generator 函数。

## 🎯 项目特色

- **Generator 函数基础**: 详细演示 Generator 的用法和特性
- **Fiber 架构原理**: 可视化展示 Fiber 树的构建过程
- **优先级调度**: 交互式演示任务优先级调度机制
- **实时演示**: 所有概念都有可运行的代码示例

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

## 📚 学习内容

### 1. Generator 函数基础

- Generator 的基本语法和使用
- yield 关键字和双向通信
- Generator 在实现协程中的应用
- 可中断的计算任务

### 2. React Fiber 架构

- Fiber 节点的数据结构
- Fiber 树的构建过程
- 链表结构实现可中断遍历
- 双缓冲技术
- 两阶段提交（Render & Commit）

### 3. 优先级调度

- 不同类型任务的优先级
- 时间切片机制
- 高优先级任务打断低优先级任务
- 任务饥饿问题的处理

## 🏗️ 项目结构

```
src/
├── demos/
│   ├── GeneratorBasics.tsx      # Generator 函数演示
│   ├── FiberArchitecture.tsx    # Fiber 架构演示
│   └── PriorityScheduling.tsx   # 优先级调度演示
├── App.tsx                       # 主应用组件
└── index.tsx                     # 入口文件
```

## 💡 核心概念

### Fiber 是什么？

Fiber 是 React 16 引入的新协调引擎，它重新实现了 React 的核心算法。主要特点：

1. **可中断**: 渲染工作可以被分解和暂停
2. **优先级**: 不同更新有不同优先级
3. **并发**: 可以同时准备多个版本的 UI
4. **流畅**: 避免长时间阻塞主线程

### 为什么不直接使用 Generator？

虽然 Fiber 的思想受到 Generator 启发，但 React 最终没有使用 Generator：

- Generator 是同步的，不能真正实现并发
- 无法实现灵活的优先级调度
- 难以实现双缓冲技术
- Fiber 基于链表，可以更灵活地控制执行流程

## 🎓 推荐学习路径

1. **理解 Generator 函数** → 掌握可中断执行的概念
2. **学习 Fiber 架构** → 了解 React 的内部工作原理
3. **掌握优先级调度** → 理解 React 如何优化性能

## 📖 参考资料

- [React 官方文档 - Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)
- [Lin Clark - A Cartoon Intro to Fiber](https://www.youtube.com/watch?v=ZCuYPiUIONs)
- [深入理解 React Fiber](https://indepth.dev/posts/1008/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License
