import { useState } from 'react';

import InquiryForm from '../../components/InquiryForm';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import { cn } from '../../lib/utils';

// @MX:NOTE: [AUTO] BulkInquiry - SPEC-SKIN-004 REQ-SKIN-004-003 대량 문의 페이지 (B2B)
// @MX:SPEC: SPEC-SKIN-004 REQ-SKIN-004-003

// 문의 접수 완료 모달
const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* 배경 오버레이 */}
    <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

    {/* 모달 본체 */}
    <div className="relative bg-white rounded-lg shadow-xl p-8 mx-4 max-w-sm w-full text-center z-10">
      <div className="mb-4">
        {/* 체크 아이콘 */}
        <div className="w-14 h-14 bg-[#EEEBF9] rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-[#5538B6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-base font-semibold text-[#424242]">문의가 접수되었습니다</p>
        <p className="mt-2 text-sm text-[#979797]">담당자가 확인 후 연락드리겠습니다.</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className={cn(
          'w-full h-[46px] text-white text-sm font-semibold rounded-[5px]',
          'bg-[#5538B6] hover:bg-[#4429a0] focus:outline-none transition-colors'
        )}
      >
        확인
      </button>
    </div>
  </div>
);

const BulkInquiry = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: '대량 문의',
    hasCartBtnOnHeader: true,
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[#424242]">대량 문의</h1>
        <p className="mt-2 text-sm text-[#979797]">
          대량 인쇄 주문 및 B2B 거래를 위한 문의를 남겨주세요.
          <br />
          담당자가 확인 후 2~3 영업일 내 연락드리겠습니다.
        </p>
      </div>

      {/* 문의 폼 */}
      <InquiryForm type="bulk-inquiry" onSuccess={() => setShowSuccess(true)} />

      {/* 성공 모달 */}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </div>
  );
};

export default BulkInquiry;
