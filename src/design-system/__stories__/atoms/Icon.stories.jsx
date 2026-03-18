// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React from 'react';
import { Icon } from '../../components/atoms/Icon';

export default {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'lucide-react 아이콘 이름 (PascalCase, 예: Printer, FileText)',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '아이콘 크기 (xs:12px, sm:16px, md:20px, lg:24px, xl:32px)',
    },
    color: {
      control: { type: 'color' },
      description: '아이콘 색상 (미지정 시 currentColor 상속)',
    },
  },
};

export const Default = {
  args: {
    name: 'Printer',
    size: 'md',
  },
};

export const SmallSize = {
  name: '소형 (sm: 16px)',
  args: {
    name: 'FileText',
    size: 'sm',
  },
};

export const LargeSize = {
  name: '대형 (lg: 24px)',
  args: {
    name: 'Package',
    size: 'lg',
  },
};

export const ExtraLarge = {
  name: '특대형 (xl: 32px)',
  args: {
    name: 'Truck',
    size: 'xl',
  },
};

export const WithColor = {
  name: '색상 지정',
  args: {
    name: 'Star',
    size: 'md',
    color: '#5538B6',
  },
};

export const InvalidName = {
  name: '존재하지 않는 아이콘 (null 반환)',
  args: {
    name: 'NotExistingIcon',
    size: 'md',
  },
};

export const AllSizes = {
  name: '모든 크기',
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <Icon name="Printer" size="xs" />
        <span style={{ fontSize: '11px', color: '#888' }}>xs (12)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <Icon name="Printer" size="sm" />
        <span style={{ fontSize: '11px', color: '#888' }}>sm (16)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <Icon name="Printer" size="md" />
        <span style={{ fontSize: '11px', color: '#888' }}>md (20)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <Icon name="Printer" size="lg" />
        <span style={{ fontSize: '11px', color: '#888' }}>lg (24)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <Icon name="Printer" size="xl" />
        <span style={{ fontSize: '11px', color: '#888' }}>xl (32)</span>
      </div>
    </div>
  ),
};

export const PrintIndustryIcons = {
  name: '인쇄 관련 아이콘 모음',
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      {[
        { name: 'Printer', label: '인쇄' },
        { name: 'FileText', label: '파일' },
        { name: 'Package', label: '패키지' },
        { name: 'Truck', label: '배송' },
        { name: 'Scissors', label: '재단' },
        { name: 'Layers', label: '레이어' },
        { name: 'Image', label: '이미지' },
        { name: 'Settings', label: '설정' },
        { name: 'CheckCircle', label: '완료' },
        { name: 'AlertCircle', label: '경고' },
      ].map(({ name, label }) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Icon name={name} size="lg" />
          <span style={{ fontSize: '11px', color: '#888' }}>{label}</span>
        </div>
      ))}
    </div>
  ),
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>크기별</p>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Icon name="Printer" size="xs" />
          <Icon name="Printer" size="sm" />
          <Icon name="Printer" size="md" />
          <Icon name="Printer" size="lg" />
          <Icon name="Printer" size="xl" />
        </div>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>색상별</p>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Icon name="Star" size="lg" color="#5538B6" />
          <Icon name="Star" size="lg" color="#E74C3C" />
          <Icon name="Star" size="lg" color="#27AE60" />
          <Icon name="Star" size="lg" color="#F39C12" />
          <Icon name="Star" size="lg" color="#2980B9" />
        </div>
      </div>
    </div>
  ),
};
