// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useState } from 'react';
import { RadioGroup } from '../../components/atoms/Radio/Radio';

export default {
  title: 'Atoms/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '라디오 버튼 크기',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '전체 그룹 비활성 상태',
    },
    defaultValue: {
      control: { type: 'text' },
      description: '초기 선택 값',
    },
    onValueChange: {
      action: 'valueChanged',
      description: '값 변경 이벤트 핸들러',
    },
  },
};

export const Default = {
  render: (args) => (
    <RadioGroup.Root size={args.size} disabled={args.disabled} defaultValue={args.defaultValue} onValueChange={args.onValueChange}>
      <RadioGroup.Item value="option1">
        <RadioGroup.ItemControl value="option1">
          <RadioGroup.ItemIndicator />
        </RadioGroup.ItemControl>
        <RadioGroup.ItemLabel>옵션 1</RadioGroup.ItemLabel>
      </RadioGroup.Item>
      <RadioGroup.Item value="option2">
        <RadioGroup.ItemControl value="option2">
          <RadioGroup.ItemIndicator />
        </RadioGroup.ItemControl>
        <RadioGroup.ItemLabel>옵션 2</RadioGroup.ItemLabel>
      </RadioGroup.Item>
    </RadioGroup.Root>
  ),
  args: {
    size: 'md',
    disabled: false,
    defaultValue: 'option1',
  },
};

export const PaperTypeSelection = {
  name: '용지 종류 선택',
  render: () => (
    <RadioGroup.Root defaultValue="artpaper-80g">
      {[
        { value: 'artpaper-80g', label: '아트지 80g' },
        { value: 'artpaper-100g', label: '아트지 100g' },
        { value: 'snowpaper-100g', label: '스노우지 100g' },
        { value: 'newsprint', label: '갱지 60g' },
      ].map(({ value, label }) => (
        <RadioGroup.Item key={value} value={value}>
          <RadioGroup.ItemControl value={value}>
            <RadioGroup.ItemIndicator />
          </RadioGroup.ItemControl>
          <RadioGroup.ItemLabel>{label}</RadioGroup.ItemLabel>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  ),
};

export const PrintSideSelection = {
  name: '인쇄 면 선택',
  render: () => (
    <RadioGroup.Root defaultValue="single">
      {[
        { value: 'single', label: '단면 인쇄' },
        { value: 'double', label: '양면 인쇄' },
      ].map(({ value, label }) => (
        <RadioGroup.Item key={value} value={value}>
          <RadioGroup.ItemControl value={value}>
            <RadioGroup.ItemIndicator />
          </RadioGroup.ItemControl>
          <RadioGroup.ItemLabel>{label}</RadioGroup.ItemLabel>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  ),
};

export const WithDisabledItem = {
  name: '일부 비활성 항목',
  render: () => (
    <RadioGroup.Root defaultValue="standard">
      <RadioGroup.Item value="standard">
        <RadioGroup.ItemControl value="standard">
          <RadioGroup.ItemIndicator />
        </RadioGroup.ItemControl>
        <RadioGroup.ItemLabel>일반 배송 (3~5영업일)</RadioGroup.ItemLabel>
      </RadioGroup.Item>
      <RadioGroup.Item value="express">
        <RadioGroup.ItemControl value="express">
          <RadioGroup.ItemIndicator />
        </RadioGroup.ItemControl>
        <RadioGroup.ItemLabel>빠른 배송 (1~2영업일)</RadioGroup.ItemLabel>
      </RadioGroup.Item>
      <RadioGroup.Item value="sameday" disabled>
        <RadioGroup.ItemControl value="sameday" disabled>
          <RadioGroup.ItemIndicator />
        </RadioGroup.ItemControl>
        <RadioGroup.ItemLabel>당일 배송 (준비 중)</RadioGroup.ItemLabel>
      </RadioGroup.Item>
    </RadioGroup.Root>
  ),
};

export const AllDisabled = {
  name: '전체 비활성',
  render: () => (
    <RadioGroup.Root defaultValue="artpaper-80g" disabled>
      {[
        { value: 'artpaper-80g', label: '아트지 80g' },
        { value: 'artpaper-100g', label: '아트지 100g' },
      ].map(({ value, label }) => (
        <RadioGroup.Item key={value} value={value} disabled>
          <RadioGroup.ItemControl value={value} disabled>
            <RadioGroup.ItemIndicator />
          </RadioGroup.ItemControl>
          <RadioGroup.ItemLabel>{label}</RadioGroup.ItemLabel>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  ),
};

export const Controlled = {
  name: '제어 컴포넌트',
  render: () => {
    const [value, setValue] = useState('4color');
    const options = [
      { value: '1color', label: '단도 인쇄 (흑백)' },
      { value: '2color', label: '2도 인쇄' },
      { value: '4color', label: '4도 인쇄 (컬러)' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <RadioGroup.Root value={value} onValueChange={setValue}>
          {options.map(({ value: v, label }) => (
            <RadioGroup.Item key={v} value={v}>
              <RadioGroup.ItemControl value={v}>
                <RadioGroup.ItemIndicator />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemLabel>{label}</RadioGroup.ItemLabel>
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
          선택된 인쇄 도수: {options.find(o => o.value === value)?.label}
        </p>
      </div>
    );
  },
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>기본</p>
        <RadioGroup.Root defaultValue="a">
          <RadioGroup.Item value="a">
            <RadioGroup.ItemControl value="a"><RadioGroup.ItemIndicator /></RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>선택됨</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="b">
            <RadioGroup.ItemControl value="b"><RadioGroup.ItemIndicator /></RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>미선택</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>비활성</p>
        <RadioGroup.Root defaultValue="a" disabled>
          <RadioGroup.Item value="a" disabled>
            <RadioGroup.ItemControl value="a" disabled><RadioGroup.ItemIndicator /></RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>비활성 선택</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="b" disabled>
            <RadioGroup.ItemControl value="b" disabled><RadioGroup.ItemIndicator /></RadioGroup.ItemControl>
            <RadioGroup.ItemLabel>비활성 미선택</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
      </div>
    </div>
  ),
};
