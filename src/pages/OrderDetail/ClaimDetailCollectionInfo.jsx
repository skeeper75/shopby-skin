import { string, oneOfType, arrayOf } from 'prop-types';

import { RETURN_WAY_TYPE_MAP, getUrlWithAdditionalSearchParams } from '@shopby/shared';

const ClaimDetailCollectionInfo = ({
  returnWay,
  returnerName,
  returnerMobilePhoneNumber,
  returnerPhoneNumber,
  returnNote,
  returnAddress,
  claimImageUrls,
}) => {
  if (returnWay === 'BUYER_DIRECT_RETURN')
    return (
      <section className="l-panel">
        <p className="order-detail__section-title">반품 수거 정보</p>
        <dl className="order-detail__section-content">
          <dt>반품 수거 방법</dt>
          <dd>{RETURN_WAY_TYPE_MAP[returnWay]}</dd>
          <dt>반품 접수 정보</dt>
          <dd>{returnNote}</dd>
        </dl>
      </section>
    );

  return (
    <section className="l-panel">
      <p className="order-detail__section-title">반품 수거 정보</p>
      <dl className="order-detail__section-content">
        <dt>반품 수거 방법</dt>
        <dd>{RETURN_WAY_TYPE_MAP[returnWay]}</dd>
        <dt>반품자명</dt>
        <dd>{returnerName}</dd>
        <dt>수거지 주소</dt>
        <dd>{returnAddress}</dd>
        <dt>휴대폰 번호</dt>
        <dd>{returnerMobilePhoneNumber}</dd>
        <dt>전화 번호</dt>
        <dd>{returnerPhoneNumber}</dd>
        <dt>수거 시 참고사항</dt>
        <dd>{returnNote}</dd>
        {claimImageUrls?.length > 0 && (
          <>
            <dt>반품 이미지</dt>
            <dd className="order-detail__section-images">
              {claimImageUrls.map((src) => (
                <span key={src} className="order-detail__section-image">
                  <img
                    src={getUrlWithAdditionalSearchParams({
                      url: src,
                      additionalSearchParams: '92x92',
                    })}
                    loading="lazy"
                    alt="반품 이미지"
                  />
                </span>
              ))}
            </dd>
          </>
        )}
      </dl>
    </section>
  );
};

export default ClaimDetailCollectionInfo;

ClaimDetailCollectionInfo.propTypes = {
  returnWay: oneOfType(['BUYER_DIRECT_RETURN', 'SELLER_COLLECT']),
  returnerName: string,
  returnerMobilePhoneNumber: string,
  returnerPhoneNumber: string,
  returnNote: string,
  returnAddress: string,
  claimImageUrls: arrayOf(string),
};
