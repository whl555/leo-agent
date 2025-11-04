import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="demo-container">
      <h2>React 调度器与浏览器事件循环</h2>
      
      <div className="info-box">
        <h3>📚 课程目标</h3>
        <p>本演示项目将帮助你深入理解以下内容：</p>
        <ul>
          <li>浏览器事件循环的工作机制</li>
          <li>React Fiber 架构的时间切片原理</li>
          <li>React 如何实现任务优先级调度</li>
          <li><strong>核心问题：为什么浏览器任务没有优先级，但 React 可以实现优先级调度？</strong></li>
        </ul>
      </div>

      <div className="warning-box">
        <h3>🔑 核心问题解答</h3>
        <h4>浏览器中的任务没有优先级，但是 React 中可以通过 Fiber 自己的调度器来调度任务，这是为什么？</h4>
        
        <p><strong>简短回答：</strong></p>
        <p>
          浏览器的事件循环机制确实没有提供任务优先级的 API（除了宏任务和微任务的区别）。
          但 React 通过 <strong>时间切片（Time Slicing）</strong> 和 <strong>自己的调度器（Scheduler）</strong>，
          将一个大的更新任务拆分成多个小任务，然后根据优先级决定执行顺序。
        </p>

        <p><strong>详细解释：</strong></p>
        <ol>
          <li>
            <strong>浏览器层面：</strong>
            <ul>
              <li>浏览器只区分宏任务（setTimeout, 事件回调等）和微任务（Promise, MutationObserver）</li>
              <li>同类型的任务按照 FIFO（先进先出）队列执行，没有优先级概念</li>
              <li>你无法告诉浏览器"这个 setTimeout 比那个 setTimeout 更重要"</li>
            </ul>
          </li>
          <li>
            <strong>React 的解决方案：</strong>
            <ul>
              <li><strong>不依赖浏览器的优先级</strong>：React 自己管理所有任务</li>
              <li><strong>时间切片</strong>：把大任务拆成小任务，每个小任务执行完都会检查是否需要让出主线程</li>
              <li><strong>优先级队列</strong>：React 维护自己的任务队列，根据优先级排序</li>
              <li><strong>可中断与恢复</strong>：低优先级任务执行时，如果来了高优先级任务，可以中断并稍后恢复</li>
            </ul>
          </li>
          <li>
            <strong>实现机制：</strong>
            <ul>
              <li>使用 <code>MessageChannel</code> 或 <code>setTimeout</code> 创建宏任务</li>
              <li>每个宏任务执行一小段工作（5ms 左右）</li>
              <li>在宏任务之间检查是否有更高优先级的任务需要执行</li>
              <li>如果有，先执行高优先级任务，低优先级任务稍后继续</li>
            </ul>
          </li>
        </ol>

        <p><strong>类比理解：</strong></p>
        <p>
          想象浏览器是一个只有一个窗口的银行，所有人排队办理业务（FIFO）。
          React 相当于派了一个"大堂经理"，他可以：
        </p>
        <ul>
          <li>把每个客户的业务拆分成多个小步骤</li>
          <li>执行一小步后，看看队伍里有没有"VIP客户"（高优先级）</li>
          <li>如果有 VIP，暂停当前客户，先服务 VIP</li>
          <li>VIP 服务完后，继续之前的客户</li>
        </ul>
        <p>浏览器只提供了"窗口"（事件循环），React 提供了"大堂经理"（调度器）。</p>
      </div>

      <div className="success-box">
        <h3>🎯 演示内容</h3>
        <ul>
          <li><strong>事件循环基础</strong>：理解浏览器的宏任务、微任务和渲染时机</li>
          <li><strong>时间切片</strong>：看 React 如何将大任务拆分成小任务</li>
          <li><strong>优先级调度</strong>：体验不同优先级任务的执行顺序</li>
          <li><strong>调度器模拟</strong>：模拟 React Scheduler 的实现原理</li>
          <li><strong>React vs 浏览器</strong>：对比两种任务调度方式的区别</li>
        </ul>
      </div>

      <div className="code-block">
        <h4>React 调度器的核心优势</h4>
        <pre>{`
// 浏览器层面：无法控制执行顺序
setTimeout(() => console.log('任务1'), 0);
setTimeout(() => console.log('任务2'), 0);
// 输出：任务1 -> 任务2（固定顺序）

// React 层面：可以控制执行顺序
scheduleCallback(ImmediatePriority, task1);  // 立即执行
scheduleCallback(UserBlockingPriority, task2); // 用户交互
scheduleCallback(NormalPriority, task3);      // 正常更新
scheduleCallback(LowPriority, task4);         // 低优先级
scheduleCallback(IdlePriority, task5);        // 空闲时执行
// React 会根据优先级决定执行顺序，而不是添加顺序
        `}</pre>
      </div>

      <h3>🚀 开始探索</h3>
      <p>点击上方导航栏中的各个演示，逐步理解 React 调度器的工作原理！</p>
    </div>
  );
};

export default Home;


