// @MX:ANCHOR: [AUTO] 인쇄 옵션 통합 컨피규레이터 - 상품 상세 구매 영역의 핵심 컴포넌트
// @MX:REASON: HuniPurchase, MobileOptionSheet에서 사용, 인쇄 옵션 전체 흐름 담당
import CoatingSelector from './CoatingSelector';
import CounterInput from './CounterInput';
import FinishingSection from './FinishingSection';
import OptionChipGroup from './OptionChipGroup';
import PaperSelector from './PaperSelector';
import SizeSelector from './SizeSelector';

const PrintConfigurator = ({ options, errors, onUpdate, onToggleFinishing }) => (
  <div className="space-y-5">
    <SizeSelector
      selected={options.size}
      customWidth={options.customWidth}
      customHeight={options.customHeight}
      onSelect={(value) => onUpdate('size', value)}
      onCustomChange={onUpdate}
      error={errors.size}
    />

    <PaperSelector
      selected={options.paper}
      onSelect={(value) => onUpdate('paper', value)}
      error={errors.paper}
    />

    <CoatingSelector
      selected={options.coating}
      paper={options.paper}
      onSelect={(value) => onUpdate('coating', value)}
      error={errors.coating}
    />

    <FinishingSection
      selected={options.finishing}
      onToggle={onToggleFinishing}
    />

    <CounterInput
      value={options.quantity}
      onChange={(value) => onUpdate('quantity', value)}
      error={errors.quantity}
    />
  </div>
);

export default PrintConfigurator;
