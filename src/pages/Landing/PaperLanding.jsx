import React from 'react';

import LandingTemplate from './LandingTemplate';

// 용지/인쇄 랜딩 페이지
const PaperLanding = () => {
  const config = {
    heroTitle: '고품질 용지 인쇄의 새로운 기준',
    heroSubtitle: '다양한 용지와 코팅 옵션으로 당신만의 완벽한 인쇄물을 완성하세요.',
    heroCta: '용지 상품 보기',
    heroCtaLink: '/category/paper',
    products: [],
    reviews: [],
    ctaSection: {
      title: '지금 바로 용지 인쇄를 주문하세요',
      description: '전문 인쇄 팀이 최고의 품질로 제작해 드립니다.',
      orderText: '바로 주문하기',
      orderLink: '/order',
      quoteText: '견적 문의하기',
      quoteLink: '/inquiry',
    },
  };

  return <LandingTemplate config={config} />;
};

export default PaperLanding;
