import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@shopby/shared/styles/common';
import '@shopby/shared/styles/component';
import '@shopby/shared/styles/aurora';
import { setPolyfill, setTrackingKey, setChannelType } from '@shopby/shared';

// Tailwind CSS 기본 유틸리티 (기존 스타일보다 먼저 로드하여 덮어쓰지 않도록 함)
import './globals.css';
import './assets/style.css';

import App from './App.jsx';
import './i18n';
import { initializeShopApi } from './utils';

// Vercel 배포 환경에서 CDN 스크립트(shopby-external-script.js) 미로드 시
// ShopbyExternalScript ReferenceError 방지
if (typeof window.ShopbyExternalScript === 'undefined') {
  window.ShopbyExternalScript = null;
}

const renderApp = async () => {
  const { clientId, profile, tc } = await initializeShopApi();

  // NOTE : sns로그인 이후 패아자가 /callback/auth-callback에 도달한경우 setTrackingKey, setChannelType의 내부 로직에의해 세션스토리지를 비워버리는 현상으로 인해 제외함
  const excludePaths = ['/callback/auth-callback'];

  if (!excludePaths.includes(location.pathname)) {
    const searchParams = new URLSearchParams(location.search);
    const trackingKey = searchParams.get('trackingKey');
    const channelType = searchParams.get('channelType');

    setTrackingKey(trackingKey);
    setChannelType(channelType);
  }

  const app = document.getElementById('app');
  const root = createRoot(app);

  setPolyfill();

  root.render(
    <BrowserRouter>
      <App clientId={clientId} profile={profile} tc={tc} />
    </BrowserRouter>
  );
};

renderApp();
