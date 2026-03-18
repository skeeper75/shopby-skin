import '@testing-library/jest-dom/vitest';

// react-i18next 모킹
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'ko' },
  }),
}));

// react-device-detect 모킹
vi.mock('react-device-detect', () => ({
  isMobile: false,
}));

// ShopbyExternalScript 글로벌 모킹
global.ShopbyExternalScript = {
  setGlobalObjectSb: vi.fn(),
};
