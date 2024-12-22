'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Steps, message } from 'antd';

// 动态导入组件
const BasicInfo = dynamic(() => import('./Question/BasicInfo'), { ssr: false });
const PersonalityQ = dynamic(() => import('./Question/PersonalityQ'), { ssr: false });
const ValueQ = dynamic(() => import('./Question/ValueQ'), { ssr: false });
const ScoreCard = dynamic(() => import('./Result/ScoreCard'), { ssr: false });
const Analysis = dynamic(() => import('./Result/Analysis'), { ssr: false });
const ShareCard = dynamic(() => import('./Result/ShareCard'), { ssr: false });
const History = dynamic(() => import('./Result/History'), { ssr: false });
const Button = dynamic(() => import('antd/lib/button'), { ssr: false });
const Card = dynamic(() => import('antd/lib/card'), { ssr: false });
const Modal = dynamic(() => import('antd/lib/modal'), { ssr: false });
const Tabs = dynamic(() => import('antd/lib/tabs'), { ssr: false });
const Spin = dynamic(() => import('antd/lib/spin'), { ssr: false });
const Alert = dynamic(() => import('antd/lib/alert'), { ssr: false });

// 定义测评步骤
const steps = [
  {
    title: '基本信息',
    content: 'BasicInfo',
    description: '填写个人基本信息'
  },
  {
    title: '性格测评',
    content: 'PersonalityQ',
    description: '了解性格特征'
  },
  {
    title: '价值观测评',
    content: 'ValueQ',
    description: '探索价值观念'
  },
  {
    title: '查看结果',
    content: 'Result',
    description: '分析匹配结果'
  },
];

// 测评数据类型定义
interface TestData {
  basicInfo: any;
  personalityAnswers: Record<string, string>;
  valueAnswers: Record<string, number>;
}

const AnalysisPage: React.FC = () => {
  // 当前步骤
  const [current, setCurrent] = useState(0);
  
  // 加载状态
  const [loading, setLoading] = useState(false);
  
  // 测评数据
  const [testData, setTestData] = useState<TestData>({
    basicInfo: {
      name: '',
      gender: 'male',
      birthDate: '',
      phone: '',
    },
    personalityAnswers: {},
    valueAnswers: {},
  });

  // 处理基本信息提交
  const handleBasicInfoSubmit = async (values: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTestData = {
        ...testData,
        basicInfo: values
      };
      setTestData(newTestData);
      setCurrent(prev => prev + 1);
    } catch (error) {
      message.error('提交失败,请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理性格测评答案
  const handlePersonalitySubmit = async (answers: string[]) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTestData = {
        ...testData,
        personalityAnswers: answers
      };
      setTestData(newTestData);
      setCurrent(prev => prev + 1);
    } catch (error) {
      message.error('提交失败,请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理价值观测评答案
  const handleValueSubmit = async (answers: string[]) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTestData = {
        ...testData,
        valueAnswers: answers
      };
      setTestData(newTestData);
      setCurrent(prev => prev + 1);
    } catch (error) {
      message.error('提交失败,请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理返回上一步
  const handlePrevious = () => {
    setCurrent(prev => prev - 1);
  };

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (current) {
      case 0:
        return (
          <BasicInfo 
            onFinish={handleBasicInfoSubmit}
          />
        );
      case 1:
        return (
          <PersonalityQ
            onFinish={handlePersonalitySubmit}
            onPrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <ValueQ
            onFinish={handleValueSubmit}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <div>
            <ScoreCard data={testData} />
            <Analysis data={testData} />
            <ShareCard data={testData} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Steps
        current={current}
        items={steps}
      />
      <div style={{ marginTop: 24 }}>
        {renderStepContent()}
      </div>
    </div>
  );
};

export default AnalysisPage; 