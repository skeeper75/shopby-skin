import { Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { pick } from 'lodash-es';
import { string, arrayOf, object, func } from 'prop-types';

import { Button } from '@shopby/react-components';

import { Chip } from '../../../components/ui';

// @MX:NOTE: 클레임 상태별 Chip variant 매핑 (SPEC-SKIN-002)
const CLAIM_STATUS_CHIP_VARIANT = (label = '') => {
  if (label.includes('취소')) return 'error';
  if (label.includes('반품') || label.includes('교환')) return 'warning';
  if (label.includes('완료')) return 'success';
  return 'default';
};
import {
  convertToKoreanCurrency,
  getUrlWithAdditionalSearchParams,
  NEXT_ACTION_TYPE_MAP,
  unescapeHTML,
} from '@shopby/shared';

import OptionLabel from '../../../components/OptionLabel';
import Sanitized from '../../../components/Sanitized';

const WITHDRAW_ACTION_TYPES_MAP = pick(NEXT_ACTION_TYPE_MAP, [
  'WITHDRAW_CANCEL',
  'WITHDRAW_EXCHANGE',
  'WITHDRAW_RETURN',
]);
const WITHDRAW_ACTION_TYPES = Object.keys(WITHDRAW_ACTION_TYPES_MAP);

const ClaimSummary = ({ claimYmdt, orderNo, claimedOptions, onWithdrawClaimBtnClick }) => {
  const claimYmd = useMemo(() => claimYmdt.slice(0, 10), [claimYmdt]);

  return (
    <div className="claims__claim-summary">
      <p className="claims__identifier">
        <time dateTime={claimYmd} className="bold">
          {claimYmd.split('-').join('.')}
        </time>
        <span className="claims__order-no">{orderNo}</span>
      </p>
      {claimedOptions.map(
        ({
          imageUrl,
          imageUrlInfo,
          optionName,
          optionValue,
          inputs: optionInputs,
          orderOptionNo,
          productName,
          price: { buyAmt },
          claimStatusTypeLabel,
          nextActions,
          optionType,
          isExtraProduct,
          baseProductName,
        }) => (
          <article key={orderOptionNo} className="claims__product-wrap">
            <Link className="claims__product" to={`/orders/${orderNo}`}>
              {imageUrlInfo?.[0]?.imageUrlType === 'VIDEO_URL' ? (
                <div className="thumb-LIST">
                  <div className="thumb-item product-thumb-item">
                    <div className="thumb-item__media">
                      <span className="thumb-item__img">
                        <div className="video-cover"></div>
                        <iframe src={imageUrl} width="100%" height="100%" frameBorder="0" />
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={getUrlWithAdditionalSearchParams({
                    url: imageUrl,
                    additionalSearchParams: '75x75',
                  })}
                  alt={`${productName} 이미지`}
                />
              )}
              <div className="claims__product-description">
                {isExtraProduct && baseProductName && (
                  <p className="claims__base-product-name-content">
                    <span className="claims__base-product-name-label bold">[본상품]</span>
                    <span className="claims__base-product-name">
                      <Sanitized html={unescapeHTML(baseProductName)} />
                    </span>
                  </p>
                )}
                <p className="claims__product-name claims__product-name--with-sticker">
                  {isExtraProduct && <span className="claims__extra-product-label">추가</span>}
                  <Sanitized html={unescapeHTML(productName)} />
                </p>

                <p className="claims__product-option-label">
                  {optionType !== 'PRODUCT_ONLY' && (
                    <OptionLabel optionName={optionName} optionValue={optionValue} optionInputs={optionInputs} />
                  )}
                </p>
                <div className="claims__product-bottom">
                  <div className="claims__product-tag">
                    <span className="claims__pay-amount-label">
                      <span className="claims__pay-amount">{convertToKoreanCurrency(buyAmt)}</span> 원
                    </span>
                    <Chip variant={CLAIM_STATUS_CHIP_VARIANT(claimStatusTypeLabel)} size="sm">
                      {claimStatusTypeLabel}
                    </Chip>
                  </div>
                </div>
              </div>
            </Link>
            {nextActions.map(({ nextActionType }) => {
              if (WITHDRAW_ACTION_TYPES.includes(nextActionType)) {
                return (
                  <Button
                    key={nextActionType}
                    className="claims__withdraw-btn"
                    onClick={(e) =>
                      onWithdrawClaimBtnClick?.(e, orderOptionNo, WITHDRAW_ACTION_TYPES_MAP[nextActionType])
                    }
                  >
                    {WITHDRAW_ACTION_TYPES_MAP[nextActionType]}
                  </Button>
                );
              }

              return <Fragment key={nextActionType}></Fragment>;
            })}
          </article>
        )
      )}
    </div>
  );
};

export default ClaimSummary;

ClaimSummary.propTypes = {
  claimYmdt: string,
  orderNo: string,
  claimedOptions: arrayOf(object),
  onWithdrawClaimBtnClick: func,
};
