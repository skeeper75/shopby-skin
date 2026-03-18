import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { object, bool, func, array, number, string } from 'prop-types';

import { Icon, InfiniteScrollLoader, ThumbItem, ThumbList, VisibleComponent } from '@shopby/react-components';
import { calculateDiscountedPrice, convertToKoreanCurrency, THUMB_LIST_TYPE } from '@shopby/shared';

import HuniBadge from '../HuniBadge';
import useResponsive from '../../hooks/useResponsive';
import { cn } from '../../lib/utils';
import GalleryGridSkeleton from '../GallerySkeleton/GalleryGridSkeleton';
import ProductThumbBadge from '../ProductThumbBadge';
import ProductThumbInfo from '../ProductThumbInfo';
import TotalCountAndSort from '../TotalCountAndSort';

// @MX:NOTE: [AUTO] 반응형 그리드 컬럼 설정 - 모바일 2열, 태블릿 3열, 데스크톱 4열
const RESPONSIVE_GRID_CLASSES = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';

// @MX:NOTE: [AUTO] 디바이스별 CDN 이미지 리사이징 크기 - 불필요한 대용량 이미지 로드 방지
const RESIZE_MAP = {
  mobile: '300x300',
  tablet: '280x280',
  desktop: '260x260',
};

// @MX:NOTE: [AUTO] 스티커 타입과 Huni 뱃지 타입 매핑 - 스티커명 기반으로 뱃지 결정
const STICKER_TO_HUNI_BADGE = {
  NEW: 'NEW',
  BEST: 'BEST',
  HOT: 'HOT',
  SALE: 'SALE',
};

const getHuniBadgeType = (stickerInfos = []) => {
  for (const { name } of stickerInfos) {
    const badgeType = STICKER_TO_HUNI_BADGE[name?.toUpperCase()];
    if (badgeType) return badgeType;
  }
  return null;
};

const getResizeValue = ({ isMobile, isTablet }) => {
  if (isMobile) return RESIZE_MAP.mobile;
  if (isTablet) return RESIZE_MAP.tablet;
  return RESIZE_MAP.desktop;
};

const NoSearchProduct = () => {
  const [searchParams] = useSearchParams();
  const keyword = useMemo(() => searchParams.get('keyword'), []);

  return (
    <>
      {keyword ? (
        <div className="no-search">
          <h3 className="no-search__title">&apos;{keyword}&apos; 에 대한 검색결과가 없습니다.</h3>
          <Icon name="no-items" />
          <p className="no-search__description">
            정확한 검색어를 확인하시고 다시 검색해주세요.
            <br />
            일시적으로 상품이 품절 되었을 수 있습니다.
            <br />
            단어의 철자나 띄어쓰기를 다르게 해보세요.
          </p>
        </div>
      ) : (
        <p className="not-found-product">상품이 존재하지 않습니다.</p>
      )}
    </>
  );
};

// @MX:ANCHOR: [AUTO] 갤러리 리스트 페이지 - 상품 목록 그리드 렌더링 핵심 컴포넌트
// @MX:REASON: 검색 결과, 카테고리 목록 등 다수 페이지에서 사용
const GalleryListPage = ({
  style,
  totalCount,
  products,
  sortType,
  sortBy,
  updateSortType,
  handleIntersect,
  disabled,
  className,
  isLoading = false,
}) => {
  const { isMobile, isTablet } = useResponsive();
  const resizeValue = getResizeValue({ isMobile, isTablet });

  return (
    <div className="l-panel">
      <TotalCountAndSort totalCount={totalCount} sortType={sortType} sortBy={sortBy} updateSortType={updateSortType} />

      <VisibleComponent
        shows={products.length > 0}
        TruthyComponent={
          <>
            <ThumbList
              style={style}
              displayType={THUMB_LIST_TYPE.GALLERY}
              className={cn(RESPONSIVE_GRID_CLASSES, className)}
            >
              {products.map(
                ({
                  productNo,
                  adult,
                  listImageUrlInfo,
                  isSoldOut,
                  saleStatusType,
                  salePrice,
                  promotionText,
                  productName,
                  unescapedProductName,
                  immediateDiscountAmt,
                  additionDiscountAmt,
                  frontDisplayYn,
                  imageUrlInfo,
                  imageUrls,
                  stickerInfos,
                }) => {
                  const finalPrice = calculateDiscountedPrice({
                    salePrice,
                    immediateDiscountAmt,
                    additionDiscountAmt,
                  });
                  const huniBadgeType = getHuniBadgeType(stickerInfos);

                  return (
                    frontDisplayYn && (
                      <ThumbItem
                        key={productNo}
                        resize={resizeValue}
                        href={`/product-detail?productNo=${productNo}`}
                        src={
                          listImageUrlInfo?.[0]?.url || listImageUrlInfo?.url || imageUrlInfo?.[0]?.url || imageUrls?.[0]
                        }
                        imageUrlType={listImageUrlInfo?.[0]?.imageUrlType || listImageUrlInfo?.type}
                        adult={adult}
                        alt={productName}
                        productNo={productNo}
                      >
                        <ProductThumbBadge isSoldOut={isSoldOut} saleStatusType={saleStatusType} />

                        {/* Huni 뱃지 */}
                        {huniBadgeType && (
                          <div className="absolute top-2 left-2 z-10">
                            <HuniBadge type={huniBadgeType} />
                          </div>
                        )}

                        <Link to={`/product-detail?productNo=${productNo}`}>
                          <ProductThumbInfo
                            promotionText={promotionText}
                            productName={unescapedProductName}
                            salePrice={finalPrice}
                          />
                          {/* 가격 범위 표시 */}
                          {immediateDiscountAmt > 0 && (
                            <div className="flex items-center gap-1.5 px-2 pb-1">
                              <span className="text-xs text-[#979797] line-through">
                                {convertToKoreanCurrency(salePrice)}원
                              </span>
                              <span className="text-xs font-bold text-[#EF4444]">
                                {Math.round((immediateDiscountAmt / salePrice) * 100)}%
                              </span>
                            </div>
                          )}
                        </Link>

                        {/* 기존 스티커(뱃지) */}
                        <div>
                          {stickerInfos.map(({ label, type, no, name }, index) => (
                            <span key={no || index} className="product-thumb__sticker">
                              {type === 'IMAGE' ? (
                                <img src={label} className="product-thumb__sticker-img" alt={name ?? '이미지 아이콘'} />
                              ) : (
                                label
                              )}
                            </span>
                          ))}
                        </div>
                      </ThumbItem>
                    )
                  );
                }
              )}
            </ThumbList>
            <GalleryGridSkeleton isLoading={isLoading} />
            <InfiniteScrollLoader onIntersect={handleIntersect} disabled={disabled} />
          </>
        }
        FalsyComponent={isLoading ? <GalleryGridSkeleton isLoading={isLoading} /> : <NoSearchProduct />}
      />
    </div>
  );
};
export default GalleryListPage;

GalleryListPage.propTypes = {
  style: object,
  totalCount: number,
  products: array,
  sortType: string,
  sortBy: array,
  updateSortType: func,
  handleIntersect: func,
  disabled: bool,
  className: string,
  isLoading: bool,
};
