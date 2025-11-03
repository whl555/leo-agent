/**
 * Redux 面试题展示组件
 */

import { useState } from 'react'

import { reduxInterviewQuestions, type InterviewQuestion } from '../../data/interviewQuestions'

export function InterviewQuestions() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // 获取所有分类
  const categories = ['all', ...new Set(reduxInterviewQuestions.map((q) => q.category))]

  // 过滤题目
  const filteredQuestions = reduxInterviewQuestions.filter((q) => {
    const categoryMatch = selectedCategory === 'all' || q.category === selectedCategory
    const difficultyMatch = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty
    const searchMatch =
      searchQuery === '' ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))

    return categoryMatch && difficultyMatch && searchMatch
  })

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getDifficultyBadgeClass = (difficulty: InterviewQuestion['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'badge-success'
      case 'medium':
        return 'badge-warning'
      case 'hard':
        return 'badge-danger'
    }
  }

  const getDifficultyText = (difficulty: InterviewQuestion['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return '简单'
      case 'medium':
        return '中等'
      case 'hard':
        return '困难'
    }
  }

  return (
    <div className="card">
      <h2>📚 Redux 面试题库</h2>

      <div className="interview-stats">
        <div className="stat-item">
          <span className="stat-label">总题目数：</span>
          <span className="stat-value">{reduxInterviewQuestions.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">已筛选：</span>
          <span className="stat-value">{filteredQuestions.length}</span>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>搜索：</label>
          <input
            type="text"
            placeholder="搜索题目、答案或关键词..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="filter-group">
          <label>分类：</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? '全部分类' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>难度：</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="form-select"
          >
            <option value="all">全部难度</option>
            <option value="easy">简单</option>
            <option value="medium">中等</option>
            <option value="hard">困难</option>
          </select>
        </div>
      </div>

      <div className="questions-list">
        {filteredQuestions.length === 0 ? (
          <div className="empty-state">
            <p>😔 没有找到匹配的题目</p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div key={question.id} className="question-item">
              <div className="question-header" onClick={() => toggleExpand(question.id)}>
                <div className="question-title">
                  <span className="question-number">#{question.id}</span>
                  <h3>{question.question}</h3>
                </div>
                <div className="question-meta">
                  <span className="badge badge-info">{question.category}</span>
                  <span className={`badge ${getDifficultyBadgeClass(question.difficulty)}`}>
                    {getDifficultyText(question.difficulty)}
                  </span>
                  <button className="expand-btn">{expandedId === question.id ? '▼' : '▶'}</button>
                </div>
              </div>

              {expandedId === question.id && (
                <div className="question-content">
                  <div className="answer">
                    <h4>💡 答案：</h4>
                    <div className="answer-text">
                      {question.answer.split('\n').map((line, idx) => {
                        // 检测代码块
                        if (line.trim().startsWith('```')) {
                          return null
                        }

                        // 检测列表项
                        if (line.match(/^[\d]+\.\s/) || line.match(/^[-*]\s/)) {
                          return (
                            <li key={idx} className="list-item">
                              {line.replace(/^[\d]+\.\s|^[-*]\s/, '')}
                            </li>
                          )
                        }

                        // 检测标题
                        if (line.match(/^\*\*.*\*\*/) || line.match(/^#{1,3}\s/)) {
                          const text = line.replace(/^\*\*|\*\*$|^#{1,3}\s/g, '')
                          return (
                            <h5 key={idx} className="section-title">
                              {text}
                            </h5>
                          )
                        }

                        // 检测代码行
                        if (line.trim().startsWith('//') || line.includes('const ') || line.includes('function ')) {
                          return (
                            <pre key={idx} className="code-line">
                              <code>{line}</code>
                            </pre>
                          )
                        }

                        // 普通段落
                        if (line.trim()) {
                          return (
                            <p key={idx} className="paragraph">
                              {line}
                            </p>
                          )
                        }

                        return <br key={idx} />
                      })}
                    </div>
                  </div>

                  <div className="keywords">
                    <h4>🏷️ 关键词：</h4>
                    <div className="keyword-tags">
                      {question.keywords.map((keyword, idx) => (
                        <span key={idx} className="keyword-tag">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="interview-tips">
        <h3>💡 面试准备建议：</h3>
        <ul>
          <li>
            <strong>理解核心概念</strong>：深入理解 Redux 三大原则和数据流
          </li>
          <li>
            <strong>实践经验</strong>：能够结合实际项目经验回答问题
          </li>
          <li>
            <strong>最佳实践</strong>：熟悉 Redux Toolkit 和官方推荐模式
          </li>
          <li>
            <strong>性能优化</strong>：了解常见性能问题和优化方案
          </li>
          <li>
            <strong>对比分析</strong>：能够对比不同方案的优劣（thunk vs saga、Redux vs Context）
          </li>
          <li>
            <strong>源码理解</strong>：有精力的话可以阅读核心源码，理解实现原理
          </li>
        </ul>
      </div>
    </div>
  )
}
