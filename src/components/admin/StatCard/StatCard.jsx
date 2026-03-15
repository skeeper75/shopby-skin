import { cn } from '../../../lib/utils';

// @MX:NOTE: [AUTO] 관리자 대시보드 통계 카드 컴포넌트
// @MX:SPEC: SPEC-SKIN-005
/**
 * 통계 카드 컴포넌트
 * - 아이콘, 숫자, 라벨을 표시하는 카드
 * - Huni 디자인 토큰 적용 (border: #CACACA, hover: #EEEBF9)
 *
 * @param {string} icon - 카드 아이콘 (SVG element)
 * @param {number|string} value - 통계 숫자
 * @param {string} label - 통계 라벨
 * @param {string} className - 추가 클래스
 */
const StatCard = ({ icon, value, label, className }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-[#CACACA] p-5 flex items-center gap-4',
        'hover:bg-[#EEEBF9] hover:border-[#5538B6]/30 transition-colors cursor-default',
        className
      )}
    >
      {/* 아이콘 영역 */}
      <div className="w-12 h-12 rounded-full bg-[#EEEBF9] flex items-center justify-center flex-shrink-0 text-[#5538B6]">
        {icon}
      </div>

      {/* 텍스트 영역 */}
      <div>
        <p className="text-2xl font-bold text-[#424242]" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600 }}>
          {value}
        </p>
        <p className="text-sm text-[#979797]">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
