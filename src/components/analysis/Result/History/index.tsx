import React, { useRef, useEffect } from 'react';
import { Card, List, Tag, Typography, Empty, Button, Popconfirm } from 'antd';
import { motion } from 'framer-motion';
import { 
  HistoryOutlined, 
  DeleteOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import type { HistoryRecord } from '../../utils/storage';
import { clearHistory } from '../../utils/storage';
import { useVirtualList, usePerformanceMonitor } from '../../utils/performance';

const { Title, Text } = Typography;

interface HistoryProps {
  records: HistoryRecord[];
  onClear: () => void;
  onRetake: (record: HistoryRecord) => void;
}

const ITEM_HEIGHT = 120; // 每个列表项的高度
const CONTAINER_HEIGHT = 600; // 容器高度

const History: React.FC<HistoryProps> = ({ records, onClear, onRetake }) => {
  // 性能监控
  usePerformanceMonitor('History');

  // 容器引用
  const containerRef = useRef<HTMLDivElement>(null);

  // 虚拟列表
  const {
    visibleData,
    onScroll,
    totalHeight,
    startOffset
  } = useVirtualList(records, ITEM_HEIGHT, CONTAINER_HEIGHT);

  // 格式化时间
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取得分等级
  const getScoreLevel = (score: number) => {
    if (score >= 90) return { text: '极高', color: 'success' };
    if (score >= 80) return { text: '很高', color: 'processing' };
    if (score >= 70) return { text: '较高', color: 'warning' };
    if (score >= 60) return { text: '一般', color: 'default' };
    return { text: '较低', color: 'error' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="history"
    >
      <Card>
        <div className="header">
          <Title level={4}>
            <HistoryOutlined /> 历史记录
          </Title>
          {records.length > 0 && (
            <Popconfirm
              title="确定要清空所有历史记录吗？"
              okText="确定"
              cancelText="取消"
              icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              onConfirm={onClear}
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
              >
                清空记录
              </Button>
            </Popconfirm>
          )}
        </div>

        {records.length > 0 ? (
          <div
            ref={containerRef}
            style={{
              height: CONTAINER_HEIGHT,
              overflow: 'auto',
              position: 'relative'
            }}
            onScroll={onScroll}
          >
            <div style={{ height: totalHeight, position: 'relative' }}>
              <div
                style={{
                  transform: `translateY(${startOffset}px)`,
                  position: 'absolute',
                  width: '100%'
                }}
              >
                <List
                  dataSource={visibleData}
                  renderItem={(record, index) => {
                    const level = getScoreLevel(record.totalScore);
                    return (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        style={{ height: ITEM_HEIGHT }}
                      >
                        <List.Item
                          actions={[
                            <Button 
                              key="retake" 
                              type="link"
                              onClick={() => onRetake(record)}
                            >
                              重新测试
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            title={
                              <div className="record-title">
                                <span>{record.basicInfo.name}</span>
                                <Tag color={level.color as any}>
                                  匹配度: {record.totalScore}分 ({level.text})
                                </Tag>
                                <Text type="secondary" className="record-time">
                                  {formatDate(record.timestamp)}
                                </Text>
                              </div>
                            }
                            description={
                              <div className="record-dimensions">
                                {record.dimensions.map((dim, dimIndex) => (
                                  <Tag key={dimIndex} color="default">
                                    {dim.name}: {dim.score}分
                                  </Tag>
                                ))}
                              </div>
                            }
                          />
                        </List.Item>
                      </motion.div>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无历史记录"
          />
        )}

        <style jsx>{`
          .history {
            max-width: 800px;
            margin: 0 auto;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }

          :global(.record-title) {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          :global(.record-time) {
            font-size: 12px;
          }

          :global(.record-dimensions) {
            margin-top: 8px;
          }

          :global(.ant-list-item) {
            padding: 16px;
            border-radius: 8px;
            background-color: #fafafa;
            margin-bottom: 12px;
            transition: all 0.3s;
          }

          :global(.ant-list-item:hover) {
            background-color: #f0f0f0;
          }

          :global(.ant-empty) {
            padding: 32px 0;
          }
        `}</style>
      </Card>
    </motion.div>
  );
};

export default History; 