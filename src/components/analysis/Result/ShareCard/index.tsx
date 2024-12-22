'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import styles from './ShareCard.module.css';

// 动态导入antd组件
const Card = dynamic(() => import('antd/lib/card'), { ssr: false });
const Button = dynamic(() => import('antd/lib/button'), { ssr: false });
const message = dynamic(() => import('antd/lib/message'), { ssr: false });

// 动态导入图标
const ShareAltOutlined = dynamic(() => import('@ant-design/icons/ShareAltOutlined'), { ssr: false });

interface ShareCardProps {
  data: any;
}

const ShareCard: React.FC<ShareCardProps> = ({ data }) => {
  const handleShare = () => {
    // 这里应该实现分享功能
    message.success('分享功能开发中...');
  };

  return (
    <Card className={styles.shareCard}>
      <div className={styles.header}>
        <h2>分享结果</h2>
        <p>与好友分享您的测评结果</p>
      </div>

      <div className={styles.content}>
        <p>分享您的测评结果,获取更多见解和建议。</p>
        <Button
          type="primary"
          icon={<ShareAltOutlined />}
          onClick={handleShare}
          className={styles.shareButton}
          size="large"
        >
          分享结果
        </Button>
      </div>
    </Card>
  );
};

export default ShareCard; 