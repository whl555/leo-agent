import { assign, fromPromise, setup } from 'xstate'

/**
 * 表单验证状态机
 * 展示：嵌套状态、并行状态、复杂的状态转换逻辑
 */

type FormField = {
  value: string
  error: string | null
  touched: boolean
}

type FormContext = {
  email: FormField
  password: FormField
  confirmPassword: FormField
  submissionError: string | null
}

type FormEvents =
  | { type: 'UPDATE_EMAIL'; value: string }
  | { type: 'UPDATE_PASSWORD'; value: string }
  | { type: 'UPDATE_CONFIRM_PASSWORD'; value: string }
  | { type: 'BLUR_EMAIL' }
  | { type: 'BLUR_PASSWORD' }
  | { type: 'BLUR_CONFIRM_PASSWORD' }
  | { type: 'SUBMIT' }
  | { type: 'RESET' }

const validateEmail = (email: string): string | null => {
  if (!email) return '邮箱不能为空'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '邮箱格式不正确'
  return null
}

const validatePassword = (password: string): string | null => {
  if (!password) return '密码不能为空'
  if (password.length < 6) return '密码至少6个字符'
  return null
}

const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return '请确认密码'
  if (password !== confirmPassword) return '两次密码不一致'
  return null
}

const submitFormAPI = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  
  // 模拟10%的失败率
  if (Math.random() < 0.1) {
    throw new Error('服务器错误，请稍后重试')
  }
  
  return { success: true, userId: '123' }
}

export const formMachine = setup({
  types: {
    context: {} as FormContext,
    events: {} as FormEvents,
  },
  guards: {
    isFormValid: ({ context }) => {
      return Boolean(
        !context.email.error &&
        !context.password.error &&
        !context.confirmPassword.error &&
        context.email.value &&
        context.password.value &&
        context.confirmPassword.value
      )
    },
  },
  actions: {
    updateEmail: assign({
      email: ({ context, event }) => {
        if (event.type !== 'UPDATE_EMAIL') return context.email
        const value = event.value
        return {
          ...context.email,
          value,
          error: context.email.touched ? validateEmail(value) : null,
        }
      },
    }),
    updatePassword: assign({
      password: ({ context, event }) => {
        if (event.type !== 'UPDATE_PASSWORD') return context.password
        const value = event.value
        return {
          ...context.password,
          value,
          error: context.password.touched ? validatePassword(value) : null,
        }
      },
      confirmPassword: ({ context, event }) => {
        if (event.type !== 'UPDATE_PASSWORD') return context.confirmPassword
        // 重新验证确认密码
        return {
          ...context.confirmPassword,
          error: context.confirmPassword.touched
            ? validateConfirmPassword(event.value, context.confirmPassword.value)
            : null,
        }
      },
    }),
    updateConfirmPassword: assign({
      confirmPassword: ({ context, event }) => {
        if (event.type !== 'UPDATE_CONFIRM_PASSWORD') return context.confirmPassword
        const value = event.value
        return {
          ...context.confirmPassword,
          value,
          error: context.confirmPassword.touched
            ? validateConfirmPassword(context.password.value, value)
            : null,
        }
      },
    }),
    blurEmail: assign({
      email: ({ context }) => ({
        ...context.email,
        touched: true,
        error: validateEmail(context.email.value),
      }),
    }),
    blurPassword: assign({
      password: ({ context }) => ({
        ...context.password,
        touched: true,
        error: validatePassword(context.password.value),
      }),
    }),
    blurConfirmPassword: assign({
      confirmPassword: ({ context }) => ({
        ...context.confirmPassword,
        touched: true,
        error: validateConfirmPassword(context.password.value, context.confirmPassword.value),
      }),
    }),
    resetForm: assign({
      email: { value: '', error: null, touched: false },
      password: { value: '', error: null, touched: false },
      confirmPassword: { value: '', error: null, touched: false },
      submissionError: null,
    }),
  },
  actors: {
    submitForm: fromPromise(async () => {
      return await submitFormAPI()
    }),
  },
}).createMachine({
  id: 'form',
  initial: 'editing',
  context: {
    email: { value: '', error: null, touched: false },
    password: { value: '', error: null, touched: false },
    confirmPassword: { value: '', error: null, touched: false },
    submissionError: null,
  },
  states: {
    editing: {
      on: {
        UPDATE_EMAIL: {
          actions: { type: 'updateEmail' },
        },
        UPDATE_PASSWORD: {
          actions: { type: 'updatePassword' },
        },
        UPDATE_CONFIRM_PASSWORD: {
          actions: { type: 'updateConfirmPassword' },
        },
        BLUR_EMAIL: {
          actions: { type: 'blurEmail' },
        },
        BLUR_PASSWORD: {
          actions: { type: 'blurPassword' },
        },
        BLUR_CONFIRM_PASSWORD: {
          actions: { type: 'blurConfirmPassword' },
        },
        SUBMIT: {
          target: 'submitting',
          guard: { type: 'isFormValid' },
        },
      },
    },
    submitting: {
      invoke: {
        src: 'submitForm',
        onDone: {
          target: 'success',
        },
        onError: {
          target: 'editing',
          actions: assign({
            submissionError: ({ event }) => (event.error as Error).message,
          }),
        },
      },
    },
    success: {
      on: {
        RESET: {
          target: 'editing',
          actions: { type: 'resetForm' },
        },
      },
    },
  },
})

