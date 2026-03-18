// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React from 'react';
import { InfoTooltip } from '../../components/atoms/InfoTooltip';

export default {
  title: 'Atoms/InfoTooltip',
  component: InfoTooltip,
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: { type: 'text' },
      description: '툴팁에 표시될 안내 텍스트',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm'],
      description: '트리거 아이콘 크기 (default: 16x16px, sm: 12x12px)',
    },
  },
};

export const Default = {
  args: {
    content: '인쇄 수량은 최소 100부부터 주문 가능합니다.',
    size: 'default',
  },
};

export const SmallSize = {
  name: '소형 크기',
  args: {
    content: '추가 정보',
    size: 'sm',
  },
};

export const PrintQuantityTip = {
  name: '인쇄 수량 안내',
  args: {
    content: '인쇄 수량: 100부 / 200부 / 300부 / 500부 / 1000부',
    size: 'default',
  },
};

export const PaperTypeTip = {
  name: '용지 종류 안내',
  args: {
    content: '아트지: 광택 있는 용지 / 스노우지: 무광 용지',
    size: 'default',
  },
};

export const DeliveryTip = {
  name: '납기 안내',
  args: {
    content: '납기는 영업일 기준이며, 주말 및 공휴일은 제외됩니다.',
    size: 'default',
  },
};

export const InlineUsage = {
  name: '인라인 사용 예시',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '14px', fontWeight: 500 }}>인쇄 수량</span>
        <InfoTooltip content="최소 주문 수량은 100부입니다." />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '14px', fontWeight: 500 }}>용지 선택</span>
        <InfoTooltip content="아트지 80g / 아트지 100g / 스노우지 100g 중 선택하세요." />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '14px', fontWeight: 500 }}>납기일</span>
        <InfoTooltip content="영업일 기준 3~5일 소요됩니다." size="sm" />
      </div>
    </div>
  ),
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => (
    <div style={{ display: 'flex', gap: '24px', padding: '24px', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>기본 크기</p>
        <InfoTooltip content="기본 크기 툴팁입니다." size="default" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>소형</p>
        <InfoTooltip content="소형 툴팁입니다." size="sm" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>긴 텍스트</p>
        <InfoTooltip content="인쇄 도수는 단면 1도, 단면 4도, 양면 4도 중 선택하실 수 있습니다." />
      </div>
    </div>
  ),
};
