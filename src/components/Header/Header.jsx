// @MX:NOTE: [AUTO] 반응형 헤더 시스템 - 데스크톱 메가메뉴 + 모바일 Sheet 메뉴
// @MX:SPEC: SPEC-SKIN-001 REQ-R02
import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link, NavLink } from 'react-router-dom';

import { string, bool } from 'prop-types';

import {
  RecentKeywordProvider,
  SearchField,
  useBannerStateContext,
  useModalActionContext,
  IconBtn,
  CartBtnV2,
  IconSVG,
  useCartStateContext,
  useMallStateContext,
  useAuthStateContext,
  useAuthActionContext,
} from '@shopby/react-components';
import { isSignedIn } from '@shopby/shared';

import useSearchKeyword from '../../hooks/useSearchKeyword';
import { cn } from '../../lib/utils';
import { getPageTypeInformation } from '../../utils';
import BackButton from '../BackButton';
import { useLayoutValueContext } from '../LayoutProvider';
import { DesktopPrintMegaMenu, MobilePrintCategories } from '../MegaMenuCategories';
import Sanitized from '../Sanitized';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '../ui/sheet';

import MallLogo from './MallLogo';

// =============================================
// 검색 관련 컴포넌트
// =============================================

/** 데스크톱 검색바 내부 (Provider 안에서 hook 호출) */
const DesktopSearchBarContent = () => {
  const { openAlert } = useModalActionContext();
  const { keyword, searchProductsByKeyword, removeKeyword, updateKeyword } = useSearchKeyword('');

  const handleSearch = (_keyword) => {
    if (!_keyword) {
      openAlert({ message: '키워드를 입력하세요.' });

      return;
    }
    searchProductsByKeyword(_keyword);
  };

  return (
    <div className="hidden lg:flex items-center">
      <SearchField
        className="w-[240px] xl:w-[320px]"
        searchValue={keyword}
        onSearchBtnClick={() => handleSearch(keyword)}
        onClearBtnClick={removeKeyword}
        onChange={({ target }) => updateKeyword(target.value)}
      />
    </div>
  );
};

/** 데스크톱 검색바 (Provider로 래핑) */
const DesktopSearchBar = () => (
  <RecentKeywordProvider>
    <DesktopSearchBarContent />
  </RecentKeywordProvider>
);

/** 검색 키워드 헤더 (서브 페이지용, 기존 기능 보존) */
const SearchKeywordHeader = ({ title }) => {
  const { openAlert } = useModalActionContext();
  const [showsSearchKeyword, setShowsSearchKeyword] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { keyword, searchProductsByKeyword, removeKeyword, updateKeyword } = useSearchKeyword(title);
  const keywordParam = searchParams.get('keyword');

  const searchKeyword = (_keyword) => {
    if (!_keyword) {
      openAlert({ message: '키워드를 입력하세요.' });

      return;
    }
    searchProductsByKeyword(_keyword);
    setSearchParams({ keyword });
  };

  useEffect(() => {
    if (!keywordParam) return;
    searchProductsByKeyword(keywordParam);
    updateKeyword(keywordParam);
  }, [keywordParam]);

  return (
    <>
      {showsSearchKeyword ? (
        <SearchField
          className="header__search-field"
          searchValue={keyword}
          onSearchBtnClick={() => searchKeyword(keyword)}
          onClearBtnClick={removeKeyword}
          onChange={({ target }) => updateKeyword(target.value)}
        />
      ) : (
        <button className="header__title" onClick={() => setShowsSearchKeyword((prev) => !prev)}>
          {keyword}
        </button>
      )}
    </>
  );
};
SearchKeywordHeader.propTypes = {
  title: string,
};

// =============================================
// 모바일 Sheet 메뉴 컴포넌트
// =============================================

/** 모바일 사이드 Sheet 메뉴 */
const MobileSheetMenu = () => {
  const { profile } = useAuthStateContext();
  const { fetchProfile } = useAuthActionContext();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (!isSignedIn()) {
      setUserName(null);

      return;
    }

    (async () => {
      if (!profile) {
        await fetchProfile();
      }
      setUserName(profile?.memberName ?? profile?.memberNo ?? null);
    })();
  }, [profile]);

  return (
    <Sheet>
      {/* 햄버거 버튼 */}
      <SheetTrigger asChild>
        <button
          className="lg:hidden flex items-center justify-center p-2"
          aria-label="메뉴 열기"
        >
          <IconSVG name="hamburger" size={24} strokeWidth={3} />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 overflow-y-auto">
        {/* 접근성: Sheet 제목 (시각적으로 숨김) */}
        <SheetTitle className="sr-only">메뉴</SheetTitle>

        {/* 사용자 정보 영역 */}
        <div className="bg-primary/10 p-6 pt-10">
          {userName ? (
            <div className="flex items-center gap-2">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <Link to="/my-page" className="font-semibold text-foreground hover:underline">
                {userName}
              </Link>
              <span className="text-muted-foreground text-sm">님</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/sign-in"
                state={{ from: '/' }}
                className="font-semibold text-primary hover:underline"
              >
                로그인
              </Link>
              <span className="text-muted-foreground text-sm">을 해주세요.</span>
            </div>
          )}
        </div>

        {/* 인쇄 카테고리 목록 (MegaMenuCategories 컴포넌트 사용) */}
        <MobilePrintCategories />

        {/* 퀵 링크 */}
        <div className="border-t border-border mt-2 pt-2">
          <Link
            to="/my-page"
            className="flex items-center gap-3 px-6 py-3 text-sm text-foreground hover:bg-accent transition-colors"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            마이페이지
          </Link>
          <Link
            to="/orders"
            className="flex items-center gap-3 px-6 py-3 text-sm text-foreground hover:bg-accent transition-colors"
          >
            <IconSVG name="hamburger" size={18} />
            주문/배송 조회
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-3 px-6 py-3 text-sm text-foreground hover:bg-accent transition-colors"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            장바구니
          </Link>
          <Link
            to="/customer-center"
            className="flex items-center gap-3 px-6 py-3 text-sm text-foreground hover:bg-accent transition-colors"
          >
            <IconSVG name="hamburger" size={18} />
            고객센터
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// =============================================
// 콘텐츠 영역 (기존 기능 보존)
// =============================================

const Content = ({ isMain, hasSearchKeywordHeader, title }) => {
  const { bannerMap } = useBannerStateContext();
  const { pageType } = getPageTypeInformation() ?? {};

  if (isMain) {
    return <MallLogo banner={bannerMap.get('LOGO')} />;
  }

  if (hasSearchKeywordHeader) {

    return (
      <RecentKeywordProvider>
        <SearchKeywordHeader title={title} />
      </RecentKeywordProvider>
    );
  }

  return (
    <h1 className={`header__title ${pageType ?? ''}`}>
      <Sanitized html={title} className="header__title-wrapper" />
    </h1>
  );
};

Content.propTypes = {
  isMain: bool,
  hasSearchKeywordHeader: bool,
  title: string,
};

// =============================================
// 메인 Header 컴포넌트
// =============================================

// @MX:WARN: [AUTO] [Header] 복잡한 상태 관리 컴포넌트 - 메가메뉴, 모바일시트, 스티키헤더, 검색 상태 동시 관리
// @MX:REASON: 복잡도 10 이상, 여러 상태가 상호 의존적
// @MX:ANCHOR: [AUTO] 앱 전체 헤더 - 모든 페이지에서 사용됨
// @MX:REASON: 라우팅 레이아웃에서 직접 참조 (fan_in >= 3)
const Header = () => {
  const {
    isMain = false,
    hasBackBtnOnHeader = false,
    hasCartBtnOnHeader = false,
    hasSearchKeywordHeader = false,
    hasCancelBtnOnHeader = false,
    title = '',
  } = useLayoutValueContext();
  const { cartCount } = useCartStateContext();
  const navigate = useNavigate();

  const canShowShoppingBasket = useMemo(
    () => (isMain || hasCartBtnOnHeader) && !hasCancelBtnOnHeader,
    [isMain, hasCartBtnOnHeader, hasCancelBtnOnHeader]
  );

  // 서브 페이지 - 모바일: 뒤로가기 + 중앙 제목, 데스크톱: 제목 좌측 정렬
  if (!isMain) {
    return (
      <header className={cn('header header--sub', 'sticky top-0 z-40 bg-white border-b')}>
        {/* 모바일에서만 뒤로가기 버튼 표시 */}
        {hasBackBtnOnHeader && <BackButton label="페이지 뒤로 가기" className="header__left-btn lg:hidden" />}
        {/* 데스크톱에서 제목 좌측 정렬, 모바일에서 중앙 정렬(기존 유지) */}
        <div className="lg:text-left">
          <Content isMain={isMain} hasSearchKeywordHeader={hasSearchKeywordHeader} title={title} />
        </div>
        {canShowShoppingBasket && (
          <div className="header__cart-btn">
            <Link to="/cart">
              <CartBtnV2 cartCount={cartCount} />
            </Link>
          </div>
        )}
        {hasCancelBtnOnHeader && (
          <IconBtn className="header__cancel-btn" iconType="x-black" onClick={() => navigate('/')} size="xs" />
        )}
      </header>
    );
  }

  // 메인 페이지: 반응형 헤더
  return (
    <>
      {/* ============================================ */}
      {/* 데스크톱 헤더 (lg 이상) */}
      {/* ============================================ */}
      <header
        className={cn(
          'hidden lg:block',
          'sticky top-0 z-40 bg-white border-b shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="flex items-center justify-between h-16">
            {/* 로고 (좌측) */}
            <div className="flex-shrink-0">
              <Content isMain={isMain} hasSearchKeywordHeader={hasSearchKeywordHeader} title={title} />
            </div>

            {/* 인쇄 카테고리 메가메뉴 (중앙) */}
            <DesktopPrintMegaMenu />

            {/* 검색 + 유저 액션 (우측) */}
            <div className="flex items-center gap-4">
              <DesktopSearchBar />

              {/* 로그인/마이페이지 */}
              <Link
                to={isSignedIn() ? '/my-page' : '/sign-in'}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label={isSignedIn() ? '마이페이지' : '로그인'}
              >
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="hidden xl:inline">
                  {isSignedIn() ? '마이페이지' : '로그인'}
                </span>
              </Link>

              {/* 장바구니 */}
              {canShowShoppingBasket && (
                <Link to="/cart" className="relative" aria-label={`장바구니 (${cartCount}개)`}>
                  <CartBtnV2 cartCount={cartCount} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 카테고리 네비게이션 바 (기존 Nav 슬라이더와 동일 역할) */}
        <DesktopCategoryBar />
      </header>

      {/* ============================================ */}
      {/* 모바일 헤더 (lg 미만) */}
      {/* ============================================ */}
      <header
        className={cn(
          'lg:hidden',
          'sticky top-0 z-40 bg-white border-b shadow-sm'
        )}
      >
        <div className="flex items-center justify-between h-14 px-4">
          {/* 햄버거 메뉴 (좌측) */}
          <MobileSheetMenu />

          {/* 로고 (중앙) */}
          <div className="flex-1 flex justify-center">
            <Content isMain={isMain} hasSearchKeywordHeader={hasSearchKeywordHeader} title={title} />
          </div>

          {/* 검색 + 장바구니 (우측) */}
          <div className="flex items-center gap-2">
            <Link to="/search" className="p-2" aria-label="검색">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </Link>
            {canShowShoppingBasket && (
              <Link to="/cart" className="relative" aria-label={`장바구니 (${cartCount}개)`}>
                <CartBtnV2 cartCount={cartCount} />
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

// =============================================
// 데스크톱 카테고리 바 (기존 Nav 대체)
// =============================================

/** 데스크톱 하단 카테고리 네비게이션 바 */
const DesktopCategoryBar = () => {
  const { categories } = useMallStateContext();

  if (!categories?.multiLevelCategories?.length) return null;

  return (
    <nav className="hidden lg:block border-t border-border/40" aria-label="카테고리 바로가기">
      <div className="max-w-7xl mx-auto px-4 xl:px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
          {categories.multiLevelCategories.map((category) => (
            <NavLink
              key={category.categoryNo}
              to={`/products?categoryNo=${category.categoryNo}`}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap px-3 py-1.5 text-sm rounded-md transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )
              }
            >
              {category.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;
