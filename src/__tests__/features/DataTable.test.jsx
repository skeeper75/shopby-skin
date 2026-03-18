/**
 * DataTable 테스트 - 재사용 가능한 데이터 테이블
 *
 * SPEC-SKIN-005 REQ-005-002: 주문 목록 테이블
 * - 정렬, 체크박스 선택, 페이지네이션
 * - 빈 데이터 처리
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import DataTable from '../../components/admin/DataTable';

const mockColumns = [
  { key: 'orderNo', label: '주문번호', sortable: true },
  { key: 'customerName', label: '주문자', sortable: true },
  { key: 'status', label: '상태', sortable: false },
];

const mockData = [
  { id: 1, orderNo: 'ORD-001', customerName: '홍길동', status: '결제완료' },
  { id: 2, orderNo: 'ORD-002', customerName: '김철수', status: '배송중' },
  { id: 3, orderNo: 'ORD-003', customerName: '이영희', status: '결제완료' },
];

describe('DataTable', () => {
  const defaultProps = {
    columns: mockColumns,
    data: mockData,
    selectable: true,
    onSort: vi.fn(),
    onSelectionChange: vi.fn(),
    pagination: { page: 1, pageSize: 10, total: 3 },
    onPageChange: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('테이블 헤더를 렌더링한다', () => {
    render(<DataTable {...defaultProps} />);
    expect(screen.getByText('주문번호')).toBeInTheDocument();
    expect(screen.getByText('주문자')).toBeInTheDocument();
    expect(screen.getByText('상태')).toBeInTheDocument();
  });

  it('데이터 행을 렌더링한다', () => {
    render(<DataTable {...defaultProps} />);
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('김철수')).toBeInTheDocument();
  });

  it('정렬 가능한 컬럼을 클릭하면 onSort를 호출한다', () => {
    render(<DataTable {...defaultProps} />);
    fireEvent.click(screen.getByText('주문번호'));
    expect(defaultProps.onSort).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'orderNo' })
    );
  });

  it('전체 선택 체크박스가 있다', () => {
    render(<DataTable {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(4); // 1 전체 + 3 개별
  });

  it('전체 선택 시 onSelectionChange를 호출한다', () => {
    render(<DataTable {...defaultProps} />);
    const allCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(allCheckbox);
    expect(defaultProps.onSelectionChange).toHaveBeenCalledWith(mockData);
  });

  it('개별 행 체크박스를 선택할 수 있다', () => {
    render(<DataTable {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    expect(defaultProps.onSelectionChange).toHaveBeenCalled();
  });

  it('빈 데이터일 때 안내 메시지를 표시한다', () => {
    render(<DataTable {...defaultProps} data={[]} />);
    expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
  });

  it('table 요소를 렌더링한다', () => {
    render(<DataTable {...defaultProps} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('selectable이 false이면 체크박스를 렌더링하지 않는다', () => {
    render(<DataTable {...defaultProps} selectable={false} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('페이지네이션 버튼을 렌더링한다', () => {
    render(<DataTable {...defaultProps} pagination={{ page: 1, pageSize: 1, total: 3 }} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
