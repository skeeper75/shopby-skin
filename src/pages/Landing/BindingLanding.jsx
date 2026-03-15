import React from 'react';

import LandingTemplate from './LandingTemplate';

// 제본 랜딩 페이지
const BindingLanding = () => {
  const config = {
    heroTitle: '전문 제본으로 완성하는 고급 인쇄물',
    heroSubtitle: '무선제본, 중철제본, 양장제본 등 다양한 제본 방식으로 완성도 높은 결과물을 만들어 드립니다.',
    heroCta: '제본 상품 보기',
    heroCtaLink: '/category/binding',
    products: [],
    reviews: [],
    ctaSection: {
      title: '지금 바로 제본 인쇄를 주문하세요',
      description: '소량부터 대량까지 맞춤 제본 서비스를 제공합니다.',
      orderText: '바로 주문하기',
      orderLink: '/order',
      quoteText: '견적 문의하기',
      quoteLink: '/inquiry',
    },
  };

  return <LandingTemplate config={config} />;
};

export default BindingLanding;
