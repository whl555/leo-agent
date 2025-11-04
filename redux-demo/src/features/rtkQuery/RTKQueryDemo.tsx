/**
 * RTK Query 演示组件
 * 展示数据获取、缓存、乐观更新等功能
 */

import { useState } from 'react'

import {
  useAddPostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
  type Post,
} from './api'

export function RTKQueryDemo() {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null)
  const [newPost, setNewPost] = useState({ title: '', body: '' })

  // 使用 query hook 获取数据
  const {
    data: posts,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetPostsQuery(undefined, {
    // 配置选项
    pollingInterval: 0, // 轮询间隔（0 表示不轮询）
    refetchOnFocus: true, // 窗口重新获得焦点时重新获取
    refetchOnReconnect: true, // 重新连接时重新获取
  })

  // 使用 mutation hooks
  const [addPost, { isLoading: isAdding }] = useAddPostMutation()
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()

  const handleAddPost = async () => {
    if (!newPost.title.trim()) return

    try {
      await addPost({
        ...newPost,
        userId: 1,
      }).unwrap()

      setNewPost({ title: '', body: '' })
      console.log('✅ 文章创建成功！')
    } catch (err) {
      console.error('❌ 创建失败:', err)
    }
  }

  const handleUpdatePost = async (id: number) => {
    if (!editingPost) return

    try {
      await updatePost({
        id,
        ...editingPost,
      }).unwrap()

      setEditingPost(null)
      setSelectedPostId(null)
      console.log('✅ 文章更新成功！')
    } catch (err) {
      console.error('❌ 更新失败:', err)
    }
  }

  const handleDeletePost = async (id: number) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    try {
      await deletePost(id).unwrap()
      console.log('✅ 文章删除成功！')
    } catch (err) {
      console.error('❌ 删除失败:', err)
    }
  }

  const startEdit = (post: Post) => {
    setSelectedPostId(post.id)
    setEditingPost({ title: post.title, body: post.body })
  }

  const cancelEdit = () => {
    setSelectedPostId(null)
    setEditingPost(null)
  }

  if (isLoading) {
    return (
      <div className="card">
        <h2>🔄 RTK Query 演示</h2>
        <div className="loading">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="card">
        <h2>🔄 RTK Query 演示</h2>
        <div className="error">
          <p>错误：{error?.toString()}</p>
          <button onClick={refetch} className="btn-primary">
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>🔄 RTK Query 演示</h2>

      <div className="rtk-info">
        <div className="status-indicators">
          <span className={`badge ${isFetching ? 'badge-warning' : 'badge-success'}`}>
            {isFetching ? '🔄 获取中...' : '✅ 已加载'}
          </span>
          <span className="badge badge-info">📦 缓存已启用</span>
          <button onClick={refetch} className="btn-sm" disabled={isFetching}>
            刷新数据
          </button>
        </div>

        <div className="feature-list">
          <h3>RTK Query 特性：</h3>
          <ul>
            <li>✅ 自动缓存和重复请求去重</li>
            <li>✅ 乐观更新（Optimistic Updates）</li>
            <li>✅ 自动重新获取（refetchOnFocus）</li>
            <li>✅ 标签化缓存失效（Tag-based Invalidation）</li>
            <li>✅ 自动生成 TypeScript 类型</li>
          </ul>
        </div>
      </div>

      <div className="demo-section">
        <h3>创建新文章：</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="文章标题..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="form-input"
          />
          <textarea
            placeholder="文章内容..."
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            className="form-textarea"
            rows={3}
          />
          <button onClick={handleAddPost} disabled={isAdding} className="btn-primary">
            {isAdding ? '创建中...' : '✨ 创建文章（乐观更新）'}
          </button>
        </div>
      </div>

      <div className="demo-section">
        <h3>文章列表：</h3>
        <p className="hint">💡 编辑或删除会触发乐观更新，先立即更新 UI，后同步到服务器</p>

        <div className="posts-list">
          {posts?.map((post) => (
            <div key={post.id} className="post-item">
              {selectedPostId === post.id && editingPost ? (
                // 编辑模式
                <div className="edit-form">
                  <input
                    type="text"
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="form-input"
                  />
                  <textarea
                    value={editingPost.body || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, body: e.target.value })}
                    className="form-textarea"
                    rows={2}
                  />
                  <div className="button-group">
                    <button
                      onClick={() => handleUpdatePost(post.id)}
                      disabled={isUpdating}
                      className="btn-success"
                    >
                      {isUpdating ? '保存中...' : '💾 保存'}
                    </button>
                    <button onClick={cancelEdit} className="btn-secondary">
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                // 显示模式
                <div className="post-content">
                  <h4>{post.title}</h4>
                  <p>{post.body}</p>
                  <div className="post-actions">
                    <button onClick={() => startEdit(post)} className="btn-sm btn-primary">
                      ✏️ 编辑
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      disabled={isDeleting}
                      className="btn-sm btn-danger"
                    >
                      {isDeleting ? '删除中...' : '🗑️ 删除'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="code-example">
        <h3>代码示例：</h3>
        <pre>{`// 1. 定义 API
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: ['Post']
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: '/posts',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Post']
    })
  })
})

// 2. 在组件中使用
function Posts() {
  const { data, isLoading } = useGetPostsQuery()
  const [addPost] = useAddPostMutation()

  return (
    <div>
      {data?.map(post => <div>{post.title}</div>)}
      <button onClick={() => addPost({ title: 'New' })}>
        Add
      </button>
    </div>
  )
}`}</pre>
      </div>
    </div>
  )
}
