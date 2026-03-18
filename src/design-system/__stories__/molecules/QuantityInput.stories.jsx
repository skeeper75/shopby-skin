// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useState } from 'react';
import { QuantityInput } from '../../components/molecules/QuantityInput';

export default {
  title: 'Molecules/QuantityInput',
  component: QuantityInput,
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
      description: '입력 필드 너비',
    },
    placeholder: {
      control: { type: 'text' },
      description: '플레이스홀더 텍스트',
    },
    unit: {
      control: { type: 'text' },
      description: '수량 단위 표시 (예: 장, 부, 권)',
    },
    min: {
      control: { type: 'number' },
      description: '최소 입력값',
    },
    max: {
      control: { type: 'number' },
      description: '최대 입력값',
    },
    onChange: { action: 'changed' },
  },
};

export const Default = {
  args: {
    state: 'default',
    size: 'default',
    placeholder: '수량을 입력해 주세요',
    unit: '장',
    min: 1,
    max: 9999,
  },
};

export const Interactive = {
  name: '인터랙티브 수량 입력',
  render: () => {
    const [quantity, setQuantity] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <QuantityInput
          value={quantity}
          onChange={setQuantity}
          placeholder="수량을 입력해 주세요"
          unit="장"
          min={1}
          max={9999}
        />
        {quantity && (
          <p style={{ fontSize: '13px', color: '#666' }}>
            입력값: {quantity}장
          </p>
        )}
      </div>
    );
  },
};

export const WithUnit = {
  name: '다양한 단위',
  render: () => {
    const [qty1, setQty1] = useState('100');
    const [qty2, setQty2] = useState('');
    const [qty3, setQty3] = useState('50');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>전단지 (장)</p>
          <QuantityInput value={qty1} onChange={setQty1} unit="장" />
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>카탈로그 (부)</p>
          <QuantityInput value={qty2} onChange={setQty2} unit="부" placeholder="부 수를 입력해 주세요" />
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>도서 (권)</p>
          <QuantityInput value={qty3} onChange={setQty3} unit="권" />
        </div>
      </div>
    );
  },
};

export const Disabled = {
  name: '비활성화 상태',
  args: {
    value: '500',
    state: 'disabled',
    unit: '장',
  },
};

export const FullWidth = {
  name: '전체 너비',
  args: {
    size: 'full',
    placeholder: '수량을 입력해 주세요',
    unit: '장',
  },
  parameters: {
    layout: 'padded',
  },
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>기본 상태 (빈 값)</p>
          <QuantityInput value={value} onChange={setValue} unit="장" />
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>값이 있는 상태 (단위 표시)</p>
          <QuantityInput value="1000" onChange={() => {}} unit="장" />
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>비활성화 상태</p>
          <QuantityInput value="500" state="disabled" unit="장" />
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>전체 너비</p>
          <QuantityInput value="" onChange={() => {}} size="full" unit="장" />
        </div>
      </div>
    );
  },
};
