/**
 * HuniOptionPreview 테스트 - 선택된 옵션 요약 미리보기
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('../../lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

import HuniOptionPreview from '../../components/HuniOptionPreview/HuniOptionPreview';

describe('HuniOptionPreview', () => {
  const fullOptions = {
    size: 'A4',
    paper: 'ART_COAT_130',
    coating: 'GLOSSY',
    finishing: ['STAPLE', 'FOLDING'],
    quantity: 500,
  };

  it('선택한 옵션 라벨을 표시한다', () => {
    render(<HuniOptionPreview options={fullOptions} />);
    expect(screen.getByText('선택한 옵션')).toBeInTheDocument();
  });

  it('사이즈를 표시한다', () => {
    render(<HuniOptionPreview options={fullOptions} />);
    expect(screen.getByText('A4')).toBeInTheDocument();
  });

  it('용지명을 한글로 표시한다', () => {
    render(<HuniOptionPreview options={fullOptions} />);
    expect(screen.getByText('아트코트지 130g')).toBeInTheDocument();
  });

  it('코팅명을 한글로 표시한다', () => {
    render(<HuniOptionPreview options={fullOptions} />);
    expect(screen.getByText('유광 코팅')).toBeInTheDocument();
  });

  it('마감 옵션을 쉼표로 구분하여 표시한다', () => {
    render(<HuniOptionPreview options={fullOptions} />);
    expect(screen.getByText('스테이플 제본, 접지')).toBeInTheDocument();
  });

  it('수량을 "부" 단위로 표시한다', () => {
    render(<HuniOptionPreview options={fullOptions} />);
    expect(screen.getByText('500부')).toBeInTheDocument();
  });

  it('썸네일 이미지를 렌더링한다', () => {
    render(<HuniOptionPreview options={fullOptions} thumbnail="/img/product.jpg" />);
    expect(screen.getByAltText('상품 미리보기')).toBeInTheDocument();
  });

  it('썸네일이 없으면 이미지를 렌더링하지 않는다', () => {
    render(<HuniOptionPreview options={fullOptions} />);
    expect(screen.queryByAltText('상품 미리보기')).not.toBeInTheDocument();
  });

  it('맞춤 사이즈일 때 가로x세로를 표시한다', () => {
    render(
      <HuniOptionPreview
        options={{ ...fullOptions, size: 'CUSTOM', customWidth: '210', customHeight: '297' }}
      />
    );
    expect(screen.getByText('맞춤 (210×297mm)')).toBeInTheDocument();
  });

  it('옵션이 없으면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<HuniOptionPreview options={{ size: '', paper: '' }} />);
    expect(container.firstChild).toBeNull();
  });
});
