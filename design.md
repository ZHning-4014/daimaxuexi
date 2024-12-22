# 项目设计文档

## 目录结构

  /src
    /app
      /layout.tsx    # 根布局文件，配置字体等全局设置
      /page.tsx      # 主页面组件
      /globals.css   # 全局样式和Tailwind引入
    /components      # 组件目录（待使用）
    /lib            # 共享工具库（待使用）

## 技术架构

### 核心技术
- Next.js 15.1.1 (采用App Router架构)
  - 服务端渲染框架，提供现代化的开发体验
- React 19
  - 用于构建用户界面的JavaScript库
- TypeScript
  - 添加静态类型检查的JavaScript超集
- Tailwind CSS
  - 原子化CSS框架，提供高效的样式开发

### 开发工具
- ESLint
  - 代码质量检查工具，集成Next.js推荐配置
- PostCSS
  - CSS处理器，用于转换CSS代码
- TypeScript编译器
  - 负责类型检查和代码转译
- 现代化模块打包工具
  - 支持ESM模块系统

## 主要特性

### 样式与主题
- Tailwind CSS集成
  - 提供丰富的原子化样式类
- CSS变量主题系统
  - 支持动态切换主题颜色
- 深色模式支持
  - 自动适应系统颜色模式
- Geist字体集成
  - 优化的网页字体方案
- 响应式设计
  - 适配各种屏幕尺寸

### TypeScript配置
- 启用严格类型检查
- 配置路径别名(@/*)
- 使用现代ESM模块解析
- 保留JSX语法支持Next.js

### 开发体验
- 模块热重载
- TypeScript实时类型检查
- ESLint代码质量控制
- 现代化的导入别名系统
- 开发服务器快速刷新

### 项目配置
- Next.js可扩展配置
- Tailwind覆盖所有应用文件
- PostCSS处理管道
- ESLint集成Next.js最佳实践
- 环境变量支持

## 开发工作流

### 开始使用
1. 安装依赖：`npm install`
2. 启动开发服务器：`npm run dev`
3. 访问地址：http://localhost:3000

### 可用命令
- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 运行生产服务器
- `npm run lint` - 运行代码检查

## 注意事项
- 项目采用现代ESM模块系统
- 同时支持客户端和服务端组件
- 预留了组件和工具库扩展空间
- 内置字体和图片优化功能
- 推荐使用VS Code进行开发，可获得最佳TypeScript支持
- 建议遵循ESLint规则，保持代码风格一致性
- 注意保持良好的Git提交习惯，编写清晰的提交信息