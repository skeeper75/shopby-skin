/**
 * GuideCard 테스트 - 작업 가이드 카드
 *
 * SPEC-SKIN-004 REQ-005: 작업 가이드
 * - 아이콘/이미지 + 제목 + "자세히보기" 링크
 * - hover 시 테두리 색상 변경 (#5538B6)
 * - 흰 배경, 8px 라운드, #CACACA 보더
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

import GuideCard from '../../components/GuideCard';

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('GuideCard', () => {
  const defaultProps = {
    title: '모니터 색상',
    icon: '/images/guide/monitor.svg',
    href: '/guide/monitor-color',
  };

  it('카드 제목을 렌더링한다', () => {
    renderWithRouter(<GuideCard {...defaultProps} />);
    expect(screen.getByText('모니터 색상')).toBeInTheDocument();
  });

  it('아이콘 이미지를 렌더링한다', () => {
    renderWithRouter(<GuideCard {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/images/guide/monitor.svg');
    expect(img).toHaveAttribute('alt', '모니터 색상');
  });

  it('"자세히보기" 링크를 표시한다', () => {
    renderWithRouter(<GuideCard {...defaultProps} />);
    expect(screen.getByText('자세히보기')).toBeInTheDocument();
  });

  it('링크로 렌더링된다', () => {
    renderWithRouter(<GuideCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/guide/monitor-color');
  });

  it('카드 배경이 흰색이다', () => {
    renderWithRouter(<GuideCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link.className).toContain('bg-white');
  });

  it('카드에 rounded-[8px]을 적용한다', () => {
    renderWithRouter(<GuideCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link.className).toContain('rounded-[8px]');
  });

  it('카드에 테두리를 적용한다', () => {
    renderWithRouter(<GuideCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link.className).toContain('border');
    expect(link.className).toContain('border-[#CACACA]');
  });

  it('추가 className을 받을 수 있다', () => {
    renderWithRouter(<GuideCard {...defaultProps} className="custom-class" />);
    const link = screen.getByRole('link');
    expect(link.className).toContain('custom-class');
  });

  it('아이콘이 React 엘리먼트일 때도 렌더링된다', () => {
    renderWithRouter(<GuideCard {...defaultProps} icon={<span data-testid="icon-element">아이콘</span>} />);
    expect(screen.getByTestId('icon-element')).toBeInTheDocument();
  });
});
