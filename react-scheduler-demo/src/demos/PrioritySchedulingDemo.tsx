import React, { useState, useTransition } from 'react';

// 模拟不同优先级
enum Priority {
  Immediate = 1,    // 立即执行（同步）
  UserBlocking = 2, // 用户交互（250ms 超时）
  Normal = 3,       // 正常更新（5s 超时）
  Low = 4,          // 低优先级（10s 超时）
  Idle = 5,         // 空闲时执行（无超时）
}

interface Task {
  id: number;
  name: string;
  priority: Priority;
  status: 'pending' | 'running' | 'completed';
  addedAt: number;
  startedAt?: number;
  completedAt?: number;
}

const PrioritySchedulingDemo: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [taskIdCounter, setTaskIdCounter] = useState(1);
  const [isPending, startTransition] = useTransition();
  
  const [inputValue, setInputValue] = useState('');
  const [filteredItems, setFilteredItems] = useState<string[]>([]);

  const addLog = (message: string, type: string = 'normal') => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] <span class="log-${type}">${message}</span>`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getPriorityName = (priority: Priority): string => {
    switch (priority) {
      case Priority.Immediate: return '立即执行';
      case Priority.UserBlocking: return '用户交互';
      case Priority.Normal: return '正常更新';
      case Priority.Low: return '低优先级';
      case Priority.Idle: return '空闲执行';
    }
  };

  const getPriorityClass = (priority: Priority): string => {
    switch (priority) {
      case Priority.Immediate: return 'immediate';
      case Priority.UserBlocking: return 'high';
      case Priority.Normal: return 'normal';
      case Priority.Low: return 'low';
      case Priority.Idle: return 'idle';
    }
  };

  // 添加任务
  const addTask = (priority: Priority) => {
    const newTask: Task = {
      id: taskIdCounter,
      name: `任务 ${taskIdCounter}`,
      priority,
      status: 'pending',
      addedAt: Date.now(),
    };
    
    setTaskIdCounter(prev => prev + 1);
    setTasks(prev => [...prev, newTask]);
    addLog(`➕ 添加 ${getPriorityName(priority)} 任务：${newTask.name}`, getPriorityClass(priority));
  };

  // 执行任务（按优先级）
  const executeTasks = async () => {
    clearLogs();
    addLog('🚀 开始执行任务队列', 'immediate');
    
    // 按优先级排序
    const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);
    
    for (const task of sortedTasks) {
      if (task.status !== 'pending') continue;
      
      // 标记为运行中
      setTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, status: 'running', startedAt: Date.now() } : t
      ));
      
      addLog(`▶️ 执行 ${getPriorityName(task.priority)}：${task.name}`, getPriorityClass(task.priority));
      
      // 模拟任务执行
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 标记为完成
      setTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, status: 'completed', completedAt: Date.now() } : t
      ));
      
      addLog(`✅ 完成：${task.name}`, getPriorityClass(task.priority));
    }
    
    addLog('🎉 所有任务执行完成', 'immediate');
  };

  // 模拟浏览器执行（FIFO，无优先级）
  const executeBrowserStyle = async () => {
    clearLogs();
    addLog('🚀 浏览器风格执行（FIFO）', 'immediate');
    
    // 按添加顺序执行
    for (const task of tasks) {
      if (task.status !== 'pending') continue;
      
      setTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, status: 'running', startedAt: Date.now() } : t
      ));
      
      addLog(`▶️ 执行：${task.name}（优先级被忽略）`, getPriorityClass(task.priority));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, status: 'completed', completedAt: Date.now() } : t
      ));
      
      addLog(`✅ 完成：${task.name}`, getPriorityClass(task.priority));
    }
    
    addLog('⚠️ 注意：低优先级任务先于高优先级执行！', 'immediate');
  };

  const resetTasks = () => {
    setTasks([]);
    clearLogs();
    setTaskIdCounter(1);
  };

  // React 18 useTransition 演示
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // 使用 startTransition 将过滤操作标记为低优先级
    startTransition(() => {
      // 模拟大量数据过滤（耗时操作）
      const items = Array.from({ length: 20000 }, (_, i) => `Item ${i}`);
      const filtered = items.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered.slice(0, 100));
    });
  };

  return (
    <div className="demo-container">
      <h2>优先级调度演示</h2>

      <div className="info-box">
        <h3>🎯 React 的优先级系统</h3>
        <p>React 定义了多个优先级级别，用于决定哪些更新应该先执行：</p>
        <ul>
          <li><strong className="log-immediate">Immediate（立即）</strong>：同步执行，如受控输入</li>
          <li><strong className="log-high">User-Blocking（用户交互）</strong>：用户交互导致的更新，如点击、hover</li>
          <li><strong className="log-normal">Normal（正常）</strong>：正常的数据获取、网络响应</li>
          <li><strong className="log-low">Low（低）</strong>：不紧急的更新</li>
          <li><strong className="log-idle">Idle（空闲）</strong>：可以推迟的更新，如分析数据</li>
        </ul>
      </div>

      <div className="code-block">
        <h4>React 优先级调度示例</h4>
        <pre>{`
import { unstable_scheduleCallback, unstable_ImmediatePriority } from 'scheduler';

// 不同优先级的任务
unstable_scheduleCallback(unstable_ImmediatePriority, () => {
  // 立即执行的任务（如输入框）
});

unstable_scheduleCallback(unstable_UserBlockingPriority, () => {
  // 用户交互任务（如点击按钮）
});

unstable_scheduleCallback(unstable_NormalPriority, () => {
  // 正常更新（如数据获取完成）
});

// React 会自动按优先级调度这些任务
// 即使添加顺序是：Normal -> Immediate -> UserBlocking
// 执行顺序会是：Immediate -> UserBlocking -> Normal
        `}</pre>
      </div>

      <h3>🧪 任务调度模拟</h3>

      <div className="controls">
        <button onClick={() => addTask(Priority.Immediate)}>
          添加立即任务
        </button>
        <button onClick={() => addTask(Priority.UserBlocking)}>
          添加用户交互任务
        </button>
        <button onClick={() => addTask(Priority.Normal)}>
          添加正常任务
        </button>
        <button onClick={() => addTask(Priority.Low)}>
          添加低优先级任务
        </button>
        <button onClick={() => addTask(Priority.Idle)}>
          添加空闲任务
        </button>
      </div>

      <div className="controls">
        <button onClick={executeTasks} disabled={tasks.length === 0}>
          ✅ React 风格执行（按优先级）
        </button>
        <button onClick={executeBrowserStyle} disabled={tasks.length === 0}>
          ❌ 浏览器风格执行（FIFO）
        </button>
        <button onClick={resetTasks}>
          重置
        </button>
      </div>

      <div className="visual-demo">
        <div className="task-queue">
          <h4>任务队列（添加顺序）</h4>
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item ${task.status === 'running' ? 'task-executing' : ''}`}
            >
              <div>
                <strong>{task.name}</strong>
                <span style={{ marginLeft: '0.5rem' }} className={`log-${getPriorityClass(task.priority)}`}>
                  [{getPriorityName(task.priority)}]
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                {task.status === 'pending' && '⏳ 等待中'}
                {task.status === 'running' && '▶️ 执行中'}
                {task.status === 'completed' && '✅ 已完成'}
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
              点击上方按钮添加任务
            </div>
          )}
        </div>

        <div className="task-queue">
          <h4>执行日志</h4>
          <div className="log-container" style={{ maxHeight: '300px' }}>
            {logs.length === 0 ? (
              <div style={{ color: '#888' }}>等待执行...</div>
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

      <div className="warning-box">
        <h3>⚠️ 对比观察</h3>
        <p><strong>试验步骤：</strong></p>
        <ol>
          <li>按顺序添加：低优先级 → 正常 → 用户交互 → 立即</li>
          <li>点击"React 风格执行"：会按优先级执行（立即 → 用户交互 → 正常 → 低）</li>
          <li>重置后重新添加相同任务</li>
          <li>点击"浏览器风格执行"：会按添加顺序执行（低 → 正常 → 用户交互 → 立即）</li>
        </ol>
        <p><strong>这就是 React 优先级调度的价值！</strong></p>
      </div>

      <h3>🎨 React 18 useTransition 实例</h3>
      
      <div className="info-box">
        <p>
          <code>useTransition</code> 是 React 18 的新特性，允许你将某些更新标记为"过渡"（低优先级）。
          这样，紧急更新（如输入）可以立即响应，而不会被大量计算阻塞。
        </p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="输入搜索（体验优先级调度）"
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '2px solid #667eea',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}
        />
        
        {isPending && (
          <div style={{ color: '#667eea', marginBottom: '0.5rem' }}>
            🔄 正在过滤数据...（低优先级任务）
          </div>
        )}
        
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '8px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          <div>找到 {filteredItems.length} 个结果：</div>
          {filteredItems.slice(0, 20).map((item, index) => (
            <div key={index} style={{ padding: '0.25rem 0' }}>{item}</div>
          ))}
        </div>
      </div>

      <div className="success-box">
        <h3>💡 关键要点</h3>
        <ul>
          <li>React 通过优先级队列管理任务，而不是简单的 FIFO</li>
          <li>高优先级任务可以"插队"执行</li>
          <li>低优先级任务可以被中断，等高优先级任务完成后继续</li>
          <li>这让 React 可以保证重要的更新（如用户输入）立即响应</li>
        </ul>
      </div>
    </div>
  );
};

export default PrioritySchedulingDemo;


