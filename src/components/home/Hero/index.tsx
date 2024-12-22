'use client';

import Image from 'next/image';
import { CTAButton } from './CTAButton';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
}

export function Hero({ title, subtitle, ctaText }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  // 添加时间状态
  const [time, setTime] = useState<string>('');

  // 更新时间的效果
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    // 立即更新一次
    updateTime();
    
    // 每秒更新一次
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 时间显示区域 */}
      <motion.div 
        className="absolute top-8 right-8 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <motion.div
          className="text-text-primary font-mono text-xl"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {time}
        </motion.div>
      </motion.div>

      {/* 背景装饰 */}
      <motion.div style={{ opacity }} className="absolute inset-0">
        {/* 渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        
        {/* 装饰圆圈 */}
        <motion.div
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 right-[10%] w-48 h-48 rounded-full bg-secondary/5 blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>
      
      {/* 内容区域 */}
      <motion.div 
        style={{ scale }}
        className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16"
      >
        {/* 左侧文本区域 */}
        <div className="flex-1 text-center lg:text-left relative">
          {/* 装饰线条 */}
          <div className="absolute -left-4 top-0 w-1 h-24 bg-gradient-to-b from-primary/30 to-transparent hidden lg:block" />
          
          <motion.h1 
            className="text-heading-1 font-bold mb-6 text-text-primary relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="relative">
              {title}
              <motion.span 
                className="absolute -right-6 -top-6 text-accent text-4xl"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-body-lg mb-10 text-text-secondary max-w-2xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
          
          {/* 特性列表 */}
          <motion.ul 
            className="mb-10 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { icon: "✨", text: "AI深度分析，准确率高达95%" },
              { icon: "🔒", text: "数据安全加密，隐私严格保护" },
              { icon: "⚡", text: "快速测评，3分钟获取专业报告" }
            ].map((item, index) => (
              <motion.li 
                key={index}
                className="flex items-center text-text-secondary bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ x: 10 }}
              >
                <span className="mr-4 text-2xl">{item.icon}</span>
                <span>{item.text}</span>
              </motion.li>
            ))}
          </motion.ul>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <CTAButton text={ctaText} />
          </motion.div>
        </div>
        
        {/* 右侧图片区域 */}
        <motion.div 
          className="flex-1 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="relative w-full aspect-square">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl" />
            <Image
              src="/hero-image.svg"
              alt="AI爱情测评展示"
              fill
              className="object-contain relative z-10"
              priority
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
} 