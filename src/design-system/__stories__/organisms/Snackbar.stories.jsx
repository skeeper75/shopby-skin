// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useRef } from 'react';
import { Snackbar, SnackbarToast } from '../../components/organisms/Snackbar/Snackbar';
import { SnackbarProvider, useSnackbar } from '../../components/organisms/Snackbar/useSnackbar';

export default {
  title: 'Organisms/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Context 기반의 프로그래매틱 Snackbar 컴포넌트입니다. SnackbarProvider로 앱을 감싸고, useSnackbar() 훅으로 생성합니다. 4가지 타입(default, positive, warning, critical)을 지원합니다.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 개별 SnackbarToast 미리보기 (정적 렌더링)
// ---------------------------------------------------------------------------

/**
 * 스토리에서 정적으로 SnackbarToast를 보여주기 위한 더미 핸들러
 */
const noop = () => {};

export const DefaultType = {
  name: '기본 (default)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', minWidth: '360px' }}>
      <p style={{ fontSize: '12px', color: '#979797', margin: 0 }}>type: "default" — 일반 알림</p>
      <SnackbarToast
        snackbar={{
          id: 1,
          title: '변경사항이 저장되었습니다',
          type: 'default',
          duration: 0,
          dismissed: false,
        }}
        onDismiss={noop}
        onRemove={noop}
      />
      <SnackbarToast
        snackbar={{
          id: 2,
          title: '알림',
          description: '처리가 완료되었습니다.',
          type: 'default',
          duration: 0,
          dismissed: false,
        }}
        onDismiss={noop}
        onRemove={noop}
      />
    </div>
  ),
};

export const PositiveType = {
  name: '성공 (positive)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', minWidth: '360px' }}>
      <p style={{ fontSize: '12px', color: '#979797', margin: 0 }}>type: "positive" — 성공 알림</p>
      <SnackbarToast
        snackbar={{
          id: 1,
          title: '주문이 완료되었습니다',
          type: 'positive',
          duration: 0,
          dismissed: false,
        }}
        onDismiss={noop}
        onRemove={noop}
      />
      <SnackbarToast
        snackbar={{
          id: 2,
          title: '저장 완료',
          description: '상품이 장바구니에 추가되었습니다.',
          type: 'positive',
          duration: 0,
          dismissed: false,
        }}
        onDismiss={noop}
        onRemove={noop}
      />
    </div>
  ),
};

export const WarningType = {
  name: '경고 (warning)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', minWidth: '360px' }}>
      <p style={{ fontSize: '12px', color: '#979797', margin: 0 }}>type: "warning" — 경고 알림</p>
      <SnackbarToast
        snackbar={{
          id: 1,
          title: '재고가 부족합니다',
          type: 'warning',
          duration: 0,
          dismissed: false,
        }}
        onDismiss={noop}
        onRemove={noop}
      />
      <SnackbarToast
        snackbar={{
          id: 2,
          title: '주의',
          description: '이 작업은 되돌릴 수 없습니다.',
          type: 'warning',
          duration: 0,
          dismissed: false,
        }}
        onDismiss={noop}
        onRemove={noop}
      />
    </div>
  ),
};

export const CriticalType = {
  name: '오류 (critical)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', minWidth: '360px' }}>
      <p style={{ fontSize: '12px', color: '#979797', margin: 0 }}>type: "critical" — 오류 알림</p>
      <SnackbarToast
        snackbar={{
          id: 1,
          title: '결제에 실패했습니다',
          type: 'critical',
          duration: 0,
          dismissed: false,
        }}
        onDismiss={noop}
        onRemove={noop}
      />
      <SnackbarToast
        snackbar={{
          id: 2,
          title: '오류 발생',
          description: '잠시 후 다시 시도해주세요.',
          type: 'critical',
          duration: 0,
          dismissed: false,
        }}
        onDismiss={noop}
        onRemove={noop}
      />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// 액션 버튼이 있는 Snackbar
// ---------------------------------------------------------------------------

export const WithAction = {
  name: '액션 버튼',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', minWidth: '360px' }}>
      <p style={{ fontSize: '12px', color: '#979797', margin: 0 }}>actionLabel — 액션 버튼 포함</p>
      <SnackbarToast
        snackbar={{
          id: 1,
          title: '파일이 삭제되었습니다',
          type: 'default',
          duration: 0,
          actionLabel: '실행 취소',
          onAction: () => alert('실행 취소'),
          dismissed: false,
        }}
        onDismiss={noop}
        onRemove={noop}
      />
      <SnackbarToast
        snackbar={{
          id: 2,
          title: '새 메시지가 도착했습니다',
          description: '홍길동님이 메시지를 보냈습니다.',
          type: 'positive',
          duration: 0,
          actionLabel: '확인하기',
          onAction: () => alert('메시지 확인'),
          dismissed: false,
        }}
        onDismiss={noop}
        onRemove={noop}
      />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// 프로그래매틱 사용 (useSnackbar 훅)
// ---------------------------------------------------------------------------

/**
 * useSnackbar 훅 사용을 보여주는 컨트롤 패널
 */
function SnackbarControls() {
  const snackbar = useSnackbar();

  const showSnackbar = (type, withAction = false) => {
    const options = {
      default: { title: '알림', description: '일반 알림 메시지입니다.', type: 'default' },
      positive: { title: '성공', description: '작업이 성공적으로 완료되었습니다.', type: 'positive' },
      warning: { title: '경고', description: '주의가 필요한 상황입니다.', type: 'warning' },
      critical: { title: '오류', description: '오류가 발생했습니다. 다시 시도해주세요.', type: 'critical' },
    };

    const option = options[type] ?? options.default;

    snackbar.create({
      ...option,
      duration: 3000,
      ...(withAction && {
        actionLabel: '실행 취소',
        onAction: () => console.log('실행 취소'),
      }),
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', minWidth: '360px' }}>
      <p style={{ fontSize: '13px', color: '#424242', margin: 0, fontWeight: 600 }}>
        useSnackbar() 훅 — 프로그래매틱 API
      </p>
      <p style={{ fontSize: '12px', color: '#979797', margin: 0 }}>
        버튼을 클릭하면 화면 하단에 Snackbar가 표시됩니다. (3초 후 자동 닫힘)
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <button
          onClick={() => showSnackbar('default')}
          style={{ padding: '8px 14px', background: '#424242', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
        >
          기본 알림
        </button>
        <button
          onClick={() => showSnackbar('positive')}
          style={{ padding: '8px 14px', background: '#22C55E', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
        >
          성공 알림
        </button>
        <button
          onClick={() => showSnackbar('warning')}
          style={{ padding: '8px 14px', background: '#F59E0B', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
        >
          경고 알림
        </button>
        <button
          onClick={() => showSnackbar('critical')}
          style={{ padding: '8px 14px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
        >
          오류 알림
        </button>
        <button
          onClick={() => showSnackbar('default', true)}
          style={{ padding: '8px 14px', background: '#5538B6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
        >
          액션 포함
        </button>
      </div>
    </div>
  );
}

export const Programmatic = {
  name: '프로그래매틱 API (useSnackbar)',
  render: () => (
    <SnackbarProvider>
      <SnackbarControls />
      <Snackbar.Region />
    </SnackbarProvider>
  ),
};

// ---------------------------------------------------------------------------
// 모든 변형 한 눈에 보기 (정적)
// ---------------------------------------------------------------------------

export const AllVariants = {
  name: '모든 변형',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', minWidth: '400px' }}>
      <p style={{ fontSize: '13px', color: '#424242', margin: '0 0 8px 0', fontWeight: 600 }}>
        4가지 타입 비교
      </p>
      {[
        { id: 1, title: '일반 알림', description: 'type: default', type: 'default', duration: 0, dismissed: false },
        { id: 2, title: '성공 알림', description: 'type: positive', type: 'positive', duration: 0, dismissed: false },
        { id: 3, title: '경고 알림', description: 'type: warning', type: 'warning', duration: 0, dismissed: false },
        { id: 4, title: '오류 알림', description: 'type: critical', type: 'critical', duration: 0, dismissed: false },
      ].map((snackbar) => (
        <SnackbarToast
          key={snackbar.id}
          snackbar={snackbar}
          onDismiss={noop}
          onRemove={noop}
        />
      ))}
      <p style={{ fontSize: '12px', color: '#979797', margin: '8px 0 0 0' }}>
        ※ 실제 사용 시 SnackbarProvider로 감싸고 useSnackbar() 훅을 사용하세요.
      </p>
    </div>
  ),
};
