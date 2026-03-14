import { createRef, useEffect, useMemo, useState } from 'react';

import { first } from 'lodash-es';

import {
  TextField,
  useSignUpActionContext,
  useSignUpStateContext,
  Radio,
  Checkbox,
  SelectBox,
} from '@shopby/react-components';
import { EXTRA_INFO_TYPE, TEXT_CONTENT_TYPES } from '@shopby/shared/constants';

import ImageFileUploader from '../../components/ImageFileUploader';
import { REQUIRED } from '../../constants/form';

const getExtraInfo = ({ extraInfoNo, extraInfo, signUpMemberInfo }) => {
  if (extraInfo) {
    return extraInfo;
  }

  return signUpMemberInfo.extraInfo?.find((extraInfoItem) => extraInfoItem.extraInfoNo === extraInfoNo);
};

const SignUpExtraInfosForm = () => {
  const [imageMap, setImageMap] = useState({});

  const { validationStatus, signUpMemberInfo } = useSignUpStateContext();
  const { setValidationStatus, setSignUpMemberInfo, getConfigMemberExtraInfo } = useSignUpActionContext();

  const imageFileUploadRefMap = useMemo(
    () =>
      signUpMemberInfo?.extraInfo
        .filter(({ extraInfoType }) => extraInfoType === EXTRA_INFO_TYPE.IMAGE)
        .reduce((acc, { extraInfoNo }) => {
          acc[extraInfoNo] = imageFileUploadRefMap?.[extraInfoNo] ?? createRef();

          return acc;
        }, {}),
    [signUpMemberInfo?.extraInfo]
  );

  const validateExtraInfo = (extraInfoNo, info) => {
    const extraInfo = getExtraInfo({
      extraInfo: info,
      extraInfoNo,
      signUpMemberInfo,
    });

    const { status, extraInfoType, extraInfoOptionTextContent, extraInfoOptionNos } = extraInfo ?? {};
    const value = TEXT_CONTENT_TYPES.includes(extraInfoType) ? extraInfoOptionTextContent : extraInfoOptionNos;

    const isInvalidExtraInfo = status === REQUIRED && !value?.length;

    if (!isInvalidExtraInfo) {
      setValidationStatus((prev) => ({
        ...prev,
        extraInfo: prev.extraInfo?.filter((extraInfoItem) => extraInfoItem.extraInfoNo !== extraInfoNo),
      }));

      return;
    }

    const validationStatusExtraInfo = validationStatus.extraInfo?.find(
      (extraInfoItem) => extraInfoItem.extraInfoNo === extraInfoNo
    );

    if (!validationStatusExtraInfo) {
      setValidationStatus((prev) => ({
        ...prev,
        extraInfo: [
          ...prev.extraInfo,
          {
            ...extraInfo,
            result: false,
            message: `${extraInfo?.extraInfoName}을(를) 입력해주세요.`,
          },
        ],
      }));
    }
  };

  const handleTextFieldChange = ({ target }, extraInfoNo) => {
    const { value } = target;

    setSignUpMemberInfo((prev) => ({
      ...prev,
      extraInfo: prev.extraInfo.map((extraInfo) => {
        if (extraInfo.extraInfoNo === extraInfoNo) {
          return {
            ...extraInfo,
            extraInfoNo,
            extraInfoOptionTextContent: value,
          };
        }

        return extraInfo;
      }),
    }));
  };
  const handleRadioChange = ({ target }, extraInfoNo) => {
    const value = Number(target.value);

    setSignUpMemberInfo((prev) => ({
      ...prev,
      extraInfo: prev.extraInfo.map((extraInfo) => {
        if (extraInfo.extraInfoNo === extraInfoNo) {
          return {
            ...extraInfo,
            extraInfoNo,
            extraInfoOptionNos: [value],
          };
        }

        return extraInfo;
      }),
    }));
  };
  const handleCheckBoxChange = ({ target }, extraInfoNo) => {
    const { checked } = target;
    const value = Number(target.value);

    setSignUpMemberInfo((prev) => ({
      ...prev,
      extraInfo: prev.extraInfo.map((extraInfo) => {
        if (extraInfo.extraInfoNo === extraInfoNo) {
          const extraInfoOptionNos = extraInfo.extraInfoOptionNos ?? [];

          if (!checked) {
            return {
              ...extraInfo,
              extraInfoOptionNos: extraInfoOptionNos.filter((extraInfoOptionNo) => extraInfoOptionNo !== value),
            };
          }

          if (!extraInfoOptionNos.includes(value)) {
            extraInfoOptionNos.push(value);

            return {
              ...extraInfo,
              extraInfoOptionNos,
            };
          }
        }

        return extraInfo;
      }),
    }));
  };
  const handleSelectChange = ({ target }, extraInfoNo) => {
    const value = Number(target.value);

    setSignUpMemberInfo((prev) => ({
      ...prev,
      extraInfo: prev.extraInfo.map((extraInfo) => {
        if (extraInfo.extraInfoNo === extraInfoNo) {
          return {
            ...extraInfo,
            extraInfoNo,
            extraInfoOptionNos: [value],
          };
        }

        return extraInfo;
      }),
    }));
  };

  const handleImageChange = (images, extraInfoNo) => {
    const imageUrl = first(images)?.imageUrl ?? '';

    setImageMap((prev) => ({
      ...prev,
      [extraInfoNo]: images,
    }));

    setSignUpMemberInfo((prev) => ({
      ...prev,
      extraInfo: prev.extraInfo.map((info) => {
        if (info.extraInfoNo === extraInfoNo) {
          const extraInfo = {
            ...info,
            extraInfoOptionTextContent: imageUrl,
            extraInfoNo,
          };

          validateExtraInfo(extraInfoNo, extraInfo);

          return extraInfo;
        }

        return info;
      }),
    }));
  };

  const handleImageUploadButtonClick = (extraInfoNo) => {
    imageFileUploadRefMap?.[extraInfoNo]?.current?.click();
  };

  const handleImageDelete = (extraInfoNo) => {
    if (!extraInfoNo) {
      return;
    }

    setImageMap((prev) => ({
      ...prev,
      [extraInfoNo]: [],
    }));

    setSignUpMemberInfo((prev) => ({
      ...prev,
      extraInfo: prev.extraInfo.map((info) => {
        if (info.extraInfoNo === extraInfoNo) {
          const extraInfo = {
            ...info,
            extraInfoNo,
            extraInfoOptionTextContent: '',
          };

          validateExtraInfo(extraInfoNo, extraInfo);

          return extraInfo;
        }

        return info;
      }),
    }));
  };

  useEffect(() => {
    getConfigMemberExtraInfo();
  }, []);

  // eslint-disable-next-line complexity
  return signUpMemberInfo?.extraInfo?.map(({ status, extraInfoType, extraInfoNo, extraInfoName, extraInfoOptions }) => {
    const { message, result } =
      validationStatus.extraInfo?.find((validation) => validation.extraInfoNo === extraInfoNo) ?? {};
    const profileExtraInfo = signUpMemberInfo.extraInfo.find((extraInfo) => extraInfo.extraInfoNo === extraInfoNo);

    return (
      <div className="sign-up-form__item" key={extraInfoNo}>
        <label htmlFor="extra-info" className="sign-up-form__tit">
          <span className="sign-up-form__item-extra-info-name">{extraInfoName}</span>
          {status === REQUIRED && <div className="required"></div>}
        </label>
        <div className="sign-up-form__input-wrap">
          {extraInfoType === EXTRA_INFO_TYPE.TEXTBOX && (
            <TextField
              name={extraInfoName}
              id={extraInfoName}
              maxLength={300}
              value={profileExtraInfo?.extraInfoOptionTextContent ?? ''}
              onChange={(event) => handleTextFieldChange(event, extraInfoNo)}
              onBlur={() => validateExtraInfo(extraInfoNo)}
            />
          )}

          {extraInfoType === EXTRA_INFO_TYPE.RADIOBUTTON && (
            <div className="extra-info-radio-group">
              {extraInfoOptions.map(({ extraInfoOptionName, extraInfoOptionNo }) => (
                <Radio
                  key={extraInfoOptionNo}
                  name={extraInfoName}
                  label={extraInfoOptionName}
                  value={extraInfoOptionNo}
                  checked={profileExtraInfo?.extraInfoOptionNos?.includes(extraInfoOptionNo) ?? false}
                  onChange={(event) => handleRadioChange(event, extraInfoNo)}
                  onBlur={() => validateExtraInfo(extraInfoNo)}
                />
              ))}
            </div>
          )}
          {extraInfoType === EXTRA_INFO_TYPE.CHECKBOX && (
            <div className="extra-info-checkbox-group">
              {extraInfoOptions.map(({ extraInfoOptionName, extraInfoOptionNo }) => (
                <Checkbox
                  name={extraInfoName}
                  label={extraInfoOptionName}
                  key={extraInfoOptionNo}
                  value={extraInfoOptionNo}
                  checked={profileExtraInfo?.extraInfoOptionNos?.includes(extraInfoOptionNo) ?? false}
                  onChange={(event) => handleCheckBoxChange(event, extraInfoNo)}
                  onBlur={() => validateExtraInfo(extraInfoNo)}
                />
              ))}
            </div>
          )}
          {extraInfoType === EXTRA_INFO_TYPE.DROPDOWN && (
            <SelectBox
              value={profileExtraInfo?.extraInfoOptionNos?.at(0) ?? ''}
              name={extraInfoName}
              options={extraInfoOptions?.map(({ extraInfoOptionName, extraInfoOptionNo }) => ({
                label: extraInfoOptionName,
                value: extraInfoOptionNo,
              }))}
              hasEmptyOption={true}
              emptyOptionLabel={'선택'}
              onSelect={(e) => handleSelectChange(e, extraInfoNo)}
              onBlur={() => validateExtraInfo(extraInfoNo)}
            />
          )}

          {extraInfoType === EXTRA_INFO_TYPE.IMAGE && (
            <ImageFileUploader
              extraInfoNo={extraInfoNo}
              images={imageMap?.[extraInfoNo]}
              imageFileUploadRef={imageFileUploadRefMap?.[extraInfoNo]}
              handleImageChange={(images) => handleImageChange(images, extraInfoNo)}
              handleImageUploadButtonClick={(event) => {
                event.preventDefault();
                handleImageUploadButtonClick(extraInfoNo);
              }}
              handleImageDelete={() => handleImageDelete(extraInfoNo)}
              usableStorage={true}
            />
          )}
        </div>

        <p className={`description ${message && result ? '' : 'alert'}`}>{message}</p>
      </div>
    );
  });
};

export default SignUpExtraInfosForm;

SignUpExtraInfosForm.propTypes = {};
