// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React from 'react';
import { ColorChip } from '../../components/atoms/ColorChip';

export default {
  title: 'Atoms/ColorChip',
  component: ColorChip,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['default', 'selected', 'disabled'],
      description: '칩 선택 상태 (default: 미선택, selected: 선택됨, disabled: 비활성)',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'mini'],
      description: '칩 크기 (default: 50x50px, mini: 32x32px)',
    },
    color: {
      control: { type: 'color' },
      description: '표시할 색상 (CSS 색상값)',
    },
    label: {
      control: { type: 'text' },
      description: '접근성용 라벨 텍스트 (aria-label)',
    },
    onClick: {
      action: 'clicked',
      description: '클릭 이벤트 핸들러',
    },
  },
};

export const Default = {
  args: {
    color: '#FF0000',
    state: 'default',
    size: 'default',
    label: '빨강',
  },
};

export const Selected = {
  name: '선택된 상태',
  args: {
    color: '#5538B6',
    state: 'selected',
    size: 'default',
    label: '보라',
  },
};

export const Disabled = {
  name: '비활성 상태',
  args: {
    color: '#CACACA',
    state: 'disabled',
    size: 'default',
    label: '회색 (비활성)',
  },
};

export const MiniSize = {
  name: '미니 크기',
  args: {
    color: '#00AAFF',
    state: 'default',
    size: 'mini',
    label: '파랑 미니',
  },
};

export const MiniSelected = {
  name: '미니 크기 선택',
  args: {
    color: '#FF6600',
    state: 'selected',
    size: 'mini',
    label: '주황 미니 선택',
  },
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>기본 크기 (50x50)</p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <ColorChip color="#FF0000" state="default" label="빨강" />
          <ColorChip color="#FF6600" state="default" label="주황" />
          <ColorChip color="#FFCC00" state="default" label="노랑" />
          <ColorChip color="#00AA00" state="selected" label="초록 (선택)" />
          <ColorChip color="#0044FF" state="default" label="파랑" />
          <ColorChip color="#9900CC" state="default" label="보라" />
          <ColorChip color="#FFFFFF" state="default" label="흰색" style={{ border: '1px solid #eee' }} />
          <ColorChip color="#000000" state="disabled" label="검정 (비활성)" />
        </div>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>미니 크기 (32x32)</p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <ColorChip color="#FF0000" state="default" size="mini" label="빨강 미니" />
          <ColorChip color="#00AA00" state="selected" size="mini" label="초록 미니 선택" />
          <ColorChip color="#0044FF" state="default" size="mini" label="파랑 미니" />
          <ColorChip color="#CACACA" state="disabled" size="mini" label="회색 미니 비활성" />
        </div>
      </div>
    </div>
  ),
};
