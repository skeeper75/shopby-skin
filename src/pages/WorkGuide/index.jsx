import React from 'react';
import { Link } from 'react-router-dom';

import GuideCard from '../../components/GuideCard';

// 작업 가이드 목록 데이터
// @MX:NOTE: [AUTO] [GUIDE_LIST] 11개 가이드 항목 목록 - 추가/삭제 시 라우터도 함께 수정 필요
const GUIDE_LIST = [
  {
    id: 'monitor-color',
    title: '모니터 색상 보정',
    icon: null,
    description: '모니터 색상과 인쇄 색상의 차이를 최소화하는 방법을 안내합니다.',
  },
  {
    id: 'color-settings',
    title: '색상 설정 방법',
    icon: null,
    description: 'CMYK 색상 모드 설정으로 정확한 인쇄 색상을 구현하는 방법을 안내합니다.',
  },
  {
    id: 'cutting-line',
    title: '재단선 설정',
    icon: null,
    description: '재단선(도련) 설정 방법과 안전 영역에 대해 안내합니다.',
  },
  {
    id: 'paper-selection',
    title: '용지 선택 가이드',
    icon: null,
    description: '인쇄 목적에 맞는 용지 선택 방법을 안내합니다.',
  },
  {
    id: 'coating-guide',
    title: '코팅 종류 안내',
    icon: null,
    description: '유광, 무광, 매트 등 코팅 종류별 특성을 안내합니다.',
  },
  {
    id: 'finishing-guide',
    title: '후가공 안내',
    icon: null,
    description: '박, 형압, 홀로그램 등 다양한 후가공 옵션을 안내합니다.',
  },
  {
    id: 'file-format',
    title: '파일 형식 안내',
    icon: null,
    description: '인쇄용 파일 형식(PDF, AI, PSD 등) 저장 방법을 안내합니다.',
  },
  {
    id: 'resolution',
    title: '해상도 설정',
    icon: null,
    description: '고품질 인쇄를 위한 적정 해상도 설정 방법을 안내합니다.',
  },
  {
    id: 'overprint',
    title: '중복 인쇄(오버프린트)',
    icon: null,
    description: '오버프린트 설정으로 색상 겹침 문제를 방지하는 방법을 안내합니다.',
  },
  {
    id: 'spot-color',
    title: '별색(스팟 컬러)',
    icon: null,
    description: '별색 사용 시 주의사항 및 변환 방법을 안내합니다.',
  },
  {
    id: 'folding',
    title: '접지 방식 안내',
    icon: null,
    description: '2단, 3단, 4단 등 다양한 접지 방식을 안내합니다.',
  },
];

// 작업 가이드 인덱스 페이지 - 카드 그리드 (모바일 2열, 데스크탑 3열)
const WorkGuide = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="text-center mb-10">
        <h1 className="text-[28px] font-[700] text-[#424242] mb-3">작업 가이드</h1>
        <p className="text-[15px] text-[#888] leading-relaxed">
          고품질 인쇄물 제작을 위한 파일 작업 가이드를 확인하세요.
        </p>
      </div>

      {/* 가이드 카드 그리드: 모바일 2열, 태블릿+ 3열 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {GUIDE_LIST.map((guide) => (
          <GuideCard
            key={guide.id}
            icon={<GuideIconPlaceholder />}
            title={guide.title}
            href={`/guide/work/${guide.id}`}
          />
        ))}
      </div>
    </div>
  );
};

// 가이드 아이콘 플레이스홀더 SVG
const GuideIconPlaceholder = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="48" height="48" rx="8" fill="#EEEBF9" />
    <path d="M14 34V16C14 14.9 14.9 14 16 14H28L34 20V34C34 35.1 33.1 36 32 36H16C14.9 36 14 35.1 14 34Z" stroke="#5538B6" strokeWidth="2" fill="none" />
    <path d="M28 14V20H34" stroke="#5538B6" strokeWidth="2" strokeLinecap="round" />
    <path d="M19 24H29M19 28H25" stroke="#5538B6" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default WorkGuide;
