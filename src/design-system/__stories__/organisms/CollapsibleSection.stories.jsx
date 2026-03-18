import React, { useState } from 'react';
import { CollapsibleSection } from '../../components/organisms/CollapsibleSection';

export default {
  title: 'Organisms/CollapsibleSection',
  component: CollapsibleSection,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: '섹션 제목',
    },
    defaultOpen: {
      control: { type: 'boolean' },
      description: '초기 열림 상태',
    },
    required: {
      control: { type: 'boolean' },
      description: '필수 항목 표시 (*)',
    },
    state: {
      control: { type: 'select' },
      options: ['default', 'hidden'],
      description: '표시/숨김 상태',
    },
    onOpenChange: { action: 'openChanged' },
  },
};

export const Default = {
  args: {
    title: '색상 선택',
    defaultOpen: true,
    required: false,
  },
  render: (args) => (
    <CollapsibleSection {...args}>
      <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#424242' }}>섹션 내용이 여기에 표시됩니다.</p>
      </div>
    </CollapsibleSection>
  ),
};

export const Expanded = {
  name: '펼쳐진 상태',
  args: {
    title: '사이즈 선택',
    defaultOpen: true,
    required: true,
  },
  render: (args) => (
    <div style={{ width: '465px' }}>
      <CollapsibleSection {...args}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button style={{ padding: '6px 12px', border: '1px solid #DCDEE3', borderRadius: '4px', cursor: 'pointer' }}>S</button>
          <button style={{ padding: '6px 12px', border: '1px solid #DCDEE3', borderRadius: '4px', cursor: 'pointer' }}>M</button>
          <button style={{ padding: '6px 12px', border: '2px solid #5538B6', borderRadius: '4px', cursor: 'pointer', background: '#F3F0FA' }}>L</button>
          <button style={{ padding: '6px 12px', border: '1px solid #DCDEE3', borderRadius: '4px', cursor: 'pointer' }}>XL</button>
        </div>
      </CollapsibleSection>
    </div>
  ),
};

export const Collapsed = {
  name: '접힌 상태',
  args: {
    title: '박스 선택',
    defaultOpen: false,
    required: false,
  },
  render: (args) => (
    <div style={{ width: '465px' }}>
      <CollapsibleSection {...args}>
        <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontSize: '13px' }}>박스 옵션 내용</p>
        </div>
      </CollapsibleSection>
    </div>
  ),
};

export const Controlled = {
  name: '제어 모드',
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ width: '465px' }}>
        <p style={{ fontSize: '12px', color: '#979797', marginBottom: '8px' }}>
          현재 상태: {open ? '열림' : '닫힘'}
        </p>
        <CollapsibleSection
          title="수량 입력"
          open={open}
          onOpenChange={setOpen}
        >
          <input
            type="number"
            defaultValue={1}
            min={1}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #DCDEE3',
              borderRadius: '4px',
              fontSize: '13px',
            }}
          />
        </CollapsibleSection>
      </div>
    );
  },
};

export const WithMultipleSections = {
  name: '여러 섹션',
  render: () => (
    <div style={{ width: '465px' }}>
      <CollapsibleSection title="색상 선택" defaultOpen={true} required={true}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', background: '#EF4444', borderRadius: '50%', cursor: 'pointer' }} />
          <div style={{ width: '24px', height: '24px', background: '#3B82F6', borderRadius: '50%', cursor: 'pointer' }} />
          <div style={{ width: '24px', height: '24px', background: '#22C55E', borderRadius: '50%', cursor: 'pointer' }} />
        </div>
      </CollapsibleSection>
      <CollapsibleSection title="사이즈 선택" defaultOpen={false} required={true}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['S', 'M', 'L', 'XL'].map((size) => (
            <button key={size} style={{ padding: '6px 12px', border: '1px solid #DCDEE3', borderRadius: '4px', cursor: 'pointer' }}>
              {size}
            </button>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  ),
};
