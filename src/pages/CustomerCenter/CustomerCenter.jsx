import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ArticleProvider,
  useMallStateContext,
  useArticleActionContext,
  useArticleStateContext,
  useBoardConfigurationContextState,
  useBoardConfigurationContextAction,
  useAuthStateContext,
  useModalActionContext,
} from '@shopby/react-components';
import { isSignedIn } from '@shopby/shared';

import { FAQ_BOARD_ID } from '../../constants/board';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import { cn } from '../../lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';

// @MX:NOTE: [AUTO] CustomerCenter 허브 페이지 - SPEC-SKIN-004 탭 메뉴, 최근 공지/FAQ 요약, 연락처 섹션
// @MX:SPEC: SPEC-SKIN-004

// 허브 탭 메뉴 목록
const HUB_TABS = [
  { value: 'notice', label: '공지사항', path: '/notice' },
  { value: 'faq', label: 'FAQ', path: '/faq' },
  { value: 'inquiry', label: '1:1 문의', path: '/my-page/personal-inquiry' },
  { value: 'bulk-inquiry', label: '대량 문의', path: '/bulk-inquiry' },
  { value: 'business', label: '사업 상담', path: '/business-consultation' },
  { value: 'design', label: '디자인 상담', path: '/design-consultation' },
];

// 최근 공지사항 요약 섹션
const RecentNoticeSection = ({ notices }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#CACACA] rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-[#CACACA]">
        <h3 className="text-sm font-semibold text-[#424242]">최근 공지사항</h3>
        <button
          type="button"
          onClick={() => navigate('/notice')}
          className="text-xs text-[#5538B6] hover:underline"
        >
          전체보기
        </button>
      </div>
      {notices.length === 0 ? (
        <div className="px-4 py-6 text-sm text-center text-[#979797]">공지사항이 없습니다.</div>
      ) : (
        <ul className="divide-y divide-[#CACACA]">
          {notices.map((item) => (
            <li key={item.postNo}>
              <button
                type="button"
                onClick={() => navigate('/notice')}
                className="w-full px-4 py-3 text-left hover:bg-[#EEEBF9] transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-[#424242] truncate flex-1">{item.title}</span>
                  <span className="text-xs text-[#979797] shrink-0">
                    {item.registerYmdt?.split(' ')[0]}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 최근 FAQ 요약 섹션
const RecentFAQSection = ({ faqs }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#CACACA] rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-[#CACACA]">
        <h3 className="text-sm font-semibold text-[#424242]">자주 묻는 질문</h3>
        <button
          type="button"
          onClick={() => navigate('/faq')}
          className="text-xs text-[#5538B6] hover:underline"
        >
          전체보기
        </button>
      </div>
      {faqs.length === 0 ? (
        <div className="px-4 py-6 text-sm text-center text-[#979797]">FAQ가 없습니다.</div>
      ) : (
        <ul className="divide-y divide-[#CACACA]">
          {faqs.map((item) => (
            <li key={item.postNo}>
              <button
                type="button"
                onClick={() => navigate('/faq')}
                className="w-full px-4 py-3 text-left hover:bg-[#EEEBF9] transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="shrink-0 text-xs font-bold text-[#5538B6] mt-0.5">Q.</span>
                  <span className="text-sm text-[#424242] truncate flex-1">{item.title}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 연락처 섹션
const ContactSection = ({ serviceCenter }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#CACACA] rounded-md p-6">
      <h3 className="text-sm font-semibold text-[#424242] mb-4">고객센터 안내</h3>

      <div className="space-y-2 mb-6">
        {serviceCenter?.phoneNo && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#979797] w-16 shrink-0">전화</span>
            <span className="text-sm font-semibold text-[#424242]">{serviceCenter.phoneNo}</span>
          </div>
        )}
        {serviceCenter?.email && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#979797] w-16 shrink-0">이메일</span>
            <span className="text-sm text-[#424242]">{serviceCenter.email}</span>
          </div>
        )}
        {serviceCenter?.openHour && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#979797] w-16 shrink-0">운영시간</span>
            <span className="text-sm text-[#424242]">{serviceCenter.openHour}</span>
          </div>
        )}
        {/* 운영시간 기본 안내 (서버 데이터 없을 때) */}
        {!serviceCenter?.openHour && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#979797] w-16 shrink-0">운영시간</span>
            <span className="text-sm text-[#424242]">평일 09:00 - 18:00 (주말/공휴일 제외)</span>
          </div>
        )}
      </div>

      {/* CTA 버튼 그룹 */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            if (!isSignedIn()) {
              navigate('/sign-in');
              return;
            }
            navigate('/my-page/personal-inquiry');
          }}
          className={cn(
            'h-[46px] text-sm font-semibold border border-[#5538B6] text-[#5538B6] rounded-[5px]',
            'hover:bg-[#EEEBF9] transition-colors focus:outline-none'
          )}
        >
          1:1 문의
        </button>
        <button
          type="button"
          onClick={() => navigate('/bulk-inquiry')}
          className={cn(
            'h-[46px] text-white text-sm font-semibold rounded-[5px]',
            'bg-[#5538B6] hover:bg-[#4429a0] transition-colors focus:outline-none'
          )}
        >
          대량 문의
        </button>
      </div>
    </div>
  );
};

// 허브 탭 내용 (공지/FAQ 요약 + 연락처)
const CustomerCenterHubContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [recentNotices, setRecentNotices] = useState([]);
  const [recentFaqs, setRecentFaqs] = useState([]);

  const { mall: { serviceCenter } = {} } = useMallStateContext();
  const { boardConfig } = useBoardConfigurationContextState();
  const { checkDisplayableState } = useBoardConfigurationContextAction();
  const { fetchBoardPosts } = useArticleActionContext();
  const {
    boardPosts: { items },
  } = useArticleStateContext();
  const { profile } = useAuthStateContext();
  const { openAlert } = useModalActionContext();

  const faqConfig = useMemo(
    () => boardConfig.boardConfigs?.find(({ boardId }) => boardId?.toLowerCase().includes(FAQ_BOARD_ID)),
    [boardConfig.boardConfigs]
  );

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasBottomNav: true,
    hasCartBtnOnHeader: true,
    title: '고객센터',
  });

  // 최근 공지사항 3-5건 조회
  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchBoardPosts({
          boardNoOrId: 'notice',
          page: 1,
          pageSize: 5,
        });
        setRecentNotices(data?.items ?? []);
      } catch {
        // 에러 무시 (공지사항 없는 경우 빈 배열 유지)
      }
    })();
  }, []);

  // 최근 FAQ 3-5건 조회
  useEffect(() => {
    if (!faqConfig?.boardNo) return;

    const { data: displayable } = checkDisplayableState({
      profile,
      boardId: FAQ_BOARD_ID,
    });

    if (!displayable) return;

    fetchBoardPosts({
      boardNoOrId: faqConfig.boardNo,
      page: 1,
      pageSize: 5,
    });
  }, [faqConfig?.boardNo]);

  // 서브 메뉴 탭 클릭 핸들러
  const handleTabNavClick = (path, requireLogin = false) => {
    if (requireLogin && !isSignedIn()) {
      openAlert({ message: '로그인하셔야 본 서비스를 이용하실 수 있습니다.' });
      return;
    }
    navigate(path);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#424242]">고객센터</h1>
        <p className="mt-1 text-sm text-[#979797]">무엇을 도와드릴까요?</p>
      </div>

      {/* 주요 메뉴 탭 */}
      <div className="grid grid-cols-3 gap-3 mb-8 md:grid-cols-6">
        {HUB_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTabNavClick(tab.path, tab.value === 'inquiry')}
            className={cn(
              'flex flex-col items-center gap-1.5 p-3 border border-[#CACACA] rounded-md',
              'hover:border-[#5538B6] hover:bg-[#EEEBF9] hover:text-[#5538B6] transition-colors',
              'text-xs text-[#424242]'
            )}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 최근 공지 / FAQ 요약 */}
      <div className="space-y-4 mb-6">
        <RecentNoticeSection notices={recentNotices} />
        <RecentFAQSection faqs={items?.slice(0, 5) ?? []} />
      </div>

      {/* 연락처 및 CTA */}
      <ContactSection serviceCenter={serviceCenter} />
    </div>
  );
};

const CustomerCenter = () => (
  <ArticleProvider>
    <CustomerCenterHubContent />
  </ArticleProvider>
);

export default CustomerCenter;
