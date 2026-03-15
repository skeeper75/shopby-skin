import { useState, useEffect } from 'react';

import { cn } from '../../../lib/utils';
import StatCard from '../../../components/admin/StatCard';

// @MX:NOTE: [AUTO] 관리자 대시보드 페이지 - 통계 카드 6개, 최근 주문 테이블, 월매출 차트 영역
// @MX:SPEC: SPEC-SKIN-005
// @MX:TODO: [AUTO] 테스트 미작성 - 통계 데이터 렌더링 및 API 연동 후 로딩 상태 검증 필요

// 통계 카드 아이콘 정의
const STAT_ICONS = {
  newOrder: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  fileWait: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  production: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  shipping: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  ),
  inquiry: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  unpaid: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// 목업 최근 주문 데이터
const MOCK_RECENT_ORDERS = [
  { orderNo: 'ORD-20260315-001', customerName: '김후니', productName: '명함 500매', amount: 45000, status: '신규주문', date: '2026-03-15' },
  { orderNo: 'ORD-20260315-002', customerName: '이프린', productName: '전단지 A4 양면 1000매', amount: 120000, status: '파일대기', date: '2026-03-15' },
  { orderNo: 'ORD-20260314-003', customerName: '박인쇄', productName: '리플릿 3단 500부', amount: 85000, status: '제작중', date: '2026-03-14' },
  { orderNo: 'ORD-20260314-004', customerName: '최디자', productName: '포스터 A2 100매', amount: 200000, status: '배송중', date: '2026-03-14' },
  { orderNo: 'ORD-20260313-005', customerName: '정스티', productName: '스티커 원형 2000매', amount: 35000, status: '완료', date: '2026-03-13' },
];

// 주문 상태별 배지 색상 매핑
const STATUS_BADGE_STYLES = {
  신규주문: 'bg-blue-100 text-blue-700',
  파일대기: 'bg-yellow-100 text-yellow-700',
  제작중: 'bg-purple-100 text-purple-700',
  배송중: 'bg-green-100 text-green-700',
  완료: 'bg-gray-100 text-gray-500',
};

/**
 * 관리자 대시보드 페이지
 * - 6개 통계 카드 (그리드 배치)
 * - 최근 주문 테이블 (최근 5건)
 * - 월매출 차트 영역 (placeholder)
 */
const Dashboard = () => {
  // 목업 통계 데이터
  const [stats, setStats] = useState({
    newOrders: 12,
    fileWaiting: 8,
    inProduction: 23,
    inShipping: 15,
    pendingInquiry: 5,
    unpaidAmount: 3,
  });

  const [recentOrders, setRecentOrders] = useState(MOCK_RECENT_ORDERS);

  // TODO: 실제 API 연동 시 아래 코드 활성화
  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     const orders = await fetchHttpRequest({
  //       url: 'admin/orders',
  //       query: { limit: 5 },
  //     });
  //     setRecentOrders(orders);
  //   };
  //   fetchDashboardData();
  // }, []);

  // 금액 포맷팅 (원 단위)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <h2 className="text-xl font-semibold text-[#424242]" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600 }}>
        대시보드
      </h2>

      {/* 통계 카드 그리드 (6개) */}
      <div className="grid grid-cols-3 gap-4 xl:grid-cols-6">
        <StatCard icon={STAT_ICONS.newOrder} value={stats.newOrders} label="신규주문" />
        <StatCard icon={STAT_ICONS.fileWait} value={stats.fileWaiting} label="파일대기" />
        <StatCard icon={STAT_ICONS.production} value={stats.inProduction} label="제작중" />
        <StatCard icon={STAT_ICONS.shipping} value={stats.inShipping} label="배송중" />
        <StatCard icon={STAT_ICONS.inquiry} value={stats.pendingInquiry} label="문의대기" />
        <StatCard icon={STAT_ICONS.unpaid} value={stats.unpaidAmount} label="미수금" />
      </div>

      {/* 하단 영역: 최근 주문 + 월매출 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 최근 주문 테이블 (2/3 너비) */}
        <div className="xl:col-span-2 bg-white rounded-lg border border-[#CACACA] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#CACACA]">
            <h3 className="text-base font-semibold text-[#424242]">최근 주문 (5건)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F6F6F6] text-[#424242]">
                  <th className="text-left px-5 py-3 font-medium">주문번호</th>
                  <th className="text-left px-5 py-3 font-medium">주문자</th>
                  <th className="text-left px-5 py-3 font-medium">상품명</th>
                  <th className="text-right px-5 py-3 font-medium">금액</th>
                  <th className="text-center px-5 py-3 font-medium">상태</th>
                  <th className="text-center px-5 py-3 font-medium">주문일</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.orderNo} className="border-t border-[#CACACA]/50 hover:bg-[#F6F6F6]/50 transition-colors">
                    <td className="px-5 py-3 text-[#5538B6] font-medium">{order.orderNo}</td>
                    <td className="px-5 py-3 text-[#424242]">{order.customerName}</td>
                    <td className="px-5 py-3 text-[#424242]">{order.productName}</td>
                    <td className="px-5 py-3 text-right text-[#424242]">{formatCurrency(order.amount)}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-medium', STATUS_BADGE_STYLES[order.status])}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-[#979797]">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 월매출 차트 영역 (1/3 너비, placeholder) */}
        <div className="bg-white rounded-lg border border-[#CACACA] p-5">
          <h3 className="text-base font-semibold text-[#424242] mb-4">월별 매출</h3>
          {/* 차트 placeholder */}
          <div className="h-[280px] bg-[#F6F6F6] rounded-lg flex items-center justify-center">
            <div className="text-center text-[#979797]">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm">차트 영역</p>
              <p className="text-xs mt-1">(차트 라이브러리 연동 예정)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
