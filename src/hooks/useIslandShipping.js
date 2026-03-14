import { useState, useCallback } from 'react';

// @MX:NOTE: [AUTO] 도서산간 지역 배송비 추가 산정 훅 - 우편번호 기반 도서산간 여부 판별
// 실제 우편번호 DB 연동 시 API 호출로 교체 필요

// 도서산간 우편번호 앞자리 패턴 (예시, 실제 운용 시 DB 조회로 교체)
const ISLAND_ZIP_PREFIXES = [
  '630', '631', '632', '633', '634', '635', '636', '637', '638', '639', // 제주
  '695', '696', '697', '698', '699', // 제주 추가
  '400', '401', '402', '403', '404', '405', '406', '407', '408', // 인천 도서
  '217', '218', '219', // 강원 도서
  '545', '546', '547', '548', '549', // 전남 도서
  '591', '592', '593', '594', '595', '596', // 경남 도서
];

const ISLAND_SURCHARGE = 3000;
const MOUNTAIN_SURCHARGE = 3000;

export const checkIsIslandArea = (zipCode) => {
  if (!zipCode) return false;
  const prefix = zipCode.replace(/-/g, '').substring(0, 3);
  return ISLAND_ZIP_PREFIXES.includes(prefix);
};

const useIslandShipping = () => {
  const [isIsland, setIsIsland] = useState(false);
  const [extraCharge, setExtraCharge] = useState(0);

  const checkShipping = useCallback((zipCode) => {
    const island = checkIsIslandArea(zipCode);
    setIsIsland(island);
    setExtraCharge(island ? ISLAND_SURCHARGE : 0);
  }, []);

  return { isIsland, extraCharge, checkShipping };
};

export default useIslandShipping;
