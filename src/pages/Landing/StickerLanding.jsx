import React from 'react';

import LandingTemplate from './LandingTemplate';

// 스티커 랜딩 페이지
const StickerLanding = () => {
  const config = {
    heroTitle: '원하는 모양, 원하는 수량의 맞춤 스티커',
    heroSubtitle: '다양한 형태와 소재의 스티커를 소량부터 대량까지 제작해 드립니다.',
    heroCta: '스티커 상품 보기',
    heroCtaLink: '/category/sticker',
    products: [],
    reviews: [],
    ctaSection: {
      title: '나만의 스티커를 지금 주문하세요',
      description: '방수, 유광, 무광 등 다양한 소재 옵션으로 완벽한 스티커를 제작합니다.',
      orderText: '스티커 주문하기',
      orderLink: '/order',
      quoteText: '견적 문의하기',
      quoteLink: '/inquiry',
    },
  };

  return <LandingTemplate config={config} />;
};

export default StickerLanding;
