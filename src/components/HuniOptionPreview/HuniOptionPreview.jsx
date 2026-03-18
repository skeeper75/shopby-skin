import { cn } from '../../lib/utils';

const PAPER_LABELS = {
  ART_COAT_130: '아트코트지 130g',
  ART_COAT_200: '아트코트지 200g',
  MATTE_COAT_130: '매트코트지 130g',
  MATTE_COAT_200: '매트코트지 200g',
  GENERAL_COPY: '일반복사지 80g',
};

const COATING_LABELS = {
  NONE: '무코팅',
  GLOSSY: '유광 코팅',
  MATTE: '무광 코팅',
  SOFT_TOUCH: '소프트터치 코팅',
};

const FINISHING_LABELS = {
  STAPLE: '스테이플 제본',
  BINDING_SPIRAL: '링 제본',
  FOLDING: '접지',
  PERFORATION: '타공',
  SCORING: '접음선 가공',
};

// @MX:NOTE: [AUTO] 선택된 인쇄 옵션 요약 미리보기 컴포넌트
const HuniOptionPreview = ({ options, thumbnail, className }) => {
  const { size, customWidth, customHeight, paper, coating, finishing = [], quantity } = options;

  const hasOptions = size || paper;

  if (!hasOptions) return null;

  const sizeLabel =
    size === 'CUSTOM' && customWidth && customHeight ? `맞춤 (${customWidth}×${customHeight}mm)` : size;

  return (
    <div className={cn('bg-[#F6F6F6] rounded-[5px] p-3 space-y-2', className)}>
      <p className="text-xs font-semibold text-[#424242] tracking-[-0.05em]">선택한 옵션</p>
      <div className="flex gap-3">
        {thumbnail && (
          <img
            src={thumbnail}
            alt="상품 미리보기"
            className="w-14 h-14 object-cover rounded-[5px] border border-[#CACACA] shrink-0"
          />
        )}
        <dl className="flex-1 space-y-1">
          {sizeLabel && (
            <div className="flex justify-between text-xs tracking-[-0.05em]">
              <dt className="text-[#979797]">사이즈</dt>
              <dd className="text-[#424242] font-medium">{sizeLabel}</dd>
            </div>
          )}
          {paper && (
            <div className="flex justify-between text-xs tracking-[-0.05em]">
              <dt className="text-[#979797]">용지</dt>
              <dd className="text-[#424242] font-medium">{PAPER_LABELS[paper] ?? paper}</dd>
            </div>
          )}
          {coating && (
            <div className="flex justify-between text-xs tracking-[-0.05em]">
              <dt className="text-[#979797]">코팅</dt>
              <dd className="text-[#424242] font-medium">{COATING_LABELS[coating] ?? coating}</dd>
            </div>
          )}
          {finishing.length > 0 && (
            <div className="flex justify-between text-xs tracking-[-0.05em]">
              <dt className="text-[#979797]">마감</dt>
              <dd className="text-[#424242] font-medium">
                {finishing.map((f) => FINISHING_LABELS[f] ?? f).join(', ')}
              </dd>
            </div>
          )}
          {quantity && (
            <div className="flex justify-between text-xs tracking-[-0.05em]">
              <dt className="text-[#979797]">수량</dt>
              <dd className="text-[#424242] font-medium">{quantity.toLocaleString()}부</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default HuniOptionPreview;
