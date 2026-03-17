import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    include: /\.[jt]sx?$/,
    loader: 'jsx',
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/__tests__/setup.js'],
    include: ['src/__tests__/**/*.test.{js,jsx}'],
    css: false,
    alias: {
      '@shopby/react-components': path.resolve(__dirname, 'src/__tests__/__mocks__/shopby-react-components.jsx'),
      '@shopby/shared$': path.resolve(__dirname, 'src/__tests__/__mocks__/shopby-shared.js'),
      '@shopby/shared/constants': path.resolve(__dirname, 'src/__tests__/__mocks__/shopby-shared-constants.js'),
      '@shopby/shared/utils': path.resolve(__dirname, 'src/__tests__/__mocks__/shopby-shared-utils.js'),
    },
    deps: {
      inline: [/@shopby/, /lodash-es/, /react-device-detect/, /clsx/, /tailwind-merge/],
    },
  },
});
