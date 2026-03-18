import React from 'react';

import { cn } from '../../lib/utils';

// 회사 주소 및 연락처 정보
const CONTACT_INFO = {
  address: '서울특별시 강남구 테헤란로 521, 파르나스타워 28층',
  zipcode: '06164',
  phone: '1588-0000',
  email: 'support@shopby-print.com',
  businessHours: '평일 09:00 - 18:00 (점심시간 12:00 - 13:00, 주말/공휴일 휴무)',
};

// 교통편 안내
const TRANSPORT_INFO = [
  {
    type: '지하철',
    details: [
      '2호선 삼성역 5번 출구 도보 5분',
      '9호선 봉은사역 7번 출구 도보 8분',
    ],
  },
  {
    type: '버스',
    details: [
      '테헤란로 정류장 하차 - 146, 360, 740번',
      '삼성역 정류장 하차 - 2311, 3412번',
    ],
  },
  {
    type: '자가용',
    details: [
      '파르나스타워 지하 주차장 이용 (30분 무료)',
      '내비게이션: "파르나스타워" 검색',
    ],
  },
];

// 오시는길 페이지
// @MX:NOTE: [AUTO] [Directions] 오시는길 - 지도 임베드 플레이스홀더 + 주소/교통편 안내
const Directions = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      {/* 페이지 제목 */}
      <div className="text-center mb-10">
        <h1 className="text-[28px] font-[700] text-[#424242] mb-3">오시는 길</h1>
        <p className="text-[15px] text-[#888]">저희 사무소를 방문하시기 전에 아래 정보를 확인해 주세요.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 지도 영역 */}
        <div className="lg:flex-1">
          <MapPlaceholder />
        </div>

        {/* 위치 정보 */}
        <div className="lg:w-[380px] shrink-0 space-y-6">
          {/* 주소 및 연락처 */}
          <div className="bg-white border border-[#CACACA] rounded-[8px] p-6">
            <h2 className="text-[18px] font-[700] text-[#424242] mb-4">주소 및 연락처</h2>

            <InfoRow icon={<LocationIcon />} label="주소">
              <p className="text-[14px] text-[#424242]">{CONTACT_INFO.address}</p>
              <p className="text-[12px] text-[#888] mt-0.5">우편번호: {CONTACT_INFO.zipcode}</p>
            </InfoRow>

            <InfoRow icon={<PhoneIcon />} label="전화">
              <a href={`tel:${CONTACT_INFO.phone}`} className="text-[14px] text-[#5538B6] hover:underline">
                {CONTACT_INFO.phone}
              </a>
            </InfoRow>

            <InfoRow icon={<EmailIcon />} label="이메일">
              <a href={`mailto:${CONTACT_INFO.email}`} className="text-[14px] text-[#5538B6] hover:underline">
                {CONTACT_INFO.email}
              </a>
            </InfoRow>

            <InfoRow icon={<ClockIcon />} label="업무 시간" isLast>
              <p className="text-[14px] text-[#424242] leading-relaxed">{CONTACT_INFO.businessHours}</p>
            </InfoRow>
          </div>

          {/* 교통편 안내 */}
          <div className="bg-white border border-[#CACACA] rounded-[8px] p-6">
            <h2 className="text-[18px] font-[700] text-[#424242] mb-4">교통편 안내</h2>
            <div className="space-y-5">
              {TRANSPORT_INFO.map((transport, idx) => (
                <TransportSection
                  key={transport.type}
                  transport={transport}
                  isLast={idx === TRANSPORT_INFO.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 지도 플레이스홀더 (실제 구현 시 Kakao/Naver 지도 API 연동)
const MapPlaceholder = () => (
  <div
    className={cn(
      'w-full min-h-[400px] lg:min-h-[500px]',
      'bg-[#F6F6F6] border border-[#CACACA] rounded-[8px]',
      'flex flex-col items-center justify-center text-center'
    )}
    role="img"
    aria-label="지도 영역"
  >
    {/* 지도 아이콘 */}
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4" aria-hidden="true">
      <circle cx="32" cy="28" r="16" stroke="#CACACA" strokeWidth="3" fill="none" />
      <path d="M32 12C23.16 12 16 19.16 16 28C16 38.96 32 56 32 56C32 56 48 38.96 48 28C48 19.16 40.84 12 32 12Z" stroke="#CACACA" strokeWidth="3" fill="none" />
      <circle cx="32" cy="28" r="5" fill="#CACACA" />
    </svg>
    <p className="text-[16px] text-[#CACACA] font-[600] mb-2">지도</p>
    <p className="text-[13px] text-[#AAAAAA]">
      카카오맵 또는 네이버 지도 API 연동 예정
    </p>
    <p className="text-[12px] text-[#CACACA] mt-2">파르나스타워, 서울 강남구 테헤란로 521</p>
  </div>
);

// 정보 행 컴포넌트
const InfoRow = ({ icon, label, children, isLast = false }) => (
  <div className={cn('flex gap-3 py-3', !isLast && 'border-b border-[#F0F0F0]')}>
    <div className="w-5 h-5 text-[#5538B6] shrink-0 mt-0.5">{icon}</div>
    <div className="flex-1">
      <p className="text-[12px] text-[#888] mb-1">{label}</p>
      {children}
    </div>
  </div>
);

// 교통편 섹션
const TransportSection = ({ transport, isLast }) => (
  <div className={cn('pb-4', !isLast && 'border-b border-[#F0F0F0]')}>
    <h3 className="text-[14px] font-[700] text-[#5538B6] mb-2">{transport.type}</h3>
    <ul className="space-y-1">
      {transport.details.map((detail, i) => (
        <li key={i} className="text-[13px] text-[#424242] flex items-start gap-2">
          <span className="text-[#CACACA] mt-0.5 shrink-0">•</span>
          {detail}
        </li>
      ))}
    </ul>
  </div>
);

// SVG 아이콘들
const LocationIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

export default Directions;
