// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useState } from 'react';
import { Chip } from '../../components/atoms/Chip/Chip';

export default {
  title: 'Atoms/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md'],
      description: '칩 크기 (xs: 24px, sm: 28px, md: 32px)',
    },
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outlineStrong', 'outlineWeak'],
      description: '칩 스타일 variant',
    },
    selected: {
      control: { type: 'boolean' },
      description: '선택 상태',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성 상태',
    },
    onClick: {
      action: 'clicked',
      description: '클릭 이벤트 핸들러',
    },
  },
};

export const Default = {
  render: (args) => (
    <Chip.Root size={args.size} variant={args.variant} selected={args.selected} disabled={args.disabled} onClick={args.onClick}>
      <Chip.Label>아트지</Chip.Label>
    </Chip.Root>
  ),
  args: {
    size: 'md',
    variant: 'solid',
    selected: false,
    disabled: false,
  },
};

export const Selected = {
  name: '선택된 상태',
  render: () => (
    <Chip.Root variant="solid" selected>
      <Chip.Label>아트지 80g</Chip.Label>
    </Chip.Root>
  ),
};

export const Unselected = {
  name: '미선택 상태',
  render: () => (
    <Chip.Root variant="solid" selected={false}>
      <Chip.Label>스노우지 100g</Chip.Label>
    </Chip.Root>
  ),
};

export const OutlineStrong = {
  name: 'Outline Strong Variant',
  render: () => (
    <Chip.Root variant="outlineStrong" selected>
      <Chip.Label>4도 인쇄</Chip.Label>
    </Chip.Root>
  ),
};

export const OutlineWeak = {
  name: 'Outline Weak Variant',
  render: () => (
    <Chip.Root variant="outlineWeak" selected={false}>
      <Chip.Label>단면 인쇄</Chip.Label>
    </Chip.Root>
  ),
};

export const Disabled = {
  name: '비활성 상태',
  render: () => (
    <Chip.Root disabled>
      <Chip.Label>준비 중</Chip.Label>
    </Chip.Root>
  ),
};

export const WithDeleteButton = {
  name: '삭제 버튼 포함',
  render: () => {
    const [tags, setTags] = useState(['명함', '전단지', '브로슈어']);
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <Chip.Root key={tag} variant="solid" selected>
            <Chip.Label>{tag}</Chip.Label>
            <Chip.DeleteButton onDelete={() => setTags(prev => prev.filter(t => t !== tag))} />
          </Chip.Root>
        ))}
      </div>
    );
  },
};

export const WithCount = {
  name: '카운트 표시',
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Chip.Root variant="solid" selected>
        <Chip.Label>아트지</Chip.Label>
        <Chip.Count>3</Chip.Count>
      </Chip.Root>
      <Chip.Root variant="outlineStrong">
        <Chip.Label>스노우지</Chip.Label>
        <Chip.Count>1</Chip.Count>
      </Chip.Root>
    </div>
  ),
};

export const PaperFilter = {
  name: '용지 필터 선택',
  render: () => {
    const papers = ['전체', '아트지', '스노우지', '갱지', '합성지'];
    const [selected, setSelected] = useState('전체');
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {papers.map(paper => (
          <Chip.Root
            key={paper}
            variant="solid"
            selected={selected === paper}
            onClick={() => setSelected(paper)}
          >
            <Chip.Label>{paper}</Chip.Label>
          </Chip.Root>
        ))}
      </div>
    );
  },
};

export const SizeComparison = {
  name: '크기 비교',
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Chip.Root size="xs" variant="solid" selected>
        <Chip.Label>xs 크기</Chip.Label>
      </Chip.Root>
      <Chip.Root size="sm" variant="solid" selected>
        <Chip.Label>sm 크기</Chip.Label>
      </Chip.Root>
      <Chip.Root size="md" variant="solid" selected>
        <Chip.Label>md 크기</Chip.Label>
      </Chip.Root>
    </div>
  ),
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Solid</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Chip.Root variant="solid" selected><Chip.Label>선택됨</Chip.Label></Chip.Root>
          <Chip.Root variant="solid" selected={false}><Chip.Label>미선택</Chip.Label></Chip.Root>
          <Chip.Root variant="solid" disabled><Chip.Label>비활성</Chip.Label></Chip.Root>
        </div>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Outline Strong</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Chip.Root variant="outlineStrong" selected><Chip.Label>선택됨</Chip.Label></Chip.Root>
          <Chip.Root variant="outlineStrong" selected={false}><Chip.Label>미선택</Chip.Label></Chip.Root>
          <Chip.Root variant="outlineStrong" disabled><Chip.Label>비활성</Chip.Label></Chip.Root>
        </div>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Outline Weak</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Chip.Root variant="outlineWeak" selected><Chip.Label>선택됨</Chip.Label></Chip.Root>
          <Chip.Root variant="outlineWeak" selected={false}><Chip.Label>미선택</Chip.Label></Chip.Root>
          <Chip.Root variant="outlineWeak" disabled><Chip.Label>비활성</Chip.Label></Chip.Root>
        </div>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>기능 포함</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Chip.Root variant="solid" selected>
            <Chip.Label>태그</Chip.Label>
            <Chip.Count>5</Chip.Count>
          </Chip.Root>
          <Chip.Root variant="outlineStrong" selected>
            <Chip.Label>삭제 가능</Chip.Label>
            <Chip.DeleteButton onDelete={() => {}} />
          </Chip.Root>
        </div>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>크기별 (xs / sm / md)</p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Chip.Root size="xs" variant="solid" selected><Chip.Label>xs</Chip.Label></Chip.Root>
          <Chip.Root size="sm" variant="solid" selected><Chip.Label>sm</Chip.Label></Chip.Root>
          <Chip.Root size="md" variant="solid" selected><Chip.Label>md</Chip.Label></Chip.Root>
        </div>
      </div>
    </div>
  ),
};
