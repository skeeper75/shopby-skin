import { Link } from 'react-router-dom';

import { Button, useFindAccountStateContext, useFindAccountActionContext } from '@shopby/react-components';

import FullModal from '../../components/FullModal';

import FindPasswordAuthentication from './FindPasswordAuthentication';

// Huni Design System Components
import { TextField } from '../../design-system/components/molecules/TextField/TextField';
import { Field } from '../../design-system/components/molecules/Field/Field';

export const FindPasswordSmsForm = () => {
  const {
    findAccountInfo: { memberId },
    isNotExistMemberInfo,
    isFindPasswordFullModalOpen,
  } = useFindAccountStateContext();
  const { updateFindAccountInfo, searchAccount, setIsFindPasswordFullModalOpen } = useFindAccountActionContext();

  const handleMemberIdChange = ({ currentTarget: { value } }) => {
    updateFindAccountInfo({ memberId: value });
  };

  const handleFindPasswordKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchAccount({ memberId });
    }
  };

  return (
    <>
      {/* 아이디 필드 - Huni Field + TextField */}
      <div className="find-password-form__item">
        <Field.Root>
          <Field.Label>아이디</Field.Label>
          <Field.Control className="find-password-form__input-wrap">
            <TextField.Root>
              <TextField.Input
                id="memberId"
                value={memberId}
                placeholder="아이디 입력"
                onChange={handleMemberIdChange}
                onKeyDown={handleFindPasswordKeyDown}
              />
            </TextField.Root>
          </Field.Control>
        </Field.Root>
      </div>

      {isNotExistMemberInfo && <p className="find-password-form__caution">회원정보를 찾을 수 없습니다.</p>}

      <div className="find-password-form__btn-wrap">
        <Link to="/find-id">아이디 찾기</Link>
        <Button
          label="비밀번호 찾기"
          onClick={() => {
            searchAccount({ memberId });
          }}
        />
      </div>

      {isFindPasswordFullModalOpen && (
        <FullModal title="비밀번호 찾기" onClose={() => setIsFindPasswordFullModalOpen(false)}>
          <FindPasswordAuthentication type="SMS" />
        </FullModal>
      )}
    </>
  );
};

export default FindPasswordSmsForm;
