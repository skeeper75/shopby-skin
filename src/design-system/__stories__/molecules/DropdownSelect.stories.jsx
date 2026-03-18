import React, { useState } from 'react';
import { DropdownSelect } from '../../components/molecules/DropdownSelect';

const sampleOptions = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
  { value: 'option4', label: '비활성화 옵션', disabled: true },
];

const colorOptions = [
  { value: 'red', label: '빨강' },
  { value: 'blue', label: '파랑' },
  { value: 'green', label: '초록' },
  { value: 'yellow', label: '노랑' },
];

export default {
  title: 'Molecules/DropdownSelect',
  component: DropdownSelect,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['default', 'full'],
      description: '드롭다운 크기',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
    },
    placeholder: {
      control: { type: 'text' },
      description: '플레이스홀더 텍스트',
    },
    onChange: { action: 'changed' },
  },
};

export const Default = {
  args: {
    options: sampleOptions,
    placeholder: '선택해 주세요',
    size: 'default',
    disabled: false,
  },
};

export const WithOptions = {
  name: '옵션 목록',
  args: {
    options: sampleOptions,
    placeholder: '색상을 선택해 주세요',
    size: 'default',
  },
};

export const WithSelectedValue = {
  name: '선택된 상태',
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <DropdownSelect
        options={sampleOptions}
        value={value}
        onChange={setValue}
        placeholder="선택해 주세요"
      />
    );
  },
};

export const ColorSelect = {
  name: '색상 선택',
  render: () => {
    const [color, setColor] = useState('');
    return (
      <DropdownSelect
        options={colorOptions}
        value={color}
        onChange={setColor}
        placeholder="색상을 선택해 주세요"
      />
    );
  },
};

export const Disabled = {
  name: '비활성화 상태',
  args: {
    options: sampleOptions,
    placeholder: '선택 불가',
    disabled: true,
  },
};

export const FullWidth = {
  name: '전체 너비',
  args: {
    options: sampleOptions,
    placeholder: '선택해 주세요',
    size: 'full',
  },
  parameters: {
    layout: 'padded',
  },
};
