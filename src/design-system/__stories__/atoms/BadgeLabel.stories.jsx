import React from 'react';
import { BadgeLabel } from '../../components/atoms/BadgeLabel';

export default {
  title: 'Atoms/BadgeLabel',
  component: BadgeLabel,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'gold', 'teal', 'muted'],
      description: '뱃지 색상 variant',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm'],
      description: '뱃지 크기',
    },
    children: {
      control: { type: 'text' },
      description: '뱃지 텍스트',
    },
  },
};

export const Default = {
  args: {
    children: '추천',
    variant: 'default',
    size: 'default',
  },
};

export const Recommended = {
  name: '추천 뱃지',
  args: {
    children: '추천',
    variant: 'default',
    size: 'default',
  },
};

export const Gold = {
  name: '골드 뱃지',
  args: {
    children: 'BEST',
    variant: 'gold',
    size: 'default',
  },
};

export const Teal = {
  name: '틸 뱃지',
  args: {
    children: 'NEW',
    variant: 'teal',
    size: 'default',
  },
};

export const Muted = {
  name: '뮤트 뱃지',
  args: {
    children: '품절',
    variant: 'muted',
    size: 'default',
  },
};

export const Small = {
  name: '소형 뱃지',
  args: {
    children: '추천',
    variant: 'default',
    size: 'sm',
  },
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <BadgeLabel variant="default">추천</BadgeLabel>
      <BadgeLabel variant="gold">BEST</BadgeLabel>
      <BadgeLabel variant="teal">NEW</BadgeLabel>
      <BadgeLabel variant="muted">품절</BadgeLabel>
      <BadgeLabel variant="default" size="sm">추천</BadgeLabel>
      <BadgeLabel variant="gold" size="sm">BEST</BadgeLabel>
    </div>
  ),
};
