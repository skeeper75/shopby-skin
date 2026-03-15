import React from 'react';
import { Link } from 'react-router-dom';

import { cn } from '../../lib/utils';

// @MX:ANCHOR: [AUTO] [HeroBanner] 히어로 배너 공통 컴포넌트 - 랜딩 페이지 전체에서 재사용
// @MX:REASON: fan_in >= 3, 5개 랜딩 페이지 변형 모두에서 사용
/**
 * 히어로 배너 컴포넌트
 * 전체 너비, 이미지 배경 + 오버레이, 제목/부제목/CTA 버튼
 *
 * @param {string} image - 배경 이미지 URL
 * @param {string} title - 배너 제목 (Noto Sans 32px 700 white)
 * @param {string} subtitle - 배너 부제목 (Noto Sans 16px 400 white, opacity 0.8)
 * @param {string} ctaText - CTA 버튼 텍스트
 * @param {string} ctaLink - CTA 버튼 링크 URL
 * @param {string} className - 추가 클래스
 */
const HeroBanner = ({ image, title, subtitle, ctaText, ctaLink = '#', className }) => {
  return (
    <section
      className={cn(
        // 전체 너비, 최소 높이 400px, 상대 위치
        'relative w-full min-h-[400px] flex items-center justify-center overflow-hidden',
        className
      )}
      style={{
        // 배경 이미지 설정
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: image ? undefined : '#5538B6',
      }}
    >
      {/* 다크 오버레이 */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* 콘텐츠 영역 */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* 제목: Noto Sans 32px 700 white */}
        <h1 className="text-[32px] font-[700] text-white leading-tight mb-4">{title}</h1>

        {/* 부제목: Noto Sans 16px 400 white, opacity 0.8 */}
        {subtitle && (
          <p className="text-[16px] font-[400] text-white/80 mb-8 leading-relaxed">{subtitle}</p>
        )}

        {/* CTA 버튼: #5538B6 fill, white text, h-[50px], radius 5px */}
        {ctaText && (
          <Link
            to={ctaLink}
            className={cn(
              'inline-flex items-center justify-center',
              'h-[50px] px-8',
              'bg-[#5538B6] text-white',
              'rounded-[5px] text-[16px] font-[600]',
              'hover:bg-[#4429A0] transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
            )}
          >
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
