// @MX:ANCHOR: 회원 상세 Drawer - 탭 기반 상세 정보 (기본정보/주문/프린팅머니/쿠폰)
// @MX:REASON: fan_in >= 3 (MemberPage, WithdrawnMemberPage, 검색 결과 등)
// @MX:SPEC: SPEC-SKIN-007

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/Tabs';
import { Divider } from '../../ui/Divider';
import { MoneyAdjustDialog } from './MoneyAdjustDialog';
import { ActivityTimeline } from './ActivityTimeline';

// 회원 등급 배지 스타일
const GRADE_STYLES = {
  gold: { label: '골드', bg: '#fef3c7', color: '#92400e' },
  silver: { label: '실버', bg: '#f3f4f6', color: '#374151' },
  normal: { label: '일반', bg: '#f3f4f6', color: '#6b7280' },
};

// 회원 상태 배지
const STATUS_STYLES = {
  active: { label: '활성', bg: '#d1fae5', color: '#065f46' },
  inactive: { label: '비활성', bg: '#f3f4f6', color: '#6b7280' },
  suspended: { label: '정지', bg: '#fee2e2', color: '#991b1b' },
};

/**
 * 회원 상세 Drawer
 * @param {Object|null} member - 선택된 회원
 * @param {boolean} isOpen - 열림 여부
 * @param {Function} onClose - 닫기 핸들러
 * @param {Function} [onMoneyAdjustSuccess] - 프린팅머니 조정 성공 콜백
 */
const MemberDetailDrawer = ({ member, isOpen, onClose, onMoneyAdjustSuccess }) => {
  const [isMoneyDialogOpen, setIsMoneyDialogOpen] = useState(false);

  if (!isOpen) return null;

  const gradeStyle = GRADE_STYLES[member?.grade] ?? GRADE_STYLES.normal;
  const statusStyle = STATUS_STYLES[member?.status] ?? STATUS_STYLES.active;

  // 목업 활동 내역 (실제 API 연동 시 별도 fetch)
  const mockActivities = [
    { id: 1, type: 'order', description: '명함 500매 주문 (ORD-001)', createdAt: '2026-03-10 14:23' },
    { id: 2, type: 'payment', description: '35,000원 결제 완료', createdAt: '2026-03-10 14:24' },
    { id: 3, type: 'money', description: '프린팅머니 5,000원 적립', createdAt: '2026-03-10 14:24' },
    { id: 4, type: 'login', description: '로그인', createdAt: '2026-03-15 09:12' },
  ];

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.3)' }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '560px',
          maxWidth: '100vw',
          background: 'var(--huni-bg-surface)',
          borderLeft: '1px solid var(--huni-border-default)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* 헤더 */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--huni-spacing-sm)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--huni-font-size-md)', fontWeight: 'var(--huni-font-weight-semibold)', color: 'var(--huni-text-primary)' }}>
              회원 상세
            </h3>
            {member && (
              <>
                <span style={{ padding: '2px 8px', background: gradeStyle.bg, color: gradeStyle.color, fontSize: 'var(--huni-font-size-xs)', borderRadius: 'var(--huni-radius-xs)', fontWeight: 'var(--huni-font-weight-medium)' }}>
                  {gradeStyle.label}
                </span>
                <span style={{ padding: '2px 8px', background: statusStyle.bg, color: statusStyle.color, fontSize: 'var(--huni-font-size-xs)', borderRadius: 'var(--huni-radius-xs)', fontWeight: 'var(--huni-font-weight-medium)' }}>
                  {statusStyle.label}
                </span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--huni-text-muted)', fontSize: '20px', lineHeight: 1, padding: '4px' }}
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        {member && (
          <Tabs defaultValue="info" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <TabsList style={{ borderRadius: 0, borderBottom: '1px solid var(--huni-border-default)', padding: '0 var(--huni-spacing-lg)', justifyContent: 'flex-start', background: 'transparent', height: 'auto' }}>
              <TabsTrigger value="info" style={{ borderRadius: 0, padding: 'var(--huni-spacing-sm) var(--huni-spacing-md)' }}>기본정보</TabsTrigger>
              <TabsTrigger value="orders" style={{ borderRadius: 0, padding: 'var(--huni-spacing-sm) var(--huni-spacing-md)' }}>주문내역</TabsTrigger>
              <TabsTrigger value="money" style={{ borderRadius: 0, padding: 'var(--huni-spacing-sm) var(--huni-spacing-md)' }}>프린팅머니</TabsTrigger>
              <TabsTrigger value="coupon" style={{ borderRadius: 0, padding: 'var(--huni-spacing-sm) var(--huni-spacing-md)' }}>쿠폰</TabsTrigger>
            </TabsList>

            {/* 기본정보 탭 */}
            <TabsContent value="info" style={{ flex: 1, overflow: 'auto', padding: 'var(--huni-spacing-lg)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--huni-spacing-md)' }}>
                <InfoGrid items={[
                  { label: '아이디', value: member.memberId },
                  { label: '이름', value: member.name },
                  { label: '이메일', value: member.email },
                  { label: '전화번호', value: member.phone },
                  { label: '가입일', value: member.joinedAt },
                  { label: '최근 로그인', value: member.lastLoginAt },
                  { label: '총 주문 수', value: `${member.totalOrders}건` },
                  { label: '총 결제 금액', value: `${(member.totalAmount ?? 0).toLocaleString()}원` },
                ]} />

                {member.address && (
                  <>
                    <Divider />
                    <div>
                      <SectionTitle>배송지</SectionTitle>
                      <InfoGrid items={[
                        { label: '우편번호', value: member.address.zipCode },
                        { label: '주소', value: member.address.address1 },
                        { label: '상세주소', value: member.address.address2 || '-' },
                      ]} />
                    </div>
                  </>
                )}

                <Divider />
                <div>
                  <SectionTitle>활동 내역</SectionTitle>
                  <ActivityTimeline activities={mockActivities} />
                </div>
              </div>
            </TabsContent>

            {/* 주문내역 탭 */}
            <TabsContent value="orders" style={{ flex: 1, overflow: 'auto', padding: 'var(--huni-spacing-lg)' }}>
              <SectionTitle>주문 내역</SectionTitle>
              {(member.orders ?? []).length === 0 ? (
                <EmptyState>주문 내역이 없습니다.</EmptyState>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--huni-font-size-sm)' }}>
                  <thead>
                    <tr style={{ background: 'var(--huni-bg-muted)' }}>
                      {['주문번호', '상품명', '금액', '상태', '주문일'].map((h) => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--huni-text-secondary)', fontWeight: 'var(--huni-font-weight-medium)', borderBottom: '1px solid var(--huni-border-default)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {member.orders.map((order) => (
                      <tr key={order.orderId} style={{ borderBottom: '1px solid var(--huni-border-subtle)' }}>
                        <td style={{ padding: '8px 12px', color: 'var(--huni-color-brand)' }}>{order.orderId}</td>
                        <td style={{ padding: '8px 12px' }}>{order.productName}</td>
                        <td style={{ padding: '8px 12px' }}>{order.amount.toLocaleString()}원</td>
                        <td style={{ padding: '8px 12px' }}>{order.status}</td>
                        <td style={{ padding: '8px 12px', color: 'var(--huni-text-muted)' }}>{order.orderedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </TabsContent>

            {/* 프린팅머니 탭 */}
            <TabsContent value="money" style={{ flex: 1, overflow: 'auto', padding: 'var(--huni-spacing-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--huni-spacing-md)' }}>
                <div>
                  <SectionTitle>프린팅머니</SectionTitle>
                  <p style={{ margin: '4px 0 0', fontSize: 'var(--huni-font-size-lg)', fontWeight: 'var(--huni-font-weight-bold)', color: 'var(--huni-text-primary)' }}>
                    {(member.printingMoney ?? 0).toLocaleString()}원
                  </p>
                </div>
                <button
                  onClick={() => setIsMoneyDialogOpen(true)}
                  style={{ padding: 'var(--huni-spacing-xs) var(--huni-spacing-md)', background: 'var(--huni-color-brand)', color: '#fff', border: 'none', borderRadius: 'var(--huni-radius-sm)', fontSize: 'var(--huni-font-size-sm)', cursor: 'pointer' }}
                >
                  지급/차감
                </button>
              </div>
              <Divider />
              <SectionTitle style={{ marginTop: 'var(--huni-spacing-md)' }}>적립/사용 내역</SectionTitle>
              {(member.moneyHistory ?? []).length === 0 ? (
                <EmptyState>내역이 없습니다.</EmptyState>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--huni-spacing-xs)' }}>
                  {member.moneyHistory.map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--huni-spacing-sm)', background: 'var(--huni-bg-muted)', borderRadius: 'var(--huni-radius-sm)' }}>
                      <div>
                        <span style={{ fontSize: 'var(--huni-font-size-sm)', color: 'var(--huni-text-primary)' }}>{h.reason}</span>
                        <span style={{ marginLeft: '8px', fontSize: 'var(--huni-font-size-xs)', color: 'var(--huni-text-muted)' }}>{h.createdAt}</span>
                      </div>
                      <span style={{ fontSize: 'var(--huni-font-size-sm)', fontWeight: 'var(--huni-font-weight-medium)', color: h.type === 'earn' ? '#10b981' : 'var(--huni-color-error)' }}>
                        {h.type === 'earn' ? '+' : '-'}{h.amount.toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* 쿠폰 탭 */}
            <TabsContent value="coupon" style={{ flex: 1, overflow: 'auto', padding: 'var(--huni-spacing-lg)' }}>
              <SectionTitle>보유 쿠폰</SectionTitle>
              {(member.coupons ?? []).length === 0 ? (
                <EmptyState>보유 쿠폰이 없습니다.</EmptyState>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--huni-spacing-sm)' }}>
                  {member.coupons.map((coupon) => (
                    <div
                      key={coupon.couponId}
                      style={{
                        padding: 'var(--huni-spacing-sm) var(--huni-spacing-md)',
                        border: '1px solid var(--huni-border-default)',
                        borderRadius: 'var(--huni-radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontSize: 'var(--huni-font-size-sm)', fontWeight: 'var(--huni-font-weight-medium)', color: 'var(--huni-text-primary)' }}>
                          {coupon.name}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 'var(--huni-font-size-xs)', color: 'var(--huni-text-muted)' }}>
                          {coupon.discountType === 'percent' ? `${coupon.discountValue}% 할인` : `${coupon.discountValue.toLocaleString()}원 할인`} | 만료: {coupon.expiredAt}
                        </p>
                      </div>
                      <span style={{ padding: '2px 8px', background: coupon.status === 'unused' ? '#d1fae5' : '#f3f4f6', color: coupon.status === 'unused' ? '#065f46' : '#6b7280', fontSize: 'var(--huni-font-size-xs)', borderRadius: 'var(--huni-radius-xs)' }}>
                        {coupon.status === 'unused' ? '미사용' : '사용완료'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* 프린팅머니 지급/차감 Dialog */}
      <MoneyAdjustDialog
        isOpen={isMoneyDialogOpen}
        onClose={() => setIsMoneyDialogOpen(false)}
        member={member}
        onSuccess={() => {
          setIsMoneyDialogOpen(false);
          onMoneyAdjustSuccess?.();
        }}
      />
    </>
  );
};

// 정보 그리드
const InfoGrid = ({ items }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--huni-spacing-sm)' }}>
    {items.map(({ label, value }) => (
      <div key={label}>
        <p style={{ margin: 0, fontSize: 'var(--huni-font-size-xs)', color: 'var(--huni-text-muted)' }}>{label}</p>
        <p style={{ margin: '2px 0 0', fontSize: 'var(--huni-font-size-sm)', color: 'var(--huni-text-primary)' }}>{value ?? '-'}</p>
      </div>
    ))}
  </div>
);

const SectionTitle = ({ children, style }) => (
  <p style={{ margin: '0 0 var(--huni-spacing-sm)', fontSize: 'var(--huni-font-size-sm)', fontWeight: 'var(--huni-font-weight-semibold)', color: 'var(--huni-text-secondary)', ...style }}>
    {children}
  </p>
);

const EmptyState = ({ children }) => (
  <div style={{ padding: 'var(--huni-spacing-xl)', textAlign: 'center', color: 'var(--huni-text-muted)', fontSize: 'var(--huni-font-size-sm)' }}>
    {children}
  </div>
);

export { MemberDetailDrawer };
