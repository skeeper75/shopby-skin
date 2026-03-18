import { useMemo } from 'react';

import {
  Button,
  useFindAccountStateContext,
  useFindAccountActionContext,
  SelectBox,
  EmailInput,
} from '@shopby/react-components';

import { EMAIL_DOMAIN_OPTIONS } from '../../constants/form';

// Huni Design System Components
import { TextField } from '../../design-system/components/molecules/TextField/TextField';
import { Field } from '../../design-system/components/molecules/Field/Field';

export const FindIdEmailForm = () => {
  const {
    findAccountInfo: { memberName, emailId, emailDomain, domainSelectorValue },
    isNotExistMemberInfo,
  } = useFindAccountStateContext();
  const { findId, updateFindAccountInfo } = useFindAccountActionContext();

  const handleEmailIdInputChange = ({ currentTarget: { value } }) => {
    updateFindAccountInfo({ emailId: value });
  };

  const handleEmailDomainInputChange = ({ currentTarget: { value } }) => {
    updateFindAccountInfo({ emailDomain: value, domainSelectorValue: '' });
  };

  const handleEmailDomainSelect = ({ currentTarget: { value } }) => {
    updateFindAccountInfo({ emailDomain: value, domainSelectorValue: value });
  };

  const handleMemberNameChange = ({ currentTarget: { value } }) => {
    updateFindAccountInfo({ memberName: value });
  };
  const email = useMemo(() => `${emailId}@${emailDomain}`, [emailId, emailDomain]);

  return (
    <>
      {/* 이름 필드 - Huni Field + TextField */}
      <div className="find-id-form__item">
        <Field.Root>
          <Field.Label>이름</Field.Label>
          <Field.Control className="find-id-form__input-wrap">
            <TextField.Root>
              <TextField.Input
                id="memberId"
                value={memberName}
                placeholder="이름 입력"
                onChange={handleMemberNameChange}
              />
            </TextField.Root>
          </Field.Control>
        </Field.Root>
      </div>

      {/* 이메일 필드 - EmailInput 사용 (Huni 이메일 컴포넌트는 후속 작업) */}
      <div className="find-id-form__item">
        <Field.Root>
          <Field.Label>이메일</Field.Label>
          <Field.Control className="find-id-form__input-wrap">
            <EmailInput
              id={emailId}
              domain={emailDomain}
              onIdChange={handleEmailIdInputChange}
              onDomainChange={handleEmailDomainInputChange}
            />
            <SelectBox
              hasEmptyOption={true}
              emptyOptionLabel="직접 입력"
              value={domainSelectorValue}
              onSelect={handleEmailDomainSelect}
              options={EMAIL_DOMAIN_OPTIONS}
            />
          </Field.Control>
        </Field.Root>
      </div>

      {isNotExistMemberInfo && <p className="find-id-form__caution">회원정보를 찾을 수 없습니다.</p>}

      <div className="find-id-form__btn-wrap">
        <Button
          label="아이디 찾기"
          onClick={() => {
            findId({ findMethod: 'EMAIL', email, memberName });
          }}
        />
      </div>
    </>
  );
};

export default FindIdEmailForm;
