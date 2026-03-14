import { useState, useEffect, useRef, useCallback } from 'react';

import { fetchPrintPrice } from '../api/printPrice';

// @MX:NOTE: [AUTO] 인쇄 가격 계산 훅 - debounce 300ms 적용으로 과도한 계산 방지
const DEBOUNCE_MS = 300;

const usePrintPrice = (options) => {
  const [priceInfo, setPriceInfo] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const timerRef = useRef(null);

  const calculate = useCallback(async (opts) => {
    setIsCalculating(true);
    try {
      const result = await fetchPrintPrice(opts);
      setPriceInfo(result);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  useEffect(() => {
    if (!options.size || !options.paper || !options.coating) {
      setPriceInfo(null);
      return;
    }

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      calculate(options);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timerRef.current);
  }, [options.size, options.paper, options.coating, options.finishing, options.quantity]);

  return { priceInfo, isCalculating };
};

export default usePrintPrice;
