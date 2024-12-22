import type { BasicInfoValues } from '../Question/BasicInfo';

// 存储键名定义
const STORAGE_KEYS = {
  TEST_DATA: 'love_match_test_data',
  HISTORY: 'love_match_history',
} as const;

// 测评数据类型定义
export interface TestData {
  basicInfo: BasicInfoValues;
  personalityAnswers: Record<string, string>;
  valueAnswers: Record<string, number>;
  timestamp?: number;
}

// 历史记录类型定义
export interface HistoryRecord extends TestData {
  totalScore: number;
  dimensions: {
    name: string;
    score: number;
    maxScore: number;
    weight: number;
  }[];
  timestamp: number;
}

// 保存测评数据
export const saveTestData = (data: TestData) => {
  try {
    const saveData = {
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.TEST_DATA, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error('保存测评数据失败:', error);
    return false;
  }
};

// 获取测评数据
export const getTestData = (): TestData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEST_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('获取测评数据失败:', error);
    return null;
  }
};

// 清除测评数据
export const clearTestData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TEST_DATA);
    return true;
  } catch (error) {
    console.error('清除测评数据失败:', error);
    return false;
  }
};

// 保存历史记录
export const saveHistory = (record: HistoryRecord) => {
  try {
    const history = getHistory();
    const newHistory = [record, ...history].slice(0, 10); // 只保留最近10条记录
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
    return true;
  } catch (error) {
    console.error('保存历史记录失败:', error);
    return false;
  }
};

// 获取历史记录
export const getHistory = (): HistoryRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取历史记录失败:', error);
    return [];
  }
};

// 清除历史记录
export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    return true;
  } catch (error) {
    console.error('清除历史记录失败:', error);
    return false;
  }
};

// 检查是否有未完成的测评
export const hasUnfinishedTest = (): boolean => {
  const testData = getTestData();
  if (!testData) return false;

  // 检查是否所有必要数据都已填写
  const hasBasicInfo = Object.values(testData.basicInfo).every(value => value);
  const hasPersonalityAnswers = Object.keys(testData.personalityAnswers).length > 0;
  const hasValueAnswers = Object.keys(testData.valueAnswers).length > 0;

  return hasBasicInfo || hasPersonalityAnswers || hasValueAnswers;
};

// 检查数据是否过期
export const isDataExpired = (timestamp: number): boolean => {
  const now = Date.now();
  const expirationTime = 24 * 60 * 60 * 1000; // 24小时
  return now - timestamp > expirationTime;
}; 