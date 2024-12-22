'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CTAButtonProps {
  text: string;
}

export function CTAButton({ text }: CTAButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="
        relative group
        bg-primary text-white px-8 py-4 rounded-full
        text-[16px] font-semibold 
        hover:bg-primary/90 transition-colors
        shadow-lg hover:shadow-xl
        flex items-center gap-3
        overflow-hidden
      "
      onClick={() => console.log("开始测试")}
    >
      {/* 背景动画 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary"
        animate={{
          x: ['0%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          opacity: 0.5,
        }}
      />
      
      {/* 按钮内容 */}
      <span className="relative z-10">{text}</span>
      <motion.span 
        className="relative z-10 text-xl"
        animate={{ x: [0, 5, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        →
      </motion.span>
    </motion.button>
  );
} 