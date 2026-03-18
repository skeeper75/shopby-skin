import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  useModalActionContext,
  useProductDetailStateContext,
  useCartActionContext,
  useOrderSheetActionContext,
  useAuthActionContext,
  useAuthStateContext,
} from '@shopby/react-components';

import HuniOptionPreview from '../../../components/HuniOptionPreview';
import HuniPriceCalculator from '../../../components/HuniPriceCalculator';
import MobileOptionSheet from '../../../components/MobileOptionSheet';
import PrintConfigurator from '../../../components/PrintConfigurator';
import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import usePrintOptions from '../../../hooks/usePrintOptions';
import usePrintPrice from '../../../hooks/usePrintPrice';

// @MX:NOTE: [AUTO] 인쇄 상품 전용 구매 컴포넌트 - 기존 Purchase 대체
// 인쇄 옵션(사이즈/용지/코팅/마감/수량)을 PrintConfigurator로 선택 후 장바구니/구매 처리
const HuniPurchase = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productNo = Number(searchParams.get('productNo'));
  const channelType = searchParams.get('channelType');

  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const { productDetail } = useProductDetailStateContext();
  const { openAlert, openConfirm } = useModalActionContext();
  const { catchError } = useErrorBoundaryActionContext();
  const { addCart } = useCartActionContext();
  const { makeOrderSheet } = useOrderSheetActionContext();
  const { isSignedIn } = useAuthActionContext();
  const { profile } = useAuthStateContext();

  const { options, errors, updateOption, toggleFinishing, validate } = usePrintOptions();
  const { priceInfo, isCalculating } = usePrintPrice(options);

  const buildCartProduct = () => ({
    productNo,
    orderCnt: options.quantity,
    channelType,
    optionInputs: [
      { inputLabel: '사이즈', inputValue: options.size },
      { inputLabel: '용지', inputValue: options.paper },
      { inputLabel: '코팅', inputValue: options.coating },
      ...(options.finishing.length > 0
        ? [{ inputLabel: '마감', inputValue: options.finishing.join(', ') }]
        : []),
    ],
  });

  const handleAddCart = async () => {
    if (!validate()) {
      openAlert({ message: '필수 인쇄 옵션을 모두 선택해주세요.' });
      return;
    }
    try {
      await addCart([buildCartProduct()], profile?.memberStatus);
      openConfirm({
        message: '장바구니에 담았습니다.',
        confirmLabel: '장바구니 가기',
        onConfirm: () => navigate('/cart'),
        cancelLabel: '쇼핑계속하기',
      });
      setIsMobileSheetOpen(false);
    } catch (ctx) {
      catchError(ctx, () => navigate(0));
    }
  };

  const handleBuyNow = async () => {
    if (!validate()) {
      openAlert({ message: '필수 인쇄 옵션을 모두 선택해주세요.' });
      return;
    }
    try {
      const { data: orderSheet } = await makeOrderSheet({
        cartNos: null,
        channelType,
        productCoupons: null,
        products: [buildCartProduct()],
      });

      isSignedIn()
        ? navigate(`/order/${orderSheet.orderSheetNo}`)
        : navigate('/sign-in', { state: { orderSheetNo: orderSheet.orderSheetNo } });
    } catch (ctx) {
      catchError(ctx, () => navigate(0));
    }
  };

  const thumbnail = productDetail?.baseInfo?.imageUrl;

  return (
    <>
      {/* 데스크톱: 인라인 컨피규레이터 */}
      <div className="hidden lg:block space-y-5">
        <PrintConfigurator
          options={options}
          errors={errors}
          onUpdate={updateOption}
          onToggleFinishing={toggleFinishing}
        />
        <HuniOptionPreview options={options} thumbnail={thumbnail} />
        <HuniPriceCalculator
          priceInfo={priceInfo}
          isCalculating={isCalculating}
          onAddCart={handleAddCart}
          onBuyNow={handleBuyNow}
        />
      </div>

      {/* 모바일: 버튼 클릭 시 시트 열기 */}
      <div className="lg:hidden">
        <HuniOptionPreview options={options} thumbnail={thumbnail} className="mb-3" />
        <button
          type="button"
          onClick={() => setIsMobileSheetOpen(true)}
          className="w-full h-[50px] bg-[#5538B6] text-white text-sm font-bold rounded-[5px] tracking-[-0.05em]"
        >
          인쇄 옵션 선택하기
        </button>

        <MobileOptionSheet
          isOpen={isMobileSheetOpen}
          onClose={() => setIsMobileSheetOpen(false)}
        >
          <div className="space-y-5 pb-4">
            <PrintConfigurator
              options={options}
              errors={errors}
              onUpdate={updateOption}
              onToggleFinishing={toggleFinishing}
            />
            <HuniPriceCalculator
              priceInfo={priceInfo}
              isCalculating={isCalculating}
              onAddCart={handleAddCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </MobileOptionSheet>
      </div>
    </>
  );
};

export default HuniPurchase;
