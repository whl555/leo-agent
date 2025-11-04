/**
 * VoiceCallPage 状态机测试示例
 * 
 * 这个文件展示了如何测试使用 holly-fsm 的状态机逻辑
 */

import { createMachine } from 'holly-fsm';

// 为了测试，我们重新定义状态机创建函数
const createVoiceChatMachine = (context: {
  startListening: () => void;
  clearResponse: () => void;
  reconnect: () => void;
}) => {
  return createMachine({
    calling: {
      connectionReady: async () => {
        return 'welcome';
      },
      connectionLost: async () => {
        return 'network_error';
      },
    },
    welcome: {
      startSpeaking: async () => {
        return 'speaking';
      },
      interrupt: async () => {
        context.clearResponse();
        context.startListening();
        return 'listening';
      },
      connectionLost: async () => {
        return 'network_error';
      },
    },
    thinking: {
      startSpeaking: async () => {
        return 'speaking';
      },
      interrupt: async () => {
        context.clearResponse();
        context.startListening();
        return 'listening';
      },
      connectionLost: async () => {
        return 'network_error';
      },
    },
    speaking: {
      finishSpeaking: async () => {
        context.startListening();
        return 'listening';
      },
      interrupt: async () => {
        context.clearResponse();
        context.startListening();
        return 'listening';
      },
      connectionLost: async () => {
        return 'network_error';
      },
    },
    listening: {
      userSpeaking: async () => {
        return 'thinking';
      },
      connectionLost: async () => {
        return 'network_error';
      },
    },
    network_error: {
      retry: async () => {
        context.reconnect();
        return 'reconnecting';
      },
    },
    reconnecting: {
      connectionReady: async () => {
        return 'calling';
      },
      connectionLost: async () => {
        return 'network_error';
      },
    },
  }, {
    initialState: 'calling',
  });
};

describe('VoiceChat 状态机测试', () => {
  let machine: ReturnType<typeof createVoiceChatMachine>;
  let mockContext: {
    startListening: jest.Mock;
    clearResponse: jest.Mock;
    reconnect: jest.Mock;
  };

  beforeEach(() => {
    mockContext = {
      startListening: jest.fn(),
      clearResponse: jest.fn(),
      reconnect: jest.fn(),
    };
    machine = createVoiceChatMachine(mockContext);
  });

  describe('正常对话流程', () => {
    test('初始状态应该是 calling', () => {
      expect(machine.getState()).toBe('calling');
    });

    test('连接成功后应该转到 welcome 状态', async () => {
      await machine.connectionReady();
      expect(machine.getState()).toBe('welcome');
    });

    test('完整对话流程', async () => {
      // 1. 连接建立
      await machine.connectionReady();
      expect(machine.getState()).toBe('welcome');

      // 2. AI 开始说话
      await machine.startSpeaking();
      expect(machine.getState()).toBe('speaking');

      // 3. AI 说完，等待用户
      await machine.finishSpeaking();
      expect(machine.getState()).toBe('listening');
      expect(mockContext.startListening).toHaveBeenCalled();

      // 4. 用户开始说话
      await machine.userSpeaking();
      expect(machine.getState()).toBe('thinking');

      // 5. AI 思考完成，开始回复
      await machine.startSpeaking();
      expect(machine.getState()).toBe('speaking');

      // 6. AI 说完，继续等待
      await machine.finishSpeaking();
      expect(machine.getState()).toBe('listening');
    });
  });

  describe('打断功能', () => {
    test('在 welcome 状态时可以打断', async () => {
      await machine.connectionReady();
      expect(machine.getState()).toBe('welcome');

      await machine.interrupt();
      expect(machine.getState()).toBe('listening');
      expect(mockContext.clearResponse).toHaveBeenCalled();
      expect(mockContext.startListening).toHaveBeenCalled();
    });

    test('在 thinking 状态时可以打断', async () => {
      // 设置到 thinking 状态
      await machine.connectionReady();
      await machine.startSpeaking();
      await machine.finishSpeaking();
      await machine.userSpeaking();
      expect(machine.getState()).toBe('thinking');

      // 清空 mock 调用记录
      mockContext.clearResponse.mockClear();
      mockContext.startListening.mockClear();

      // 打断
      await machine.interrupt();
      expect(machine.getState()).toBe('listening');
      expect(mockContext.clearResponse).toHaveBeenCalled();
      expect(mockContext.startListening).toHaveBeenCalled();
    });

    test('在 speaking 状态时可以打断', async () => {
      await machine.connectionReady();
      await machine.startSpeaking();
      expect(machine.getState()).toBe('speaking');

      await machine.interrupt();
      expect(machine.getState()).toBe('listening');
      expect(mockContext.clearResponse).toHaveBeenCalled();
      expect(mockContext.startListening).toHaveBeenCalled();
    });
  });

  describe('错误处理和重连', () => {
    test('连接失败应该转到 network_error 状态', async () => {
      await machine.connectionLost();
      expect(machine.getState()).toBe('network_error');
    });

    test('任何状态都可以转到 network_error', async () => {
      // welcome 状态
      await machine.connectionReady();
      await machine.connectionLost();
      expect(machine.getState()).toBe('network_error');

      // 重置到 listening 状态
      machine = createVoiceChatMachine(mockContext);
      await machine.connectionReady();
      await machine.startSpeaking();
      await machine.finishSpeaking();
      
      // listening 状态
      await machine.connectionLost();
      expect(machine.getState()).toBe('network_error');
    });

    test('重连流程', async () => {
      // 进入错误状态
      await machine.connectionLost();
      expect(machine.getState()).toBe('network_error');

      // 点击重试
      await machine.retry();
      expect(machine.getState()).toBe('reconnecting');
      expect(mockContext.reconnect).toHaveBeenCalled();

      // 重连成功
      await machine.connectionReady();
      expect(machine.getState()).toBe('calling');
    });

    test('重连失败', async () => {
      // 进入错误状态
      await machine.connectionLost();
      await machine.retry();
      expect(machine.getState()).toBe('reconnecting');

      // 重连失败
      await machine.connectionLost();
      expect(machine.getState()).toBe('network_error');
    });
  });

  describe('状态监听器', () => {
    test('应该触发 onEnter 事件', async () => {
      const onEnterMock = jest.fn();
      const unsubscribe = machine.onEnter(onEnterMock);

      await machine.connectionReady();

      expect(onEnterMock).toHaveBeenCalledWith(
        expect.objectContaining({
          current: 'welcome',
          last: 'calling',
          action: 'connectionReady',
        })
      );

      unsubscribe();
    });

    test('应该触发 onExit 事件', async () => {
      const onExitMock = jest.fn();
      const unsubscribe = machine.onExit(onExitMock);

      await machine.connectionReady();

      expect(onExitMock).toHaveBeenCalledWith(
        expect.objectContaining({
          current: 'calling',
          action: 'connectionReady',
        })
      );

      unsubscribe();
    });

    test('应该触发特定状态的监听器', async () => {
      const onWelcomeMock = jest.fn();
      const unsubscribe = machine.onWelcome(onWelcomeMock);

      await machine.connectionReady();

      expect(onWelcomeMock).toHaveBeenCalledWith(
        expect.objectContaining({
          current: 'welcome',
        })
      );

      unsubscribe();
    });

    test('取消订阅后不应触发事件', async () => {
      const onEnterMock = jest.fn();
      const unsubscribe = machine.onEnter(onEnterMock);

      unsubscribe();

      await machine.connectionReady();

      expect(onEnterMock).not.toHaveBeenCalled();
    });
  });

  describe('边界情况', () => {
    test('连续多次状态转换', async () => {
      await machine.connectionReady();
      await machine.startSpeaking();
      await machine.finishSpeaking();
      await machine.userSpeaking();
      await machine.startSpeaking();
      await machine.finishSpeaking();
      await machine.userSpeaking();

      expect(machine.getState()).toBe('thinking');
    });

    test('快速打断', async () => {
      await machine.connectionReady();
      await machine.startSpeaking();
      
      // 连续打断（虽然状态已经是 listening，但不应该出错）
      await machine.interrupt();
      expect(machine.getState()).toBe('listening');
    });
  });
});

describe('状态机性能测试', () => {
  test('大量状态转换性能', async () => {
    const mockContext = {
      startListening: jest.fn(),
      clearResponse: jest.fn(),
      reconnect: jest.fn(),
    };
    const machine = createVoiceChatMachine(mockContext);

    const startTime = Date.now();

    // 执行1000次状态转换
    for (let i = 0; i < 100; i++) {
      await machine.connectionReady();
      await machine.startSpeaking();
      await machine.finishSpeaking();
      await machine.userSpeaking();
      await machine.startSpeaking();
      await machine.finishSpeaking();
      await machine.userSpeaking();
      await machine.interrupt();
      await machine.userSpeaking();
      await machine.startSpeaking();
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`1000次状态转换耗时: ${duration}ms`);
    expect(duration).toBeLessThan(1000); // 应该在1秒内完成
  });
});

