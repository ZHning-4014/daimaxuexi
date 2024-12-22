'use client';

import React, { useState } from 'react';
import { Card, Form, Select, Slider, Button, Tag, message } from 'antd';
import { 
  HeartOutlined, 
  UserOutlined, 
  StarOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import styles from './PartnerQ.module.css';

const { Option } = Select;

const personalityTraits = [
  { label: '开朗', value: 'outgoing' },
  { label: '稳重', value: 'steady' },
  { label: '温柔', value: 'gentle' },
  { label: '独立', value: 'independent' },
  { label: '理性', value: 'rational' },
  { label: '创造力', value: 'creative' },
  { label: '幽默', value: 'humorous' },
  { label: '善解人意', value: 'considerate' },
  { label: '积极', value: 'ambitious' },
  { label: '随和', value: 'easygoing' },
  { label: '责任心', value: 'responsible' },
  { label: '乐观', value: 'optimistic' }
];

const PartnerQ = ({ onFinish, onPrevious }) => {
  const [form] = Form.useForm();
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const handleTraitClick = (trait: string) => {
    setSelectedTraits(prev => {
      if (prev.includes(trait)) {
        return prev.filter(t => t !== trait);
      }
      if (prev.length >= 5) {
        message.warning('最多只能选择5个期望特征哦');
        return prev;
      }
      return [...prev, trait];
    });
    form.setFieldsValue({ personalityTraits: selectedTraits });
  };

  const handleSubmit = (values: any) => {
    if (selectedTraits.length < 3) {
      message.warning('请至少选择3个期望的性格特征');
      return;
    }
    onFinish({
      ...values,
      personalityTraits: selectedTraits
    });
  };

  return (
    <div className={styles.container}>
      <Card className={styles.questionCard}>
        <div className={styles.header}>
          <HeartOutlined className={styles.headerIcon} />
          <h2>描述你理想的另一半</h2>
          <p>告诉我们你期望的伴侣特质</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
          initialValues={{
            ageRange: [20, 35],
            personalityTraits: []
          }}
        >
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <UserOutlined className={styles.sectionIcon} />
              <span>年龄范围</span>
            </div>
            <Form.Item name="ageRange">
              <Slider
                range
                min={18}
                max={60}
                marks={{
                  18: '18岁',
                  30: '30岁',
                  45: '45岁',
                  60: '60岁'
                }}
                className={styles.ageSlider}
              />
            </Form.Item>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <StarOutlined className={styles.sectionIcon} />
              <span>期望的性格特征（3-5项）</span>
            </div>
            <div className={styles.traitsContainer}>
              {personalityTraits.map(trait => (
                <Tag
                  key={trait.value}
                  className={`${styles.traitTag} ${
                    selectedTraits.includes(trait.value) ? styles.selected : ''
                  }`}
                  onClick={() => handleTraitClick(trait.value)}
                >
                  {selectedTraits.includes(trait.value) && (
                    <CheckCircleOutlined className={styles.checkIcon} />
                  )}
                  {trait.label}
                </Tag>
              ))}
            </div>
          </div>

          <div className={styles.footer}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={onPrevious}
              className={styles.prevButton}
            >
              返回上一步
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
            >
              完成测评
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default PartnerQ; 