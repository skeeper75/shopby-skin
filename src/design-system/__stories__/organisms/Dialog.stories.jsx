// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useState } from 'react';
import { Dialog } from '../../components/organisms/Dialog/Dialog';

export default {
  title: 'Organisms/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: '다이얼로그 열림/닫힘 상태 (제어 모드)',
    },
    defaultOpen: {
      control: { type: 'boolean' },
      description: '초기 열림 상태 (비제어 모드)',
    },
    onOpenChange: { action: 'openChanged' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Radix UI 기반의 모달 다이얼로그 컴포넌트입니다. 컴파운드 패턴으로 구성되어 있으며 lazyMount, unmountOnExit를 지원합니다.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 기본 다이얼로그
// ---------------------------------------------------------------------------

export const Default = {
  name: '기본 다이얼로그',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              style={{
                padding: '10px 20px',
                background: '#5538B6',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              다이얼로그 열기
            </button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>기본 다이얼로그</Dialog.Title>
              <Dialog.Description>다이얼로그의 기본 형태입니다.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <p style={{ margin: 0, fontSize: '14px', color: '#424242' }}>
                다이얼로그 내용이 여기에 표시됩니다. 필요한 정보나 액션을 담을 수 있습니다.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Action asChild>
                <button
                  style={{
                    padding: '8px 16px',
                    background: '#5538B6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  확인
                </button>
              </Dialog.Action>
              <Dialog.Action asChild>
                <button
                  style={{
                    padding: '8px 16px',
                    background: '#fff',
                    color: '#424242',
                    border: '1px solid #DCDEE3',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginLeft: '8px',
                  }}
                >
                  취소
                </button>
              </Dialog.Action>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// 확인/취소 다이얼로그
// ---------------------------------------------------------------------------

export const ConfirmDialog = {
  name: '확인/취소 다이얼로그',
  render: () => {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState(null);

    const handleConfirm = () => {
      setResult('확인');
      setOpen(false);
    };

    const handleCancel = () => {
      setResult('취소');
      setOpen(false);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: '10px 20px',
            background: '#EF4444',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          삭제 확인 다이얼로그
        </button>
        {result && (
          <p style={{ fontSize: '13px', color: '#979797' }}>선택 결과: {result}</p>
        )}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>정말 삭제하시겠습니까?</Dialog.Title>
              <Dialog.Description>
                이 작업은 되돌릴 수 없습니다. 선택한 항목이 영구적으로 삭제됩니다.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Footer>
              <button
                onClick={handleConfirm}
                style={{
                  padding: '8px 16px',
                  background: '#EF4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                삭제
              </button>
              <button
                onClick={handleCancel}
                style={{
                  padding: '8px 16px',
                  background: '#fff',
                  color: '#424242',
                  border: '1px solid #DCDEE3',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginLeft: '8px',
                }}
              >
                취소
              </button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// 폼이 포함된 다이얼로그
// ---------------------------------------------------------------------------

export const WithForm = {
  name: '폼 입력 다이얼로그',
  render: () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [submitted, setSubmitted] = useState(null);

    const handleSubmit = (e) => {
      e.preventDefault();
      setSubmitted({ ...formData });
      setOpen(false);
      setFormData({ name: '', email: '' });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: '10px 20px',
            background: '#5538B6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          사용자 추가
        </button>
        {submitted && (
          <div style={{ fontSize: '13px', color: '#424242', background: '#F3F0FA', padding: '8px 12px', borderRadius: '6px' }}>
            제출됨: {submitted.name} ({submitted.email})
          </div>
        )}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Content style={{ minWidth: '400px' }}>
            <Dialog.Header>
              <Dialog.Title>사용자 추가</Dialog.Title>
              <Dialog.Description>새 사용자 정보를 입력하세요.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <form id="user-form" onSubmit={handleSubmit}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#424242' }}>
                    이름
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="홍길동"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #DCDEE3',
                      borderRadius: '4px',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#424242' }}>
                    이메일
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="example@email.com"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #DCDEE3',
                      borderRadius: '4px',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </form>
            </Dialog.Body>
            <Dialog.Footer>
              <button
                type="submit"
                form="user-form"
                style={{
                  padding: '8px 16px',
                  background: '#5538B6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                추가
              </button>
              <Dialog.Action asChild>
                <button
                  style={{
                    padding: '8px 16px',
                    background: '#fff',
                    color: '#424242',
                    border: '1px solid #DCDEE3',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginLeft: '8px',
                  }}
                >
                  취소
                </button>
              </Dialog.Action>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// 비제어 모드 (defaultOpen)
// ---------------------------------------------------------------------------

export const Uncontrolled = {
  name: '비제어 모드',
  render: () => (
    <Dialog.Root defaultOpen={false}>
      <Dialog.Trigger asChild>
        <button
          style={{
            padding: '10px 20px',
            background: '#5538B6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          비제어 모드 열기
        </button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>비제어 모드 다이얼로그</Dialog.Title>
          <Dialog.Description>
            defaultOpen 프로퍼티를 사용하는 비제어 모드입니다. 상태를 직접 관리하지 않아도 됩니다.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <p style={{ margin: 0, fontSize: '14px', color: '#424242' }}>
            Dialog.Trigger 클릭으로 열고, Dialog.Action 클릭으로 닫힙니다.
          </p>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Action asChild>
            <button
              style={{
                padding: '8px 16px',
                background: '#5538B6',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              닫기
            </button>
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

// ---------------------------------------------------------------------------
// 모든 변형 한 눈에 보기
// ---------------------------------------------------------------------------

export const AllVariants = {
  name: '모든 변형',
  render: () => {
    const [openStates, setOpenStates] = useState({
      basic: false,
      warning: false,
      info: false,
    });

    const toggleDialog = (key, value) => {
      setOpenStates((prev) => ({ ...prev, [key]: value }));
    };

    return (
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {/* 기본 */}
        <div>
          <button
            onClick={() => toggleDialog('basic', true)}
            style={{
              padding: '10px 16px',
              background: '#5538B6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            기본 다이얼로그
          </button>
          <Dialog.Root open={openStates.basic} onOpenChange={(v) => toggleDialog('basic', v)}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>기본 다이얼로그</Dialog.Title>
                <Dialog.Description>일반적인 정보 표시에 사용합니다.</Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <p style={{ margin: 0, fontSize: '14px', color: '#424242' }}>기본 스타일의 다이얼로그 콘텐츠입니다.</p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Action asChild>
                  <button style={{ padding: '8px 16px', background: '#5538B6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    확인
                  </button>
                </Dialog.Action>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </div>

        {/* 경고 */}
        <div>
          <button
            onClick={() => toggleDialog('warning', true)}
            style={{
              padding: '10px 16px',
              background: '#EF4444',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            경고 다이얼로그
          </button>
          <Dialog.Root open={openStates.warning} onOpenChange={(v) => toggleDialog('warning', v)}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>주의가 필요합니다</Dialog.Title>
                <Dialog.Description>이 작업은 되돌릴 수 없을 수 있습니다.</Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <p style={{ margin: 0, fontSize: '14px', color: '#EF4444' }}>
                  ⚠ 계속 진행하시겠습니까?
                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <button
                  onClick={() => toggleDialog('warning', false)}
                  style={{ padding: '8px 16px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                >
                  계속
                </button>
                <Dialog.Action asChild>
                  <button style={{ padding: '8px 16px', background: '#fff', color: '#424242', border: '1px solid #DCDEE3', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', marginLeft: '8px' }}>
                    취소
                  </button>
                </Dialog.Action>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </div>

        {/* 정보 */}
        <div>
          <button
            onClick={() => toggleDialog('info', true)}
            style={{
              padding: '10px 16px',
              background: '#3B82F6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            안내 다이얼로그
          </button>
          <Dialog.Root open={openStates.info} onOpenChange={(v) => toggleDialog('info', v)}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>안내사항</Dialog.Title>
                <Dialog.Description>중요한 정보를 안내드립니다.</Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '14px', color: '#424242' }}>
                  <li>배송은 영업일 기준 2-3일 소요됩니다.</li>
                  <li>제주도 및 도서산간 지역은 추가 비용이 발생할 수 있습니다.</li>
                  <li>주문 후 변경은 출고 전까지만 가능합니다.</li>
                </ul>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Action asChild>
                  <button style={{ padding: '8px 16px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    확인했습니다
                  </button>
                </Dialog.Action>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>
    );
  },
};
