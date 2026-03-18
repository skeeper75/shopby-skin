import '@testing-library/jest-dom/vitest';

// react-i18next 모킹
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'ko' },
  }),
}));

// react-device-detect 모킹 (마이그레이션 중 잔여 의존성 대응)
// TODO: react-device-detect 완전 제거 후 이 모킹도 삭제 가능
vi.mock('react-device-detect', () => ({
  isMobile: false,
  isIOS: false,
}));

// ShopbyExternalScript 글로벌 모킹
global.ShopbyExternalScript = {
  setGlobalObjectSb: vi.fn(),
};
