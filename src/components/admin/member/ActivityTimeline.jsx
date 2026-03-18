// @MX:SPEC: SPEC-SKIN-007
// 회원 활동 타임라인 컴포넌트

/**
 * 활동 타임라인 아이템 타입별 아이콘/색상
 */
const ACTIVITY_TYPE_CONFIG = {
  order: { icon: '🛒', label: '주문', color: 'var(--huni-color-brand)' },
  payment: { icon: '💳', label: '결제', color: '#10b981' },
  login: { icon: '🔑', label: '로그인', color: 'var(--huni-text-muted)' },
  review: { icon: '⭐', label: '리뷰', color: '#f59e0b' },
  coupon: { icon: '🎟', label: '쿠폰', color: '#8b5cf6' },
  money: { icon: '💰', label: '프린팅머니', color: '#ec4899' },
};

/**
 * 회원 활동 타임라인
 * @param {Array} activities - 활동 목록 [{ id, type, description, createdAt }]
 */
const ActivityTimeline = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <div style={{ padding: 'var(--huni-spacing-xl)', textAlign: 'center', color: 'var(--huni-text-muted)', fontSize: 'var(--huni-font-size-sm)' }}>
        활동 내역이 없습니다.
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', paddingLeft: '28px' }}>
      {/* 세로선 */}
      <div
        style={{
          position: 'absolute',
          left: '10px',
          top: '8px',
          bottom: '8px',
          width: '2px',
          background: 'var(--huni-border-default)',
        }}
      />

      {activities.map((activity, idx) => {
        const config = ACTIVITY_TYPE_CONFIG[activity.type] ?? { icon: '•', label: activity.type, color: 'var(--huni-text-muted)' };
        return (
          <div
            key={activity.id ?? idx}
            style={{
              position: 'relative',
              marginBottom: 'var(--huni-spacing-md)',
              paddingLeft: 'var(--huni-spacing-md)',
            }}
          >
            {/* 원형 아이콘 */}
            <div
              style={{
                position: 'absolute',
                left: '-22px',
                top: '2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'var(--huni-bg-surface)',
                border: `2px solid ${config.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
              }}
            >
              {config.icon}
            </div>

            {/* 활동 내용 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--huni-spacing-xs)', marginBottom: '2px' }}>
                <span
                  style={{
                    padding: '1px 6px',
                    background: config.color + '20',
                    color: config.color,
                    fontSize: 'var(--huni-font-size-xs)',
                    borderRadius: 'var(--huni-radius-xs)',
                    fontWeight: 'var(--huni-font-weight-medium)',
                  }}
                >
                  {config.label}
                </span>
                <span style={{ fontSize: 'var(--huni-font-size-xs)', color: 'var(--huni-text-muted)' }}>
                  {activity.createdAt}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--huni-font-size-sm)',
                  color: 'var(--huni-text-primary)',
                  lineHeight: 1.5,
                }}
              >
                {activity.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { ActivityTimeline };
