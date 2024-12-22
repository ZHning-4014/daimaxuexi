'use client';

import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ShareAltOutlined, LoadingOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

// 动态导入 antd 组件
const Button = dynamic(() => import('antd/lib/button'), { ssr: false });
const message = dynamic(() => import('antd/lib/message'), {
  ssr: false,
  loading: () => null
});

interface ShareButtonProps {
  targetRef: React.RefObject<HTMLElement>;
}

const ShareButton: React.FC<ShareButtonProps> = ({ targetRef }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!targetRef.current || isSharing) return;

    try {
      setIsSharing(true);
      
      // 截图配置
      const options: html2canvas.Options = {
        scale: window.devicePixelRatio * 2, // 根据设备像素比提高清晰度
        useCORS: true, // 允许加载跨域图片
        backgroundColor: '#ffffff', // 设置白色背景
        logging: false, // 关闭日志
        allowTaint: true, // 允许加载跨域图片
        foreignObjectRendering: true, // 使用 foreignObject 渲染
        removeContainer: true, // 移除临时创建的容器
      };

      // 生成截图
      const canvas = await html2canvas(targetRef.current, options);
      
      // 转换为Blob
      canvas.toBlob((blob) => {
        if (blob) {
          // 生成文件名
          const date = new Date();
          const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
          const fileName = `匹配结果_${formattedDate}.png`;
          
          // 保存文件
          saveAs(blob, fileName);
          message.success({
            content: '分享图片已保存',
            duration: 2,
            style: {
              marginTop: '64px'
            }
          });
        }
      }, 'image/png', 1.0); // 使用最高质量

    } catch (error) {
      console.error('生成分享图片失败:', error);
      message.error({
        content: '生成分享图片失败，请重试',
        duration: 3,
        style: {
          marginTop: '64px'
        }
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      type="primary"
      icon={isSharing ? <LoadingOutlined /> : <ShareAltOutlined />}
      onClick={handleShare}
      loading={isSharing}
      className="share-button"
      size="large"
    >
      保存分享图
      <style jsx>{`
        :global(.share-button) {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 100;
          height: 48px;
          padding: 0 24px;
          font-size: 16px;
          border-radius: 24px;
          background: linear-gradient(45deg, #ff85c0, #b37feb);
          border: none;
          box-shadow: 0 8px 16px rgba(255, 133, 192, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        :global(.share-button:hover) {
          transform: translateY(-2px);
          box-shadow: 0 12px 20px rgba(255, 133, 192, 0.4);
        }
        :global(.share-button .anticon) {
          font-size: 20px;
        }
        @media (max-width: 768px) {
          :global(.share-button) {
            bottom: 16px;
            right: 16px;
            height: 40px;
            padding: 0 16px;
            font-size: 14px;
          }
          :global(.share-button .anticon) {
            font-size: 16px;
          }
        }
      `}</style>
    </Button>
  );
};

export default ShareButton; 