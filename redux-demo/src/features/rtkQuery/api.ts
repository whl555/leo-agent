/**
 * RTK Query API 定义
 * 演示如何使用 RTK Query 进行数据获取和缓存
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// 模拟 API 数据类型
export interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export interface User {
  id: number
  name: string
  email: string
  username: string
}

/**
 * 模拟 API 请求
 * 实际项目中应该调用真实的 API
 */
const mockFetch = async (url: string, options?: RequestInit) => {
  await new Promise((resolve) => setTimeout(resolve, 800)) // 模拟网络延迟

  // 解析 URL
  const pathname = url.replace(/^https?:\/\/[^/]+/, '')

  // 模拟不同的 API 端点
  if (pathname === '/posts') {
    return {
      ok: true,
      status: 200,
      json: async () => [
        { id: 1, title: 'Redux Toolkit 入门', body: '学习 RTK 的基础知识...', userId: 1 },
        { id: 2, title: 'RTK Query 使用指南', body: 'RTK Query 简化数据获取...', userId: 1 },
        {
          id: 3,
          title: 'React-Redux Hooks',
          body: '使用 useSelector 和 useDispatch...',
          userId: 2,
        },
      ],
    }
  }

  if (pathname.match(/\/posts\/\d+/)) {
    const id = parseInt(pathname.split('/')[2])
    return {
      ok: true,
      status: 200,
      json: async () => ({
        id,
        title: `Post ${id}`,
        body: `这是第 ${id} 篇文章的内容...`,
        userId: 1,
      }),
    }
  }

  if (pathname === '/users') {
    return {
      ok: true,
      status: 200,
      json: async () => [
        { id: 1, name: '张三', email: 'zhang@example.com', username: 'zhangsan' },
        { id: 2, name: '李四', email: 'li@example.com', username: 'lisi' },
      ],
    }
  }

  if (options?.method === 'POST' && pathname === '/posts') {
    const body = JSON.parse(options.body as string)
    return {
      ok: true,
      status: 201,
      json: async () => ({
        ...body,
        id: Math.floor(Math.random() * 1000),
      }),
    }
  }

  if (options?.method === 'PUT' && pathname.match(/\/posts\/\d+/)) {
    const id = parseInt(pathname.split('/')[2])
    const body = JSON.parse(options.body as string)
    return {
      ok: true,
      status: 200,
      json: async () => ({
        ...body,
        id,
      }),
    }
  }

  if (options?.method === 'DELETE' && pathname.match(/\/posts\/\d+/)) {
    return {
      ok: true,
      status: 204,
      json: async () => ({}),
    }
  }

  throw new Error('Not found')
}

/**
 * 创建 API slice
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com',
    // 使用模拟 fetch 替代真实请求
    fetchFn: mockFetch as typeof fetch,
  }),
  tagTypes: ['Post', 'User'],
  endpoints: (builder) => ({
    // 查询所有文章
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Post' as const, id })), { type: 'Post', id: 'LIST' }]
          : [{ type: 'Post', id: 'LIST' }],
    }),

    // 查询单个文章
    getPost: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Post', id }],
    }),

    // 查询所有用户
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),

    // 创建文章
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: '/posts',
        method: 'POST',
        body,
      }),
      // 乐观更新
      async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getPosts', undefined, (draft) => {
            draft.unshift({
              id: Math.floor(Math.random() * 1000),
              title: newPost.title || '',
              body: newPost.body || '',
              userId: newPost.userId || 1,
            })
          }),
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    // 更新文章
    updatePost: builder.mutation<Post, Partial<Post> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: patch,
      }),
      // 乐观更新
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getPost', id, (draft) => {
            Object.assign(draft, patch)
          }),
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Post', id }],
    }),

    // 删除文章
    deletePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      // 乐观更新
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getPosts', undefined, (draft) => {
            const index = draft.findIndex((post) => post.id === id)
            if (index !== -1) {
              draft.splice(index, 1)
            }
          }),
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_result, _error, id) => [{ type: 'Post', id }],
    }),
  }),
})

// 导出自动生成的 hooks
export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetUsersQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = api
