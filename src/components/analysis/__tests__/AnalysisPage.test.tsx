import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnalysisPage from '../index';
import * as storage from '../utils/storage';

// Mock storage module
jest.mock('../utils/storage');
const mockedStorage = storage as jest.Mocked<typeof storage>;

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('AnalysisPage', () => {
  beforeEach(() => {
    // 清除所有mock的实现
    jest.clearAllMocks();
    
    // 设置默认的mock返回值
    mockedStorage.getTestData.mockReturnValue(null);
    mockedStorage.getHistory.mockReturnValue([]);
    mockedStorage.hasUnfinishedTest.mockReturnValue(false);
  });

  it('应该正确渲染初始状态', () => {
    render(<AnalysisPage />);

    // 验证步骤指示器
    expect(screen.getByText('基本信息')).toBeInTheDocument();
    expect(screen.getByText('性格测评')).toBeInTheDocument();
    expect(screen.getByText('价值观测评')).toBeInTheDocument();
    expect(screen.getByText('查看结果')).toBeInTheDocument();

    // 验证基本信息表单
    expect(screen.getByLabelText('姓名')).toBeInTheDocument();
    expect(screen.getByLabelText('性别')).toBeInTheDocument();
    expect(screen.getByLabelText('出生日期')).toBeInTheDocument();
    expect(screen.getByLabelText('手机号码')).toBeInTheDocument();
  });

  it('应该能提交基本信息并进入下一步', async () => {
    render(<AnalysisPage />);

    // 填写基本信息
    await userEvent.type(screen.getByLabelText('姓名'), '测试用户');
    await userEvent.type(screen.getByLabelText('手机号码'), '13800138000');
    
    // 选择性别
    const genderSelect = screen.getByLabelText('性别');
    fireEvent.mouseDown(genderSelect);
    const maleOption = screen.getByText('男');
    fireEvent.click(maleOption);

    // 选择日期
    const dateInput = screen.getByLabelText('出生日期');
    fireEvent.mouseDown(dateInput);
    // 这里需要根据日期选择器的具体实现来模拟选择日期

    // 提交表单
    const submitButton = screen.getByText('下一步');
    fireEvent.click(submitButton);

    // 验证数据保存
    await waitFor(() => {
      expect(mockedStorage.saveTestData).toHaveBeenCalled();
    });

    // 验证页面切换
    await waitFor(() => {
      expect(screen.queryByText('性格测评')).toBeInTheDocument();
    });
  });

  it('应该检查未完成的测评', async () => {
    // 模拟有未完成的测评
    mockedStorage.hasUnfinishedTest.mockReturnValue(true);
    mockedStorage.getTestData.mockReturnValue({
      basicInfo: {
        name: '测试用户',
        gender: 'male',
        birthDate: '2000-01-01',
        phone: '13800138000'
      },
      personalityAnswers: {
        'p1': 'A'
      },
      valueAnswers: {},
      timestamp: Date.now()
    });

    render(<AnalysisPage />);

    // 验证提示对话框
    await waitFor(() => {
      expect(screen.getByText('发现未完成的测评')).toBeInTheDocument();
    });

    // 点击继续
    const continueButton = screen.getByText('继续');
    fireEvent.click(continueButton);

    // 验证数据恢复
    await waitFor(() => {
      expect(screen.getByText('性格测评')).toBeInTheDocument();
    });
  });

  it('应该能显示历史记录', async () => {
    // 模拟历史记录数据
    mockedStorage.getHistory.mockReturnValue([
      {
        basicInfo: {
          name: '历史用户',
          gender: 'male',
          birthDate: '2000-01-01',
          phone: '13800138000'
        },
        personalityAnswers: {},
        valueAnswers: {},
        totalScore: 85,
        dimensions: [
          {
            name: '性格匹配度',
            score: 80,
            maxScore: 100,
            weight: 0.4
          }
        ],
        timestamp: Date.now()
      }
    ]);

    render(<AnalysisPage />);

    // 完成测评流程
    // ... 填写并提交所有步骤的表单

    // 切换到历史记录标签
    const historyTab = screen.getByText('历史记录');
    fireEvent.click(historyTab);

    // 验证历史记录显示
    await waitFor(() => {
      expect(screen.getByText('历史用户')).toBeInTheDocument();
      expect(screen.getByText('85分')).toBeInTheDocument();
    });
  });

  it('应该能重新开始测评', async () => {
    render(<AnalysisPage />);

    // 完成测评流程
    // ... 填写并提交所有步骤的表单

    // 点击重新测试按钮
    const retakeButton = screen.getByText('重新测试');
    fireEvent.click(retakeButton);

    // 验证确认对话框
    await waitFor(() => {
      expect(screen.getByText('确定要重新测试吗？')).toBeInTheDocument();
    });

    // 确认重新测试
    const confirmButton = screen.getByText('确定');
    fireEvent.click(confirmButton);

    // 验证返回初始状态
    await waitFor(() => {
      expect(screen.getByLabelText('姓名')).toBeInTheDocument();
      expect(mockedStorage.clearTestData).toHaveBeenCalled();
    });
  });

  it('应该正确处理数据加载错误', () => {
    // 模拟localStorage错误
    mockedStorage.getTestData.mockImplementation(() => {
      throw new Error('Storage error');
    });

    render(<AnalysisPage />);

    // 验证页面仍然正常渲染
    expect(screen.getByText('基本信息')).toBeInTheDocument();
  });
}); 