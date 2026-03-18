import { cn } from '../../lib/utils';

// @MX:NOTE: [AUTO] ChatWidget - 카카오 채널 연결 플로팅 버튼 컴포넌트
// @MX:SPEC: SPEC-SKIN-004

// 카카오 채널 URL (실제 채널 ID로 교체 필요)
const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_placeholder';

/**
 * 우측 하단 고정 카카오 채널 상담 버튼
 * 실제 카카오 채널 URL은 KAKAO_CHANNEL_URL 상수에서 관리
 */
const ChatWidget = ({ className }) => {
  const handleClick = () => {
    window.open(KAKAO_CHANNEL_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      aria-label="카카오 채널 상담하기"
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'w-14 h-14 rounded-full shadow-lg',
        'flex items-center justify-center',
        'bg-[#FEE500] hover:bg-[#f5da00] active:bg-[#e8ce00]',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:ring-offset-2',
        className
      )}
    >
      {/* 카카오 버블 아이콘 */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14 3.5C8.20101 3.5 3.5 7.30222 3.5 12C3.5 14.9633 5.30222 17.5856 8.05556 19.1044L6.94444 23.1889C6.82222 23.6333 7.35556 23.9722 7.72222 23.6889L12.5667 20.4444C13.0444 20.4944 13.5222 20.5 14 20.5C19.799 20.5 24.5 16.6978 24.5 12C24.5 7.30222 19.799 3.5 14 3.5Z"
          fill="#3C1E1E"
        />
      </svg>
    </button>
  );
};

export default ChatWidget;
