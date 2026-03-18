/* eslint-disable complexity */
import { useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';

import { pick } from 'lodash-es';
import { oneOf } from 'prop-types';

import {
  ClaimProvider,
  NextActionProvider,
  useClaimActionContext,
  useClaimStateContext,
  useModalActionContext,
  useMallStateContext,
  FileProvider,
} from '@shopby/react-components';
import { CLAIM_TYPE_MAP } from '@shopby/shared';

import OrderNoLabel from '../../components/OrderNoLabel';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import { deliverableProduct } from '../../utils';
import { PageShell } from '../../components/Layout';

import ClaimAccountForm from './ClaimAccountForm';
import ClaimButtons from './ClaimButtons';
import ClaimProductTable from './ClaimProductTable';
import ClaimReasonForm from './ClaimReasonForm';
import CollectionComment from './CollectionComment';
import CollectionInfoForm from './CollectionInfoForm';
import useValidateClaimFormMaker from './useValidateClaimFormMaker';

const IMAGE_UPLOADABLE_CLAIM_TYPES = ['RETURN', 'EXCHANGE'];

const ClaimContent = ({ claimType }) => {
  const [searchParams] = useSearchParams();
  const { isGlobalForm } = useMallStateContext();
  const {
    claimInfo,
    allClaimableOptions,
    checkedOptionAmount,
    isAccountFormNecessary,
    isCollectionInfoFormNecessary,
    returnWay,
  } = useClaimStateContext();
  const { fetchClaimInfo } = useClaimActionContext();
  const { toggleOneOrderOption } = useClaimActionContext();
  const { openAlert } = useModalActionContext();
  const { orderOptionNo } = useParams();

  const deliverable = useMemo(() => deliverableProduct(searchParams), [searchParams]);
  const isSellerCollect = returnWay === 'SELLER_COLLECT';

  const refs = {
    claimReasonSelectRef: useRef(),
    claimReasonDetailTextareaRef: useRef(),
    receiverNameInputRef: useRef(),
    searchZipCodeBtnRef: useRef(),
    mobilePhoneNumberInputRef: useRef(),
    phoneNumberInputRef: useRef(),
    bankSelectRef: useRef(),
    bankAccountInputRef: useRef(),
    bankDepositorNameInputRef: useRef(),
  };

  const isReceiverInfoNecessary = isCollectionInfoFormNecessary && isSellerCollect && deliverable;

  const { validate } = useValidateClaimFormMaker({
    refs,
    activeStatus: {
      receiverName: isReceiverInfoNecessary,
      address: isReceiverInfoNecessary,
      mobilePhoneNumber: isReceiverInfoNecessary && !isGlobalForm,
      phoneNumber: false,
      accountForRefund: isAccountFormNecessary && deliverable,
    },
  });

  const claimTypeLabel = useMemo(() => CLAIM_TYPE_MAP[claimType] ?? '', [claimType]);
  const dateLabel = useMemo(
    () => claimInfo?.originalOption.orderStatusDate.registerYmdt.slice(0, 10) ?? '',
    [claimInfo]
  );
  const orderNo = useMemo(() => claimInfo?.originalOption.orderNo ?? '', [claimInfo]);

  const isAllChecked = useMemo(
    () => checkedOptionAmount === allClaimableOptions.length,
    [checkedOptionAmount, allClaimableOptions]
  );

  useLayoutChanger({
    title: `${claimTypeLabel} 신청`,
    hasCartBtnOnHeader: true,
    hasBackBtnOnHeader: true,
  });

  useEffect(() => {
    if (!orderOptionNo || !Object.keys(CLAIM_TYPE_MAP).includes(claimType)) {
      openAlert({
        message: '올바른 접근 경로가 아닙니다. 메인으로 돌아갑니다.',
        onClose: () => {
          location.replace('/');
        },
      });

      return;
    }
    fetchClaimInfo(orderOptionNo);
  }, [orderOptionNo]);

  const handleToggleAllCheckboxBtnClick = () => {
    allClaimableOptions.forEach(({ orderOptionNo }) =>
      toggleOneOrderOption({ orderOptionNo: orderOptionNo.toString(), isChecked: !isAllChecked })
    );
  };

  return (
    <div className="claim">
      <OrderNoLabel dateLabel={dateLabel} orderNo={orderNo}>
        <button className="claim__toggle-all-btn" onClick={handleToggleAllCheckboxBtnClick}>
          {isAllChecked ? '선택 해제' : '전체 선택'}
        </button>
      </OrderNoLabel>
      <ClaimProductTable claimTypeLabel={claimTypeLabel} />
      <p className="claim__amount-info-label">
        {isAllChecked ? (
          <>
            <span className="bold">모든</span>&nbsp;상품을 선택하셨습니다.
          </>
        ) : (
          <>
            <span className="bold">{checkedOptionAmount}개</span>의 상품을 선택하셨습니다.
          </>
        )}
      </p>

      <ClaimReasonForm
        refs={pick(refs, ['claimReasonSelectRef', 'claimReasonDetailTextareaRef'])}
        useImageUploader={IMAGE_UPLOADABLE_CLAIM_TYPES.includes(claimType)}
      />
      {isAccountFormNecessary && (
        <ClaimAccountForm refs={pick(refs, ['bankSelectRef', 'bankAccountInputRef', 'bankDepositorNameInputRef'])} />
      )}
      {isCollectionInfoFormNecessary && deliverable && (
        <>
          <CollectionInfoForm
            refs={pick(refs, [
              'receiverNameInputRef',
              'searchZipCodeBtnRef',
              'mobilePhoneNumberInputRef',
              'phoneNumberInputRef',
            ])}
          />
          <CollectionComment returnWay={returnWay} returnWarehouseLabel={claimInfo.returnWarehouse?.summary} />
        </>
      )}

      <ClaimButtons claimTypeLabel={claimTypeLabel} validate={validate} orderNo={claimInfo?.originalOption.orderNo} />
    </div>
  );
};

ClaimContent.propTypes = {
  claimType: oneOf(['EXCHANGE', 'CANCEL', 'RETURN']),
};

const Claim = () => {
  const [searchParams] = useSearchParams();
  const { isGlobalForm } = useMallStateContext();

  const claimType = useMemo(() => searchParams.get('claimType'), [searchParams]);
  return (
    // 클레임 폼 최대 너비 제한 및 반응형 패딩 적용
    <PageShell maxWidth="4xl">
      <ClaimProvider claimType={claimType} isGlobal={isGlobalForm}>
        <NextActionProvider>
          <FileProvider>
            <ClaimContent claimType={claimType} />
          </FileProvider>
        </NextActionProvider>
      </ClaimProvider>
    </PageShell>
  );
};

export default Claim;
