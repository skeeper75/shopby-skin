/**
 * HuniBadge 테스트 - NEW/BEST/HOT/SALE 4가지 뱃지
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

import HuniBadge from '../../components/HuniBadge/HuniBadge';

describe('HuniBadge', () => {
  it('NEW 뱃지를 렌더링한다', () => {
    render(<HuniBadge type="NEW" />);
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('BEST 뱃지를 렌더링한다', () => {
    render(<HuniBadge type="BEST" />);
    expect(screen.getByText('BEST')).toBeInTheDocument();
  });

  it('HOT 뱃지를 렌더링한다', () => {
    render(<HuniBadge type="HOT" />);
    expect(screen.getByText('HOT')).toBeInTheDocument();
  });

  it('SALE 뱃지를 렌더링한다', () => {
    render(<HuniBadge type="SALE" />);
    expect(screen.getByText('SALE')).toBeInTheDocument();
  });

  it('NEW 뱃지에 보라색 배경이 적용된다', () => {
    render(<HuniBadge type="NEW" />);
    expect(screen.getByText('NEW').className).toContain('bg-[#5538B6]');
  });

  it('HOT 뱃지에 빨간색 배경이 적용된다', () => {
    render(<HuniBadge type="HOT" />);
    expect(screen.getByText('HOT').className).toContain('bg-[#EF4444]');
  });

  it('SALE 뱃지에 금색 배경이 적용된다', () => {
    render(<HuniBadge type="SALE" />);
    expect(screen.getByText('SALE').className).toContain('bg-[#E6B93F]');
  });

  it('알 수 없는 타입에는 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<HuniBadge type="UNKNOWN" />);
    expect(container.firstChild).toBeNull();
  });

  it('추가 className을 받을 수 있다', () => {
    render(<HuniBadge type="NEW" className="custom-class" />);
    expect(screen.getByText('NEW').className).toContain('custom-class');
  });
});
