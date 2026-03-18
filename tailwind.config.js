/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  corePlugins: {
    // 기존 CSS reset 보존을 위해 preflight 비활성화
    preflight: false,
  },
  theme: {
    extend: {
      // 기존 CSS 변수를 Tailwind 색상으로 매핑
      colors: {
        // 기본 브랜드 색상 (CSS 변수 참조)
        whole: 'var(--whole-color)',
        background: 'var(--background-color)',
        point: {
          DEFAULT: 'var(--point-color)',
          secondary: 'var(--point-color-secondary)',
        },
        black: 'var(--black-color)',
        'dark-gray': 'var(--dark-gray-color)',
        empty: 'var(--empty-color)',
        'default-border': 'var(--default-color)',
        'blue-gray': 'var(--blue-gray-color)',
        gray: {
          DEFAULT: 'var(--gray-color)',
          font: 'var(--gray-font-color)',
        },
        'tooltip-bg': 'var(--tooltip-bg-color)',
        'default-font': 'var(--default-font-color)',

        // shadcn/ui 호환 시맨틱 색상
        border: 'var(--default-color)',
        input: 'var(--default-color)',
        ring: 'var(--point-color)',
        foreground: 'var(--default-font-color)',
        primary: {
          DEFAULT: 'var(--point-color)',
          foreground: 'var(--whole-color)',
        },
        secondary: {
          DEFAULT: 'var(--point-color-secondary)',
          foreground: 'var(--whole-color)',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: 'var(--background-color)',
          foreground: 'var(--gray-font-color)',
        },
        accent: {
          DEFAULT: 'var(--background-color)',
          foreground: 'var(--default-font-color)',
        },
        card: {
          DEFAULT: 'var(--whole-color)',
          foreground: 'var(--default-font-color)',
        },

        // === SPEC-DS-009: Huni 표준 색상 토큰 매핑 ===
        // 브랜드 색상 (--huni-color-*)
        'huni-primary': 'var(--huni-color-primary)',
        'huni-primary-dark': 'var(--huni-color-primary-dark)',
        'huni-primary-secondary': 'var(--huni-color-primary-secondary)',
        'huni-primary-light-1': 'var(--huni-color-primary-light-1)',
        'huni-primary-light-2': 'var(--huni-color-primary-light-2)',
        'huni-primary-light-3': 'var(--huni-color-primary-light-3)',

        // 텍스트 색상
        'huni-text-dark': 'var(--huni-color-text-dark)',
        'huni-text-medium': 'var(--huni-color-text-medium)',
        'huni-text-muted': 'var(--huni-color-text-muted)',

        // 테두리 및 배경
        'huni-border': 'var(--huni-color-border-default)',
        'huni-bg-light': 'var(--huni-color-bg-light)',
        'huni-bg-section': 'var(--huni-color-bg-section)',
        'huni-bg-white': 'var(--huni-color-bg-white)',

        // 액센트
        'huni-accent-gold': 'var(--huni-color-accent-gold)',
        'huni-accent-teal': 'var(--huni-color-accent-teal)',

        // Huni Primitive 팔레트
        'huni-purple': {
          50: 'var(--huni-purple-50)',
          100: 'var(--huni-purple-100)',
          200: 'var(--huni-purple-200)',
          300: 'var(--huni-purple-300)',
          400: 'var(--huni-purple-400)',
          500: 'var(--huni-purple-500)',
          600: 'var(--huni-purple-600)',
          700: 'var(--huni-purple-700)',
        },
        'huni-gray': {
          0: 'var(--huni-gray-0)',
          50: 'var(--huni-gray-50)',
          100: 'var(--huni-gray-100)',
          200: 'var(--huni-gray-200)',
          300: 'var(--huni-gray-300)',
          400: 'var(--huni-gray-400)',
          500: 'var(--huni-gray-500)',
          600: 'var(--huni-gray-600)',
          700: 'var(--huni-gray-700)',
          800: 'var(--huni-gray-800)',
          900: 'var(--huni-gray-900)',
        },

        // Huni Semantic 색상
        'huni-bg-brand': 'var(--huni-bg-brand-solid)',
        'huni-bg-brand-weak': 'var(--huni-bg-brand-weak)',
        'huni-bg-neutral': 'var(--huni-bg-neutral-weak)',
        'huni-bg-disabled': 'var(--huni-bg-disabled)',
        'huni-fg-brand': 'var(--huni-fg-brand)',
        'huni-fg-neutral': 'var(--huni-fg-neutral)',
        'huni-fg-neutral-subtle': 'var(--huni-fg-neutral-subtle)',
        'huni-fg-disabled': 'var(--huni-fg-disabled)',
      },
      fontFamily: {
        sans: [
          'Montserrat',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        // === SPEC-DS-009: Huni 타이포그래피 토큰 ===
        'huni-sans': ['var(--huni-typo-family)'],
      },
      fontSize: {
        // === SPEC-DS-009: Huni 폰트 사이즈 스케일 ===
        'huni-t1': 'var(--huni-typo-size-t1)',
        'huni-t2': 'var(--huni-typo-size-t2)',
        'huni-t3': 'var(--huni-typo-size-t3)',
        'huni-t4': 'var(--huni-typo-size-t4)',
        'huni-t5': 'var(--huni-typo-size-t5)',
        'huni-t6': 'var(--huni-typo-size-t6)',
        'huni-t7': 'var(--huni-typo-size-t7)',
        'huni-t8': 'var(--huni-typo-size-t8)',
        'huni-t9': 'var(--huni-typo-size-t9)',
        'huni-t10': 'var(--huni-typo-size-t10)',
      },
      fontWeight: {
        // === SPEC-DS-009: Huni 폰트 굵기 ===
        'huni-normal': 'var(--huni-typo-weight-normal)',
        'huni-medium': 'var(--huni-typo-weight-medium)',
        'huni-bold': 'var(--huni-typo-weight-bold)',
      },
      spacing: {
        // === SPEC-DS-009: Huni 간격 토큰 ===
        'huni-0_5': 'var(--huni-space-0_5)',
        'huni-1': 'var(--huni-space-1)',
        'huni-1_5': 'var(--huni-space-1_5)',
        'huni-2': 'var(--huni-space-2)',
        'huni-2_5': 'var(--huni-space-2_5)',
        'huni-3': 'var(--huni-space-3)',
        'huni-3_5': 'var(--huni-space-3_5)',
        'huni-4': 'var(--huni-space-4)',
        'huni-4_5': 'var(--huni-space-4_5)',
        'huni-5': 'var(--huni-space-5)',
        'huni-6': 'var(--huni-space-6)',
        'huni-7': 'var(--huni-space-7)',
        'huni-8': 'var(--huni-space-8)',
        'huni-9': 'var(--huni-space-9)',
        'huni-10': 'var(--huni-space-10)',
        'huni-12': 'var(--huni-space-12)',
        'huni-16': 'var(--huni-space-16)',
      },
      // 테두리 반경
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
        // === SPEC-DS-009: Huni 반경 토큰 ===
        'huni-0': 'var(--huni-radius-0)',
        'huni-0_5': 'var(--huni-radius-0_5)',
        'huni-1': 'var(--huni-radius-1)',
        'huni-1_5': 'var(--huni-radius-1_5)',
        'huni-2': 'var(--huni-radius-2)',
        'huni-3': 'var(--huni-radius-3)',
        'huni-4': 'var(--huni-radius-4)',
        'huni-full': 'var(--huni-radius-full)',
      },
      boxShadow: {
        // === SPEC-DS-009: Huni 그림자 토큰 ===
        'huni-sm': 'var(--huni-shadow-sm)',
        'huni-md': 'var(--huni-shadow-md)',
        'huni-lg': 'var(--huni-shadow-lg)',
        'huni-xl': 'var(--huni-shadow-xl)',
      },
      transitionDuration: {
        // === SPEC-DS-009: Huni 모션 토큰 ===
        'huni-fast': 'var(--huni-motion-duration-fast)',
        'huni-normal': 'var(--huni-motion-duration-normal)',
        'huni-slow': 'var(--huni-motion-duration-slow)',
      },
      transitionTimingFunction: {
        // === SPEC-DS-009: Huni 이징 토큰 ===
        'huni-default': 'var(--huni-motion-easing-default)',
        'huni-in': 'var(--huni-motion-easing-in)',
        'huni-out': 'var(--huni-motion-easing-out)',
      },
      // shadcn/ui 컴포넌트 애니메이션용 키프레임
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
