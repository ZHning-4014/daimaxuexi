'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Form, Select } from 'antd';
import { UserOutlined, StarOutlined } from '@ant-design/icons';
import styles from './BasicInfo.module.css';

// 动态导入 antd 组件
const Card = dynamic(() => import('antd/lib/card'), { ssr: false });
const Input = dynamic(() => import('antd/lib/input'), { ssr: false });
const Button = dynamic(() => import('antd/lib/button'), { ssr: false });

// 从antd的Select中获取Option
const { Option } = Select;

interface BasicInfoData {
  nickname: string;
  age: number;
  gender: 'male' | 'female';
  city: string;
}

interface BasicInfoProps {
  onFinish: (values: BasicInfoData) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ onFinish }) => {
  const [form] = Form.useForm<BasicInfoData>();

  return (
    <div className={styles.container}>
      <Card className={styles.questionCard}>
        <div className={styles.header}>
          <UserOutlined className={styles.headerIcon} />
          <h2>基本信息</h2>
          <p>请填写您的基本信息，帮助我们更好地了解您</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className={styles.form}
          requiredMark={false}
        >
          <Form.Item
            label="昵称"
            name="nickname"
            className={styles.formItem}
            rules={[
              { required: true, message: '请输入您的昵称' },
              { min: 2, message: '昵称至少2个字符' },
              { max: 20, message: '昵称最多20个字符' }
            ]}
          >
            <Input
              placeholder="请输入昵称"
              className={styles.formInput}
              maxLength={20}
              showCount
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="年龄"
            name="age"
            className={styles.formItem}
            rules={[
              { required: true, message: '请选择您的年龄' },
              { type: 'number', min: 18, message: '年龄必须大于等于18岁' },
              { type: 'number', max: 60, message: '年龄必须小于等于60岁' }
            ]}
          >
            <Select
              placeholder="请选择年龄"
              className={styles.formSelect}
              showSearch
              optionFilterProp="children"
            >
              {Array.from({ length: 43 }, (_, i) => i + 18).map(age => (
                <Option key={age} value={age}>
                  {age}岁
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="性别"
            name="gender"
            className={styles.formItem}
            rules={[{ required: true, message: '请选择您的性别' }]}
          >
            <Select
              placeholder="请选择性别"
              className={styles.formSelect}
            >
              <Option value="male">男</Option>
              <Option value="female">女</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="所在城市"
            name="city"
            className={styles.formItem}
            rules={[
              { required: true, message: '请输入您所在的城市' },
              { min: 2, message: '城市名称至少2个字符' },
              { max: 20, message: '城市名称最多20个字符' }
            ]}
          >
            <Input
              placeholder="请输入城市名称"
              className={styles.formInput}
              maxLength={20}
              showCount
              allowClear
            />
          </Form.Item>

          <div className={styles.footer}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
              size="large"
            >
              下一步
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default BasicInfo; 