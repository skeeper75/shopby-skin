import { useState } from 'react';

import { cn } from '../../lib/utils';
import { fetchHttpRequest } from '../../utils/api';

// @MX:NOTE: [AUTO] GuestOrderForm - SPEC-SKIN-004 REQ-SKIN-004-004 비회원 주문 조회 폼
// @MX:SPEC: SPEC-SKIN-004 REQ-SKIN-004-004

const inputClass = (hasError) =>
  cn(
    'w-full h-[46px] px-4 text-sm border rounded bg-white text-[#424242] placeholder-[#979797]',
    'focus:outline-none focus:border-[#5538B6] focus:border-2',
    hasError ? 'border-red-500 border-2' : 'border-[#CACACA]'
  );

// 주문 상태 한글 변환
const ORDER_STATUS_MAP = {
  ORDER_COMPLETE: '주문 완료',
  PAYING: '결제 중',
  PAY_DONE: '결제 완료',
  PAY_FAIL: '결제 실패',
  PRODUCT_PREPARE: '상품 준비 중',
  DELIVERY_PREPARE: '배송 준비 중',
  DELIVERY_ING: '배송 중',
  DELIVERY_DONE: '배송 완료',
  BUY_CONFIRM: '구매 확정',
  CANCEL_DONE: '주문 취소',
  RETURN_DONE: '반품 완료',
  EXCHANGE_DONE: '교환 완료',
};

// 주문 결과 표시 컴포넌트
const OrderResult = ({ orderData }) => {
  const statusLabel = ORDER_STATUS_MAP[orderData.orderStatusType] ?? orderData.orderStatusType;

  return (
    <div className="mt-6 border border-[#CACACA] rounded-md overflow-hidden">
      {/* 주문 헤더 */}
      <div className="bg-[#EEEBF9] px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#424242]">주문번호: {orderData.orderNo}</span>
          <span className="text-sm font-semibold text-[#5538B6]">{statusLabel}</span>
        </div>
      </div>

      {/* 주문 상품 목록 */}
      {orderData.orderOptions?.length > 0 && (
        <div className="divide-y divide-[#CACACA]">
          {orderData.orderOptions.map((option, idx) => (
            <div key={idx} className="px-4 py-3 flex items-center gap-3">
              {option.imageUrl && (
                <img
                  src={option.imageUrl}
                  alt={option.productName}
                  className="w-14 h-14 object-cover rounded border border-[#CACACA]"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#424242] truncate">{option.productName}</p>
                {option.optionName && (
                  <p className="text-xs text-[#979797] mt-0.5">{option.optionName}</p>
                )}
                <p className="text-xs text-[#979797] mt-0.5">수량: {option.orderCnt}개</p>
              </div>
              <div className="text-sm font-semibold text-[#424242]">
                {option.price?.toLocaleString()}원
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 주문 요약 */}
      <div className="border-t border-[#CACACA] px-4 py-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#424242]">총 결제금액</span>
          <span className="text-base font-bold text-[#5538B6]">
            {orderData.lastOrderAmount?.totalStandardAmt?.toLocaleString() ?? 0}원
          </span>
        </div>
      </div>

      {/* 영수증 다운로드 버튼 */}
      <div className="px-4 py-3 border-t border-[#CACACA]">
        <button
          type="button"
          onClick={() => window.open(`/orders/${orderData.orderNo}/receipt`, '_blank')}
          className={cn(
            'w-full h-[46px] text-sm font-semibold border border-[#5538B6] text-[#5538B6] rounded',
            'hover:bg-[#EEEBF9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5538B6] focus:ring-offset-2'
          )}
        >
          영수증 출력
        </button>
      </div>
    </div>
  );
};

const GuestOrderForm = () => {
  const [formData, setFormData] = useState({ orderNo: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [notFoundError, setNotFoundError] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setNotFoundError(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.orderNo.trim()) newErrors.orderNo = '주문번호를 입력해주세요.';
    if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    if (!formData.phone.trim()) newErrors.phone = '전화번호를 입력해주세요.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setOrderResult(null);
    setNotFoundError(false);

    try {
      // SPEC: GET /guest/orders - 주문번호, 이메일, 전화번호 모두 일치해야 조회
      const data = await fetchHttpRequest({
        url: 'guest/orders',
        method: 'GET',
        query: {
          orderNo: formData.orderNo,
          email: formData.email,
          phone: formData.phone,
        },
      });

      if (data) {
        setOrderResult(data);
      } else {
        setNotFoundError(true);
      }
    } catch {
      // 정보 불일치 시 에러 메시지 표시
      setNotFoundError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit(e);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#424242]">비회원 주문 조회</h1>
        <p className="mt-1 text-sm text-[#979797]">주문 시 입력하신 정보를 입력해주세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* 주문번호 */}
        <div>
          <label className="block text-sm font-semibold text-[#424242] mb-1.5">
            주문번호 <span className="text-[#5538B6]">*</span>
          </label>
          <input
            type="text"
            value={formData.orderNo}
            onChange={handleChange('orderNo')}
            onKeyDown={handleKeyDown}
            placeholder="주문번호를 입력해주세요"
            className={inputClass(errors.orderNo)}
          />
          {errors.orderNo && <p className="mt-1 text-xs text-red-500">{errors.orderNo}</p>}
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-sm font-semibold text-[#424242] mb-1.5">
            이메일 <span className="text-[#5538B6]">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            onKeyDown={handleKeyDown}
            placeholder="이메일을 입력해주세요"
            className={inputClass(errors.email)}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* 전화번호 */}
        <div>
          <label className="block text-sm font-semibold text-[#424242] mb-1.5">
            전화번호 <span className="text-[#5538B6]">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            onKeyDown={handleKeyDown}
            placeholder="전화번호를 입력해주세요 (예: 010-1234-5678)"
            className={inputClass(errors.phone)}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>

        {/* 정보 불일치 에러 메시지 */}
        {notFoundError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            주문 정보를 찾을 수 없습니다.
          </div>
        )}

        {/* 조회 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'w-full h-[50px] text-white text-sm font-semibold rounded-[5px]',
            'bg-[#5538B6] hover:bg-[#4429a0] focus:outline-none focus:ring-2 focus:ring-[#5538B6] focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          )}
        >
          {isLoading ? '조회 중...' : '조회하기'}
        </button>
      </form>

      {/* 조회 결과 */}
      {orderResult && <OrderResult orderData={orderResult} />}
    </div>
  );
};

export default GuestOrderForm;
