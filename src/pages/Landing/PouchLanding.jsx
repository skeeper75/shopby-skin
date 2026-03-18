import React from 'react';

import LandingTemplate from './LandingTemplate';

// 파우치 랜딩 페이지
const PouchLanding = () => {
  const config = {
    heroTitle: '브랜드를 담은 맞춤 파우치',
    heroSubtitle: '다양한 소재와 사이즈로 브랜드 아이덴티티를 담은 파우치를 제작합니다.',
    heroCta: '파우치 상품 보기',
    heroCtaLink: '/category/pouch',
    products: [],
    reviews: [],
    ctaSection: {
      title: '나만의 파우치를 지금 주문하세요',
      description: '소량 제작부터 대량 OEM까지 모든 파우치 제작을 담당합니다.',
      orderText: '파우치 주문하기',
      orderLink: '/order',
      quoteText: '대량 견적 문의',
      quoteLink: '/inquiry',
    },
  };

  return <LandingTemplate config={config} />;
};

export default PouchLanding;
