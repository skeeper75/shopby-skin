import React from 'react';
import { CTAButton } from '../../components/molecules/CTAButton';

export default {
  title: 'Molecules/CTAButton',
  component: CTAButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'dark'],
      description: '버튼 스타일 variant',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'full', 'sm'],
      description: '버튼 크기',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
    },
    children: {
      control: { type: 'text' },
      description: '버튼 텍스트',
    },
    onClick: { action: 'clicked' },
  },
};

export const Default = {
  args: {
    children: '장바구니 담기',
    variant: 'primary',
    size: 'default',
    disabled: false,
  },
};

export const Primary = {
  name: '주요 버튼 (장바구니)',
  args: {
    children: '장바구니 담기',
    variant: 'primary',
    size: 'default',
  },
};

export const Secondary = {
  name: '보조 버튼',
  args: {
    children: '바로 주문',
    variant: 'secondary',
    size: 'default',
  },
};

export const Dark = {
  name: '다크 버튼',
  args: {
    children: '구매하기',
    variant: 'dark',
    size: 'default',
  },
};

export const Disabled = {
  name: '비활성화 상태',
  args: {
    children: '품절된 상품',
    variant: 'primary',
    size: 'default',
    disabled: true,
  },
};

export const FullWidth = {
  name: '전체 너비',
  args: {
    children: '바로 주문하기',
    variant: 'primary',
    size: 'full',
  },
  parameters: {
    layout: 'padded',
  },
};

export const Small = {
  name: '소형 버튼',
  args: {
    children: '장바구니',
    variant: 'primary',
    size: 'sm',
  },
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <CTAButton variant="primary">장바구니 담기</CTAButton>
      <CTAButton variant="secondary">바로 주문</CTAButton>
      <CTAButton variant="dark">구매하기</CTAButton>
      <CTAButton variant="primary" disabled>품절된 상품</CTAButton>
    </div>
  ),
};
