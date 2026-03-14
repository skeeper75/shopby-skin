// @MX:NOTE: [AUTO] 수량 카운터 입력 - RULE-3: 34+155+34px 레이아웃, h-50px
const CounterInput = ({ value, onChange, min = 1, max = 10000, error }) => {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const handleChange = (e) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    }
  };

  return (
    <div>
      <p className="text-sm font-semibold text-[#424242] mb-2 tracking-[-0.05em]">수량 (부)</p>
      <div className="flex items-stretch h-[50px] border border-[#CACACA] rounded-[5px] overflow-hidden">
        {/* 감소 버튼 34px */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="수량 감소"
          className="w-[34px] shrink-0 flex items-center justify-center text-xl text-[#424242] bg-[#F6F6F6] hover:bg-[#EBEBEB] disabled:opacity-40 disabled:cursor-not-allowed border-r border-[#CACACA] transition-colors"
        >
          −
        </button>

        {/* 입력 필드 155px */}
        <input
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          className="w-[155px] flex-1 h-full text-center text-sm font-semibold text-[#424242] tracking-[-0.05em] border-none outline-none bg-white"
        />

        {/* 증가 버튼 34px */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="수량 증가"
          className="w-[34px] shrink-0 flex items-center justify-center text-xl text-[#424242] bg-[#F6F6F6] hover:bg-[#EBEBEB] disabled:opacity-40 disabled:cursor-not-allowed border-l border-[#CACACA] transition-colors"
        >
          +
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-[#EF4444] tracking-[-0.05em]">{error}</p>}
    </div>
  );
};

export default CounterInput;
