import React from 'react';
import { Link } from 'react-router-dom';

import { cn } from '../../lib/utils';

// @MX:ANCHOR: [AUTO] [GuideCard] 가이드 카드 공통 컴포넌트 - 작업 가이드/랜딩 페이지 전역에서 사용
// @MX:REASON: fan_in >= 3, GuideIndex/LandingPage 등 다수 페이지에서 재사용
/**
 * 가이드 카드 컴포넌트
 * 아이콘/일러스트 + 제목 + "자세히보기" 링크 형태의 카드
 *
 * @param {string} icon - 카드 상단 아이콘 또는 이미지 URL
 * @param {string} title - 카드 제목
 * @param {string} href - "자세히보기" 링크 URL
 * @param {string} className - 추가 클래스
 */
const GuideCard = ({ icon, title, href = '#', className }) => {
  return (
    <Link
      to={href}
      className={cn(
        // 기본 카드 스타일: 흰 배경, #CACACA 1px 보더, 8px 라운드
        'block bg-white border border-[#CACACA] rounded-[8px] p-6',
        // 호버 시 #5538B6 2px 보더
        'hover:border-[#5538B6] hover:border-2 transition-all duration-200',
        'group cursor-pointer',
        className
      )}
    >
      {/* 아이콘/이미지 영역 */}
      <div className="flex justify-center mb-4">
        {typeof icon === 'string' ? (
          <img src={icon} alt={title} className="w-16 h-16 object-contain" />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center text-[#5538B6]">{icon}</div>
        )}
      </div>

      {/* 제목 영역: Noto Sans 14px 600 #424242 */}
      <h3 className="text-[14px] font-[600] text-[#424242] text-center mb-3 leading-snug">{title}</h3>

      {/* 자세히보기 링크: #5538B6 12px */}
      <p className="text-center text-[12px] text-[#5538B6] group-hover:underline">자세히보기</p>
    </Link>
  );
};

export default GuideCard;
