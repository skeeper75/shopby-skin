/**
 * usePrintOptions 훅 테스트 - 인쇄 옵션 상태 관리
 */
import { renderHook, act } from '@testing-library/react';

vi.mock('../../utils/printOptionValidator', () => ({
  validatePrintOptions: vi.fn((options) => {
    const errors = {};
    if (!options.size) errors.size = '사이즈를 선택해주세요.';
    if (!options.paper) errors.paper = '용지를 선택해주세요.';
    return { isValid: Object.keys(errors).length === 0, errors };
  }),
}));

import usePrintOptions from '../../hooks/usePrintOptions';

describe('usePrintOptions', () => {
  it('기본 옵션 값으로 초기화된다', () => {
    const { result } = renderHook(() => usePrintOptions());
    expect(result.current.options.size).toBe('');
    expect(result.current.options.coating).toBe('NONE');
    expect(result.current.options.quantity).toBe(1);
    expect(result.current.options.finishing).toEqual([]);
  });

  it('initialOptions로 초기화할 수 있다', () => {
    const { result } = renderHook(() => usePrintOptions({ size: 'A4', quantity: 100 }));
    expect(result.current.options.size).toBe('A4');
    expect(result.current.options.quantity).toBe(100);
  });

  it('updateOption으로 옵션을 변경할 수 있다', () => {
    const { result } = renderHook(() => usePrintOptions());
    act(() => result.current.updateOption('size', 'A4'));
    expect(result.current.options.size).toBe('A4');
  });

  it('용지 변경 시 코팅이 NONE으로 초기화된다', () => {
    const { result } = renderHook(() => usePrintOptions({ coating: 'GLOSSY' }));
    act(() => result.current.updateOption('paper', 'GENERAL_COPY'));
    expect(result.current.options.coating).toBe('NONE');
  });

  it('toggleFinishing으로 마감 옵션을 토글할 수 있다', () => {
    const { result } = renderHook(() => usePrintOptions());
    act(() => result.current.toggleFinishing('STAPLE'));
    expect(result.current.options.finishing).toEqual(['STAPLE']);
    act(() => result.current.toggleFinishing('FOLDING'));
    expect(result.current.options.finishing).toEqual(['STAPLE', 'FOLDING']);
    act(() => result.current.toggleFinishing('STAPLE'));
    expect(result.current.options.finishing).toEqual(['FOLDING']);
  });

  it('validate가 유효하지 않을 때 false를 반환하고 에러를 설정한다', () => {
    const { result } = renderHook(() => usePrintOptions());
    let isValid;
    act(() => { isValid = result.current.validate(); });
    expect(isValid).toBe(false);
    expect(result.current.errors.size).toBe('사이즈를 선택해주세요.');
  });

  it('validate가 유효할 때 true를 반환한다', () => {
    const { result } = renderHook(() => usePrintOptions({ size: 'A4', paper: 'ART_COAT_130' }));
    let isValid;
    act(() => { isValid = result.current.validate(); });
    expect(isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it('reset으로 초기 상태로 돌아간다', () => {
    const { result } = renderHook(() => usePrintOptions());
    act(() => result.current.updateOption('size', 'A4'));
    act(() => result.current.updateOption('paper', 'ART_COAT_130'));
    act(() => result.current.reset());
    expect(result.current.options.size).toBe('');
    expect(result.current.options.paper).toBe('');
  });
});
