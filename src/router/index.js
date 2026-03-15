import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

const MemberRoute = lazy(() => import('./MemberRoute'));
const IntroPageRoute = lazy(() => import('./IntroPageRoute'));
const NotAccessLoggedInUserRouter = lazy(() => import('./NotAccessLoggedInUserRouter'));
const NotFoundRoute = lazy(() => import('./NotFoundRoute'));

const Layout = lazy(() => import('../components/Layout'));
const Main = lazy(() => import('../pages/Main'));
const MyPage = lazy(() => import('../pages/MyPage'));
const SignIn = lazy(() => import('../pages/SignIn'));
const OrderSheet = lazy(() => import('../pages/OrderSheet'));
const Notice = lazy(() => import('../pages/Notice'));
const CustomerCenter = lazy(() => import('../pages/CustomerCenter'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const DisplayCategoryList = lazy(() => import('../pages/DisplayCategoryList'));
const SignUp = lazy(() => import('../pages/SignUp'));
const SignUpConfirm = lazy(() => import('../pages/SignUpConfirm'));
const ProductSectionList = lazy(() => import('../pages/ProductSectionList'));
const CallBack = lazy(() => import('../pages/CallBack'));
const FAQ = lazy(() => import('../pages/FAQ'));
const Cart = lazy(() => import('../pages/Cart'));
const OpenIdCallback = lazy(() => import('../pages/OpenIdCallback'));
const SignUpMenu = lazy(() => import('../pages/SignUpMenu'));
const MemberModification = lazy(() => import('../pages/MemberModification'));
const OrderConfirm = lazy(() => import('../pages/OrderConfirm'));
const FindId = lazy(() => import('../pages/FindId'));
const FindPassword = lazy(() => import('../pages/FindPassword'));
const ChangePassword = lazy(() => import('../pages/ChangePassword'));
const NotFound = lazy(() => import('../pages/NotFound'));
const AdultCertification = lazy(() => import('../pages/AdultCertification'));
const MemberWithdrawal = lazy(() => import('../pages/MemberWithdrawal'));
const Event = lazy(() => import('../pages/Event'));
const Claim = lazy(() => import('../pages/Claim'));
const OrderDetail = lazy(() => import('../pages/OrderDetail'));
const DesignWindowPopup = lazy(() => import('../components/DesignPopup/DesignWindowPopup'));
const OrderSpecification = lazy(() => import('../components/OrderSpecification'));
const SimpleReceipt = lazy(() => import('../components/SimpleReceipt'));

// MyPage
const MyPageProductReview = lazy(() => import('../pages/MyPage/ProductReview'));
const MyPagePersonalInquiry = lazy(() => import('../pages/MyPage/PersonalInquiry'));
const MyPagePersonalInquiryDetail = lazy(() => import('../pages/MyPage/PersonalInquiry/PersonalInquiryDetail'));
const MyPageProductInquiry = lazy(() => import('../pages/MyPage/ProductInquiry'));
const MyPageCoupon = lazy(() => import('../pages/MyPage/Coupon'));
const MyOrders = lazy(() => import('../pages/MyPage/Orders'));
const MyPageAccumulation = lazy(() => import('../pages/MyPage/Accumulation'));
const MyPageLike = lazy(() => import('../pages/MyPage/Like'));
const MyPageShippingAddress = lazy(() => import('../pages/MyPage/ShippingAddress'));
const MyClaims = lazy(() => import('../pages/MyPage/Claims'));
const GuestOrder = lazy(() => import('../pages/GuestOrder'));

// SPEC-SKIN-004: 고객센터/정보/마케팅 페이지
const BulkInquiry = lazy(() => import('../pages/BulkInquiry'));
const BusinessConsultation = lazy(() => import('../pages/BusinessConsultation'));
const DesignConsultation = lazy(() => import('../pages/DesignConsultation'));
const Terms = lazy(() => import('../pages/Terms'));
const WorkGuide = lazy(() => import('../pages/WorkGuide'));
const GuideDetail = lazy(() => import('../pages/WorkGuide/GuideDetail'));
const PaperLanding = lazy(() => import('../pages/Landing/PaperLanding'));
const BindingLanding = lazy(() => import('../pages/Landing/BindingLanding'));
const CalendarLanding = lazy(() => import('../pages/Landing/CalendarLanding'));
const PouchLanding = lazy(() => import('../pages/Landing/PouchLanding'));
const StickerLanding = lazy(() => import('../pages/Landing/StickerLanding'));
const Reviews = lazy(() => import('../pages/Reviews'));
const ExperienceGroup = lazy(() => import('../pages/ExperienceGroup'));
const AboutUs = lazy(() => import('../pages/AboutUs'));
const Directions = lazy(() => import('../pages/Directions'));

// @MX:NOTE: [AUTO] SPEC-SKIN-005 관리자 라우트 - /admin/login은 레이아웃 없음, /admin/* 하위는 AdminLayout 적용
// SPEC-SKIN-005: 관리자 페이지
const AdminLayout = lazy(() => import('../components/admin/AdminLayout'));
const AdminLogin = lazy(() => import('../pages/admin/Login'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminMembers = lazy(() => import('../pages/admin/Members'));
const AdminOrders = lazy(() => import('../pages/admin/Orders'));
const AdminFileCheck = lazy(() => import('../pages/admin/FileCheck'));
const AdminStatusChange = lazy(() => import('../pages/admin/StatusChange'));
const AdminPrintOrders = lazy(() => import('../pages/admin/PrintOrders'));
const AdminDeferredPayment = lazy(() => import('../pages/admin/DeferredPayment'));
const AdminReceipts = lazy(() => import('../pages/admin/Receipts'));
const AdminSMS = lazy(() => import('../pages/admin/SMS'));

// ETC
const NoAccess = lazy(() => import('../pages/NoAccess'));
const MemberOnly = lazy(() => import('../pages/MemberOnly'));
const ServiceCheck = lazy(() => import('../pages/ServiceCheck'));
const ExpiredMall = lazy(() => import('../pages/ExpiredMall'));

const Router = () =>
  useRoutes([
    {
      path: '/',
      element: (
        <IntroPageRoute>
          <Layout />
        </IntroPageRoute>
      ),
      children: [
        {
          index: true,
          element: <Main />,
        },
        {
          path: 'my-page',
          element: (
            <MemberRoute>
              <MyPage />
            </MemberRoute>
          ),
        },
        {
          path: 'sign-in',
          element: (
            <NotAccessLoggedInUserRouter>
              <SignIn />
            </NotAccessLoggedInUserRouter>
          ),
        },
        {
          path: 'order/:orderSheetNo',
          element: <OrderSheet />,
        },
        {
          path: 'order/confirm',
          element: <OrderConfirm />,
        },
        {
          path: 'orders',
          element: <MyOrders />,
        },
        {
          path: 'orders/:orderNo',
          element: <OrderDetail />,
        },
        {
          path: 'claims',
          element: <MyClaims />,
        },
        {
          path: 'claim/:orderOptionNo',
          element: <Claim />,
        },
        {
          path: 'notice',
          element: <Notice />,
        },
        {
          path: 'customer-center',
          element: <CustomerCenter />,
        },
        {
          path: 'product-detail',
          element: <ProductDetail />,
        },
        {
          path: 'products',
          element: <DisplayCategoryList />,
        },
        {
          path: 'sign-up/form',
          element: (
            <NotAccessLoggedInUserRouter>
              <SignUp />
            </NotAccessLoggedInUserRouter>
          ),
        },
        {
          path: 'sign-up-confirm',
          element: (
            <NotAccessLoggedInUserRouter>
              <SignUpConfirm />
            </NotAccessLoggedInUserRouter>
          ),
        },
        {
          path: 'display/:sectionsId',
          element: <ProductSectionList />,
        },
        {
          path: 'faq',
          element: <FAQ />,
        },
        {
          path: 'cart',
          element: <Cart />,
        },
        {
          path: 'sign-up',
          element: (
            <NotAccessLoggedInUserRouter>
              <SignUpMenu />
            </NotAccessLoggedInUserRouter>
          ),
        },
        {
          path: 'callback/auth-callback',
          element: <OpenIdCallback />,
        },
        {
          path: 'member-modification',
          element: (
            <MemberRoute>
              <MemberModification />
            </MemberRoute>
          ),
        },
        {
          path: 'find-id',
          element: (
            <NotAccessLoggedInUserRouter>
              <FindId />
            </NotAccessLoggedInUserRouter>
          ),
        },
        {
          path: 'find-password',
          element: (
            <NotAccessLoggedInUserRouter>
              <FindPassword />
            </NotAccessLoggedInUserRouter>
          ),
        },
        {
          path: 'change-password',
          element: <ChangePassword />,
        },
        {
          path: 'adult-certification',
          element: <AdultCertification />,
        },
        {
          path: 'member-withdrawal',
          element: <MemberWithdrawal />,
        },
        {
          path: 'member-only',
          element: <MemberOnly />,
        },
        {
          path: 'event/:eventNoOrId',
          element: <Event />,
        },
        // my-page
        {
          path: 'my-page',
          element: <MemberRoute />,
          children: [
            {
              path: 'personal-inquiry',
              element: <MyPagePersonalInquiry />,
            },
            {
              path: 'personal-inquiry/:inquiryNo',
              element: <MyPagePersonalInquiryDetail />,
            },
            {
              path: 'product-review',
              element: <MyPageProductReview />,
            },
            {
              path: 'product-inquiry',
              element: <MyPageProductInquiry />,
            },
            {
              path: 'coupon',
              element: <MyPageCoupon />,
            },
            {
              path: 'accumulation',
              element: <MyPageAccumulation />,
            },
            {
              path: 'like',
              element: <MyPageLike />,
            },
            {
              path: 'shipping-address',
              element: <MyPageShippingAddress />,
            },
          ],
        },
        // myapp
        {
          path: 'pages/order/guest-order.html',
          element: <GuestOrder />,
        },
        // SPEC-SKIN-004: 고객센터
        {
          path: 'bulk-inquiry',
          element: <BulkInquiry />,
        },
        {
          path: 'business-consultation',
          element: <BusinessConsultation />,
        },
        {
          path: 'design-consultation',
          element: <DesignConsultation />,
        },
        // SPEC-SKIN-004: 정보
        {
          path: 'terms',
          element: <Terms />,
        },
        {
          path: 'about',
          element: <AboutUs />,
        },
        {
          path: 'directions',
          element: <Directions />,
        },
        // SPEC-SKIN-004: 가이드
        {
          path: 'guide/work',
          element: <WorkGuide />,
        },
        {
          path: 'guide/work/:guideId',
          element: <GuideDetail />,
        },
        // SPEC-SKIN-004: 마케팅 랜딩
        {
          path: 'landing/paper',
          element: <PaperLanding />,
        },
        {
          path: 'landing/binding',
          element: <BindingLanding />,
        },
        {
          path: 'landing/calendar',
          element: <CalendarLanding />,
        },
        {
          path: 'landing/pouch',
          element: <PouchLanding />,
        },
        {
          path: 'landing/sticker',
          element: <StickerLanding />,
        },
        // SPEC-SKIN-004: 이용후기/체험단
        {
          path: 'reviews',
          element: <Reviews />,
        },
        {
          path: 'experience-group',
          element: <ExperienceGroup />,
        },
      ],
    },
    // SPEC-SKIN-005: 관리자 로그인 (레이아웃 없음)
    {
      path: 'admin/login',
      element: <AdminLogin />,
    },
    // SPEC-SKIN-005: 관리자 페이지 (AdminLayout 적용)
    {
      path: 'admin',
      element: <AdminLayout />,
      children: [
        {
          path: 'dashboard',
          element: <AdminDashboard />,
        },
        {
          path: 'members',
          element: <AdminMembers />,
        },
        // SPEC-SKIN-005: 주문관리
        {
          path: 'orders',
          element: <AdminOrders />,
        },
        {
          path: 'file-check',
          element: <AdminFileCheck />,
        },
        {
          path: 'status-change',
          element: <AdminStatusChange />,
        },
        {
          path: 'print-orders',
          element: <AdminPrintOrders />,
        },
        {
          path: 'deferred-payment',
          element: <AdminDeferredPayment />,
        },
        {
          path: 'receipts',
          element: <AdminReceipts />,
        },
        {
          path: 'sms',
          element: <AdminSMS />,
        },
      ],
    },
    {
      path: 'design-popup',
      element: <DesignWindowPopup />,
    },
    {
      path: 'order-specification/:orderNo',
      element: <OrderSpecification />,
    },
    {
      path: 'simple-receipt/:orderNo',
      element: <SimpleReceipt />,
    },
    {
      path: 'no-access',
      element: <NoAccess />,
    },
    {
      path: 'callback',
      element: <CallBack />,
    },
    {
      path: 'service-check',
      element: <ServiceCheck />,
    },
    {
      path: 'expired-mall',
      element: <ExpiredMall />,
    },
    {
      path: 'not-found',
      element: <NotFound />,
    },
    {
      path: '*',
      element: <NotFoundRoute />,
    },
  ]);

export default Router;
