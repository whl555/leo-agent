import React, { useState } from 'react';

// 优先级定义（数字越小优先级越高）
const ImmediatePriority = 1;
const UserBlockingPriority = 2;
const NormalPriority = 3;
const LowPriority = 4;
const IdlePriority = 5;

// 不同优先级的超时时间
const IMMEDIATE_PRIORITY_TIMEOUT = -1; // 立即执行
const USER_BLOCKING_PRIORITY_TIMEOUT = 250;
const NORMAL_PRIORITY_TIMEOUT = 5000;
const LOW_PRIORITY_TIMEOUT = 10000;
const IDLE_PRIORITY_TIMEOUT = 1073741823; // 最大值

interface SchedulerTask {
  id: number;
  callback: () => void;
  priorityLevel: number;
  expirationTime: number;
  name: string;
}

const SchedulerSimulation: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [taskQueue, setTaskQueue] = useState<SchedulerTask[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const addLog = (message: string, type: string = 'normal') => {
    setLogs(prev => [...prev, `[T+${currentTime}ms] <span class="log-${type}">${message}</span>`]);
  };

  const clearAll = () => {
    setLogs([]);
    setTaskQueue([]);
    setCurrentTime(0);
    setIsScheduling(false);
  };

  const getPriorityName = (priority: number): string => {
    switch (priority) {
      case ImmediatePriority: return '立即执行';
      case UserBlockingPriority: return '用户交互';
      case NormalPriority: return '正常';
      case LowPriority: return '低优先级';
      case IdlePriority: return '空闲';
      default: return '未知';
    }
  };

  const getPriorityClass = (priority: number): string => {
    switch (priority) {
      case ImmediatePriority: return 'immediate';
      case UserBlockingPriority: return 'high';
      case NormalPriority: return 'normal';
      case LowPriority: return 'low';
      case IdlePriority: return 'idle';
      default: return 'normal';
    }
  };

  const getTimeout = (priorityLevel: number): number => {
    switch (priorityLevel) {
      case ImmediatePriority: return IMMEDIATE_PRIORITY_TIMEOUT;
      case UserBlockingPriority: return USER_BLOCKING_PRIORITY_TIMEOUT;
      case NormalPriority: return NORMAL_PRIORITY_TIMEOUT;
      case LowPriority: return LOW_PRIORITY_TIMEOUT;
      case IdlePriority: return IDLE_PRIORITY_TIMEOUT;
      default: return NORMAL_PRIORITY_TIMEOUT;
    }
  };

  // 模拟 scheduleCallback
  const scheduleCallback = (priorityLevel: number, taskName: string) => {
    const startTime = currentTime;
    const timeout = getTimeout(priorityLevel);
    const expirationTime = startTime + timeout;

    const newTask: SchedulerTask = {
      id: Date.now() + Math.random(),
      callback: () => {
        addLog(`执行任务：${taskName}`, getPriorityClass(priorityLevel));
      },
      priorityLevel,
      expirationTime,
      name: taskName,
    };

    setTaskQueue(prev => {
      const newQueue = [...prev, newTask];
      // 按过期时间排序（最早过期的在前）
      newQueue.sort((a, b) => a.expirationTime - b.expirationTime);
      return newQueue;
    });

    addLog(`📝 添加任务：${taskName} (${getPriorityName(priorityLevel)})`, getPriorityClass(priorityLevel));
  };

  // 模拟工作循环
  const workLoop = async () => {
    if (isScheduling) return;
    
    setIsScheduling(true);
    addLog('🚀 开始调度循环', 'immediate');

    let queue = [...taskQueue];
    let time = currentTime;

    while (queue.length > 0) {
      // 按过期时间排序
      queue.sort((a, b) => a.expirationTime - b.expirationTime);

      // 取出最高优先级的任务
      const currentTask = queue.shift()!;
      
      addLog(`▶️ 执行：${currentTask.name}`, getPriorityClass(currentTask.priorityLevel));
      
      // 更新界面
      setTaskQueue([...queue]);
      
      // 模拟任务执行
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 执行任务
      currentTask.callback();
      
      // 时间前进
      time += 50;
      setCurrentTime(time);

      // 模拟时间切片：每执行一个任务后让出主线程
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    addLog('✅ 所有任务执行完成', 'immediate');
    setIsScheduling(false);
  };

  // 演示场景
  const demoScenario1 = () => {
    clearAll();
    addLog('场景 1：不同优先级任务的调度', 'immediate');
    
    setTimeout(() => scheduleCallback(NormalPriority, '正常任务 A'), 100);
    setTimeout(() => scheduleCallback(UserBlockingPriority, '用户点击'), 200);
    setTimeout(() => scheduleCallback(LowPriority, '低优先级任务'), 300);
    setTimeout(() => scheduleCallback(ImmediatePriority, '同步任务'), 400);
  };

  const demoScenario2 = () => {
    clearAll();
    addLog('场景 2：任务饥饿问题', 'immediate');
    
    // 先添加一个低优先级任务
    scheduleCallback(LowPriority, '低优先级任务');
    
    // 然后不断添加高优先级任务
    setTimeout(() => scheduleCallback(UserBlockingPriority, '用户任务 1'), 100);
    setTimeout(() => scheduleCallback(UserBlockingPriority, '用户任务 2'), 200);
    setTimeout(() => scheduleCallback(UserBlockingPriority, '用户任务 3'), 300);
    
    addLog('⚠️ 低优先级任务可能被"饿死"（一直等待）', 'idle');
  };

  const demoScenario3 = () => {
    clearAll();
    addLog('场景 3：过期时间机制', 'immediate');
    
    // 添加任务
    scheduleCallback(NormalPriority, '正常任务 (5s超时)');
    scheduleCallback(LowPriority, '低优先级任务 (10s超时)');
    
    // 模拟时间流逝
    setTimeout(() => {
      setCurrentTime(prev => prev + 6000);
      addLog('⏰ 时间流逝 6 秒...', 'normal');
      addLog('正常任务已过期！会被提升优先级', 'immediate');
    }, 500);
  };

  return (
    <div className="demo-container">
      <h2>React Scheduler 模拟</h2>

      <div className="info-box">
        <h3>🔧 Scheduler 的工作原理</h3>
        <p>React 的 Scheduler 包是一个独立的优先级调度库，核心机制包括：</p>
        <ol>
          <li><strong>优先级队列</strong>：任务按优先级（实际是过期时间）排序</li>
          <li><strong>过期时间</strong>：每个任务有一个过期时间，越紧急的任务过期时间越短</li>
          <li><strong>时间切片</strong>：使用 MessageChannel 实现非阻塞的任务调度</li>
          <li><strong>可中断</strong>：低优先级任务执行时，如果有高优先级任务，可以中断</li>
        </ol>
      </div>

      <div className="code-block">
        <h4>Scheduler 核心代码简化版</h4>
        <pre>{`
// 1. 定义优先级和超时时间
const PRIORITY_TIMEOUT = {
  Immediate: -1,        // 立即执行
  UserBlocking: 250,    // 250ms 后过期
  Normal: 5000,         // 5s 后过期
  Low: 10000,          // 10s 后过期
  Idle: Infinity,      // 永不过期
};

// 2. 调度任务
function scheduleCallback(priority, callback) {
  const currentTime = getCurrentTime();
  const timeout = PRIORITY_TIMEOUT[priority];
  const expirationTime = currentTime + timeout;
  
  const newTask = {
    callback,
    expirationTime,
    priority
  };
  
  // 插入任务队列（按过期时间排序）
  taskQueue.push(newTask);
  taskQueue.sort((a, b) => a.expirationTime - b.expirationTime);
  
  // 请求调度
  requestHostCallback(workLoop);
}

// 3. 工作循环
function workLoop() {
  let currentTask = taskQueue[0];
  
  while (currentTask) {
    // 检查是否需要让出主线程
    if (shouldYieldToHost()) {
      // 让出，下次继续
      break;
    }
    
    // 执行任务
    const callback = currentTask.callback;
    currentTask.callback = null;
    callback();
    
    // 移除已完成的任务
    taskQueue.shift();
    currentTask = taskQueue[0];
  }
  
  // 如果还有任务，继续调度
  if (currentTask) {
    requestHostCallback(workLoop);
  }
}

// 4. 让出主线程的判断
function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime;
  // 如果执行时间超过 5ms，让出主线程
  return timeElapsed >= 5;
}
        `}</pre>
      </div>

      <div className="warning-box">
        <h3>🔑 关键机制：过期时间而非优先级值</h3>
        <p>
          Scheduler 实际上不是直接比较优先级，而是<strong>比较过期时间</strong>。
          这样做的好处是：
        </p>
        <ul>
          <li><strong>防止饥饿</strong>：低优先级任务会随着时间推移而"过期"，从而被执行</li>
          <li><strong>统一调度</strong>：所有任务用同一个队列，按过期时间排序</li>
          <li><strong>自然提升</strong>：等待时间越长的任务，优先级自然越高</li>
        </ul>
        <p>
          例如：低优先级任务添加时过期时间是 10s 后，如果等了 10s 还没执行，
          它的过期时间会比新添加的正常任务（5s 后过期）更早，因此会先执行。
        </p>
      </div>

      <h3>🧪 调度演示</h3>

      <div className="controls">
        <button onClick={demoScenario1}>
          场景 1：基础调度
        </button>
        <button onClick={demoScenario2}>
          场景 2：任务饥饿
        </button>
        <button onClick={demoScenario3}>
          场景 3：过期提升
        </button>
        <button onClick={clearAll}>
          清空
        </button>
      </div>

      <h4>手动添加任务：</h4>
      <div className="controls">
        <button onClick={() => scheduleCallback(ImmediatePriority, `立即任务 ${taskQueue.length + 1}`)}>
          立即任务
        </button>
        <button onClick={() => scheduleCallback(UserBlockingPriority, `交互任务 ${taskQueue.length + 1}`)}>
          用户交互
        </button>
        <button onClick={() => scheduleCallback(NormalPriority, `正常任务 ${taskQueue.length + 1}`)}>
          正常任务
        </button>
        <button onClick={() => scheduleCallback(LowPriority, `低优先级 ${taskQueue.length + 1}`)}>
          低优先级
        </button>
        <button onClick={() => scheduleCallback(IdlePriority, `空闲任务 ${taskQueue.length + 1}`)}>
          空闲任务
        </button>
      </div>

      <div className="controls">
        <button 
          onClick={workLoop} 
          disabled={isScheduling || taskQueue.length === 0}
          style={{ background: isScheduling ? '#ccc' : '#28a745' }}
        >
          {isScheduling ? '⏳ 调度中...' : '▶️ 开始执行队列'}
        </button>
      </div>

      <div style={{ margin: '1rem 0', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <strong>当前时间：</strong> {currentTime}ms
      </div>

      <div className="visual-demo">
        <div className="task-queue">
          <h4>任务队列（按过期时间排序）</h4>
          {taskQueue.map((task, index) => (
            <div key={task.id} className="task-item">
              <div>
                <strong>{task.name}</strong>
                <span style={{ marginLeft: '0.5rem' }} className={`log-${getPriorityClass(task.priorityLevel)}`}>
                  [{getPriorityName(task.priorityLevel)}]
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                过期时间: {task.expirationTime}ms
                {task.expirationTime < currentTime && ' ⚠️ 已过期！'}
              </div>
            </div>
          ))}
          {taskQueue.length === 0 && (
            <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
              队列为空
            </div>
          )}
        </div>

        <div className="task-queue">
          <h4>执行日志</h4>
          <div className="log-container" style={{ maxHeight: '400px' }}>
            {logs.length === 0 ? (
              <div style={{ color: '#888' }}>等待任务...</div>
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
        </div>
      </div>

      <div className="success-box">
        <h3>💡 核心要点</h3>
        <ul>
          <li>React Scheduler 是独立的调度库，不依赖浏览器 API</li>
          <li>使用过期时间而非优先级值，避免低优先级任务"饿死"</li>
          <li>结合时间切片，实现可中断的渲染</li>
          <li>这就是 React 能够实现优先级调度的秘密！</li>
        </ul>
      </div>

      <div className="comparison-table">
        <table>
          <thead>
            <tr>
              <th>特性</th>
              <th>浏览器事件循环</th>
              <th>React Scheduler</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>任务队列</td>
              <td>宏任务队列（FIFO）</td>
              <td>优先级队列（按过期时间）</td>
            </tr>
            <tr>
              <td>优先级支持</td>
              <td>❌ 无（只有宏/微任务区别）</td>
              <td>✅ 5 个优先级级别</td>
            </tr>
            <tr>
              <td>可中断性</td>
              <td>❌ 任务必须执行完</td>
              <td>✅ 可以中断和恢复</td>
            </tr>
            <tr>
              <td>饥饿问题</td>
              <td>不存在（FIFO 保证执行）</td>
              <td>✅ 通过过期时间解决</td>
            </tr>
            <tr>
              <td>时间切片</td>
              <td>❌ 不支持</td>
              <td>✅ 内置支持（5ms 切片）</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchedulerSimulation;


