/**
 * StatCard 테스트 - 대시보드 통계 카드
 *
 * SPEC-SKIN-005 REQ-005-001: 대시보드 통계
 * - 아이콘, 값, 라벨 렌더링
 * - Huni 디자인 토큰 적용
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

import StatCard from '../../components/admin/StatCard';

describe('StatCard', () => {
  const defaultProps = {
    label: '오늘 주문',
    value: 42,
    icon: <span data-testid="stat-icon">아이콘</span>,
  };

  it('라벨을 렌더링한다', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('오늘 주문')).toBeInTheDocument();
  });

  it('값을 렌더링한다', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('아이콘을 렌더링한다', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
  });

  it('문자열 값도 표시한다', () => {
    render(<StatCard {...defaultProps} value="1,234,567원" />);
    expect(screen.getByText('1,234,567원')).toBeInTheDocument();
  });

  it('카드에 rounded-lg 스타일을 적용한다', () => {
    const { container } = render(<StatCard {...defaultProps} />);
    expect(container.firstChild.className).toContain('rounded-lg');
  });

  it('border 스타일을 적용한다', () => {
    const { container } = render(<StatCard {...defaultProps} />);
    expect(container.firstChild.className).toContain('border');
  });

  it('hover 시 배경색 변경 클래스가 있다', () => {
    const { container } = render(<StatCard {...defaultProps} />);
    expect(container.firstChild.className).toContain('hover:bg-[#EEEBF9]');
  });

  it('추가 className을 적용할 수 있다', () => {
    const { container } = render(<StatCard {...defaultProps} className="custom-class" />);
    expect(container.firstChild.className).toContain('custom-class');
  });
});
