// @MX:NOTE: ProductDetail 페이지 - Huni DS v2로 마이그레이션
// SPEC-SKIN-003: 인쇄 상품 상세 페이지

import React, { useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ImageSlider from './ImageSlider';
import ProductSummary from './ProductSummary';
import PrintConfigurator from '../../components/product/PrintConfigurator';
import HuniPriceCalculator from '../../components/product/HuniPriceCalculator';
import OptionActions from '../../components/product/OptionActions';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Divider } from '../../components/ui/Divider';

const ProductDetail = () => {
  const { productNo } = useParams();
  const [searchParams] = useSearchParams();
  const productType = searchParams.get('type') || 'business-card';

  const [selections, setSelections] = React.useState({});
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // 실제 인증 상태 확인 필요

  // 탭 구성
  const tabs = useMemo(() => [
    { value: 'detail', label: '상품 상세정보' },
    { value: 'review', label: '상품후기 (0)' },
    { value: 'inquiry', label: '상품 Q&A (0)' },
    { value: 'shipping', label: '배송/교환/반품' },
  ], []);

  // 로그인 상태 확인 (실제 구현 시 인증 Context 사용)
  useEffect(() => {
    // const checkAuth = async () => {
    //   const loggedIn = await checkLoginStatus();
    //   setIsLoggedIn(loggedIn);
    // };
    // checkAuth();
  }, []);

  /**
   * 옵션 변경 핸들러
   */
  const handleOptionsChange = (options) => {
    setSelections(options);
  };

  /**
   * 장바구니 추가
   */
  const handleAddToCart = () => {
    // shopby 장바구니 API 연동
    console.log('장바구니 추가:', { productNo, selections });
  };

  /**
   * 바로 구매
   */
  const handleBuyNow = () => {
    // 주문서 페이지로 이동
    window.location.href = `/order-sheet?productNo=${productNo}`;
  };

  return (
    <div className="min-h-screen bg-[--huni-bg-default]">
      {/* 헤더 영역 (기존 Header 컴포넌트 사용) */}

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* 상품 상세 섹션 */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* 좌측: 상품 이미지 */}
          <div className="w-full">
            <ImageSlider productNo={productNo} />
          </div>

          {/* 우측: 상품 요약 + 구매 영역 */}
          <div className="mt-4 lg:mt-0 space-y-6">
            {/* 상품 요약 */}
            <ProductSummary productNo={productNo} />

            <Divider />

            {/* 종속옵션 컨피규레이터 */}
            <PrintConfigurator
              productType={productType}
              productNo={Number(productNo)}
              onOptionsChange={handleOptionsChange}
            />

            {/* 가격 계산기 */}
            <HuniPriceCalculator
              selections={selections}
              productType={productType}
            />

            {/* 액션 버튼 */}
            <OptionActions
              selections={selections}
              productNo={Number(productNo)}
              productType={productType}
              isLoggedIn={isLoggedIn}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* 상품 상세 정보 탭 */}
        <div className="mt-12">
          <Tabs defaultValue="detail">
            <TabsList variant="brand">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="detail" className="mt-6">
              {/* 상품 상세 정보 */}
              <div className="prose max-w-none">
                <img
                  src={`/images/products/${productNo}/detail.jpg`}
                  alt="상품 상세정보"
                  className="w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="review" className="mt-6">
              {/* 상품 후기 (기존 Review 컴포넌트 사용) */}
              <div className="text-center py-12 text-[--huni-fg-muted]">
                등록된 상품후기가 없습니다.
              </div>
            </TabsContent>

            <TabsContent value="inquiry" className="mt-6">
              {/* 상품 Q&A (기존 Inquiry 컴포넌트 사용) */}
              <div className="text-center py-12 text-[--huni-fg-muted]">
                등록된 상품 Q&A가 없습니다.
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              {/* 배송/교환/반품 안내 */}
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold text-lg">배송 안내</h3>
                <p>일반택배: 3~5영업일 (금, 공휴일 제외)</p>
                <p>급행주문: 1~2영업일 (추가 비용 발생)</p>

                <h3 className="font-semibold text-lg mt-6">교환/반품 안내</h3>
                <p>인쇄물 특성상 단순 변심에 의한 교환/반품이 어렵습니다.</p>
                <p>불량품 발생 시 7일 이내 교환 가능합니다.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
