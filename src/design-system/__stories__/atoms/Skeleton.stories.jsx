// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React from 'react';
import { Skeleton } from '../../components/atoms/Skeleton';

export default {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    animation: {
      control: { type: 'select' },
      options: ['wave', 'pulse'],
      description: '애니메이션 종류 (wave: shimmer 효과, pulse: 깜빡임 효과)',
    },
    tone: {
      control: { type: 'select' },
      options: ['neutral', 'brand'],
      description: '색상 톤 (neutral: 중립, brand: 브랜드 색상)',
    },
    width: {
      control: { type: 'text' },
      description: '너비 (CSS 값, 예: 200px, 100%)',
    },
    height: {
      control: { type: 'text' },
      description: '높이 (CSS 값, 예: 20px, 48px)',
    },
    radius: {
      control: { type: 'text' },
      description: '모서리 반경 (CSS 값 또는 디자인 토큰)',
    },
  },
};

export const Default = {
  args: {
    width: '200px',
    height: '20px',
    animation: 'wave',
    tone: 'neutral',
  },
};

export const WaveAnimation = {
  name: 'Wave 애니메이션',
  args: {
    width: '300px',
    height: '24px',
    animation: 'wave',
    tone: 'neutral',
  },
};

export const PulseAnimation = {
  name: 'Pulse 애니메이션',
  args: {
    width: '300px',
    height: '24px',
    animation: 'pulse',
    tone: 'neutral',
  },
};

export const BrandTone = {
  name: '브랜드 색상 톤',
  args: {
    width: '200px',
    height: '20px',
    animation: 'wave',
    tone: 'brand',
  },
};

export const CircleSkeleton = {
  name: '원형 (아바타)',
  render: () => (
    <Skeleton width="48px" height="48px" radius="9999px" />
  ),
};

export const ProductCardSkeleton = {
  name: '상품 카드 로딩',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '200px' }}>
      <Skeleton width="200px" height="200px" radius="4px" />
      <Skeleton width="150px" height="16px" />
      <Skeleton width="80px" height="14px" />
      <Skeleton width="100px" height="18px" />
    </div>
  ),
};

export const OrderListSkeleton = {
  name: '주문 목록 로딩',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '400px' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', border: '1px solid #eee', borderRadius: '4px' }}>
          <Skeleton width="60px" height="60px" radius="4px" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <Skeleton width="180px" height="16px" />
            <Skeleton width="120px" height="14px" />
            <Skeleton width="80px" height="14px" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px' }}>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Wave (중립)</p>
        <Skeleton width="300px" height="20px" animation="wave" tone="neutral" />
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Pulse (중립)</p>
        <Skeleton width="300px" height="20px" animation="pulse" tone="neutral" />
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Wave (브랜드)</p>
        <Skeleton width="300px" height="20px" animation="wave" tone="brand" />
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>다양한 형태</p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Skeleton width="48px" height="48px" radius="9999px" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Skeleton width="160px" height="16px" />
            <Skeleton width="100px" height="12px" />
          </div>
        </div>
      </div>
    </div>
  ),
};
