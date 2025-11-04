import { useState } from 'react'
import { useMachine } from '@xstate/react'
import { authMachine } from '../machines/authMachine'

export function AuthDemo() {
  const [state, send] = useMachine(authMachine)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    send({ type: 'LOGIN', username, password })
  }

  const isLoading = state.matches('loading')
  const isAuthenticated = state.matches('authenticated')
  const isError = state.matches('error')

  return (
    <div className="demo-card">
      <h2>🔐 用户认证状态机</h2>
      <p className="description">
        展示基础状态转换、context管理、错误处理和异步操作
      </p>
      
      <div className="state-indicator">
        当前状态: <span className="state-badge">{state.value as string}</span>
      </div>

      {!isAuthenticated ? (
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-field">
            <label>用户名：</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入 admin"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-field">
            <label>密码：</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入 admin"
              disabled={isLoading}
            />
          </div>

          {state.context.error && (
            <div className="error-message">❌ {state.context.error}</div>
          )}

          <div className="button-group">
            <button type="submit" disabled={isLoading || !username || !password}>
              {isLoading ? '登录中...' : '登录'}
            </button>
            
            {isError && (
              <button type="button" onClick={() => send({ type: 'RETRY' })}>
                重试
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="success-state">
          <p>✅ 欢迎, {state.context.user?.name}!</p>
          <button onClick={() => send({ type: 'LOGOUT' })}>退出登录</button>
        </div>
      )}

      <div className="hint">
        💡 提示: 用户名和密码都是 "admin"
      </div>
    </div>
  )
}

