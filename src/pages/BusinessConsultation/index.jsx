import { useState } from 'react';

import InquiryForm from '../../components/InquiryForm';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import { cn } from '../../lib/utils';

// @MX:NOTE: [AUTO] BusinessConsultation - SPEC-SKIN-004 사업 상담 문의 페이지
// @MX:SPEC: SPEC-SKIN-004

// 문의 접수 완료 모달 (BulkInquiry와 공유 가능하지만 간단히 인라인 정의)
const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
    <div className="relative bg-white rounded-lg shadow-xl p-8 mx-4 max-w-sm w-full text-center z-10">
      <div className="mb-4">
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

const BusinessConsultation = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: '사업 상담',
    hasCartBtnOnHeader: true,
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[#424242]">사업 상담</h1>
        <p className="mt-2 text-sm text-[#979797]">
          사업 제휴 및 파트너십 관련 문의를 남겨주세요.
          <br />
          담당자가 확인 후 2~3 영업일 내 연락드리겠습니다.
        </p>
      </div>

      {/* 문의 폼 */}
      <InquiryForm type="business" onSuccess={() => setShowSuccess(true)} />

      {/* 성공 모달 */}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </div>
  );
};

export default BusinessConsultation;
