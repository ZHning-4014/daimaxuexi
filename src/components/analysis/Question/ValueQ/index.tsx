'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Form } from 'antd';
import styles from './ValueQ.module.css';

// 动态导入 antd 组件
const Card = dynamic(() => import('antd/lib/card'), { ssr: false });
const Tag = dynamic(() => import('antd/lib/tag'), { ssr: false });
const Button = dynamic(() => import('antd/lib/button'), { ssr: false });
const Progress = dynamic(() => import('antd/lib/progress'), { ssr: false });
const message = dynamic(() => import('antd/lib/message'), { ssr: false });

// 动态导入图标
const HeartOutlined = dynamic(() => import('@ant-design/icons/HeartOutlined'), { ssr: false });
const HomeOutlined = dynamic(() => import('@ant-design/icons/HomeOutlined'), { ssr: false });
const TrophyOutlined = dynamic(() => import('@ant-design/icons/TrophyOutlined'), { ssr: false });
const TeamOutlined = dynamic(() => import('@ant-design/icons/TeamOutlined'), { ssr: false });
const StarOutlined = dynamic(() => import('@ant-design/icons/StarOutlined'), { ssr: false });
const ArrowLeftOutlined = dynamic(() => import('@ant-design/icons/ArrowLeftOutlined'), { ssr: false });
const CheckCircleOutlined = dynamic(() => import('@ant-design/icons/CheckCircleOutlined'), { ssr: false });

interface ValueCategory {
  category: string;
  icon: React.ReactNode;
  values: string[];
}

interface ValueQProps {
  onFinish: (answers: string[]) => void;
  onPrevious: () => void;
}

// 定义基础数据
const VALUE_DATA = [
  {
    category: '感情价值观',
    icon: <HeartOutlined />,
    values: ['忠诚专一', '浪漫温情', '相互理解', '共同成长', '尊重包容', '真诚沟通']
  },
  {
    category: '家庭价值观',
    icon: <HomeOutlined />,
    values: ['家庭和睦', '共同规划', '责任分担', '教育理念', '亲情关爱', '生活方式']
  },
  {
    category: '事业价值观',
    icon: <TrophyOutlined />,
    values: ['事业进取', '工作平衡', '财务规划', '个人发展', '目标导向', '成就追求']
  },
  {
    category: '社交价值观',
    icon: <TeamOutlined />,
    values: ['社交活跃', '朋友关系', '兴趣爱好', '生活圈子', '社会责任', '人际和谐']
  }
];

const ValueQ: React.FC<ValueQProps> = ({ onFinish, onPrevious }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const minSelection = 4;
  const maxSelection = 10;

  // 使用useMemo缓存数据
  const valueCategories = useMemo(() => VALUE_DATA, []);

  // 初始化时从localStorage恢复数据
  useEffect(() => {
    const savedValues = localStorage.getItem('valueChoices');
    if (savedValues) {
      try {
        const parsed = JSON.parse(savedValues);
        if (Array.isArray(parsed)) {
          setSelectedValues(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved values:', e);
      }
    }
  }, []);

  // 当选择改变时保存到localStorage
  useEffect(() => {
    localStorage.setItem('valueChoices', JSON.stringify(selectedValues));
  }, [selectedValues]);

  // 优化value点击处理函数
  const handleValueClick = useCallback((value: string) => {
    setSelectedValues(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      }
      if (prev.length >= maxSelection) {
        message.warning(`最多只能选择${maxSelection}个价值观特征哦`);
        return prev;
      }
      return [...prev, value];
    });
  }, [maxSelection]);

  // 添加键盘操作支持
  const handleKeyPress = useCallback((e: React.KeyboardEvent, value: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleValueClick(value);
    }
  }, [handleValueClick]);

  const handleSubmit = useCallback(() => {
    if (selectedValues.length < minSelection) {
      message.warning(`请至少选择${minSelection}个价值观特征`);
      return;
    }
    onFinish(selectedValues);
  }, [selectedValues, minSelection, onFinish]);

  const progress = (selectedValues.length / maxSelection) * 100;

  return (
    <div className={styles.container}>
      <Card className={styles.questionCard}>
        <div className={styles.header}>
          <StarOutlined className={styles.headerIcon} />
          <h2>选择最重要的价值观</h2>
          <p>请选择 {minSelection}-{maxSelection} 个最符合你的价值观特征</p>
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

        <div className={styles.valueCategories}>
          {valueCategories.map(category => (
            <div key={category.category} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                {category.icon}
                <span>{category.category}</span>
              </div>
              <div className={styles.valueGroup}>
                {category.values.map(value => (
                  <Tag
                    key={value}
                    className={`${styles.valueTag} ${
                      selectedValues.includes(value) ? styles.selected : ''
                    }`}
                    onClick={() => handleValueClick(value)}
                    onKeyPress={(e) => handleKeyPress(e, value)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedValues.includes(value)}
                  >
                    {selectedValues.includes(value) && (
                      <CheckCircleOutlined className={styles.checkIcon} />
                    )}
                    {value}
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
            disabled={selectedValues.length < minSelection}
            size="large"
          >
            下一步
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ValueQ; 