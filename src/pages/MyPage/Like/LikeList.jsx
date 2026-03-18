import { useEffect, useState } from 'react';

import {
  useProductInquiryFormActionContext,
  useProductInquiryStateContext,
  VisibleComponent,
  useModalActionContext,
  useProfileLikeStateContext,
  useProfileLikeActionContext,
  useInfiniteScroll,
  Button,
  ThumbList,
  InfiniteScrollLoader,
  useProductInquiryActionContext,
  useCurrencyStateContext,
} from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import FullModal from '../../../components/FullModal';
import ListSkeleton from '../../../components/ListSkeleton/ListSkeleton';
import ProductInquiryForm from '../../../components/ProductInquiryForm/ProductInquiryForm';
import ProductThumbItem from '../../../components/ProductThumbItem';
import { INFINITY_SCROLL_PAGE_SIZE } from '../../../constants/common';

const DEFAULT_PRODUCT_INFORMATION = {
  productName: '',
  imageUrls: [''],
};

const EmptyList = () => (
  <div className="empty-list">
    <p>좋아요 내역이 없습니다.</p>
  </div>
);

const LikeList = () => {
  const { inquiryConfig } = useProductInquiryStateContext();
  const { currencySymbol: currencyLabel } = useCurrencyStateContext();

  const { openAlert } = useModalActionContext();
  const { postProductInquiryBy } = useProductInquiryFormActionContext();
  const { catchError } = useErrorBoundaryActionContext();
  const { fetchConfiguration: fetchProductInquiryConfiguration } = useProductInquiryActionContext();

  const { profileLikeProduct } = useProfileLikeStateContext();
  const { fetchProfileLikeProduct, postProfileLikeByProductNos } = useProfileLikeActionContext();

  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [productInformation, setProductInformation] = useState({
    ...DEFAULT_PRODUCT_INFORMATION,
  });

  // 인피니트
  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (requestOption) => {
      try {
        const { data } = await fetchProfileLikeProduct(requestOption);

        return data.items;
      } catch (error) {
        catchError(error);

        return [];
      }
    },
    requestOption: {
      pageNumber: 1,
      pageSize: INFINITY_SCROLL_PAGE_SIZE,
      hasTotalCount: true,
    },
  });

  const handleIntersect = () => {
    onIntersect({
      totalCount: profileLikeProduct?.totalCount,
    });
  };

  // 상품문의
  const handleInquiryButtonClick = (productInformation) => {
    setProductInformation(productInformation);
    setIsRegistrationModalOpen(true);
  };

  const handleProductInquiryFormSubmit = async (productInquiryForm) => {
    try {
      await postProductInquiryBy({
        productNo: productInformation.productNo,
        ...productInquiryForm,
      });

      openAlert({
        message: '상품문의가 등록됐습니다.',
        onClose: () => {
          setProductInformation({
            ...DEFAULT_PRODUCT_INFORMATION,
          });
          setIsRegistrationModalOpen(false);
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  // 삭제
  const handleDeleteButtonClick = async (productInformation) => {
    try {
      await postProfileLikeByProductNos({
        productNos: [productInformation.productNo],
      });

      await fetchInitialItems();
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    fetchInitialItems();

    fetchProductInquiryConfiguration({
      cacheOption: {
        type: 'MEMORY',
        timeBySeconds: 180,
      },
    });
  }, []);

  return (
    <>
      <VisibleComponent
        shows={!(profileLikeProduct?.totalCount > 0)}
        TruthyComponent={isLoading ? <ListSkeleton isLoading={isLoading} /> : <EmptyList />}
        FalsyComponent={
          <>
            <div className="profile-like__list">
              {accumulativeItems.map((item, index) => (
                <ThumbList key={`${item.productNo}_${index}`} className="profile-like__list-item">
                  <ProductThumbItem
                    productNo={item.productNo}
                    productName={item.unescapedProductName}
                    optionNo={item.optionNo}
                    brandName={item.brandName}
                    imageUrl={item.listImageInfo.at(0)?.url}
                    imageUrlType={item.listImageInfo.at(0)?.type}
                    optionUsed={false}
                    AmountComponent={() => {
                      const discountAmount = item.immediateDiscountAmt + item.additionDiscountAmt;
                      const originalPrice = discountAmount > 0 ? item.salePrice : 0;
                      const salePrice = item.salePrice - discountAmount;

                      return (
                        <ul className="profile-like__amount-list">
                          <li className="profile-like__amount-item">
                            <span>
                              {convertToKoreanCurrency(salePrice)} {currencyLabel}
                            </span>
                            {
                              <VisibleComponent
                                shows={discountAmount > 0}
                                TruthyComponent={
                                  <del className="profile-like__original-price">
                                    {convertToKoreanCurrency(originalPrice)} {currencyLabel}
                                  </del>
                                }
                              />
                            }
                          </li>
                        </ul>
                      );
                    }}
                    resize={'84x84'}
                  />
                  <div className="profile-like__buttons">
                    <Button
                      className="profile-like__inquiry-button"
                      label="상품문의"
                      onClick={() => handleInquiryButtonClick(item)}
                    />
                    <Button
                      className="profile-like__delete-button"
                      label="삭제"
                      onClick={() => handleDeleteButtonClick(item)}
                    />
                  </div>
                </ThumbList>
              ))}
            </div>
            <VisibleComponent
              shows={accumulativeItems.length > 0}
              TruthyComponent={
                <InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollDisabled} />
              }
            />
            <ListSkeleton isLoading={isLoading} />
          </>
        }
      />

      <VisibleComponent
        shows={isRegistrationModalOpen}
        TruthyComponent={
          <FullModal title={inquiryConfig.name}>
            <ProductInquiryForm
              productName={productInformation?.unescapedProductName}
              productImageUrl={productInformation?.listImageInfo?.[0]?.url ?? ''}
              productImageUrlType={productInformation?.listImageInfo?.[0]?.type}
              ButtonGroup={(props) => (
                <div className="board-form__button-group">
                  <Button
                    className="review-form__submit-btn review-form__btn inquiry-form__btn--cancel"
                    theme="dark"
                    label="취소"
                    onClick={() => setIsRegistrationModalOpen(false)}
                  />
                  <Button
                    className="review-form__submit-btn review-form__btn inquiry-form__btn--register"
                    theme="caution"
                    label="등록"
                    onClick={() => handleProductInquiryFormSubmit(props)}
                  />
                </div>
              )}
            />
          </FullModal>
        }
      />
    </>
  );
};

export default LikeList;
