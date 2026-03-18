// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useState } from 'react';
import { SizeInput } from '../../components/molecules/SizeInput';

export default {
  title: 'Molecules/SizeInput',
  component: SizeInput,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['default', 'disabled'],
      description: '입력 필드 상태',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'full'],
      description: '컴포넌트 너비',
    },
    unit: {
      control: { type: 'text' },
      description: '단위 표시 (예: mm, cm)',
    },
    widthPlaceholder: {
      control: { type: 'text' },
      description: '가로 입력 플레이스홀더',
    },
    heightPlaceholder: {
      control: { type: 'text' },
      description: '세로 입력 플레이스홀더',
    },
    onWidthChange: { action: 'widthChanged' },
    onHeightChange: { action: 'heightChanged' },
  },
};

export const Default = {
  args: {
    state: 'default',
    size: 'default',
    unit: 'mm',
    widthPlaceholder: '가로',
    heightPlaceholder: '세로',
  },
};

export const Interactive = {
  name: '인터랙티브 사이즈 입력',
  render: () => {
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SizeInput
          width={width}
          height={height}
          onWidthChange={setWidth}
          onHeightChange={setHeight}
          unit="mm"
        />
        {(width || height) && (
          <p style={{ fontSize: '13px', color: '#666' }}>
            입력 사이즈: {width || '-'} × {height || '-'} mm
          </p>
        )}
      </div>
    );
  },
};

export const WithValues = {
  name: '값이 있는 상태',
  args: {
    width: '210',
    height: '297',
    unit: 'mm',
  },
};

export const Disabled = {
  name: '비활성화 상태',
  args: {
    width: '148',
    height: '210',
    state: 'disabled',
    unit: 'mm',
  },
};

export const FullWidth = {
  name: '전체 너비',
  args: {
    size: 'full',
    unit: 'mm',
  },
  parameters: {
    layout: 'padded',
  },
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => {
    const [w, setW] = useState('');
    const [h, setH] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>기본 상태 (빈 값)</p>
          <SizeInput width={w} height={h} onWidthChange={setW} onHeightChange={setH} unit="mm" />
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>A4 사이즈 입력</p>
          <SizeInput width="210" height="297" onWidthChange={() => {}} onHeightChange={() => {}} unit="mm" />
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>비활성화 상태</p>
          <SizeInput width="148" height="210" state="disabled" unit="mm" />
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>전체 너비</p>
          <SizeInput size="full" unit="mm" />
        </div>
      </div>
    );
  },
};
