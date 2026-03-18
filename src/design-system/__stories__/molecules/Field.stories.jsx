// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useState } from 'react';
import { Field } from '../../components/molecules/Field/Field';

export default {
  title: 'Molecules/Field',
  component: Field.Root,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
    },
    invalid: {
      control: { type: 'boolean' },
      description: '에러 상태',
    },
    required: {
      control: { type: 'boolean' },
      description: '필수 입력 여부',
    },
  },
};

export const Default = {
  name: '기본 필드',
  render: () => (
    <Field.Root id="company-name">
      <Field.Header>
        <Field.Label>거래처명</Field.Label>
      </Field.Header>
      <Field.Control>
        <input
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            fontSize: '14px',
          }}
          placeholder="거래처명을 입력해 주세요"
        />
      </Field.Control>
    </Field.Root>
  ),
};

export const Required = {
  name: '필수 입력 필드',
  render: () => (
    <Field.Root id="contact-name" required>
      <Field.Header>
        <Field.Label>담당자명</Field.Label>
        <Field.RequiredIndicator />
      </Field.Header>
      <Field.Control>
        <input
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            fontSize: '14px',
          }}
          placeholder="담당자명을 입력해 주세요"
        />
      </Field.Control>
    </Field.Root>
  ),
};

export const WithHelperText = {
  name: '도움말 텍스트 포함',
  render: () => (
    <Field.Root id="phone-number">
      <Field.Header>
        <Field.Label>연락처</Field.Label>
      </Field.Header>
      <Field.Control>
        <input
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            fontSize: '14px',
          }}
          placeholder="010-0000-0000"
        />
      </Field.Control>
      <Field.HelperText>하이픈(-) 없이 입력해 주세요</Field.HelperText>
    </Field.Root>
  ),
};

export const WithError = {
  name: '에러 상태',
  render: () => (
    <Field.Root id="email-field" invalid>
      <Field.Header>
        <Field.Label>이메일</Field.Label>
        <Field.RequiredIndicator />
      </Field.Header>
      <Field.Control>
        <input
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '2px solid #ef4444',
            borderRadius: '4px',
            fontSize: '14px',
          }}
          defaultValue="invalid-email"
        />
      </Field.Control>
      <Field.ErrorText>올바른 이메일 형식을 입력해 주세요</Field.ErrorText>
    </Field.Root>
  ),
};

export const WithCharacterCount = {
  name: '문자 수 카운트',
  render: () => {
    const [value, setValue] = useState('');
    const maxLength = 100;
    return (
      <Field.Root id="memo-field">
        <Field.Header>
          <Field.Label>인쇄 메모</Field.Label>
        </Field.Header>
        <Field.Control>
          <textarea
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '14px',
              minHeight: '80px',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
            placeholder="특별 요청사항을 입력해 주세요"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={maxLength}
          />
        </Field.Control>
        <Field.Footer>
          <Field.HelperText>특수 요청사항 또는 주의사항을 입력해 주세요</Field.HelperText>
          <Field.CharacterCount current={value.length} max={maxLength} />
        </Field.Footer>
      </Field.Root>
    );
  },
};

export const Disabled = {
  name: '비활성화 상태',
  render: () => (
    <Field.Root id="readonly-field" disabled>
      <Field.Header>
        <Field.Label>주문 번호</Field.Label>
      </Field.Header>
      <Field.Control>
        <input
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: '#f5f5f5',
          }}
          defaultValue="ORD-2024-001234"
          disabled
        />
      </Field.Control>
    </Field.Root>
  ),
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => {
    const [memo, setMemo] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '400px' }}>
        <Field.Root id="field-basic">
          <Field.Header>
            <Field.Label>기본 필드</Field.Label>
          </Field.Header>
          <Field.Control>
            <input
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
              placeholder="입력해 주세요"
            />
          </Field.Control>
        </Field.Root>

        <Field.Root id="field-required" required>
          <Field.Header>
            <Field.Label>필수 필드</Field.Label>
            <Field.RequiredIndicator />
          </Field.Header>
          <Field.Control>
            <input
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
              placeholder="필수 항목입니다"
            />
          </Field.Control>
          <Field.HelperText>이 항목은 반드시 입력해야 합니다</Field.HelperText>
        </Field.Root>

        <Field.Root id="field-error" invalid>
          <Field.Header>
            <Field.Label>에러 필드</Field.Label>
            <Field.RequiredIndicator />
          </Field.Header>
          <Field.Control>
            <input
              style={{ width: '100%', padding: '10px 12px', border: '2px solid #ef4444', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
              defaultValue="잘못된 입력값"
            />
          </Field.Control>
          <Field.ErrorText>유효하지 않은 값입니다</Field.ErrorText>
        </Field.Root>

        <Field.Root id="field-count">
          <Field.Header>
            <Field.Label>문자 수 카운트</Field.Label>
          </Field.Header>
          <Field.Control>
            <textarea
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px', minHeight: '60px', resize: 'vertical', boxSizing: 'border-box' }}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              maxLength={50}
            />
          </Field.Control>
          <Field.Footer>
            <span />
            <Field.CharacterCount current={memo.length} max={50} />
          </Field.Footer>
        </Field.Root>
      </div>
    );
  },
};
