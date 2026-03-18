// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useState } from 'react';
import { CounterOption } from '../../components/molecules/CounterOption';

export default {
  title: 'Molecules/CounterOption',
  component: CounterOption,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['default', 'disabled'],
      description: '카운터 상태',
    },
    value: {
      control: { type: 'number', min: 1, max: 999 },
      description: '현재 수량 값',
    },
    min: {
      control: { type: 'number' },
      description: '최소 수량',
    },
    max: {
      control: { type: 'number' },
      description: '최대 수량',
    },
    onChange: { action: 'changed' },
  },
};

export const Default = {
  args: {
    value: 1,
    min: 1,
    max: 999,
    state: 'default',
  },
};

export const Interactive = {
  name: '인터랙티브 카운터',
  render: () => {
    const [count, setCount] = useState(1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>현재 수량: {count}장</p>
        <CounterOption
          value={count}
          min={1}
          max={100}
          onChange={setCount}
        />
      </div>
    );
  },
};

export const MinMaxLimit = {
  name: '최소/최대 제한',
  render: () => {
    const [count, setCount] = useState(1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>수량 범위: 1 ~ 10장</p>
        <CounterOption
          value={count}
          min={1}
          max={10}
          onChange={setCount}
        />
      </div>
    );
  },
};

export const Disabled = {
  name: '비활성화 상태',
  args: {
    value: 5,
    state: 'disabled',
  },
};

export const AllVariants = {
  name: '모든 상태',
  render: () => {
    const [count, setCount] = useState(3);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>기본 상태</p>
          <CounterOption value={count} min={1} max={999} onChange={setCount} />
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>최소값 (감소 불가)</p>
          <CounterOption value={1} min={1} max={10} onChange={() => {}} />
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>최대값 (증가 불가)</p>
          <CounterOption value={10} min={1} max={10} onChange={() => {}} />
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>비활성화 상태</p>
          <CounterOption value={5} state="disabled" />
        </div>
      </div>
    );
  },
};
