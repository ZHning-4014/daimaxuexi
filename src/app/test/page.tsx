'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ReloadOutlined, HeartFilled, SmileOutlined, StarOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';
import BasicInfo from '@/components/analysis/Question/BasicInfo';
import PersonalityQ from '@/components/analysis/Question/PersonalityQ';
import ValueQ from '@/components/analysis/Question/ValueQ';
import PartnerQ from '@/components/analysis/Question/PartnerQ';
import ScoreCard from '@/components/analysis/Result/ScoreCard';
import Analysis from '@/components/analysis/Result/Analysis';
import ShareButton from '@/components/analysis/Result/ShareButton';

// 动态导入 antd 组件
const Card = dynamic(() => import('antd/lib/card'), { ssr: false });
const Steps = dynamic(() => import('antd/lib/steps'), { ssr: false });
const Button = dynamic(() => import('antd/lib/button'), { ssr: false });
const ConfigProvider = dynamic(() => import('antd/lib/config-provider'), { ssr: false });

interface BasicInfo {
  nickname: string;
  age: number;
  gender: 'male' | 'female';
  city: string;
}

interface PersonalityAnswers {
  [key: string]: string[];
}

interface ValueAnswers {
  [key: string]: string[];
}

interface PartnerPreference {
  ageRange: [number, number];
  traits: string[];
}

interface TestData {
  basicInfo: BasicInfo | null;
  personalityAnswers: PersonalityAnswers | null;
  valueAnswers: ValueAnswers | null;
  partnerPreference: PartnerPreference | null;
}

interface Suggestion {
  type: 'strength' | 'weakness';
  content: string;
}

interface Dimension {
  name: string;
  score: number;
  maxScore: number;
  suggestions: Suggestion[];
}

interface Analysis {
  overall: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

interface TestResult {
  score: number;
  dimensions: Dimension[];
  analysis: Analysis;
}

const steps = [
  {
    title: '基本信息',
    description: '填写个人基本信息',
    icon: <SmileOutlined />
  },
  {
    title: '性格测评',
    description: '了解性格特征',
    icon: <StarOutlined />
  },
  {
    title: '价值观测评',
    description: '了解价值观倾向',
    icon: <HeartFilled />
  },
  {
    title: '伴侣期望',
    description: '期望伴侣特征',
    icon: <TeamOutlined />
  },
  {
    title: '分析结果',
    description: '查看测评结果',
    icon: <TrophyOutlined />
  }
];

const TestPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [testData, setTestData] = useState<TestData>({
    basicInfo: null,
    personalityAnswers: null,
    valueAnswers: null,
    partnerPreference: null
  });
  const [result, setResult] = useState<TestResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleBasicInfoFinish = (values: BasicInfo) => {
    setTestData(prev => ({ ...prev, basicInfo: values }));
    setCurrentStep(1);
  };

  const handlePersonalityFinish = (answers: PersonalityAnswers) => {
    setTestData(prev => ({ ...prev, personalityAnswers: answers }));
    setCurrentStep(2);
  };

  const handleValueFinish = (answers: ValueAnswers) => {
    setTestData(prev => ({ ...prev, valueAnswers: answers }));
    setCurrentStep(3);
  };

  const handlePartnerFinish = async (preference: PartnerPreference) => {
    setTestData(prev => ({ ...prev, partnerPreference: preference }));
    // 这里可以调用API生成分析结果
    const mockResult: TestResult = {
      score: 85,
      dimensions: [
        {
          name: '性格匹配度',
          score: 88,
          maxScore: 100,
          suggestions: [
            { type: 'strength', content: '性格开朗,善于交际' },
            { type: 'weakness', content: '可以提高耐心' }
          ]
        },
        {
          name: '价值观匹配度',
          score: 82,
          maxScore: 100,
          suggestions: [
            { type: 'strength', content: '三观契合度高' },
            { type: 'weakness', content: '在金钱观念上存在分歧' }
          ]
        }
      ],
      analysis: {
        overall: '根据您的测评结果,您是一个性格开朗、重视家庭的人。在择偶方面,您比较注重对方的性格特征和价值观念,这有助于建立长期稳定的关系。',
        strengths: [
          '性格开朗,容易相处',
          '价值观念清晰',
          '有责任心'
        ],
        weaknesses: [
          '对伴侣要求较高',
          '有时过于理想化'
        ],
        suggestions: [
          '建议在择偶时保持开放心态',
          '关注对方的整体特质而不是局部',
          '在相处过程中多沟通理解'
        ]
      }
    };
    
    setResult(mockResult);
    setCurrentStep(4);
  };

  const handleRetest = () => {
    setTestData({
      basicInfo: null,
      personalityAnswers: null,
      valueAnswers: null,
      partnerPreference: null
    });
    setResult(null);
    setCurrentStep(0);
  };

  const handlePrevious = () => {
    if (currentStep === 0) {
      router.push('/');
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfo onFinish={handleBasicInfoFinish} />;
      case 1:
        return <PersonalityQ onFinish={handlePersonalityFinish} onPrevious={handlePrevious} />;
      case 2:
        return <ValueQ onFinish={handleValueFinish} onPrevious={handlePrevious} />;
      case 3:
        return <PartnerQ onFinish={handlePartnerFinish} onPrevious={handlePrevious} />;
      case 4:
        return result && (
          <>
            <div className="result-container" ref={resultRef}>
              <ScoreCard score={result.score} dimensions={result.dimensions} />
              <div className="analysis-wrapper">
                <Analysis analysis={result.analysis} dimensions={result.dimensions} />
              </div>
            </div>
            <div className="action-buttons">
              <Button 
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRetest}
                size="large"
                className="cute-button"
              >
                重新测试
              </Button>
              <ShareButton targetRef={resultRef} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ff85c0',
          borderRadius: 16,
          colorBgContainer: 'rgba(255, 255, 255, 0.95)',
        },
        components: {
          Card: {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
          Button: {
            primaryColor: '#ff85c0',
            borderRadius: 24,
          },
          Steps: {
            titleLineHeight: 24,
            customIconSize: 32,
            iconSize: 32,
          }
        }
      }}
    >
      <div className="test-page">
        <Card className="test-card">
          <Steps
            current={currentStep}
            items={steps}
            className="steps"
          />
          <div className="content">
            {renderContent()}
          </div>
        </Card>

        <style jsx>{`
          .test-page {
            min-height: 100vh;
            padding: 40px 24px;
            background: linear-gradient(135deg, #ffd6e7 0%, #fff4e6 50%, #f0f5ff 100%);
            display: flex;
            justify-content: center;
            align-items: flex-start;
          }
          .test-card {
            max-width: 1200px;
            width: 100%;
            margin: 0 auto;
            backdrop-filter: blur(20px);
            animation: fadeIn 0.5s ease-out;
          }
          .steps {
            margin: 12px 0 32px;
          }
          .content {
            min-height: 400px;
            padding: 24px 0;
          }
          .result-container {
            display: flex;
            flex-direction: column;
            gap: 32px;
            animation: slideUp 0.5s ease-out;
          }
          .analysis-wrapper {
            margin-top: 32px;
          }
          .action-buttons {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-top: 48px;
            padding-bottom: 40px;
          }
          :global(.cute-button) {
            font-size: 16px;
            height: 48px;
            padding: 0 32px;
            border-radius: 24px;
            display: flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(45deg, #ff85c0, #b37feb);
            border: none;
            box-shadow: 0 8px 16px rgba(255, 133, 192, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          :global(.cute-button:hover) {
            transform: translateY(-2px);
            box-shadow: 0 12px 20px rgba(255, 133, 192, 0.4);
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @media (max-width: 768px) {
            .test-page {
              padding: 20px 12px;
            }
            .test-card {
              border-radius: 24px;
            }
            .content {
              padding: 16px 0;
            }
            .action-buttons {
              flex-direction: column;
              padding: 0 20px 32px;
            }
            :global(.cute-button) {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
};

export default TestPage; 