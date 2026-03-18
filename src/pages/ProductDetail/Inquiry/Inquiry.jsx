import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { bool } from 'prop-types';

import {
  InfiniteScrollLoader,
  ProductInquiryFormProvider,
  VisibleComponent,
  useInfiniteScroll,
  useProductDetailStateContext,
  useProductInquiryActionContext,
  useProductInquiryStateContext,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import ProductInquiryList from '../../../components/ProductInquiryList';

import Summary from './Summary';

const Inquiry = () => {
  const [searchParams] = useSearchParams();
  const productNo = Number(searchParams.get('productNo'));

  const {
    productDetail: {
      productName,
      baseInfo: { imageUrlInfo },
    },
  } = useProductDetailStateContext();

  const { totalCount } = useProductInquiryStateContext();

  const { searchInquiries } = useProductInquiryActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const { mainImageUrl, mainImageUrlType } = useMemo(() => {
    const imageInfo = imageUrlInfo.at(0);

    return {
      mainImageUrl: imageInfo?.url ?? '',
      mainImageUrlType: imageInfo?.type ?? 'IMAGE_URL',
    };
  }, [imageUrlInfo]);

  // 인피니트
  const { isLoading, accumulativeItems, fetchInitialItems, isInfiniteScrollDisabled, onIntersect } = useInfiniteScroll({
    fetcher: async (param) => {
      try {
        const { data } = await searchInquiries(param);

        return data.inquiries;
      } catch (error) {
        catchError(error);

        return [];
      }
    },
  });

  const handleIntersect = () => {
    onIntersect({
      totalCount,
    });
  };

  const resetProductInquiries = () => {
    fetchInitialItems();
  };

  useEffect(() => {
    fetchInitialItems();
  }, []);

  return (
    <div className="product-content-inquiry">
      <ProductInquiryFormProvider>
        <Summary onSubmit={resetProductInquiries} />
        <ProductInquiryList
          productName={productName}
          mainImageUrl={mainImageUrl}
          mainImageUrlType={mainImageUrlType}
          productNo={productNo}
          totalCount={totalCount}
          onModify={resetProductInquiries}
          onDelete={resetProductInquiries}
          inquiries={accumulativeItems}
          isLoading={isLoading}
        />
        <VisibleComponent
          shows={accumulativeItems.length > 0}
          TruthyComponent={<InfiniteScrollLoader onIntersect={handleIntersect} disabled={isInfiniteScrollDisabled} />}
        />
      </ProductInquiryFormProvider>
    </div>
  );
};

export default Inquiry;

Inquiry.propTypes = {
  isLoading: bool,
};
