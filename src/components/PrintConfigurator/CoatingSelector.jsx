import { isValidCoatingForPaper } from '../../utils/printOptionValidator';
import OptionChipGroup from './OptionChipGroup';

const COATING_OPTIONS = [
  { value: 'NONE', label: '무코팅' },
  { value: 'GLOSSY', label: '유광 코팅' },
  { value: 'MATTE', label: '무광 코팅' },
  { value: 'SOFT_TOUCH', label: '소프트터치 코팅' },
];

// @MX:NOTE: [AUTO] 코팅 선택 - 선택된 용지와 호환되지 않는 코팅 옵션은 비활성화
const CoatingSelector = ({ selected, paper, onSelect, error }) => {
  const options = COATING_OPTIONS.map((opt) => ({
    ...opt,
    disabled: paper ? !isValidCoatingForPaper(paper, opt.value) : false,
  }));

  return (
    <OptionChipGroup
      label="코팅"
      options={options}
      selected={selected}
      onSelect={onSelect}
      error={error}
    />
  );
};

export default CoatingSelector;
