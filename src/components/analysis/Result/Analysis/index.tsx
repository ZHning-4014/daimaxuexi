'use client';

import React, { useState } from 'react';
import { Card } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import styles from './Analysis.module.css';

interface AnalysisProps {
  data: any;
}

const Analysis: React.FC<AnalysisProps> = ({ data }) => {
  const [openKeys, setOpenKeys] = useState<string[]>(['personality', 'values', 'suggestions']);

  // 这里应该根据data生成分析结果
  const analysisData = {
    personality: {
      title: '性格特征分析',
      content: '您的性格特征显示出开放、友善的特点。这表明您容易与人相处,善于倾听他人。'
    },
    values: {
      title: '价值观分析',
      content: '您的价值观体现了对家庭和事业的平衡重视,这有助于建立稳定的关系。'
    },
    suggestions: {
      title: '改进建议',
      content: '建议在沟通方面可以更加主动,适当表达自己的想法和需求。'
    }
  };

  const togglePanel = (key: string) => {
    setOpenKeys(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  return (
    <Card className={styles.analysisCard}>
      <div className={styles.header}>
        <h2>详细分析</h2>
        <p>基于您的测评结果生成的个性化分析</p>
      </div>

      <div className={styles.collapse}>
        {Object.entries(analysisData).map(([key, item]) => (
          <div key={key} className={styles.collapseItem} onClick={() => togglePanel(key)}>
            <div className={styles.collapseHeader}>
              <span className={styles.icon}>{item.title}</span>
              <CaretRightOutlined 
                className={styles.arrow} 
                style={{ 
                  transform: openKeys.includes(key) ? 'rotate(90deg)' : 'none'
                }}
              />
            </div>
            {openKeys.includes(key) && (
              <div className={styles.collapseContent}>
                <div className={styles.panelContent}>
                  {item.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Analysis; 