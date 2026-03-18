/**
 * ChatWidget 테스트 - 우하단 플로팅 카카오 채널 버튼
 *
 * SPEC-SKIN-004 Section 8.1 #5: 채팅 위젯 플레이스홀더
 * - 우하단 고정 위치 (fixed bottom-6 right-6)
 * - 카카오 채널 링크 열기
 * - 접근성 (aria-label)
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

import ChatWidget from '../../components/ChatWidget';

describe('ChatWidget', () => {
  it('버튼을 렌더링한다', () => {
    render(<ChatWidget />);
    expect(screen.getByRole('button', { name: /카카오 채널 상담하기/ })).toBeInTheDocument();
  });

  it('클릭 시 카카오 채널 링크를 연다', () => {
    const windowOpen = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<ChatWidget />);

    fireEvent.click(screen.getByRole('button'));

    expect(windowOpen).toHaveBeenCalledWith(
      expect.stringContaining('pf.kakao.com'),
      '_blank',
      'noopener,noreferrer'
    );
    windowOpen.mockRestore();
  });

  it('우하단 고정 위치 스타일을 적용한다', () => {
    render(<ChatWidget />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('fixed');
    expect(btn.className).toContain('bottom-6');
    expect(btn.className).toContain('right-6');
  });

  it('z-50 z-index를 적용한다', () => {
    render(<ChatWidget />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('z-50');
  });

  it('aria-label 접근성을 제공한다', () => {
    render(<ChatWidget />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-label', '카카오 채널 상담하기');
  });

  it('카카오 노란색 배경을 적용한다', () => {
    render(<ChatWidget />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-[#FEE500]');
  });

  it('둥근 형태 (rounded-full)를 적용한다', () => {
    render(<ChatWidget />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('rounded-full');
  });

  it('추가 className을 받을 수 있다', () => {
    render(<ChatWidget className="custom-class" />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('custom-class');
  });
});
