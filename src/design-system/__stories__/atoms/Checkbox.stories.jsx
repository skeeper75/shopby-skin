// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useState } from 'react';
import { Checkbox } from '../../components/atoms/Checkbox/Checkbox';

export default {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '체크박스 크기',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성 상태',
    },
    checked: {
      control: { type: 'boolean' },
      description: '체크 상태 (제어 모드)',
    },
    defaultChecked: {
      control: { type: 'boolean' },
      description: '초기 체크 상태 (비제어 모드)',
    },
    onCheckedChange: {
      action: 'checkedChange',
      description: '체크 상태 변경 이벤트 핸들러',
    },
  },
};

export const Default = {
  render: (args) => (
    <Checkbox.Root size={args.size} disabled={args.disabled} defaultChecked={args.defaultChecked} onCheckedChange={args.onCheckedChange}>
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>옵션 선택</Checkbox.Label>
    </Checkbox.Root>
  ),
  args: {
    size: 'md',
    disabled: false,
    defaultChecked: false,
  },
};

export const Checked = {
  name: '체크된 상태',
  render: () => (
    <Checkbox.Root defaultChecked>
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>양면 인쇄 선택됨</Checkbox.Label>
    </Checkbox.Root>
  ),
};

export const Unchecked = {
  name: '미체크 상태',
  render: () => (
    <Checkbox.Root>
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>코팅 옵션 추가</Checkbox.Label>
    </Checkbox.Root>
  ),
};

export const DisabledChecked = {
  name: '비활성 (체크됨)',
  render: () => (
    <Checkbox.Root disabled defaultChecked>
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>필수 옵션 (변경 불가)</Checkbox.Label>
    </Checkbox.Root>
  ),
};

export const DisabledUnchecked = {
  name: '비활성 (미체크)',
  render: () => (
    <Checkbox.Root disabled>
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>준비 중인 옵션</Checkbox.Label>
    </Checkbox.Root>
  ),
};

export const Controlled = {
  name: '제어 컴포넌트',
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Checkbox.Root checked={checked} onCheckedChange={setChecked}>
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label>이메일 수신 동의</Checkbox.Label>
        </Checkbox.Root>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
          동의 여부: {checked ? '동의함' : '동의 안 함'}
        </p>
      </div>
    );
  },
};

export const OptionsList = {
  name: '인쇄 옵션 목록',
  render: () => {
    const options = [
      { id: 'glossy', label: '유광 코팅', checked: true },
      { id: 'matte', label: '무광 코팅', checked: false },
      { id: 'perforation', label: '미싱 처리', checked: false },
      { id: 'scoring', label: '접지 처리', checked: true },
      { id: 'embossing', label: '엠보싱 처리 (준비 중)', checked: false, disabled: true },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', background: '#fff', border: '1px solid #eee', borderRadius: '8px', width: '250px' }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>후가공 옵션</p>
        {options.map(({ id, label, checked, disabled }) => (
          <Checkbox.Root key={id} defaultChecked={checked} disabled={disabled}>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>{label}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </div>
    );
  },
};

export const SelectAll = {
  name: '전체 선택',
  render: () => {
    const items = ['명함', '전단지', '브로슈어', '포스터'];
    const [selected, setSelected] = useState(['명함', '브로슈어']);

    const allChecked = selected.length === items.length;
    const someChecked = selected.length > 0 && !allChecked;

    const toggleAll = () => {
      setSelected(allChecked ? [] : [...items]);
    };

    const toggleItem = (item) => {
      setSelected(prev =>
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: '#fff', border: '1px solid #eee', borderRadius: '8px', width: '200px' }}>
        <Checkbox.Root checked={allChecked} onCheckedChange={toggleAll}>
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label style={{ fontWeight: 600 }}>전체 선택</Checkbox.Label>
        </Checkbox.Root>
        <div style={{ height: '1px', background: '#eee', margin: '4px 0' }} />
        {items.map(item => (
          <Checkbox.Root key={item} checked={selected.includes(item)} onCheckedChange={() => toggleItem(item)}>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>{item}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </div>
    );
  },
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>기본 상태</p>
        <Checkbox.Root>
          <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
          <Checkbox.Label>미체크</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root defaultChecked>
          <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
          <Checkbox.Label>체크됨</Checkbox.Label>
        </Checkbox.Root>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>비활성 상태</p>
        <Checkbox.Root disabled>
          <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
          <Checkbox.Label>비활성 미체크</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root disabled defaultChecked>
          <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
          <Checkbox.Label>비활성 체크됨</Checkbox.Label>
        </Checkbox.Root>
      </div>
    </div>
  ),
};
