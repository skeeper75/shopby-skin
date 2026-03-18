import { Link } from 'react-router-dom';

import { string, number } from 'prop-types';

import { convertToKoreanCurrency, getUrlWithAdditionalSearchParams, unescapeHTML } from '@shopby/shared';

import Sanitized from '../../../components/Sanitized';

const OrderSummary = ({
  orderYmd,
  orderTitle,
  imageUrl,
  imageUrlType = 'IMAGE_URL',
  orderNo,
  totalProductAmt,
  redirectUrl,
  currencyLabel = '원',
}) => (
  <Link className="orders__order-summary" to={redirectUrl}>
    <p className="orders__identifier">
      <time dateTime={orderYmd} className="bold">
        {orderYmd?.split('-').join('.')}
      </time>
      <span className="orders__order-no">{orderNo}</span>
    </p>
    <div className="orders__product">
      {imageUrlType === 'IMAGE_URL' ? (
        <img
          src={getUrlWithAdditionalSearchParams({
            url: imageUrl,
            additionalSearchParams: '75x75',
          })}
          alt={`${orderTitle} 상품 이미지`}
        />
      ) : (
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
      )}
      <div className="orders__product-description">
        <h3 className="orders__product-name">
          <Sanitized html={unescapeHTML(orderTitle)} />
        </h3>
        <div className="orders__product-tag">
          <span className="orders__pay-amount-label">
            <span className="orders__pay-amount">{convertToKoreanCurrency(totalProductAmt)}</span>
            {currencyLabel}
          </span>
        </div>
      </div>
    </div>
  </Link>
);

export default OrderSummary;

OrderSummary.propTypes = {
  orderYmd: string.isRequired,
  orderTitle: string.isRequired,
  imageUrl: string.isRequired,
  orderNo: string.isRequired,
  totalProductAmt: number.isRequired,
  statusLabel: string.isRequired,
  redirectUrl: string,
  imageUrlType: string,
  currencyLabel: string,
};
