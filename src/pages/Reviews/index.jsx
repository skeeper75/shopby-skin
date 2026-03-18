import React, { useState, useEffect } from 'react';

import ReviewCard from '../../components/ReviewCard';
import { fetchHttpRequest } from '../../utils/api';
import { cn } from '../../lib/utils';

// 별점 분포 샘플 데이터 (API 연동 전 fallback)
const RATING_SAMPLE = { 5: 1240, 4: 387, 3: 98, 2: 31, 1: 12 };

// 리뷰 메인 페이지 - 마소니리 그리드 + 별점 분포 차트
// @MX:NOTE: [AUTO] [ReviewsPage] 리뷰 메인 - GET /products/reviews API 연동, 마소니리 2열 그리드
const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [ratingDist, setRatingDist] = useState(RATING_SAMPLE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 리뷰 데이터 로드
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const data = await fetchHttpRequest({
          url: 'products/reviews',
          query: { pageNumber: 1, pageSize: 20 },
        });
        if (data?.items) {
          setReviews(data.items);
        }
      } catch (err) {
        // API 호출 실패 시 빈 목록으로 폴백 (플레이스홀더 표시)
        setError(null);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  // 전체 리뷰 수 계산
  const totalReviews = Object.values(ratingDist).reduce((acc, val) => acc + val, 0);

  // 평균 별점 계산
  const avgRating = totalReviews > 0
    ? (Object.entries(ratingDist).reduce((acc, [star, count]) => acc + Number(star) * count, 0) / totalReviews).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      {/* 페이지 제목 */}
      <div className="text-center mb-10">
        <h1 className="text-[28px] font-[700] text-[#424242] mb-3">고객 리뷰</h1>
        <p className="text-[15px] text-[#888]">실제 구매 고객의 솔직한 후기를 확인하세요.</p>
      </div>

      {/* 별점 요약 섹션 */}
      <div className="bg-white border border-[#CACACA] rounded-[8px] p-8 mb-10">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* 평균 별점 표시 */}
          <div className="text-center shrink-0">
            <div className="text-[56px] font-[700] text-[#424242] leading-none">{avgRating}</div>
            <div className="flex justify-center gap-1 my-2">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={cn('text-[24px]', i < Math.round(Number(avgRating)) ? 'text-[#FFB800]' : 'text-[#CACACA]')}
                  aria-hidden="true"
                >
                  ★
                </span>
              ))}
            </div>
            <div className="text-[13px] text-[#888]">총 {totalReviews.toLocaleString()}개 리뷰</div>
          </div>

          {/* 별점 분포 바 차트 */}
          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDist[star] ?? 0;
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-[13px] text-[#424242] w-4 shrink-0">{star}</span>
                  <span className="text-[#FFB800] text-[13px] shrink-0">★</span>
                  {/* 진행 바 */}
                  <div className="flex-1 bg-[#F0F0F0] rounded-full h-2">
                    <div
                      className="bg-[#5538B6] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                      role="progressbar"
                      aria-valuenow={Math.round(pct)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <span className="text-[12px] text-[#888] w-12 text-right shrink-0">{count.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 리뷰 마소니리 그리드 */}
      {isLoading ? (
        <ReviewGridSkeleton />
      ) : reviews.length > 0 ? (
        <div className="columns-2 md:columns-3 gap-4">
          {reviews.map((review, i) => (
            <ReviewCard
              key={review.reviewNo ?? i}
              image={review.attachmentUrls?.[0]}
              reviewText={review.reviewContent}
              rating={review.productRating}
              author={maskAuthor(review.writerName)}
              productName={review.productName}
              createdAt={formatDate(review.registrationDate)}
            />
          ))}
        </div>
      ) : (
        // 플레이스홀더 - API 미연동 상태
        <ReviewPlaceholderGrid />
      )}
    </div>
  );
};

// 작성자 마스킹 (예: 홍*동)
const maskAuthor = (name) => {
  if (!name || name.length < 2) return name ?? '';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
};

// 날짜 포맷 (YYYY-MM-DD)
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return String(dateStr).slice(0, 10);
};

// 로딩 스켈레톤
const ReviewGridSkeleton = () => (
  <div className="columns-2 md:columns-3 gap-4">
    {Array.from({ length: 9 }, (_, i) => (
      <div
        key={i}
        className="bg-white border border-[#CACACA] rounded-[8px] mb-4 break-inside-avoid overflow-hidden"
      >
        <div
          className="bg-[#F0F0F0] animate-pulse"
          style={{ height: `${120 + (i % 3) * 60}px` }}
        />
        <div className="p-4 space-y-2">
          <div className="h-3 bg-[#F0F0F0] rounded animate-pulse" />
          <div className="h-3 bg-[#F0F0F0] rounded w-2/3 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

// 플레이스홀더 그리드 (리뷰 없을 때)
const ReviewPlaceholderGrid = () => (
  <div className="columns-2 md:columns-3 gap-4">
    {Array.from({ length: 6 }, (_, i) => (
      <div
        key={i}
        className="bg-white border border-[#CACACA] rounded-[8px] mb-4 break-inside-avoid p-4"
      >
        <div
          className="bg-[#F6F6F6] rounded mb-3 flex items-center justify-center text-[#CACACA] text-[12px]"
          style={{ height: `${100 + (i % 3) * 50}px` }}
        >
          리뷰 이미지
        </div>
        <div className="flex gap-0.5 mb-2">
          {Array.from({ length: 5 }, (_, j) => (
            <span key={j} className="text-[14px] text-[#FFB800]">★</span>
          ))}
        </div>
        <div className="space-y-1">
          <div className="h-3 bg-[#F0F0F0] rounded" />
          <div className="h-3 bg-[#F0F0F0] rounded w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

export default Reviews;
