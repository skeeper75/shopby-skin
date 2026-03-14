import { bool } from 'prop-types';

import { Button, Checkbox, useCustomTermsStateContext, useCustomTermsActionContext } from '@shopby/react-components';

import { makePrefixLabel } from '../../utils';
import FullModal from '../FullModal';
import Sanitized from '../Sanitized';

const CustomTerms = ({ isRounded = false }) => {
  const { customTerms, customTerm, openCustomTermModal } = useCustomTermsStateContext();

  const { updateCheckStateBy, updateCustomTerm, resetCustomTerm } = useCustomTermsActionContext();

  return (
    <ul className="custom-terms">
      {customTerms.map(({ termsNo, title, required, content, checked, disabled = false }) => (
        <li key={`${termsNo}_${title}`} className="custom-terms__item">
          <Checkbox
            label={makePrefixLabel({ required, title })}
            checked={checked}
            onChange={() => {
              updateCheckStateBy({
                targetNo: termsNo,
                checked: !checked,
              });
            }}
            disabled={disabled}
            isRounded={isRounded}
          />
          {content && (
            <Button
              label="보기"
              onClick={() => {
                updateCustomTerm({
                  title,
                  content,
                  required,
                });
              }}
            />
          )}
        </li>
      ))}
      {openCustomTermModal && (
        <FullModal className="agreement" title={`${makePrefixLabel(customTerm)}`} onClose={resetCustomTerm}>
          <Sanitized html={customTerm.content} />
        </FullModal>
      )}
    </ul>
  );
};

export default CustomTerms;

CustomTerms.propTypes = {
  isRounded: bool,
};
