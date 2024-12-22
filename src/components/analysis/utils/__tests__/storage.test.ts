import {
  saveTestData,
  getTestData,
  clearTestData,
  saveHistory,
  getHistory,
  clearHistory,
  hasUnfinishedTest,
  isDataExpired,
  TestData,
  HistoryRecord
} from '../storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key],
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  const mockTestData: TestData = {
    basicInfo: {
      name: '测试用户',
      gender: 'male',
      birthDate: '2000-01-01',
      phone: '13800138000'
    },
    personalityAnswers: {
      'p1': 'A',
      'p2': 'B'
    },
    valueAnswers: {
      'v1': 4,
      'v2': 5
    }
  };

  const mockHistoryRecord: HistoryRecord = {
    ...mockTestData,
    totalScore: 85,
    dimensions: [
      {
        name: '性格匹配度',
        score: 80,
        maxScore: 100,
        weight: 0.4
      },
      {
        name: '价值观契合度',
        score: 90,
        maxScore: 100,
        weight: 0.6
      }
    ],
    timestamp: Date.now()
  };

  describe('测评数据存储', () => {
    it('应该能保存和获取测评数据', () => {
      expect(saveTestData(mockTestData)).toBe(true);
      
      const savedData = getTestData();
      expect(savedData).toBeTruthy();
      expect(savedData?.basicInfo.name).toBe(mockTestData.basicInfo.name);
      expect(savedData?.personalityAnswers).toEqual(mockTestData.personalityAnswers);
      expect(savedData?.valueAnswers).toEqual(mockTestData.valueAnswers);
    });

    it('应该能清除测评数据', () => {
      saveTestData(mockTestData);
      expect(clearTestData()).toBe(true);
      expect(getTestData()).toBeNull();
    });

    it('应该正确处理localStorage错误', () => {
      // 模拟localStorage错误
      jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(saveTestData(mockTestData)).toBe(false);
    });
  });

  describe('历史记录存储', () => {
    it('应该能保存和获取历史记录', () => {
      expect(saveHistory(mockHistoryRecord)).toBe(true);
      
      const history = getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].totalScore).toBe(mockHistoryRecord.totalScore);
    });

    it('应该只保留最近的10条记录', () => {
      // 保存11条记录
      for (let i = 0; i < 11; i++) {
        saveHistory({
          ...mockHistoryRecord,
          totalScore: i,
          timestamp: Date.now() + i
        });
      }

      const history = getHistory();
      expect(history).toHaveLength(10);
      // 验证是最新的10条
      expect(history[0].totalScore).toBe(10);
    });

    it('应该能清除历史记录', () => {
      saveHistory(mockHistoryRecord);
      expect(clearHistory()).toBe(true);
      expect(getHistory()).toHaveLength(0);
    });
  });

  describe('未完成测评检查', () => {
    it('应该正确识别未完成的测评', () => {
      // 没有数据时
      expect(hasUnfinishedTest()).toBe(false);

      // 只有基本信息时
      saveTestData({
        ...mockTestData,
        personalityAnswers: {},
        valueAnswers: {}
      });
      expect(hasUnfinishedTest()).toBe(true);

      // 完整数据时
      saveTestData(mockTestData);
      expect(hasUnfinishedTest()).toBe(true);
    });
  });

  describe('数据过期检查', () => {
    it('应该正确判断数据是否过期', () => {
      const now = Date.now();
      const oneDayAgo = now - 25 * 60 * 60 * 1000; // 25小时前
      const recentTime = now - 1 * 60 * 60 * 1000; // 1小时前

      expect(isDataExpired(oneDayAgo)).toBe(true);
      expect(isDataExpired(recentTime)).toBe(false);
    });
  });
}); 