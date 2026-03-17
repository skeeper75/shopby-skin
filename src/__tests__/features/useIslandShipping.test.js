/**
 * useIslandShipping 훅 테스트 - 도서산간 배송비 판별
 */
import { renderHook, act } from '@testing-library/react';

import useIslandShipping, { checkIsIslandArea } from '../../hooks/useIslandShipping';

describe('checkIsIslandArea', () => {
  it('제주 지역 우편번호를 도서산간으로 판별한다', () => {
    expect(checkIsIslandArea('63000')).toBe(true);
    expect(checkIsIslandArea('63500')).toBe(true);
    expect(checkIsIslandArea('69500')).toBe(true);
  });

  it('서울 지역 우편번호는 도서산간이 아니다', () => {
    expect(checkIsIslandArea('06000')).toBe(false);
    expect(checkIsIslandArea('01000')).toBe(false);
  });

  it('빈 값은 false를 반환한다', () => {
    expect(checkIsIslandArea('')).toBe(false);
    expect(checkIsIslandArea(null)).toBe(false);
    expect(checkIsIslandArea(undefined)).toBe(false);
  });

  it('하이픈이 포함된 우편번호도 처리한다', () => {
    expect(checkIsIslandArea('630-00')).toBe(true);
  });
});

describe('useIslandShipping', () => {
  it('초기 상태는 도서산간이 아니다', () => {
    const { result } = renderHook(() => useIslandShipping());
    expect(result.current.isIsland).toBe(false);
    expect(result.current.extraCharge).toBe(0);
  });

  it('제주 우편번호 입력 시 도서산간으로 판별한다', () => {
    const { result } = renderHook(() => useIslandShipping());
    act(() => result.current.checkShipping('63000'));
    expect(result.current.isIsland).toBe(true);
    expect(result.current.extraCharge).toBe(3000);
  });

  it('일반 지역 우편번호 입력 시 추가 배송비가 없다', () => {
    const { result } = renderHook(() => useIslandShipping());
    act(() => result.current.checkShipping('06000'));
    expect(result.current.isIsland).toBe(false);
    expect(result.current.extraCharge).toBe(0);
  });

  it('도서산간에서 일반 지역으로 변경 시 추가비가 해제된다', () => {
    const { result } = renderHook(() => useIslandShipping());
    act(() => result.current.checkShipping('63000'));
    expect(result.current.extraCharge).toBe(3000);
    act(() => result.current.checkShipping('06000'));
    expect(result.current.extraCharge).toBe(0);
  });
});
