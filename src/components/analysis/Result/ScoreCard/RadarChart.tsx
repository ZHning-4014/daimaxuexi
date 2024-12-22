'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './RadarChart.module.css';

interface Dimension {
  name: string;
  score: number;
  maxScore: number;
}

interface RadarChartProps {
  dimensions: Dimension[];
}

const RadarChart: React.FC<RadarChartProps> = ({ dimensions }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 准备数据
    const indicator = dimensions.map(dim => ({
      name: dim.name,
      max: dim.maxScore
    }));

    const data = dimensions.map(dim => dim.score);

    // 配置项
    const option = {
      animation: true,
      animationDuration: 1500,
      animationEasing: 'elasticOut',
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ff85c0',
        borderWidth: 1,
        padding: [8, 12],
        textStyle: {
          color: '#666'
        },
        formatter: (params: any) => {
          const value = params.value;
          const indicators = params.indicator;
          let result = `<div style="font-weight: bold; margin-bottom: 4px;">${params.name}</div>`;
          indicators.forEach((ind: any, index: number) => {
            result += `<div style="display: flex; justify-content: space-between; margin: 4px 0;">
              <span>${ind.name}:</span>
              <span style="color: #ff85c0; margin-left: 12px;">${value[index]}/${ind.max}</span>
            </div>`;
          });
          return result;
        }
      },
      radar: {
        indicator,
        shape: 'circle',
        splitNumber: 5,
        center: ['50%', '50%'],
        radius: '65%',
        name: {
          textStyle: {
            color: '#666',
            fontSize: 14,
            padding: [3, 5]
          }
        },
        splitLine: {
          lineStyle: {
            color: ['#e8e8e8'],
            opacity: 0.6,
            type: [5, 10]
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(255, 133, 192, 0.02)', 'rgba(255, 133, 192, 0.05)'],
            opacity: 1
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e8e8e8',
            opacity: 0.6
          }
        }
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: data,
              name: '维度得分',
              symbol: 'circle',
              symbolSize: 8,
              lineStyle: {
                color: '#ff85c0',
                width: 2,
                type: 'dashed'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(255, 133, 192, 0.3)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(179, 127, 235, 0.1)'
                  }
                ])
              },
              itemStyle: {
                color: '#ff85c0',
                borderColor: '#fff',
                borderWidth: 2,
                shadowColor: 'rgba(255, 133, 192, 0.5)',
                shadowBlur: 10
              },
              emphasis: {
                scale: true,
                itemStyle: {
                  shadowBlur: 20
                }
              }
            }
          ]
        }
      ]
    };

    // 设置配置项
    chartInstance.current.setOption(option);

    // 响应式调整
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, [dimensions]);

  return <div ref={chartRef} className={styles.radarChart} />;
};

export default RadarChart; 