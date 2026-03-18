// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useState } from 'react';
import { Search, Mail, Eye, EyeOff } from 'lucide-react';
import { TextField } from '../../components/molecules/TextField/TextField';
import { Field } from '../../components/molecules/Field/Field';

export default {
  title: 'Molecules/TextField',
  component: TextField.Root,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['outline', 'filled', 'ghost'],
      description: 'TextField 스타일 variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'TextField 크기',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
    },
    invalid: {
      control: { type: 'boolean' },
      description: '에러 상태',
    },
    readOnly: {
      control: { type: 'boolean' },
      description: '읽기 전용 상태',
    },
  },
};

export const Default = {
  name: '기본 텍스트 필드',
  render: () => (
    <TextField.Root style={{ width: '320px' }}>
      <TextField.Input placeholder="거래처명을 입력해 주세요" />
    </TextField.Root>
  ),
};

export const Interactive = {
  name: '인터랙티브 입력',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '320px' }}>
        <TextField.Root>
          <TextField.Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="인쇄물 제목을 입력해 주세요"
          />
          {value && (
            <TextField.ClearButton onClick={() => setValue('')} />
          )}
        </TextField.Root>
        {value && (
          <p style={{ fontSize: '13px', color: '#666' }}>입력값: {value}</p>
        )}
      </div>
    );
  },
};

export const WithPrefixIcon = {
  name: '접두 아이콘',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextField.Root style={{ width: '320px' }}>
        <TextField.PrefixIcon>
          <Search size={16} />
        </TextField.PrefixIcon>
        <TextField.Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="주문번호 또는 거래처명 검색"
        />
        {value && (
          <TextField.ClearButton onClick={() => setValue('')} />
        )}
      </TextField.Root>
    );
  },
};

export const WithSuffixIcon = {
  name: '접미 아이콘',
  render: () => (
    <TextField.Root style={{ width: '320px' }}>
      <TextField.PrefixIcon>
        <Mail size={16} />
      </TextField.PrefixIcon>
      <TextField.Input placeholder="이메일을 입력해 주세요" />
    </TextField.Root>
  ),
};

export const PasswordField = {
  name: '비밀번호 필드 (토글)',
  render: () => {
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    return (
      <TextField.Root style={{ width: '320px' }}>
        <TextField.Input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="비밀번호를 입력해 주세요"
        />
        <TextField.SuffixIcon>
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </TextField.SuffixIcon>
      </TextField.Root>
    );
  },
};

export const Disabled = {
  name: '비활성화 상태',
  render: () => (
    <TextField.Root disabled style={{ width: '320px' }}>
      <TextField.Input
        defaultValue="ORD-2024-001234"
        disabled
        placeholder="주문 번호"
      />
    </TextField.Root>
  ),
};

export const Invalid = {
  name: '에러 상태',
  render: () => (
    <TextField.Root invalid style={{ width: '320px' }}>
      <TextField.Input
        defaultValue="invalid@"
        placeholder="이메일을 입력해 주세요"
      />
    </TextField.Root>
  ),
};

export const TextareaField = {
  name: '텍스트 영역 (자동 높이)',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextField.Root style={{ width: '320px' }}>
        <TextField.Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="특별 요청사항을 입력해 주세요&#13;&#10;(인쇄 메모, 주의사항 등)"
          minRows={3}
          maxHeight={200}
        />
      </TextField.Root>
    );
  },
};

export const WithFieldContext = {
  name: 'Field 컨텍스트 연동',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '320px' }}>
        <Field.Root id="company" required>
          <Field.Header>
            <Field.Label>거래처명</Field.Label>
            <Field.RequiredIndicator />
          </Field.Header>
          <Field.Control>
            <TextField.Root>
              <TextField.Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="거래처명을 입력해 주세요"
              />
              {value && <TextField.ClearButton onClick={() => setValue('')} />}
            </TextField.Root>
          </Field.Control>
          <Field.HelperText>정확한 상호명을 입력해 주세요</Field.HelperText>
        </Field.Root>

        <Field.Root id="email" invalid>
          <Field.Header>
            <Field.Label>이메일</Field.Label>
            <Field.RequiredIndicator />
          </Field.Header>
          <Field.Control>
            <TextField.Root>
              <TextField.PrefixIcon><Mail size={16} /></TextField.PrefixIcon>
              <TextField.Input
                defaultValue="wrong-email"
                placeholder="이메일을 입력해 주세요"
              />
            </TextField.Root>
          </Field.Control>
          <Field.ErrorText>올바른 이메일 형식이 아닙니다</Field.ErrorText>
        </Field.Root>
      </div>
    );
  },
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => {
    const [search, setSearch] = useState('');
    const [pw, setPw] = useState('');
    const [visible, setVisible] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '320px' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>기본 입력</p>
          <TextField.Root>
            <TextField.Input placeholder="텍스트를 입력해 주세요" />
          </TextField.Root>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>검색 (접두 아이콘 + 클리어)</p>
          <TextField.Root>
            <TextField.PrefixIcon><Search size={16} /></TextField.PrefixIcon>
            <TextField.Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="검색어 입력" />
            {search && <TextField.ClearButton onClick={() => setSearch('')} />}
          </TextField.Root>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>비활성화</p>
          <TextField.Root disabled>
            <TextField.Input defaultValue="수정 불가 항목" disabled />
          </TextField.Root>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>에러 상태</p>
          <TextField.Root invalid>
            <TextField.Input defaultValue="잘못된 값" />
          </TextField.Root>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>텍스트 영역</p>
          <TextField.Root>
            <TextField.Textarea placeholder="다중 줄 입력이 가능합니다" minRows={2} />
          </TextField.Root>
        </div>
      </div>
    );
  },
};
