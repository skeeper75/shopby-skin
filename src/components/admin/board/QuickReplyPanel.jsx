// @MX:SPEC: SPEC-SKIN-007
// 우측 슬라이드인 빠른 답변 패널 - 행 클릭 시 노출

import { useEffect } from 'react';
import { ReplyEditor } from './ReplyEditor';
import { BoardStatusChip } from './BoardStatusChip';
import { Divider } from '../../ui/Divider';

/**
 * 빠른 답변 패널 (우측 슬라이드인)
 * @param {Object|null} item - 선택된 게시판 아이템
 * @param {boolean} isOpen - 패널 열림 여부
 * @param {Function} onClose - 닫기 핸들러
 * @param {Function} onReplySubmit - 답변 제출 핸들러 (item, replyContent) => void
 * @param {boolean} [isLoading] - 제출 로딩
 * @param {Function} [renderDetail] - 상세 렌더링 커스텀 함수 (item) => ReactNode
 * @param {string} [title] - 패널 제목
 */
const QuickReplyPanel = ({
  item,
  isOpen,
  onClose,
  onReplySubmit,
  isLoading = false,
  renderDetail,
  title = '빠른 답변',
}) => {
  // Esc 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (content) => {
    onReplySubmit?.(item, content);
  };

  return (
    <>
      {/* 배경 오버레이 */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            background: 'rgba(0,0,0,0.3)',
          }}
        />
      )}

      {/* 슬라이드인 패널 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '480px',
          maxWidth: '100vw',
          background: 'var(--huni-bg-surface)',
          borderLeft: '1px solid var(--huni-border-default)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s ease',
          overflow: 'hidden',
        }}
      >
        {/* 패널 헤더 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--huni-spacing-md) var(--huni-spacing-lg)',
            borderBottom: '1px solid var(--huni-border-default)',
            flexShrink: 0,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 'var(--huni-font-size-md)',
              fontWeight: 'var(--huni-font-weight-semibold)',
              color: 'var(--huni-text-primary)',
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--huni-text-muted)',
              fontSize: '20px',
              lineHeight: 1,
              padding: '4px',
            }}
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* 패널 콘텐츠 */}
        {item && (
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: 'var(--huni-spacing-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--huni-spacing-md)',
            }}
          >
            {/* 기본 정보 */}
            {renderDetail ? (
              renderDetail(item)
            ) : (
              <DefaultItemDetail item={item} />
            )}

            <Divider />

            {/* 기존 답변 표시 */}
            {item.reply && (
              <>
                <div>
                  <div
                    style={{
                      fontSize: 'var(--huni-font-size-sm)',
                      fontWeight: 'var(--huni-font-weight-medium)',
                      color: 'var(--huni-text-secondary)',
                      marginBottom: 'var(--huni-spacing-xs)',
                    }}
                  >
                    기존 답변
                  </div>
                  <div
                    style={{
                      padding: 'var(--huni-spacing-sm)',
                      background: 'var(--huni-bg-muted)',
                      borderRadius: 'var(--huni-radius-sm)',
                      fontSize: 'var(--huni-font-size-sm)',
                      color: 'var(--huni-text-primary)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {item.reply.content}
                  </div>
                  <div
                    style={{
                      marginTop: 'var(--huni-spacing-xs)',
                      fontSize: 'var(--huni-font-size-xs)',
                      color: 'var(--huni-text-muted)',
                    }}
                  >
                    답변일: {item.reply.createdAt}
                  </div>
                </div>
                <Divider />
              </>
            )}

            {/* 답변 에디터 */}
            <div>
              <div
                style={{
                  fontSize: 'var(--huni-font-size-sm)',
                  fontWeight: 'var(--huni-font-weight-medium)',
                  color: 'var(--huni-text-secondary)',
                  marginBottom: 'var(--huni-spacing-xs)',
                }}
              >
                {item.reply ? '답변 수정' : '답변 작성'}
              </div>
              <ReplyEditor
                initialValue={item.reply?.content ?? ''}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                submitLabel={item.reply ? '답변 수정' : '답변 등록'}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/**
 * 기본 게시판 아이템 상세 표시
 */
const DefaultItemDetail = ({ item }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--huni-spacing-sm)' }}>
    {/* 제목 + 상태 */}
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--huni-spacing-xs)' }}>
      <h4
        style={{
          margin: 0,
          fontSize: 'var(--huni-font-size-md)',
          fontWeight: 'var(--huni-font-weight-medium)',
          color: 'var(--huni-text-primary)',
          flex: 1,
        }}
      >
        {item.title}
      </h4>
      {item.status && <BoardStatusChip status={item.status} />}
    </div>

    {/* 메타 정보 */}
    <div style={{ display: 'flex', gap: 'var(--huni-spacing-md)', flexWrap: 'wrap' }}>
      {item.memberName && (
        <MetaItem label="작성자" value={`${item.memberName} (${item.memberId ?? ''})`} />
      )}
      {item.contactName && (
        <MetaItem label="이름" value={item.contactName} />
      )}
      {item.companyName && (
        <MetaItem label="회사명" value={item.companyName} />
      )}
      {item.contactPhone && (
        <MetaItem label="연락처" value={item.contactPhone} />
      )}
      {item.email && (
        <MetaItem label="이메일" value={item.email} />
      )}
      <MetaItem label="등록일" value={item.createdAt} />
    </div>

    {/* 본문 */}
    {item.content && (
      <div
        style={{
          padding: 'var(--huni-spacing-sm)',
          background: 'var(--huni-bg-muted)',
          borderRadius: 'var(--huni-radius-sm)',
          fontSize: 'var(--huni-font-size-sm)',
          color: 'var(--huni-text-primary)',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.6,
        }}
      >
        {item.content}
      </div>
    )}
  </div>
);

const MetaItem = ({ label, value }) => (
  <div style={{ display: 'flex', gap: '4px', fontSize: 'var(--huni-font-size-xs)' }}>
    <span style={{ color: 'var(--huni-text-muted)' }}>{label}:</span>
    <span style={{ color: 'var(--huni-text-secondary)' }}>{value}</span>
  </div>
);

export { QuickReplyPanel };
