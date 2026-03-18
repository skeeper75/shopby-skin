import React from 'react';
import { Link } from 'react-router-dom';

import HeroBanner from '../../components/HeroBanner';
import ReviewCard from '../../components/ReviewCard';
import { cn } from '../../lib/utils';

// @MX:ANCHOR: [AUTO] [LandingTemplate] 랜딩 페이지 공통 템플릿 - 5개 랜딩 페이지 변형 모두 사용
// @MX:REASON: fan_in >= 3, Paper/Binding/Calendar/Pouch/Sticker 랜딩 페이지에서 재사용
/**
 * 랜딩 페이지 공통 템플릿
 * HeroBanner + 추천 상품 + 리뷰 + CTA 구성
 *
 * @param {object} config - 랜딩 페이지 설정값
 */
const LandingTemplate = ({ config }) => {
  const {
    heroImage,
    heroTitle,
    heroSubtitle,
    heroCta,
    heroCtaLink,
    products = [],
    reviews = [],
    ctaSection,
  } = config;

  return (
    <div className="w-full">
      {/* 히어로 배너 */}
      <HeroBanner
        image={heroImage}
        title={heroTitle}
        subtitle={heroSubtitle}
        ctaText={heroCta}
        ctaLink={heroCtaLink ?? '#'}
      />

      {/* 추천 상품 섹션: 흰 배경 */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <SectionTitle>추천 상품</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {products.length > 0
              ? products.map((product, i) => (
                  <ProductCard key={i} product={product} />
                ))
              : Array.from({ length: 4 }, (_, i) => (
                  <ProductCardPlaceholder key={i} />
                ))}
          </div>
        </div>
      </section>

      {/* 리뷰 섹션: #F6F6F6 배경 */}
      <section className="bg-[#F6F6F6] py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <SectionTitle>고객 리뷰</SectionTitle>
          <div className="columns-2 md:columns-3 gap-4 mt-8">
            {reviews.length > 0
              ? reviews.map((review, i) => (
                  <ReviewCard key={i} {...review} />
                ))
              : Array.from({ length: 6 }, (_, i) => (
                  <ReviewCardPlaceholder key={i} />
                ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션: 흰 배경 */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-[28px] font-[700] text-[#424242] mb-4">
            {ctaSection?.title ?? '지금 바로 주문하세요'}
          </h2>
          <p className="text-[16px] text-[#888] mb-8 leading-relaxed">
            {ctaSection?.description ?? '빠른 배송과 고품질 인쇄로 만족스러운 결과물을 제공합니다.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* 주문 버튼 */}
            <Link
              to={ctaSection?.orderLink ?? '#'}
              className={cn(
                'inline-flex items-center justify-center h-[50px] px-10',
                'bg-[#5538B6] text-white rounded-[5px] text-[16px] font-[600]',
                'hover:bg-[#4429A0] transition-colors duration-200'
              )}
            >
              {ctaSection?.orderText ?? '바로 주문하기'}
            </Link>
            {/* 견적 버튼 */}
            {ctaSection?.quoteLink && (
              <Link
                to={ctaSection.quoteLink}
                className={cn(
                  'inline-flex items-center justify-center h-[50px] px-10',
                  'bg-white text-[#5538B6] border-2 border-[#5538B6] rounded-[5px] text-[16px] font-[600]',
                  'hover:bg-[#EEEBF9] transition-colors duration-200'
                )}
              >
                {ctaSection?.quoteText ?? '견적 문의하기'}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

// 섹션 제목 공통
const SectionTitle = ({ children }) => (
  <h2 className="text-[24px] font-[700] text-[#424242] text-center">{children}</h2>
);

// 상품 카드
const ProductCard = ({ product }) => (
  <Link to={product.link ?? '#'} className="block group">
    <div className="aspect-square bg-[#F6F6F6] rounded-[8px] overflow-hidden mb-3">
      {product.image ? (
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[#CACACA] text-[12px]">이미지 준비 중</div>
      )}
    </div>
    <p className="text-[14px] font-[600] text-[#424242] mb-1 truncate">{product.name}</p>
    {product.price && (
      <p className="text-[14px] text-[#5538B6] font-[700]">{product.price.toLocaleString()}원~</p>
    )}
  </Link>
);

// 상품 카드 플레이스홀더
const ProductCardPlaceholder = () => (
  <div>
    <div className="aspect-square bg-[#F6F6F6] rounded-[8px] mb-3 flex items-center justify-center text-[#CACACA] text-[12px]">
      상품 준비 중
    </div>
    <div className="h-4 bg-[#F0F0F0] rounded mb-2" />
    <div className="h-4 bg-[#F0F0F0] rounded w-1/2" />
  </div>
);

// 리뷰 카드 플레이스홀더
const ReviewCardPlaceholder = () => (
  <div className="bg-white border border-[#CACACA] rounded-[8px] p-4 mb-4 break-inside-avoid">
    <div className="aspect-square bg-[#F6F6F6] rounded mb-3 flex items-center justify-center text-[#CACACA] text-[12px]">
      리뷰 이미지
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-[#F0F0F0] rounded" />
      <div className="h-3 bg-[#F0F0F0] rounded w-3/4" />
    </div>
  </div>
);

export default LandingTemplate;
