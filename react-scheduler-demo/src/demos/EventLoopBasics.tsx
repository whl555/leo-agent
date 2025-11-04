import React, { useState } from 'react';

const EventLoopBasics: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string, type: string = 'normal') => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] <span class="log-${type}">${message}</span>`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const demoBasicEventLoop = () => {
    clearLogs();
    addLog('🚀 开始执行同步代码', 'immediate');
    
    setTimeout(() => {
      addLog('⏰ setTimeout 宏任务执行', 'macrotask');
    }, 0);

    Promise.resolve().then(() => {
      addLog('✨ Promise 微任务执行', 'microtask');
    });

    addLog('🚀 同步代码执行完毕', 'immediate');
  };

  const demoMultipleTasks = () => {
    clearLogs();
    addLog('开始执行', 'immediate');

    setTimeout(() => addLog('宏任务 1', 'macrotask'), 0);
    setTimeout(() => addLog('宏任务 2', 'macrotask'), 0);

    Promise.resolve().then(() => {
      addLog('微任务 1', 'microtask');
      Promise.resolve().then(() => {
        addLog('微任务 1.1 (嵌套)', 'microtask');
      });
    });

    Promise.resolve().then(() => {
      addLog('微任务 2', 'microtask');
    });

    addLog('同步代码结束', 'immediate');
  };

  const demoWithRender = () => {
    clearLogs();
    addLog('开始复杂任务', 'immediate');

    // 宏任务
    setTimeout(() => {
      addLog('宏任务：修改 DOM', 'macrotask');
      document.body.style.background = document.body.style.background === 'lightblue' ? 'white' : 'lightblue';
    }, 0);

    // 微任务
    Promise.resolve().then(() => {
      addLog('微任务：在渲染前执行', 'microtask');
    });

    // requestAnimationFrame（在渲染前执行）
    requestAnimationFrame(() => {
      addLog('🎨 requestAnimationFrame：准备渲染', 'render');
    });

    addLog('同步代码完成', 'immediate');
  };

  const demoLongTask = () => {
    clearLogs();
    addLog('开始长任务（阻塞主线程）', 'immediate');

    const startTime = Date.now();
    // 同步长任务，会阻塞后续所有操作
    while (Date.now() - startTime < 3000) {
      // 阻塞 3 秒
    }

    addLog('长任务完成（阻塞了 3 秒）', 'immediate');
    
    setTimeout(() => {
      addLog('长任务后的宏任务', 'macrotask');
    }, 0);
  };

  return (
    <div className="demo-container">
      <h2>浏览器事件循环基础</h2>

      <div className="info-box">
        <h3>🔄 事件循环机制</h3>
        <p>浏览器的事件循环遵循以下规则：</p>
        <ol>
          <li><strong>执行栈</strong>：同步代码按顺序执行</li>
          <li><strong>微任务队列</strong>：当前宏任务执行完后，立即清空所有微任务（Promise、MutationObserver）</li>
          <li><strong>渲染</strong>：浏览器可能进行渲染（不是每次循环都渲染）</li>
          <li><strong>宏任务队列</strong>：从宏任务队列取下一个任务（setTimeout、事件回调等）</li>
        </ol>
      </div>

      <div className="code-block">
        <h4>事件循环伪代码</h4>
        <pre>{`
while (true) {
  // 1. 执行一个宏任务（从队列中取）
  const macroTask = macroTaskQueue.shift();
  execute(macroTask);
  
  // 2. 执行所有微任务
  while (microTaskQueue.length > 0) {
    const microTask = microTaskQueue.shift();
    execute(microTask);
  }
  
  // 3. 如果需要，进行渲染
  if (shouldRender()) {
    render();
  }
  
  // 4. 回到步骤 1
}
        `}</pre>
      </div>

      <div className="warning-box">
        <h4>⚠️ 关键点：浏览器没有任务优先级</h4>
        <p>
          浏览器的事件循环中，<strong>同类型的任务按照 FIFO（先进先出）执行</strong>。
          你无法告诉浏览器某个 setTimeout 比另一个更重要。
          所有 setTimeout 按添加顺序执行，所有 Promise 按添加顺序执行。
        </p>
      </div>

      <h3>🧪 交互演示</h3>

      <div className="controls">
        <button onClick={demoBasicEventLoop}>
          基础演示：宏任务 vs 微任务
        </button>
        <button onClick={demoMultipleTasks}>
          多个任务的执行顺序
        </button>
        <button onClick={demoWithRender}>
          包含渲染的循环
        </button>
        <button onClick={demoLongTask}>
          长任务阻塞演示（3秒）
        </button>
        <button onClick={clearLogs}>清空日志</button>
      </div>

      <div className="log-container">
        {logs.length === 0 ? (
          <div style={{ color: '#888' }}>点击上方按钮查看演示...</div>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index} 
              className="log-entry"
              dangerouslySetInnerHTML={{ __html: log }}
            />
          ))
        )}
      </div>

      <div className="success-box">
        <h3>💡 观察要点</h3>
        <ul>
          <li><strong>微任务总是在下一个宏任务之前执行</strong></li>
          <li><strong>同步代码会阻塞一切</strong>（看长任务演示）</li>
          <li><strong>无法控制任务优先级</strong>：先添加的先执行</li>
          <li><strong>这就是 React 需要自己实现调度器的原因！</strong></li>
        </ul>
      </div>

      <div className="comparison-table">
        <table>
          <thead>
            <tr>
              <th>特性</th>
              <th>宏任务</th>
              <th>微任务</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>典型例子</td>
              <td>setTimeout, setInterval, I/O, UI 事件</td>
              <td>Promise.then, MutationObserver, queueMicrotask</td>
            </tr>
            <tr>
              <td>执行时机</td>
              <td>每次事件循环执行一个</td>
              <td>当前宏任务后，全部执行完</td>
            </tr>
            <tr>
              <td>优先级</td>
              <td>低</td>
              <td>高</td>
            </tr>
            <tr>
              <td>是否可中断</td>
              <td>否</td>
              <td>否</td>
            </tr>
            <tr>
              <td>是否有优先级队列</td>
              <td>❌ 没有</td>
              <td>❌ 没有</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventLoopBasics;


