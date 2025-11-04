import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './demos/Home';
import EventLoopBasics from './demos/EventLoopBasics';
import TimeSlicingDemo from './demos/TimeSlicingDemo';
import PrioritySchedulingDemo from './demos/PrioritySchedulingDemo';
import SchedulerSimulation from './demos/SchedulerSimulation';
import ReactVsBrowser from './demos/ReactVsBrowser';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="nav-bar">
          <h1>React 调度器与事件循环演示</h1>
          <ul>
            <li><Link to="/">首页</Link></li>
            <li><Link to="/event-loop">事件循环基础</Link></li>
            <li><Link to="/time-slicing">时间切片</Link></li>
            <li><Link to="/priority">优先级调度</Link></li>
            <li><Link to="/scheduler">调度器模拟</Link></li>
            <li><Link to="/react-vs-browser">React vs 浏览器</Link></li>
          </ul>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event-loop" element={<EventLoopBasics />} />
            <Route path="/time-slicing" element={<TimeSlicingDemo />} />
            <Route path="/priority" element={<PrioritySchedulingDemo />} />
            <Route path="/scheduler" element={<SchedulerSimulation />} />
            <Route path="/react-vs-browser" element={<ReactVsBrowser />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
