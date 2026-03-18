import React from 'react';
import { useLocation } from 'react-router-dom';

import { string } from 'prop-types';

import { cn } from '../../lib/utils';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

// URL 경로 세그먼트를 한국어 라벨로 매핑
const PATH_LABELS = {
  'display-category-list': '카테고리',
  'product-detail': '상품 상세',
  cart: '장바구니',
  order: '주문',
  'my-page': '마이페이지',
  'customer-center': '고객센터',
  faq: 'FAQ',
  notice: '공지사항',
  search: '검색',
  'order-confirm': '주문 확인',
  'order-complete': '주문 완료',
  login: '로그인',
  join: '회원가입',
  'find-id': '아이디 찾기',
  'find-password': '비밀번호 찾기',
};

/**
 * 마지막 세그먼트의 라벨을 결정
 * categoryName, productName 우선, 없으면 PATH_LABELS 매핑 또는 원본 세그먼트
 */
const resolveLastSegmentLabel = (segment, categoryName, productName) => {
  if (categoryName) return categoryName;
  if (productName) return productName;

  return PATH_LABELS[segment] ?? segment;
};

// @MX:NOTE: [AUTO] 데스크톱 전용 브레드크럼 네비게이션 (SPEC-SKIN-001 REQ-P03)
// @MX:SPEC: SPEC-SKIN-001/TAG-011
const BreadcrumbNav = ({ className, categoryName, productName }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // 홈('/')에서는 브레드크럼을 표시하지 않음
  if (pathSegments.length === 0) return null;

  return (
    <div className={cn('hidden lg:block max-w-7xl mx-auto px-4 py-3', className)}>
      <Breadcrumb>
        <BreadcrumbList>
          {/* 홈 링크 (항상 첫 번째) */}
          <BreadcrumbItem>
            <BreadcrumbLink href="/">홈</BreadcrumbLink>
          </BreadcrumbItem>

          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const path = `/${pathSegments.slice(0, index + 1).join('/')}`;

            // 마지막 세그먼트: categoryName 또는 productName 우선 사용
            // 그 외: PATH_LABELS 매핑 또는 원본 세그먼트 표시
            const label = isLast
              ? resolveLastSegmentLabel(segment, categoryName, productName)
              : PATH_LABELS[segment] ?? segment;

            return (
              <React.Fragment key={path}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={path}>{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbNav;

BreadcrumbNav.propTypes = {
  className: string,
  categoryName: string,
  productName: string,
};
