import { useEffect } from 'react';

import { cn } from '../../lib/utils';

// @MX:NOTE: [AUTO] 모바일 하단 시트 - 인쇄 옵션 선택 UI, 오버레이 클릭 시 닫힘
const MobileOptionSheet = ({ isOpen, onClose, children, title = '인쇄 옵션 선택' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* 오버레이 */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* 시트 */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl transition-transform lg:hidden',
          'max-h-[85vh] flex flex-col',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-[#CACACA] rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-[#CACACA]">
          <h3 className="text-sm font-bold text-[#424242] tracking-[-0.05em]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#979797] hover:text-[#424242]"
            aria-label="닫기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="overflow-y-auto flex-1 px-4 py-4">
          {children}
        </div>
      </div>
    </>
  );
};

export default MobileOptionSheet;
