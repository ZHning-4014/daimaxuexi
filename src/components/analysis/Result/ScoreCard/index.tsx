'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import styles from './ScoreCard.module.css';

// 动态导入antd组件
const Card = dynamic(() => import('antd/lib/card'), { ssr: false });
const Progress = dynamic(() => import('antd/lib/progress'), { ssr: false });

interface ScoreCardProps {
  data: any;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ data }) => {
  // 这里应该根据data计算得分
  const score = 85; // 示例得分

  return (
    <Card className={styles.scoreCard}>
      <div className={styles.header}>
        <h2>匹配得分</h2>
        <p>基于您的测评结果计算的匹配度</p>
      </div>

      <div className={styles.scoreDisplay}>
        <Progress
          type="circle"
          percent={score}
          strokeColor={{
            '0%': '#ff85c0',
            '100%': '#b37feb',
          }}
          format={(percent) => `${percent}分`}
          width={200}
        />
      </div>

      <div className={styles.analysis}>
        <h3>得分解读</h3>
        <p>
          您的匹配得分为{score}分,表现{score >= 80 ? '优秀' : score >= 60 ? '良好' : '一般'}。
          这个得分反映了您在性格特征和价值观方面的整体表现。
        </p>
      </div>
    </Card>
  );
};

export default ScoreCard; 