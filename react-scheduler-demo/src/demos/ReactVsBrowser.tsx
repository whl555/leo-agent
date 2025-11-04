import React from 'react';

const ReactVsBrowser: React.FC = () => {
  return (
    <div className="demo-container">
      <h2>React vs 浏览器：深度对比</h2>

      <div className="warning-box">
        <h3>🎯 核心问题：浏览器任务没有优先级，React 为什么可以？</h3>
        
        <h4>终极答案：</h4>
        <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#d32f2f' }}>
          React 不依赖浏览器的任务优先级，而是<strong>自己管理所有任务</strong>，
          通过<strong>时间切片</strong>将大任务拆成小任务，在小任务之间检查并调度高优先级任务。
        </p>

        <h4>详细解释：</h4>
        
        <div style={{ marginTop: '1.5rem' }}>
          <h5>1️⃣ 浏览器的限制</h5>
          <ul>
            <li>浏览器只提供宏任务和微任务两种机制</li>
            <li>同类型任务按 FIFO（先进先出）执行，无法指定优先级</li>
            <li>你不能告诉浏览器"这个 setTimeout 比那个更重要"</li>
            <li>一旦任务开始执行，必须执行完才能执行下一个</li>
          </ul>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h5>2️⃣ React 的解决方案</h5>
          <ul>
            <li><strong>不依赖浏览器优先级</strong>：React 维护自己的任务队列</li>
            <li><strong>时间切片</strong>：把大任务（如渲染 1000 个组件）拆成小任务（每次渲染 10 个）</li>
            <li><strong>主动让出</strong>：每个小任务执行完，主动让出主线程（通过 MessageChannel）</li>
            <li><strong>优先级检查</strong>：让出后检查是否有更高优先级任务，如果有，先执行高优先级</li>
            <li><strong>可中断恢复</strong>：低优先级任务可以被中断，稍后从中断点继续</li>
          </ul>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h5>3️⃣ 实现机制</h5>
          <ol>
            <li><strong>Fiber 架构</strong>：每个组件对应一个 Fiber 节点，可以记录工作进度</li>
            <li><strong>工作单元</strong>：渲染工作被拆分成最小工作单元</li>
            <li><strong>时间切片循环</strong>：
              <ul>
                <li>执行一个工作单元（约 5ms）</li>
                <li>检查是否超时或有高优先级任务</li>
                <li>如果是，让出主线程，稍后继续</li>
                <li>如果否，继续下一个工作单元</li>
              </ul>
            </li>
            <li><strong>Scheduler 调度器</strong>：管理任务优先级队列，决定执行顺序</li>
          </ol>
        </div>
      </div>

      <div className="comparison-table" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>对比表格</h3>
        <table>
          <thead>
            <tr>
              <th style={{ width: '25%' }}>对比维度</th>
              <th style={{ width: '37.5%' }}>浏览器事件循环</th>
              <th style={{ width: '37.5%' }}>React Scheduler + Fiber</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>任务队列</strong></td>
              <td>
                • 宏任务队列（FIFO）<br/>
                • 微任务队列（FIFO）<br/>
                • 两个队列，简单但不灵活
              </td>
              <td>
                • 优先级任务队列<br/>
                • 按过期时间排序<br/>
                • 支持 5 个优先级级别
              </td>
            </tr>
            <tr>
              <td><strong>执行顺序</strong></td>
              <td>
                • 严格按添加顺序（FIFO）<br/>
                • 无法改变顺序<br/>
                • 先来先服务
              </td>
              <td>
                • 按优先级（过期时间）<br/>
                • 高优先级可以"插队"<br/>
                • VIP 优先服务
              </td>
            </tr>
            <tr>
              <td><strong>可中断性</strong></td>
              <td>
                ❌ 任务一旦开始必须执行完<br/>
                • 长任务会阻塞 UI<br/>
                • 用户体验差
              </td>
              <td>
                ✅ 任务可以中断和恢复<br/>
                • 通过 Fiber 记录进度<br/>
                • UI 保持响应
              </td>
            </tr>
            <tr>
              <td><strong>时间切片</strong></td>
              <td>
                ❌ 不支持<br/>
                • 必须手动实现<br/>
                • 需要 setTimeout/MessageChannel
              </td>
              <td>
                ✅ 内置支持<br/>
                • 自动拆分任务<br/>
                • 约 5ms 一个切片
              </td>
            </tr>
            <tr>
              <td><strong>优先级管理</strong></td>
              <td>
                ❌ 没有优先级<br/>
                • 只有宏任务 vs 微任务<br/>
                • 无法细粒度控制
              </td>
              <td>
                ✅ 5 级优先级<br/>
                • Immediate, UserBlocking,<br/>
                &nbsp;&nbsp;Normal, Low, Idle<br/>
                • 精确控制
              </td>
            </tr>
            <tr>
              <td><strong>饥饿问题</strong></td>
              <td>
                ✅ 不存在<br/>
                • FIFO 保证所有任务执行<br/>
                • 但可能响应慢
              </td>
              <td>
                ⚠️ 可能存在<br/>
                • 低优先级可能一直等待<br/>
                • 通过过期时间缓解
              </td>
            </tr>
            <tr>
              <td><strong>实现复杂度</strong></td>
              <td>
                简单<br/>
                • 浏览器原生支持<br/>
                • 开发者无需关心
              </td>
              <td>
                复杂<br/>
                • 需要 Fiber 架构<br/>
                • 需要 Scheduler 调度器<br/>
                • 需要大量底层代码
              </td>
            </tr>
            <tr>
              <td><strong>适用场景</strong></td>
              <td>
                • 简单异步操作<br/>
                • 不需要优先级<br/>
                • 任务量小
              </td>
              <td>
                • 复杂 UI 更新<br/>
                • 需要优先级调度<br/>
                • 大量组件渲染<br/>
                • 需要保持响应性
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="code-block" style={{ marginTop: '2rem' }}>
        <h4>代码对比：浏览器 vs React</h4>
        <pre>{`
// ============ 浏览器方式 ============
// 问题：无法控制优先级，先添加的先执行

setTimeout(() => {
  console.log('低优先级任务');
}, 0);

setTimeout(() => {
  console.log('高优先级任务');
}, 0);

// 输出：低优先级任务 -> 高优先级任务
// 即使你想高优先级先执行，也做不到！


// ============ React 方式 ============
// 优势：完全控制执行顺序

import { 
  unstable_scheduleCallback as scheduleCallback,
  unstable_LowPriority as LowPriority,
  unstable_UserBlockingPriority as UserBlockingPriority
} from 'scheduler';

// 先添加低优先级
scheduleCallback(LowPriority, () => {
  console.log('低优先级任务');
});

// 后添加高优先级
scheduleCallback(UserBlockingPriority, () => {
  console.log('高优先级任务');
});

// 输出：高优先级任务 -> 低优先级任务
// React 根据优先级决定执行顺序，而不是添加顺序！


// ============ React 时间切片示例 ============

function workLoop() {
  while (workInProgress && !shouldYield()) {
    // 执行一个工作单元
    workInProgress = performUnitOfWork(workInProgress);
  }
  
  if (workInProgress) {
    // 还有工作，但需要让出主线程
    return true; // 继续调度
  } else {
    // 工作完成
    return false;
  }
}

function shouldYield() {
  // 检查是否应该让出主线程
  return performance.now() >= deadline;
}

// MessageChannel 实现调度
const channel = new MessageChannel();
channel.port1.onmessage = () => {
  const hasMoreWork = workLoop();
  if (hasMoreWork) {
    channel.port2.postMessage(null); // 继续
  }
};

channel.port2.postMessage(null); // 开始
        `}</pre>
      </div>

      <div className="info-box" style={{ marginTop: '2rem' }}>
        <h3>🎨 形象比喻</h3>
        
        <div style={{ marginTop: '1rem' }}>
          <h4>浏览器 = 简单的快餐店</h4>
          <ul>
            <li>只有一个窗口（主线程）</li>
            <li>顾客排队，先来先服务（FIFO）</li>
            <li>不管是小孩买冰淇淋还是大单位订餐，都一样排队</li>
            <li>一旦开始服务某个顾客，必须服务完才能下一个</li>
            <li><strong>问题</strong>：VIP 客户也得排队，体验差</li>
          </ul>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h4>React = 高级餐厅</h4>
          <ul>
            <li>有一个大堂经理（Scheduler）</li>
            <li>经理维护一个优先级队列，而不是简单排队</li>
            <li>VIP 客户（高优先级）可以优先服务</li>
            <li>普通客户的订单可以分批完成（时间切片）</li>
            <li>如果服务普通客户时来了 VIP，可以暂停，先服务 VIP</li>
            <li>每隔几分钟看一下队伍，重新调整优先级</li>
            <li><strong>优势</strong>：重要客户体验好，普通客户也不会等太久（过期机制）</li>
          </ul>
        </div>
      </div>

      <div className="success-box" style={{ marginTop: '2rem' }}>
        <h3>✅ 总结：为什么 React 可以实现优先级调度？</h3>
        
        <ol style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
          <li>
            <strong>不依赖浏览器的任务优先级</strong><br/>
            React 不使用浏览器的任务队列来管理优先级，而是自己维护任务队列
          </li>
          
          <li>
            <strong>时间切片是基础</strong><br/>
            通过时间切片把大任务拆成小任务，创造了调度的机会
          </li>
          
          <li>
            <strong>主动让出主线程</strong><br/>
            每个小任务执行完主动让出（通过 MessageChannel），而不是被动等待
          </li>
          
          <li>
            <strong>Fiber 架构支持可中断</strong><br/>
            每个 Fiber 节点记录了工作进度，可以随时中断和恢复
          </li>
          
          <li>
            <strong>Scheduler 管理优先级</strong><br/>
            独立的调度器根据过期时间排序任务，决定执行顺序
          </li>
          
          <li>
            <strong>浏览器只提供"窗口"，React 提供"经理"</strong><br/>
            浏览器提供事件循环机制（窗口），React 在此基础上实现了调度逻辑（经理）
          </li>
        </ol>

        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          background: '#fff3cd', 
          borderRadius: '8px',
          border: '2px solid #ffc107'
        }}>
          <strong style={{ fontSize: '1.1rem' }}>🎯 一句话总结：</strong>
          <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '1.05rem' }}>
            React 通过时间切片将任务控制权掌握在自己手中，
            然后用自己的优先级队列决定执行顺序，
            从而在浏览器<strong>没有优先级机制</strong>的情况下实现了<strong>优先级调度</strong>。
          </p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#e3f2fd', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>📚 推荐阅读</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>React Fiber 架构：<a href="https://github.com/acdlite/react-fiber-architecture" target="_blank" rel="noopener noreferrer">github.com/acdlite/react-fiber-architecture</a></li>
          <li>Scheduler 源码：<a href="https://github.com/facebook/react/tree/main/packages/scheduler" target="_blank" rel="noopener noreferrer">React Scheduler Package</a></li>
          <li>Lin Clark 的演讲：<a href="https://www.youtube.com/watch?v=ZCuYPiUIONs" target="_blank" rel="noopener noreferrer">A Cartoon Intro to Fiber</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ReactVsBrowser;

