/**
 * HeroBanner 테스트 - 랜딩페이지 히어로 배너
 *
 * SPEC-SKIN-004 REQ-006: 랜딩페이지
 * - 풀너비, min-height 400px
 * - 타이틀 (32px 700 white) + 서브타이틀 (16px 400 white/80)
 * - CTA 링크 (#5538B6 fill, white text)
 * - 배경 이미지
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

import HeroBanner from '../../components/HeroBanner';

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('HeroBanner', () => {
  const defaultProps = {
    title: '종이의 품격을 느끼세요',
    subtitle: '최고 품질의 인쇄 서비스',
    image: '/images/hero/paper.jpg',
    ctaText: '지금 주문하기',
    ctaLink: '/order',
  };

  it('타이틀을 렌더링한다', () => {
    renderWithRouter(<HeroBanner {...defaultProps} />);
    expect(screen.getByText('종이의 품격을 느끼세요')).toBeInTheDocument();
  });

  it('서브타이틀을 렌더링한다', () => {
    renderWithRouter(<HeroBanner {...defaultProps} />);
    expect(screen.getByText('최고 품질의 인쇄 서비스')).toBeInTheDocument();
  });

  it('CTA 링크를 렌더링한다', () => {
    renderWithRouter(<HeroBanner {...defaultProps} />);
    const ctaLink = screen.getByText('지금 주문하기');
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink.closest('a')).toHaveAttribute('href', '/order');
  });

  it('배경 이미지를 설정한다', () => {
    const { container } = renderWithRouter(<HeroBanner {...defaultProps} />);
    const section = container.querySelector('section');
    expect(section.style.backgroundImage).toContain('paper.jpg');
  });

  it('풀너비 레이아웃을 적용한다', () => {
    const { container } = renderWithRouter(<HeroBanner {...defaultProps} />);
    const section = container.querySelector('section');
    expect(section.className).toContain('w-full');
  });

  it('min-height 400px을 적용한다', () => {
    const { container } = renderWithRouter(<HeroBanner {...defaultProps} />);
    const section = container.querySelector('section');
    expect(section.className).toContain('min-h-[400px]');
  });

  it('CTA에 Primary 색상을 적용한다', () => {
    renderWithRouter(<HeroBanner {...defaultProps} />);
    const ctaLink = screen.getByText('지금 주문하기').closest('a');
    expect(ctaLink.className).toContain('bg-[#5538B6]');
  });

  it('타이틀에 흰색 텍스트를 적용한다', () => {
    renderWithRouter(<HeroBanner {...defaultProps} />);
    const title = screen.getByText('종이의 품격을 느끼세요');
    expect(title.className).toContain('text-white');
  });

  it('subtitle이 없으면 서브타이틀을 렌더링하지 않는다', () => {
    const { subtitle, ...propsWithoutSub } = defaultProps;
    renderWithRouter(<HeroBanner {...propsWithoutSub} />);
    expect(screen.queryByText('최고 품질의 인쇄 서비스')).not.toBeInTheDocument();
  });

  it('ctaText가 없으면 CTA를 렌더링하지 않는다', () => {
    const { ctaText, ...propsWithoutCta } = defaultProps;
    renderWithRouter(<HeroBanner {...propsWithoutCta} />);
    expect(screen.queryByText('지금 주문하기')).not.toBeInTheDocument();
  });

  it('이미지가 없으면 Primary 배경색을 적용한다', () => {
    const { image, ...propsWithoutImage } = defaultProps;
    const { container } = renderWithRouter(<HeroBanner {...propsWithoutImage} />);
    const section = container.querySelector('section');
    expect(section.style.backgroundColor).toBe('#5538B6');
  });
});
