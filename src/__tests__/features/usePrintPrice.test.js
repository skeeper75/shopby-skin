/**
 * usePrintPrice 훅 테스트 - debounced 가격 계산
 */
import { renderHook, act } from '@testing-library/react';

const mockFetchPrintPrice = vi.fn().mockResolvedValue({
  subtotal: 45000,
  discount: 0,
  shipping: 3000,
  total: 48000,
});

vi.mock('../../api/printPrice', () => ({
  fetchPrintPrice: (...args) => mockFetchPrintPrice(...args),
}));

import usePrintPrice from '../../hooks/usePrintPrice';

describe('usePrintPrice', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('초기에는 priceInfo가 null이다', () => {
    const { result } = renderHook(() =>
      usePrintPrice({ size: '', paper: '', coating: '', finishing: [], quantity: 1 })
    );
    expect(result.current.priceInfo).toBeNull();
    expect(result.current.isCalculating).toBe(false);
  });

  it('필수 옵션이 모두 선택되면 300ms 후 가격을 계산한다', async () => {
    const options = { size: 'A4', paper: 'ART_COAT_130', coating: 'NONE', finishing: [], quantity: 100 };
    const { result } = renderHook(() => usePrintPrice(options));

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockFetchPrintPrice).toHaveBeenCalledWith(options);
    expect(result.current.priceInfo).toEqual({
      subtotal: 45000,
      discount: 0,
      shipping: 3000,
      total: 48000,
    });
  });

  it('필수 옵션이 누락되면 가격을 계산하지 않는다', async () => {
    const options = { size: 'A4', paper: '', coating: '', finishing: [], quantity: 1 };
    renderHook(() => usePrintPrice(options));

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(mockFetchPrintPrice).not.toHaveBeenCalled();
  });

  it('300ms 내 옵션 변경 시 이전 호출을 취소한다 (debounce)', async () => {
    const options1 = { size: 'A4', paper: 'ART_COAT_130', coating: 'NONE', finishing: [], quantity: 100 };
    const options2 = { size: 'A3', paper: 'ART_COAT_130', coating: 'NONE', finishing: [], quantity: 100 };

    const { rerender } = renderHook(({ opts }) => usePrintPrice(opts), {
      initialProps: { opts: options1 },
    });

    act(() => { vi.advanceTimersByTime(100); });

    rerender({ opts: options2 });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    // 마지막 옵션으로만 호출
    expect(mockFetchPrintPrice).toHaveBeenCalledTimes(1);
    expect(mockFetchPrintPrice).toHaveBeenCalledWith(options2);
  });
});
