// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React from 'react';
import { Divider } from '../../components/atoms/Divider';

export default {
  title: 'Atoms/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['full', 'inset'],
      description: '구분선 variant (full: 전체 너비, inset: 양쪽 여백 포함)',
    },
    direction: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: '구분선 방향 (horizontal: 수평, vertical: 수직)',
    },
  },
};

export const Default = {
  args: {
    variant: 'full',
    direction: 'horizontal',
  },
};

export const Horizontal = {
  name: '수평 구분선',
  render: () => (
    <div style={{ width: '400px', padding: '16px', background: '#fff' }}>
      <p style={{ margin: '0 0 12px' }}>용지 종류: 아트지 80g</p>
      <Divider variant="full" direction="horizontal" />
      <p style={{ margin: '12px 0 0' }}>인쇄 도수: 4도 인쇄</p>
    </div>
  ),
};

export const HorizontalInset = {
  name: '수평 구분선 (여백)',
  render: () => (
    <div style={{ width: '400px', padding: '16px', background: '#fff', border: '1px solid #eee' }}>
      <p style={{ margin: '0 0 12px' }}>인쇄 수량: 500부</p>
      <Divider variant="inset" direction="horizontal" />
      <p style={{ margin: '12px 0 0' }}>납기: 3영업일</p>
    </div>
  ),
};

export const Vertical = {
  name: '수직 구분선',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '40px' }}>
      <span style={{ fontSize: '14px' }}>단면 인쇄</span>
      <Divider variant="full" direction="vertical" />
      <span style={{ fontSize: '14px' }}>양면 인쇄</span>
      <Divider variant="full" direction="vertical" />
      <span style={{ fontSize: '14px' }}>코팅 없음</span>
    </div>
  ),
};

export const VerticalInset = {
  name: '수직 구분선 (여백)',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '60px' }}>
      <span style={{ fontSize: '14px' }}>명함</span>
      <Divider variant="inset" direction="vertical" />
      <span style={{ fontSize: '14px' }}>전단지</span>
      <Divider variant="inset" direction="vertical" />
      <span style={{ fontSize: '14px' }}>브로슈어</span>
    </div>
  ),
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px' }}>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>수평 - Full</p>
        <Divider variant="full" direction="horizontal" />
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>수평 - Inset</p>
        <Divider variant="inset" direction="horizontal" />
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>수직</p>
        <div style={{ display: 'flex', height: '32px', gap: '12px', alignItems: 'center' }}>
          <span>명함</span>
          <Divider variant="full" direction="vertical" />
          <span>전단지</span>
          <Divider variant="inset" direction="vertical" />
          <span>브로슈어</span>
        </div>
      </div>
    </div>
  ),
};
