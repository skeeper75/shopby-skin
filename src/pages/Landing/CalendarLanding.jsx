import React from 'react';

import LandingTemplate from './LandingTemplate';

// 달력 랜딩 페이지
const CalendarLanding = () => {
  const config = {
    heroTitle: '나만의 달력을 특별하게 만들어 드립니다',
    heroSubtitle: '탁상, 벽걸이, 포켓 달력 등 다양한 형태의 달력을 맞춤 제작합니다.',
    heroCta: '달력 상품 보기',
    heroCtaLink: '/category/calendar',
    products: [],
    reviews: [],
    ctaSection: {
      title: '나만의 달력을 지금 주문하세요',
      description: '사진, 로고, 브랜드를 담은 특별한 달력을 제작해 드립니다.',
      orderText: '달력 주문하기',
      orderLink: '/order',
      quoteText: '대량 견적 문의',
      quoteLink: '/inquiry',
    },
  };

  return <LandingTemplate config={config} />;
};

export default CalendarLanding;
