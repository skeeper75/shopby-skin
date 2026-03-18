// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useState } from 'react';
import { SizeOptionChip } from '../../components/molecules/SizeOptionChip';

export default {
  title: 'Molecules/SizeOptionChip',
  component: SizeOptionChip,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['default', 'selected', 'disabled'],
      description: '칩 상태',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm'],
      description: '칩 크기 (default: 155×50px, sm: 120×40px)',
    },
    label: {
      control: { type: 'text' },
      description: '칩 라벨 텍스트',
    },
    onClick: { action: 'clicked' },
  },
};

export const Default = {
  args: {
    state: 'default',
    size: 'default',
    label: 'A4',
  },
};

export const Selected = {
  name: '선택된 상태',
  args: {
    state: 'selected',
    label: 'A4',
  },
};

export const Disabled = {
  name: '비활성화 상태',
  args: {
    state: 'disabled',
    label: 'A0 (품절)',
  },
};

export const SmallSize = {
  name: '소형 칩',
  args: {
    size: 'sm',
    label: 'A5',
    state: 'default',
  },
};

export const InteractivePaperSize = {
  name: '인터랙티브 - 용지 사이즈 선택',
  render: () => {
    const [selected, setSelected] = useState('A4');
    const sizes = ['A3', 'A4', 'A5', 'B4', 'B5'];
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {sizes.map((s) => (
          <SizeOptionChip
            key={s}
            label={s}
            state={selected === s ? 'selected' : 'default'}
            onClick={() => setSelected(s)}
          />
        ))}
      </div>
    );
  },
};

export const WithDisabled = {
  name: '품절 옵션 포함',
  render: () => {
    const [selected, setSelected] = useState('A4');
    const sizes = [
      { label: 'A3', available: true },
      { label: 'A4', available: true },
      { label: 'A5', available: true },
      { label: 'B4', available: false },
      { label: 'B5', available: true },
    ];
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {sizes.map(({ label, available }) => (
          <SizeOptionChip
            key={label}
            label={available ? label : `${label} (품절)`}
            state={!available ? 'disabled' : selected === label ? 'selected' : 'default'}
            onClick={() => available && setSelected(label)}
          />
        ))}
      </div>
    );
  },
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>기본 사이즈 (155×50px)</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <SizeOptionChip label="A4" state="default" />
          <SizeOptionChip label="A3" state="selected" />
          <SizeOptionChip label="A0 (품절)" state="disabled" />
        </div>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>소형 사이즈 (120×40px)</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <SizeOptionChip label="A4" size="sm" state="default" />
          <SizeOptionChip label="A3" size="sm" state="selected" />
          <SizeOptionChip label="A0" size="sm" state="disabled" />
        </div>
      </div>
    </div>
  ),
};
