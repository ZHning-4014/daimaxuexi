'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import message from 'antd/lib/message';
import styles from './PersonalityQ.module.css';

// 动态导入 antd 组件
const Card = dynamic(() => import('antd/lib/card'), { ssr: false });
const Tag = dynamic(() => import('antd/lib/tag'), { ssr: false });
const Button = dynamic(() => import('antd/lib/button'), { ssr: false });
const Progress = dynamic(() => import('antd/lib/progress'), { ssr: false });

// 动态导入图标
const HeartOutlined = dynamic(() => import('@ant-design/icons/HeartOutlined'), { ssr: false });
const SmileOutlined = dynamic(() => import('@ant-design/icons/SmileOutlined'), { ssr: false });
const ThunderboltOutlined = dynamic(() => import('@ant-design/icons/ThunderboltOutlined'), { ssr: false });
const BulbOutlined = dynamic(() => import('@ant-design/icons/BulbOutlined'), { ssr: false });
const TeamOutlined = dynamic(() => import('@ant-design/icons/TeamOutlined'), { ssr: false });
const StarOutlined = dynamic(() => import('@ant-design/icons/StarOutlined'), { ssr: false });
const ArrowLeftOutlined = dynamic(() => import('@ant-design/icons/ArrowLeftOutlined'), { ssr: false });
const CheckCircleOutlined = dynamic(() => import('@ant-design/icons/CheckCircleOutlined'), { ssr: false });

interface PersonalityCategory {
  category: string;
  icon: React.ReactNode;
  traits: string[];
}

interface PersonalityQProps {
  onFinish: (answers: string[]) => void;
  onPrevious: () => void;
}

// 定义基础数据
const PERSONALITY_DATA = [
  { 
    category: '性格特征',
    icon: <SmileOutlined />,
    traits: ['开朗', '内向', '乐观', '谨慎', '活泼', '稳重']
  },
  {
    category: '情感特质',
    icon: <HeartOutlined />,
    traits: ['浪漫', '理性', '感性', '专一', '细腻', '直率']
  },
  {
    category: '行为模式',
    icon: <ThunderboltOutlined />,
    traits: ['果断', '随性', '计划', '灵活', '主动', '随和']
  },
  {
    category: '思维方式',
    icon: <BulbOutlined />,
    traits: ['创新', '务实', '理想', '现实', '分析', '直觉']
  },
  {
    category: '社交倾向',
    icon: <TeamOutlined />,
    traits: ['外向', '独处', '群体', '独立', '合作', '自主']
  }
];

const PersonalityQ: React.FC<PersonalityQProps> = ({ onFinish, onPrevious }) => {
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const minSelection = 3;
  const maxSelection = 8;

  // 使用useMemo缓存personalityTraits
  const personalityTraits = useMemo(() => PERSONALITY_DATA, []);

  // 初始化时从localStorage恢复数据
  useEffect(() => {
    const savedTraits = localStorage.getItem('personalityTraits');
    if (savedTraits) {
      try {
        const parsed = JSON.parse(savedTraits);
        if (Array.isArray(parsed)) {
          setSelectedTraits(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved traits:', e);
      }
    }
  }, []);

  // 当选择改变时保存到localStorage
  useEffect(() => {
    localStorage.setItem('personalityTraits', JSON.stringify(selectedTraits));
  }, [selectedTraits]);

  useEffect(() => {
    message.config({
      top: 64,
      duration: 2,
      maxCount: 3,
    });
  }, []);

  // 优化trait点击处理函数
  const handleTraitClick = useCallback((trait: string) => {
    setSelectedTraits(prev => {
      if (prev.includes(trait)) {
        return prev.filter(t => t !== trait);
      }
      if (prev.length >= maxSelection) {
        message.warning(`最多只能选择${maxSelection}个特征哦`);
        return prev;
      }
      return [...prev, trait];
    });
  }, [maxSelection]);

  // 添加键盘操作支持
  const handleKeyPress = useCallback((e: React.KeyboardEvent, trait: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTraitClick(trait);
    }
  }, [handleTraitClick]);

  const handleSubmit = useCallback(() => {
    if (selectedTraits.length < minSelection) {
      message.warning(`请至少选择${minSelection}个性格特征`);
      return;
    }
    onFinish(selectedTraits);
  }, [selectedTraits, minSelection, onFinish]);

  const progress = (selectedTraits.length / maxSelection) * 100;

  return (
    <div className={styles.container}>
      <Card className={styles.questionCard}>
        <div className={styles.header}>
          <StarOutlined className={styles.headerIcon} />
          <h2>选择最能代表你的性格特征</h2>
          <p>请选择 {minSelection}-{maxSelection} 个最符合你的特征</p>
        </div>

        <Progress 
          percent={progress} 
          strokeColor={{
            '0%': '#ff85c0',
            '100%': '#b37feb',
          }}
          className={styles.progress}
          showInfo={false}
        />

        <div className={styles.traitCategories}>
          {personalityTraits.map(category => (
            <div key={category.category} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                {category.icon}
                <span>{category.category}</span>
              </div>
              <div className={styles.traitGroup}>
                {category.traits.map(trait => (
                  <Tag
                    key={trait}
                    className={`${styles.traitTag} ${
                      selectedTraits.includes(trait) ? styles.selected : ''
                    }`}
                    onClick={() => handleTraitClick(trait)}
                    onKeyPress={(e) => handleKeyPress(e, trait)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedTraits.includes(trait)}
                  >
                    {selectedTraits.includes(trait) && (
                      <CheckCircleOutlined className={styles.checkIcon} />
                    )}
                    {trait}
                  </Tag>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={onPrevious}
            className={styles.prevButton}
            size="large"
          >
            返回上一步
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            className={styles.submitButton}
            disabled={selectedTraits.length < minSelection}
            size="large"
          >
            下一步
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PersonalityQ; 