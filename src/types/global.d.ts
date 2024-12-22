declare module 'antd' {
  export * from 'antd';
}

declare module '@ant-design/icons' {
  import * as React from 'react';
  
  export interface IconComponentProps {
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    style?: React.CSSProperties;
    [key: string]: any;
  }

  export interface CustomIconComponentProps {
    width: string | number;
    height: string | number;
    fill: string;
    viewBox?: string;
    className?: string;
    style?: React.CSSProperties;
  }

  export type IconType = React.ComponentType<IconComponentProps>;

  export {
    TrophyOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    StarOutlined,
    ReloadOutlined,
    FullscreenOutlined,
    CloseOutlined,
    QuestionCircleOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined
  } from '@ant-design/icons';
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
} 