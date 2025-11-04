import { assign, setup } from 'xstate'

/**
 * 向导/多步骤表单状态机
 * 展示：顺序状态流转、历史状态、条件导航
 */

type WizardContext = {
  step1Data: {
    name: string
    age: string
  }
  step2Data: {
    city: string
    country: string
  }
  step3Data: {
    subscribe: boolean
    terms: boolean
  }
  history: string[]
}

type WizardEvents =
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'GOTO'; step: string }
  | { type: 'UPDATE_STEP1'; data: Partial<WizardContext['step1Data']> }
  | { type: 'UPDATE_STEP2'; data: Partial<WizardContext['step2Data']> }
  | { type: 'UPDATE_STEP3'; data: Partial<WizardContext['step3Data']> }
  | { type: 'SUBMIT' }
  | { type: 'RESTART' }

export const wizardMachine = setup({
  types: {
    context: {} as WizardContext,
    events: {} as WizardEvents,
  },
  guards: {
    isStep1Valid: ({ context }) => {
      return context.step1Data.name.length > 0 && parseInt(context.step1Data.age) > 0
    },
    isStep2Valid: ({ context }) => {
      return context.step2Data.city.length > 0 && context.step2Data.country.length > 0
    },
    isStep3Valid: ({ context }) => {
      return context.step3Data.terms
    },
  },
  actions: {
    updateStep1: assign({
      step1Data: ({ context, event }) => {
        if (event.type !== 'UPDATE_STEP1') return context.step1Data
        return { ...context.step1Data, ...event.data }
      },
    }),
    updateStep2: assign({
      step2Data: ({ context, event }) => {
        if (event.type !== 'UPDATE_STEP2') return context.step2Data
        return { ...context.step2Data, ...event.data }
      },
    }),
    updateStep3: assign({
      step3Data: ({ context, event }) => {
        if (event.type !== 'UPDATE_STEP3') return context.step3Data
        return { ...context.step3Data, ...event.data }
      },
    }),
    addToHistory: assign({
      history: ({ context }) => [...context.history, new Date().toISOString()],
    }),
    resetWizard: assign({
      step1Data: { name: '', age: '' },
      step2Data: { city: '', country: '' },
      step3Data: { subscribe: false, terms: false },
      history: [],
    }),
  },
}).createMachine({
  id: 'wizard',
  initial: 'step1',
  context: {
    step1Data: { name: '', age: '' },
    step2Data: { city: '', country: '' },
    step3Data: { subscribe: false, terms: false },
    history: [],
  },
  states: {
    step1: {
      on: {
        UPDATE_STEP1: {
          actions: { type: 'updateStep1' },
        },
        NEXT: {
          target: 'step2',
          guard: { type: 'isStep1Valid' },
          actions: { type: 'addToHistory' },
        },
      },
    },
    step2: {
      on: {
        UPDATE_STEP2: {
          actions: { type: 'updateStep2' },
        },
        NEXT: {
          target: 'step3',
          guard: { type: 'isStep2Valid' },
          actions: { type: 'addToHistory' },
        },
        BACK: {
          target: 'step1',
          actions: { type: 'addToHistory' },
        },
      },
    },
    step3: {
      on: {
        UPDATE_STEP3: {
          actions: { type: 'updateStep3' },
        },
        NEXT: {
          target: 'review',
          guard: { type: 'isStep3Valid' },
          actions: { type: 'addToHistory' },
        },
        BACK: {
          target: 'step2',
          actions: { type: 'addToHistory' },
        },
      },
    },
    review: {
      on: {
        BACK: 'step3',
        SUBMIT: 'submitting',
        GOTO: [
          { target: 'step1', guard: ({ event }) => event.type === 'GOTO' && event.step === 'step1' },
          { target: 'step2', guard: ({ event }) => event.type === 'GOTO' && event.step === 'step2' },
          { target: 'step3', guard: ({ event }) => event.type === 'GOTO' && event.step === 'step3' },
        ],
      },
    },
    submitting: {
      after: {
        2000: 'complete',
      },
    },
    complete: {
      on: {
        RESTART: {
          target: 'step1',
          actions: { type: 'resetWizard' },
        },
      },
    },
  },
})

