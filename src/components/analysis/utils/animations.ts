import { CSSProperties } from 'react';

// 淡入动画
export const fadeIn = {
  from: { opacity: 0 },
  to: { opacity: 1 },
};

// 向上淡入
export const fadeInUp = {
  from: { opacity: 0, transform: 'translateY(20px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
};

// 向下淡入
export const fadeInDown = {
  from: { opacity: 0, transform: 'translateY(-20px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
};

// 向左淡入
export const fadeInLeft = {
  from: { opacity: 0, transform: 'translateX(20px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
};

// 向右淡入
export const fadeInRight = {
  from: { opacity: 0, transform: 'translateX(-20px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
};

// 缩放淡入
export const zoomIn = {
  from: { opacity: 0, transform: 'scale(0.95)' },
  to: { opacity: 1, transform: 'scale(1)' },
};

// 动画时间配置
export const animationConfig = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

// 生成动画样式
export const generateAnimationStyle = (
  animation: typeof fadeIn,
  duration: number = animationConfig.duration.normal,
  easing: string = animationConfig.easing.easeInOut,
  delay: number = 0
): CSSProperties => ({
  animation: `${duration}ms ${easing} ${delay}ms forwards running`,
  opacity: 0, // 初始状态
});

// 生成关键帧动画名称
export const generateKeyframes = (name: string, animation: typeof fadeIn): string => `
  @keyframes ${name} {
    from {
      ${Object.entries(animation.from)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n      ')}
    }
    to {
      ${Object.entries(animation.to)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n      ')}
    }
  }
`;

// 步骤切换动画配置
export const stepTransition = {
  enter: {
    ...fadeInRight,
    duration: animationConfig.duration.normal,
    easing: animationConfig.easing.easeOut,
  },
  exit: {
    from: { opacity: 1, transform: 'translateX(0)' },
    to: { opacity: 0, transform: 'translateX(-20px)' },
    duration: animationConfig.duration.normal,
    easing: animationConfig.easing.easeIn,
  },
};

// 结果展示动画配置
export const resultAnimation = {
  scoreCard: {
    ...zoomIn,
    duration: animationConfig.duration.slow,
    delay: 200,
  },
  analysis: {
    ...fadeInUp,
    duration: animationConfig.duration.slow,
    delay: 500,
  },
  shareCard: {
    ...fadeInUp,
    duration: animationConfig.duration.slow,
    delay: 800,
  },
}; 