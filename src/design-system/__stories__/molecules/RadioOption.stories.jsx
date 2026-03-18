// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useState } from 'react';
import { RadioOption } from '../../components/molecules/RadioOption';

export default {
  title: 'Molecules/RadioOption',
  component: RadioOption,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['default', 'selected', 'disabled'],
      description: '버튼 상태',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'wide'],
      description: '버튼 크기 (default: 116px, wide: 155px)',
    },
    label: {
      control: { type: 'text' },
      description: '버튼 라벨 텍스트',
    },
    onClick: { action: 'clicked' },
  },
};

export const Default = {
  args: {
    state: 'default',
    label: '단면',
    value: 'single',
  },
};

export const Selected = {
  name: '선택된 상태',
  args: {
    state: 'selected',
    label: '양면',
    value: 'double',
  },
};

export const Disabled = {
  name: '비활성화 상태',
  args: {
    state: 'disabled',
    label: '준비중',
    value: 'unavailable',
  },
};

export const InteractivePrintSide = {
  name: '인터랙티브 - 단면/양면 선택',
  render: () => {
    const [selected, setSelected] = useState('single');
    const options = [
      { value: 'single', label: '단면' },
      { value: 'double', label: '양면' },
    ];
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        {options.map((option) => (
          <RadioOption
            key={option.value}
            value={option.value}
            label={option.label}
            state={selected === option.value ? 'selected' : 'default'}
            onClick={setSelected}
          />
        ))}
      </div>
    );
  },
};

export const InteractivePrintColor = {
  name: '인터랙티브 - 컬러 선택',
  render: () => {
    const [selected, setSelected] = useState('4color');
    const options = [
      { value: '4color', label: '4도(컬러)' },
      { value: '1color', label: '1도(흑백)' },
    ];
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        {options.map((option) => (
          <RadioOption
            key={option.value}
            value={option.value}
            label={option.label}
            state={selected === option.value ? 'selected' : 'default'}
            size="wide"
            onClick={setSelected}
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
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>기본 사이즈 (116px)</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <RadioOption label="단면" state="default" />
          <RadioOption label="양면" state="selected" />
          <RadioOption label="준비중" state="disabled" />
        </div>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>Wide 사이즈 (155px)</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <RadioOption label="4도(컬러)" size="wide" state="default" />
          <RadioOption label="1도(흑백)" size="wide" state="selected" />
          <RadioOption label="별색(준비중)" size="wide" state="disabled" />
        </div>
      </div>
    </div>
  ),
};
