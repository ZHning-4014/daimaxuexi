'use client';

import React from 'react';
import PersonalityQ from '@/components/analysis/Question/PersonalityQ';
import { useRouter } from 'next/navigation';

const PersonalityPage = () => {
  const router = useRouter();

  const handleFinish = (values: any) => {
    console.log('性格测评结果:', values);
    // TODO: 处理测评结果，跳转到结果页面
    router.push('/test/result');
  };

  const handlePrevious = () => {
    router.push('/');
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffd6e7 0%, #fff4e6 50%, #f0f5ff 100%)',
      padding: '20px'
    }}>
      <PersonalityQ 
        onFinish={handleFinish}
        onPrevious={handlePrevious}
      />
    </div>
  );
};

export default PersonalityPage; 