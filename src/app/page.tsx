'use client';

import React from 'react';
import { Button, Typography } from 'antd';
import Link from 'next/link';
import { HeartFilled } from '@ant-design/icons';
import styles from './page.module.css';

const { Title, Text } = Typography;

const HomePage = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.content}>
        <HeartFilled className={styles.heartIcon} />
        <Title level={1}>寻找真爱</Title>
        <Text className={styles.subtitle}>
          通过科学的性格测评，找到最适合你的另一半
        </Text>
        <Link href="/test" className={styles.startButtonLink}>
          <Button type="primary" size="large" className={styles.startButton}>
            开始测试
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
