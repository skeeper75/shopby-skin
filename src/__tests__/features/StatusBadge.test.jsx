/**
 * StatusBadge 테스트 - 주문 상태 뱃지
 *
 * SPEC-SKIN-005 REQ-005-002: 주문 상태별 색상 뱃지
 * - 한글 상태명으로 색상 매핑
 * - 인라인 스타일로 색상 적용
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

import StatusBadge from '../../components/admin/StatusBadge';

describe('StatusBadge', () => {
  it('상태 텍스트를 렌더링한다', () => {
    render(<StatusBadge status="접수중" />);
    expect(screen.getByText('접수중')).toBeInTheDocument();
  });

  it('접수중 상태에 보라색 텍스트 스타일을 적용한다', () => {
    const { container } = render(<StatusBadge status="접수중" />);
    expect(container.firstChild.style.color).toBe('#5538B6');
  });

  it('접수중 상태에 보라색 배경 스타일을 적용한다', () => {
    const { container } = render(<StatusBadge status="접수중" />);
    expect(container.firstChild.style.backgroundColor).toBe('#EEEBF9');
  });

  it('제작중 상태에 노란색 스타일을 적용한다', () => {
    const { container } = render(<StatusBadge status="제작중" />);
    expect(container.firstChild.style.color).toBe('#E6B93F');
  });

  it('배송중 상태에 민트색 스타일을 적용한다', () => {
    const { container } = render(<StatusBadge status="배송중" />);
    expect(container.firstChild.style.color).toBe('#7AC8C4');
  });

  it('배송완료 상태에 민트색 배경 스타일을 적용한다', () => {
    const { container } = render(<StatusBadge status="배송완료" />);
    expect(container.firstChild.style.backgroundColor).toBe('#E0F7F6');
  });

  it('취소 상태에 빨간색 스타일을 적용한다', () => {
    const { container } = render(<StatusBadge status="취소" />);
    expect(container.firstChild.style.color).toBe('#EF4444');
  });

  it('결제완료 상태를 렌더링한다', () => {
    render(<StatusBadge status="결제완료" />);
    expect(screen.getByText('결제완료')).toBeInTheDocument();
  });

  it('알 수 없는 상태에 기본 스타일을 적용한다', () => {
    const { container } = render(<StatusBadge status="알수없음" />);
    expect(container.firstChild.style.color).toBe('#979797');
  });

  it('커스텀 className을 적용할 수 있다', () => {
    const { container } = render(<StatusBadge status="접수" className="custom" />);
    expect(container.firstChild.className).toContain('custom');
  });

  it('rounded-full 스타일을 적용한다', () => {
    const { container } = render(<StatusBadge status="접수" />);
    expect(container.firstChild.className).toContain('rounded-full');
  });
});
