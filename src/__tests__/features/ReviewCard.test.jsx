/**
 * ReviewCard 테스트 - 이용후기 카드
 *
 * SPEC-SKIN-004 Section 8.4: 리뷰 그리드
 * - 포토 리뷰 이미지 표시
 * - 별점 표시 (1~5)
 * - 작성자명, 날짜, 상품명 표시
 * - 마소니리 그리드 레이아웃 지원
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

import ReviewCard from '../../components/ReviewCard';

describe('ReviewCard', () => {
  const defaultProps = {
    author: '김철수',
    rating: 5,
    reviewText: '품질이 정말 좋아요!',
    createdAt: '2026-03-10',
    productName: '명함 200매',
  };

  it('리뷰 내용을 렌더링한다', () => {
    render(<ReviewCard {...defaultProps} />);
    expect(screen.getByText('품질이 정말 좋아요!')).toBeInTheDocument();
  });

  it('작성자명을 표시한다', () => {
    render(<ReviewCard {...defaultProps} />);
    expect(screen.getByText('김철수')).toBeInTheDocument();
  });

  it('작성 날짜를 표시한다', () => {
    render(<ReviewCard {...defaultProps} />);
    expect(screen.getByText('2026-03-10')).toBeInTheDocument();
  });

  it('상품명을 표시한다', () => {
    render(<ReviewCard {...defaultProps} />);
    expect(screen.getByText('명함 200매')).toBeInTheDocument();
  });

  it('별점 숫자를 표시한다 (5.0)', () => {
    render(<ReviewCard {...defaultProps} rating={5} />);
    expect(screen.getByText('5.0')).toBeInTheDocument();
  });

  it('별 5개를 렌더링한다', () => {
    const { container } = render(<ReviewCard {...defaultProps} rating={5} />);
    const stars = container.querySelectorAll('span[aria-hidden="true"]');
    const filledStars = Array.from(stars).filter((s) => s.textContent === '★' && s.className.includes('#FFB800'));
    expect(filledStars.length).toBe(5);
  });

  it('별점 3점일 때 채워진 별 3개와 빈 별 2개를 표시한다', () => {
    const { container } = render(<ReviewCard {...defaultProps} rating={3} />);
    const stars = container.querySelectorAll('span[aria-hidden="true"]');
    const filledStars = Array.from(stars).filter((s) => s.className.includes('#FFB800'));
    const emptyStars = Array.from(stars).filter((s) => s.className.includes('#CACACA'));
    expect(filledStars.length).toBe(3);
    expect(emptyStars.length).toBe(2);
  });

  it('포토 리뷰 이미지를 표시한다', () => {
    render(<ReviewCard {...defaultProps} image="/images/review/photo1.jpg" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/images/review/photo1.jpg');
  });

  it('이미지가 없는 리뷰도 정상 렌더링된다', () => {
    render(<ReviewCard {...defaultProps} />);
    expect(screen.getByText('품질이 정말 좋아요!')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('aria-label에 별점 정보를 포함한다', () => {
    const { container } = render(<ReviewCard {...defaultProps} rating={4} />);
    const starsContainer = container.querySelector('[aria-label]');
    expect(starsContainer).toHaveAttribute('aria-label', '별점 4점');
  });

  it('흰 배경과 보더를 적용한다', () => {
    const { container } = render(<ReviewCard {...defaultProps} />);
    const card = container.firstChild;
    expect(card.className).toContain('bg-white');
    expect(card.className).toContain('border');
  });

  it('break-inside-avoid 클래스를 적용한다 (마소니리 지원)', () => {
    const { container } = render(<ReviewCard {...defaultProps} />);
    const card = container.firstChild;
    expect(card.className).toContain('break-inside-avoid');
  });
});
