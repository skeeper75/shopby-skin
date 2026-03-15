import React from 'react';

import { cn } from '../../lib/utils';

// 회사 연혁 타임라인 데이터
const TIMELINE = [
  { year: '2024', events: ['국내 최대 온라인 인쇄 플랫폼 달성', '누적 주문 100만 건 돌파', '일본 시장 진출'] },
  { year: '2022', events: ['Series B 투자 유치 완료', '임직원 200명 달성', '기업 전용 B2B 서비스 출시'] },
  { year: '2020', events: ['Series A 투자 유치', '모바일 앱 출시', '코로나 비대면 수요 대응 확대'] },
  { year: '2018', events: ['자체 인쇄 공장 설립', '전국 익일 배송 서비스 시작', '대기업 협력사 선정'] },
  { year: '2016', events: ['설립 및 베타 서비스 오픈', '초기 상품 30종 출시'] },
];

// 주요 통계 데이터
const STATS = [
  { label: '설립 연도', value: '2016', unit: '년' },
  { label: '임직원 수', value: '250+', unit: '명' },
  { label: '협력 업체', value: '100+', unit: '개사' },
  { label: '누적 주문', value: '100만+', unit: '건' },
];

// 회사소개 페이지
// @MX:NOTE: [AUTO] [AboutUs] 회사소개 - 타임라인 + 통계 배너 + 비전 섹션
const AboutUs = () => {
  return (
    <div className="w-full">
      {/* 히어로 섹션 */}
      <section className="bg-[#5538B6] py-20 px-4 text-center">
        <h1 className="text-[36px] font-[700] text-white mb-4">회사 소개</h1>
        <p className="text-[18px] text-white/80 max-w-[600px] mx-auto leading-relaxed">
          고품질 인쇄로 고객의 비즈니스와 일상을 더욱 풍요롭게 만들어 드립니다.
        </p>
      </section>

      {/* 통계 배너 */}
      <section className="bg-white py-12 px-4 border-b border-[#F0F0F0]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <StatItem key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* 비전 및 미션 */}
      <section className="bg-[#F6F6F6] py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-[26px] font-[700] text-[#424242] text-center mb-10">비전 & 미션</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VisionCard
              icon="🎯"
              title="Vision"
              description="모든 사람이 전문적인 인쇄물을 쉽고 합리적으로 제작할 수 있는 세상을 만듭니다."
            />
            <VisionCard
              icon="💡"
              title="Mission"
              description="최신 기술과 전문 인쇄 기술을 결합하여 고객에게 최고의 인쇄 경험을 제공합니다."
            />
          </div>
        </div>
      </section>

      {/* 연혁 타임라인 */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-[26px] font-[700] text-[#424242] text-center mb-12">회사 연혁</h2>
          <Timeline items={TIMELINE} />
        </div>
      </section>
    </div>
  );
};

// 통계 아이템
const StatItem = ({ stat }) => (
  <div className="text-center">
    <div className="text-[36px] font-[700] text-[#5538B6] mb-1">
      {stat.value}
      <span className="text-[18px] font-[400] text-[#888] ml-1">{stat.unit}</span>
    </div>
    <div className="text-[14px] text-[#888]">{stat.label}</div>
  </div>
);

// 비전 카드
const VisionCard = ({ title, description }) => (
  <div className="bg-white border border-[#CACACA] rounded-[8px] p-8 text-center hover:border-[#5538B6] hover:border-2 transition-all duration-200">
    <h3 className="text-[20px] font-[700] text-[#5538B6] mb-4">{title}</h3>
    <p className="text-[14px] text-[#424242] leading-relaxed">{description}</p>
  </div>
);

// 타임라인 컴포넌트
const Timeline = ({ items }) => (
  <div className="relative">
    {/* 세로 선 */}
    <div className="absolute left-[72px] top-0 bottom-0 w-[2px] bg-[#EEEBF9]" aria-hidden="true" />

    <div className="space-y-8">
      {items.map((item, idx) => (
        <div key={item.year} className="flex gap-6">
          {/* 연도 */}
          <div className="w-[72px] shrink-0 text-right">
            <span className="text-[16px] font-[700] text-[#5538B6]">{item.year}</span>
          </div>

          {/* 도트 */}
          <div className="relative flex items-start">
            <div className="w-4 h-4 rounded-full bg-[#5538B6] border-2 border-white ring-2 ring-[#5538B6] shrink-0 mt-1 z-10" aria-hidden="true" />
          </div>

          {/* 이벤트 목록 */}
          <div className="flex-1 pb-2">
            <ul className="space-y-2">
              {item.events.map((event, i) => (
                <li key={i} className="text-[14px] text-[#424242]">{event}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AboutUs;
