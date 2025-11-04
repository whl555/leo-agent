import React, { useState } from 'react';

const TimeSlicingDemo: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message: string, type: string = 'normal') => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] <span class="log-${type}">${message}</span>`]);
  };

  const clearLogs = () => {
    setLogs([]);
    setProgress(0);
  };

  // 传统方式：一次性执行大任务（会阻塞）
  const demoBlockingTask = () => {
    clearLogs();
    setIsRunning(true);
    addLog('开始执行大任务（阻塞方式）', 'immediate');
    
    const startTime = Date.now();
    
    // 模拟处理 1000 个项目
    for (let i = 0; i < 1000; i++) {
      // 每个项目做一些计算
      for (let j = 0; j < 100000; j++) {
        Math.random();
      }
      
      if (i % 200 === 0) {
        // 尝试更新进度（但由于阻塞，不会立即显示）
        setProgress(i / 1000 * 100);
      }
    }
    
    const endTime = Date.now();
    addLog(`任务完成！耗时 ${endTime - startTime}ms`, 'immediate');
    addLog('⚠️ 注意：在任务执行期间，UI 完全卡住了', 'immediate');
    setProgress(100);
    setIsRunning(false);
  };

  // 时间切片方式：拆分成小任务
  const demoTimeSlicing = async () => {
    clearLogs();
    setIsRunning(true);
    setProgress(0);
    addLog('开始执行大任务（时间切片方式）', 'normal');
    
    const startTime = Date.now();
    const totalItems = 1000;
    const chunkSize = 50; // 每次处理 50 个项目
    
    for (let i = 0; i < totalItems; i += chunkSize) {
      // 处理一小块数据
      const end = Math.min(i + chunkSize, totalItems);
      
      for (let j = i; j < end; j++) {
        for (let k = 0; k < 100000; k++) {
          Math.random();
        }
      }
      
      const currentProgress = (end / totalItems * 100);
      setProgress(currentProgress);
      addLog(`处理进度：${Math.floor(currentProgress)}%`, 'normal');
      
      // 关键：让出主线程，给浏览器机会处理其他任务
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    const endTime = Date.now();
    addLog(`✅ 任务完成！耗时 ${endTime - startTime}ms`, 'normal');
    addLog('✨ 注意：UI 在整个过程中保持响应', 'normal');
    setIsRunning(false);
  };

  // 模拟 React 的时间切片（使用 MessageChannel）
  const demoReactStyleSlicing = () => {
    clearLogs();
    setIsRunning(true);
    setProgress(0);
    addLog('开始执行（React 风格的时间切片）', 'high');
    
    const startTime = Date.now();
    const totalItems = 1000;
    let currentIndex = 0;
    
    // 使用 MessageChannel（React Scheduler 的实现方式）
    const channel = new MessageChannel();
    const port = channel.port2;
    
    channel.port1.onmessage = () => {
      const frameDeadline = performance.now() + 5; // 每帧 5ms
      
      // 在时间片内尽可能多地处理任务
      while (currentIndex < totalItems && performance.now() < frameDeadline) {
        for (let k = 0; k < 100000; k++) {
          Math.random();
        }
        currentIndex++;
      }
      
      const currentProgress = (currentIndex / totalItems * 100);
      setProgress(currentProgress);
      
      if (currentIndex % 100 === 0) {
        addLog(`React 风格处理：${Math.floor(currentProgress)}%`, 'high');
      }
      
      if (currentIndex < totalItems) {
        // 还有任务，继续调度
        port.postMessage(null);
      } else {
        const endTime = Date.now();
        addLog(`✅ 完成！耗时 ${endTime - startTime}ms`, 'high');
        addLog('🎯 这就是 React Fiber 的时间切片原理！', 'high');
        setIsRunning(false);
      }
    };
    
    // 开始调度
    port.postMessage(null);
  };

  return (
    <div className="demo-container">
      <h2>时间切片（Time Slicing）</h2>

      <div className="info-box">
        <h3>⏱️ 什么是时间切片？</h3>
        <p>
          时间切片是将一个长任务拆分成多个小任务，每个小任务执行完后主动让出主线程，
          给浏览器机会处理其他事情（如用户交互、渲染等）。
        </p>
        <p><strong>核心思想：</strong>宁可总耗时长一点，也要保持 UI 的响应性！</p>
      </div>

      <div className="code-block">
        <h4>对比：阻塞 vs 时间切片</h4>
        <pre>{`
// ❌ 阻塞方式：一次执行完
function blockingWork() {
  for (let i = 0; i < 1000; i++) {
    doHeavyWork(i);  // UI 会卡住
  }
}

// ✅ 时间切片方式：分批执行
async function timeSlicedWork() {
  for (let i = 0; i < 1000; i += 50) {
    for (let j = i; j < i + 50; j++) {
      doHeavyWork(j);
    }
    await new Promise(resolve => setTimeout(resolve, 0)); // 让出主线程
  }
}

// ✅ React 风格：使用 MessageChannel
function reactStyleWork() {
  const channel = new MessageChannel();
  channel.port1.onmessage = () => {
    const deadline = performance.now() + 5; // 5ms 时间片
    while (hasWork() && performance.now() < deadline) {
      doWork();
    }
    if (hasWork()) {
      channel.port2.postMessage(null); // 继续调度
    }
  };
  channel.port2.postMessage(null); // 开始
}
        `}</pre>
      </div>

      <div className="warning-box">
        <h4>🔑 关键点：为什么使用 MessageChannel？</h4>
        <ul>
          <li><strong>setTimeout(fn, 0)</strong>：有 4ms 的最小延迟限制（HTML 规范）</li>
          <li><strong>MessageChannel</strong>：没有延迟限制，更快</li>
          <li><strong>requestIdleCallback</strong>：只在浏览器空闲时执行，可能等待时间太长</li>
          <li>React 优先使用 MessageChannel，降级到 setTimeout</li>
        </ul>
      </div>

      <h3>🧪 交互演示</h3>

      <div className="controls">
        <button onClick={demoBlockingTask} disabled={isRunning}>
          ❌ 阻塞方式（卡顿）
        </button>
        <button onClick={demoTimeSlicing} disabled={isRunning}>
          ✅ 时间切片方式
        </button>
        <button onClick={demoReactStyleSlicing} disabled={isRunning}>
          🎯 React 风格切片
        </button>
        <button onClick={clearLogs}>清空日志</button>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <h4>处理进度：{Math.floor(progress)}%</h4>
        <div style={{
          width: '100%',
          height: '30px',
          background: '#e0e0e0',
          borderRadius: '15px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            transition: 'width 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {progress > 10 && `${Math.floor(progress)}%`}
          </div>
        </div>
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
        <h3>💡 体验差异</h3>
        <p><strong>试着在任务执行期间移动鼠标或点击按钮：</strong></p>
        <ul>
          <li><strong>阻塞方式</strong>：UI 完全卡住，无法交互</li>
          <li><strong>时间切片方式</strong>：UI 保持响应，可以正常交互</li>
          <li><strong>React 风格</strong>：更精确的时间控制，性能更好</li>
        </ul>
      </div>

      <div className="info-box">
        <h3>🎯 时间切片的意义</h3>
        <p>
          时间切片是 React 实现优先级调度的基础。通过将任务拆分，React 可以在任务之间检查是否有更重要的任务需要执行。
          <strong>这就是 React 能够实现"可中断渲染"的核心原理！</strong>
        </p>
      </div>
    </div>
  );
};

export default TimeSlicingDemo;

