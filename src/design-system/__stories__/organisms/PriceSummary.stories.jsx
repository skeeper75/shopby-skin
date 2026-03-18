import React from 'react';
import { PriceSummary } from '../../components/organisms/PriceSummary';

const sampleItems = [
  { label: '상품 금액', value: '25,000원' },
  { label: '배송비', value: '무료' },
  { label: '할인 금액', value: '-5,000원' },
];

export default {
  title: 'Organisms/PriceSummary',
  component: PriceSummary,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['default', 'full'],
      description: '컴포넌트 너비',
    },
    totalLabel: {
      control: { type: 'text' },
      description: '합계 라벨',
    },
    totalValue: {
      control: { type: 'text' },
      description: '합계 금액',
    },
    showDivider: {
      control: { type: 'boolean' },
      description: '구분선 표시',
    },
  },
};

export const Default = {
  args: {
    items: sampleItems,
    totalLabel: '총 금액',
    totalValue: '20,000원',
    size: 'default',
    showDivider: true,
  },
};

export const WithItems = {
  name: '항목 있음',
  args: {
    items: sampleItems,
    totalLabel: '총 금액',
    totalValue: '20,000원',
    size: 'default',
    showDivider: true,
  },
};

export const Empty = {
  name: '항목 없음',
  args: {
    items: [],
    totalLabel: '총 금액',
    totalValue: '0원',
    size: 'default',
    showDivider: false,
  },
};

export const WithDeliveryFee = {
  name: '배송비 포함',
  args: {
    items: [
      { label: '상품 금액', value: '30,000원' },
      { label: '배송비', value: '3,000원' },
    ],
    totalLabel: '최종 결제 금액',
    totalValue: '33,000원',
    size: 'default',
    showDivider: true,
  },
};

export const WithDiscount = {
  name: '할인 적용',
  args: {
    items: [
      { label: '상품 금액', value: '50,000원' },
      { label: '쿠폰 할인', value: '-10,000원' },
      { label: '배송비', value: '무료' },
    ],
    totalLabel: '최종 결제 금액',
    totalValue: '40,000원',
    size: 'default',
    showDivider: true,
  },
};

export const FullWidth = {
  name: '전체 너비',
  args: {
    items: sampleItems,
    totalLabel: '총 금액',
    totalValue: '20,000원',
    size: 'full',
    showDivider: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const NoDivider = {
  name: '구분선 없음',
  args: {
    items: sampleItems,
    totalLabel: '총 금액',
    totalValue: '20,000원',
    size: 'default',
    showDivider: false,
  },
};
