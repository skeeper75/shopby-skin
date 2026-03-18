// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useState } from 'react';
import { Switch } from '../../components/atoms/Switch/Switch';

export default {
  title: 'Atoms/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '스위치 크기',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성 상태',
    },
    checked: {
      control: { type: 'boolean' },
      description: '스위치 ON/OFF 상태',
    },
    onCheckedChange: {
      action: 'checkedChange',
      description: '상태 변경 이벤트 핸들러',
    },
  },
};

export const Default = {
  render: (args) => (
    <Switch size={args.size} disabled={args.disabled}>
      <Switch.Control checked={args.checked} onCheckedChange={args.onCheckedChange} disabled={args.disabled}>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label>옵션 활성화</Switch.Label>
    </Switch>
  ),
  args: {
    size: 'md',
    disabled: false,
    checked: false,
  },
};

export const SwitchOn = {
  name: 'ON 상태',
  render: () => (
    <Switch>
      <Switch.Control defaultChecked>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label>양면 인쇄 사용</Switch.Label>
    </Switch>
  ),
};

export const SwitchOff = {
  name: 'OFF 상태',
  render: () => (
    <Switch>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label>양면 인쇄 사용</Switch.Label>
    </Switch>
  ),
};

export const SwitchDisabled = {
  name: '비활성 상태 (OFF)',
  render: () => (
    <Switch disabled>
      <Switch.Control disabled>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label>코팅 옵션 (준비 중)</Switch.Label>
    </Switch>
  ),
};

export const SwitchDisabledOn = {
  name: '비활성 상태 (ON)',
  render: () => (
    <Switch disabled>
      <Switch.Control defaultChecked disabled>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label>기본 옵션 (변경 불가)</Switch.Label>
    </Switch>
  ),
};

export const Controlled = {
  name: '제어 컴포넌트',
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Switch>
          <Switch.Control checked={checked} onCheckedChange={setChecked}>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Label>{checked ? '코팅 사용 중' : '코팅 미사용'}</Switch.Label>
        </Switch>
        <p style={{ fontSize: '12px', color: '#888' }}>현재 상태: {checked ? 'ON' : 'OFF'}</p>
      </div>
    );
  },
};

export const PrintOptions = {
  name: '인쇄 옵션 목록',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: '#fff', border: '1px solid #eee', borderRadius: '8px', width: '280px' }}>
      <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>인쇄 옵션 설정</p>
      {[
        { label: '양면 인쇄', default: true },
        { label: '유광 코팅', default: false },
        { label: '무광 코팅', default: false },
        { label: '미싱 처리', default: false },
      ].map(({ label, default: defaultChecked }) => (
        <Switch key={label}>
          <Switch.Control defaultChecked={defaultChecked}>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Label>{label}</Switch.Label>
        </Switch>
      ))}
    </div>
  ),
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>ON 상태</p>
        <Switch>
          <Switch.Control defaultChecked><Switch.Thumb /></Switch.Control>
          <Switch.Label>활성화됨</Switch.Label>
        </Switch>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>OFF 상태</p>
        <Switch>
          <Switch.Control><Switch.Thumb /></Switch.Control>
          <Switch.Label>비활성</Switch.Label>
        </Switch>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>비활성화 (disabled)</p>
        <Switch disabled>
          <Switch.Control disabled><Switch.Thumb /></Switch.Control>
          <Switch.Label>사용 불가</Switch.Label>
        </Switch>
      </div>
    </div>
  ),
};
