// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React from 'react';
import { OptionLabel } from '../../components/molecules/OptionLabel';

export default {
  title: 'Molecules/OptionLabel',
  component: OptionLabel,
  tags: ['autodocs'],
  argTypes: {
    required: {
      control: { type: 'boolean' },
      description: '필수 입력 표시 여부 (* 표시)',
    },
    children: {
      control: { type: 'text' },
      description: '레이블 텍스트',
    },
  },
};

export const Default = {
  args: {
    children: '용지 종류',
    required: false,
  },
};

export const Required = {
  name: '필수 항목',
  args: {
    children: '인쇄 수량',
    required: true,
  },
};

export const Various = {
  name: '다양한 옵션 레이블',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <OptionLabel>용지 종류</OptionLabel>
      <OptionLabel required>인쇄 수량</OptionLabel>
      <OptionLabel>인쇄 컬러</OptionLabel>
      <OptionLabel required>마감 처리</OptionLabel>
      <OptionLabel>사이즈 선택</OptionLabel>
    </div>
  ),
};

export const InContext = {
  name: '폼 컨텍스트 예시',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <OptionLabel required>단면/양면 선택</OptionLabel>
        <div style={{
          padding: '12px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#888'
        }}>
          단면 / 양면 선택 영역
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <OptionLabel>특수 코팅</OptionLabel>
        <div style={{
          padding: '12px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#888'
        }}>
          코팅 옵션 선택 영역
        </div>
      </div>
    </div>
  ),
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>기본 레이블</p>
        <OptionLabel>용지 종류</OptionLabel>
      </div>
      <div>
        <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>필수 레이블 (required=true)</p>
        <OptionLabel required>인쇄 수량</OptionLabel>
      </div>
    </div>
  ),
};
