import React from 'react';

import { cn } from '../../lib/utils';

// @MX:NOTE: [AUTO] [ReviewCard] 마소니리 그리드용 포토 리뷰 카드 - 카드 자체는 크기 제어 없이 부모가 너비 결정
/**
 * 포토 리뷰 카드 컴포넌트
 * 마소니리 그리드에 사용되는 반응형 카드
 *
 * @param {string} image - 상품/리뷰 이미지 URL
 * @param {string} reviewText - 리뷰 본문 텍스트
 * @param {number} rating - 별점 (1~5)
 * @param {string} author - 작성자 이름 (마스킹 처리)
 * @param {string} productName - 상품명
 * @param {string} createdAt - 작성일
 * @param {string} className - 추가 클래스
 */
const ReviewCard = ({ image, reviewText, rating = 5, author, productName, createdAt, className }) => {
  // 별점 렌더링 (최대 5개)
  const renderStars = (score) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={cn(
          'text-[14px]',
          i < score ? 'text-[#FFB800]' : 'text-[#CACACA]'
        )}
        aria-hidden="true"
      >
        ★
      </span>
    ));
  };

  return (
    <div
      className={cn(
        // 카드 기본 스타일: 흰 배경, 보더, 8px 라운드
        'bg-white border border-[#CACACA] rounded-[8px] overflow-hidden',
        'break-inside-avoid mb-4',
        className
      )}
    >
      {/* 상품 이미지 */}
      {image && (
        <div className="w-full aspect-square overflow-hidden">
          <img
            src={image}
            alt={productName ?? '리뷰 이미지'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* 리뷰 내용 */}
      <div className="p-4">
        {/* 별점 */}
        <div className="flex items-center mb-2" aria-label={`별점 ${rating}점`}>
          {renderStars(rating)}
          <span className="ml-1 text-[12px] text-[#424242] font-[600]">{rating}.0</span>
        </div>

        {/* 리뷰 텍스트 */}
        {reviewText && (
          <p className="text-[13px] text-[#424242] leading-relaxed mb-3 line-clamp-4">{reviewText}</p>
        )}

        {/* 상품명 */}
        {productName && (
          <p className="text-[11px] text-[#888] mb-1 truncate">{productName}</p>
        )}

        {/* 작성자 + 날짜 */}
        <div className="flex items-center justify-between">
          {author && (
            <span className="text-[12px] text-[#666] font-[500]">{author}</span>
          )}
          {createdAt && (
            <span className="text-[11px] text-[#AAAAAA]">{createdAt}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
