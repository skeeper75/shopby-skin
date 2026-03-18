import React from 'react';

// @MX:NOTE: [AUTO] SPEC-DS-009 토큰 표준화 마이그레이션 - --huni-color-* 신규 표준 네이밍 반영

export default {
  title: 'Tokens/Colors',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

const ColorSwatch = ({ name, variable, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '80px' }}>
    <div
      style={{
        width: '64px',
        height: '64px',
        borderRadius: '8px',
        background: `var(${variable})`,
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    />
    <span style={{ fontSize: '10px', color: '#424242', textAlign: 'center', wordBreak: 'break-all', maxWidth: '80px' }}>
      {name}
    </span>
    <span style={{ fontSize: '9px', color: '#979797', textAlign: 'center', wordBreak: 'break-all', maxWidth: '80px' }}>
      {value}
    </span>
  </div>
);

const ColorGroup = ({ title, swatches }) => (
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#424242', marginBottom: '16px', borderBottom: '1px solid #E9E9E9', paddingBottom: '8px' }}>
      {title}
    </h3>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {swatches.map((swatch) => (
        <ColorSwatch key={swatch.variable} {...swatch} />
      ))}
    </div>
  </div>
);

// 신규 표준 색상 토큰 (--huni-color-*)
export const HuniBrandColors = {
  name: 'Huni 브랜드 색상 (신규 표준)',
  render: () => (
    <div>
      <p style={{ fontSize: '12px', color: '#5538B6', marginBottom: '16px', padding: '8px 12px', background: '#F3F0FA', borderRadius: '6px', borderLeft: '3px solid #5538B6' }}>
        SPEC-DS-009 신규 표준: <code>--huni-color-*</code> 네이밍을 사용하세요.
      </p>
      <ColorGroup
        title="Brand Colors (--huni-color-primary-*)"
        swatches={[
          { name: 'color-primary', variable: '--huni-color-primary', value: '#5538B6' },
          { name: 'color-primary-dark', variable: '--huni-color-primary-dark', value: '#3B2573' },
          { name: 'color-primary-secondary', variable: '--huni-color-primary-secondary', value: '#9580D9' },
          { name: 'color-primary-light-1', variable: '--huni-color-primary-light-1', value: '#C9C2DF' },
          { name: 'color-primary-light-2', variable: '--huni-color-primary-light-2', value: '#DED7F4' },
          { name: 'color-primary-light-3', variable: '--huni-color-primary-light-3', value: '#EEEBF9' },
        ]}
      />
      <ColorGroup
        title="Text Colors (--huni-color-text-*)"
        swatches={[
          { name: 'color-text-dark', variable: '--huni-color-text-dark', value: '#424242' },
          { name: 'color-text-medium', variable: '--huni-color-text-medium', value: '#565656' },
          { name: 'color-text-muted', variable: '--huni-color-text-muted', value: '#979797' },
        ]}
      />
      <ColorGroup
        title="Background & Border (--huni-color-bg-*, --huni-color-border-*)"
        swatches={[
          { name: 'color-bg-white', variable: '--huni-color-bg-white', value: '#FFFFFF' },
          { name: 'color-bg-section', variable: '--huni-color-bg-section', value: '#F6F6F6' },
          { name: 'color-bg-light', variable: '--huni-color-bg-light', value: '#E9E9E9' },
          { name: 'color-border-default', variable: '--huni-color-border-default', value: '#CACACA' },
        ]}
      />
      <ColorGroup
        title="Accent Colors (--huni-color-accent-*)"
        swatches={[
          { name: 'color-accent-gold', variable: '--huni-color-accent-gold', value: '#E6B93F' },
          { name: 'color-accent-teal', variable: '--huni-color-accent-teal', value: '#7AC8C4' },
        ]}
      />
    </div>
  ),
};

export const HuniPurplePalette = {
  name: 'Huni Purple Palette',
  render: () => (
    <div>
      <ColorGroup
        title="Purple Scale (--huni-purple-*)"
        swatches={[
          { name: 'purple-50', variable: '--huni-purple-50', value: '#F3F0FA' },
          { name: 'purple-100', variable: '--huni-purple-100', value: '#E0D9F2' },
          { name: 'purple-200', variable: '--huni-purple-200', value: '#C9C2DF' },
          { name: 'purple-300', variable: '--huni-purple-300', value: '#9580D9' },
          { name: 'purple-400', variable: '--huni-purple-400', value: '#7A5FCC' },
          { name: 'purple-500', variable: '--huni-purple-500', value: '#5538B6' },
          { name: 'purple-600', variable: '--huni-purple-600', value: '#3B2573' },
          { name: 'purple-700', variable: '--huni-purple-700', value: '#2A1A52' },
        ]}
      />
    </div>
  ),
};

export const HuniGrayPalette = {
  name: 'Huni Gray Palette',
  render: () => (
    <div>
      <ColorGroup
        title="Gray Scale (--huni-gray-*)"
        swatches={[
          { name: 'gray-0', variable: '--huni-gray-0', value: '#FFFFFF' },
          { name: 'gray-50', variable: '--huni-gray-50', value: '#F9FAFB' },
          { name: 'gray-100', variable: '--huni-gray-100', value: '#F6F6F6' },
          { name: 'gray-200', variable: '--huni-gray-200', value: '#E9E9E9' },
          { name: 'gray-300', variable: '--huni-gray-300', value: '#DCDEE3' },
          { name: 'gray-400', variable: '--huni-gray-400', value: '#CACACA' },
          { name: 'gray-500', variable: '--huni-gray-500', value: '#B0B3BA' },
          { name: 'gray-600', variable: '--huni-gray-600', value: '#979797' },
          { name: 'gray-700', variable: '--huni-gray-700', value: '#868B94' },
          { name: 'gray-800', variable: '--huni-gray-800', value: '#565656' },
          { name: 'gray-900', variable: '--huni-gray-900', value: '#424242' },
        ]}
      />
    </div>
  ),
};

export const HuniSemanticColors = {
  name: 'Semantic Colors',
  render: () => (
    <div>
      <ColorGroup
        title="Semantic Background (--huni-bg-*)"
        swatches={[
          { name: 'bg-brand-solid', variable: '--huni-bg-brand-solid', value: 'purple-500' },
          { name: 'bg-brand-weak', variable: '--huni-bg-brand-weak', value: 'purple-50' },
          { name: 'bg-neutral-weak', variable: '--huni-bg-neutral-weak', value: 'gray-100' },
          { name: 'bg-disabled', variable: '--huni-bg-disabled', value: 'gray-200' },
          { name: 'bg-critical', variable: '--huni-bg-critical-solid', value: 'red-500' },
          { name: 'bg-positive', variable: '--huni-bg-positive-solid', value: 'green-500' },
          { name: 'bg-warning', variable: '--huni-bg-warning-solid', value: 'yellow-500' },
        ]}
      />
      <ColorGroup
        title="Semantic Foreground (--huni-fg-*)"
        swatches={[
          { name: 'fg-brand', variable: '--huni-fg-brand', value: 'purple-500' },
          { name: 'fg-neutral', variable: '--huni-fg-neutral', value: 'gray-900' },
          { name: 'fg-neutral-muted', variable: '--huni-fg-neutral-muted', value: 'gray-800' },
          { name: 'fg-neutral-subtle', variable: '--huni-fg-neutral-subtle', value: 'gray-600' },
          { name: 'fg-disabled', variable: '--huni-fg-disabled', value: 'gray-400' },
          { name: 'fg-critical', variable: '--huni-fg-critical', value: 'red-500' },
          { name: 'fg-positive', variable: '--huni-fg-positive', value: 'green-500' },
        ]}
      />
      <ColorGroup
        title="Semantic Stroke (--huni-stroke-*)"
        swatches={[
          { name: 'stroke-brand', variable: '--huni-stroke-brand', value: 'purple-500' },
          { name: 'stroke-neutral-muted', variable: '--huni-stroke-neutral-muted', value: 'gray-300' },
          { name: 'stroke-neutral-weak', variable: '--huni-stroke-neutral-weak', value: 'gray-400' },
          { name: 'stroke-disabled', variable: '--huni-stroke-disabled', value: 'gray-300' },
          { name: 'stroke-critical', variable: '--huni-stroke-critical', value: 'red-500' },
        ]}
      />
    </div>
  ),
};

export const AccentColors = {
  name: 'Accent Colors',
  render: () => (
    <div>
      <ColorGroup
        title="Accent & State Colors (--huni-*-500)"
        swatches={[
          { name: 'red-500', variable: '--huni-red-500', value: '#EF4444' },
          { name: 'green-500', variable: '--huni-green-500', value: '#22C55E' },
          { name: 'blue-500', variable: '--huni-blue-500', value: '#3B82F6' },
          { name: 'yellow-500', variable: '--huni-yellow-500', value: '#EAB308' },
          { name: 'orange-500', variable: '--huni-orange-500', value: '#F97316' },
          { name: 'gold-500', variable: '--huni-gold-500', value: '#E6B93F' },
          { name: 'teal-500', variable: '--huni-teal-500', value: '#7AC8C4' },
        ]}
      />
    </div>
  ),
};

export const AllColors = {
  name: '전체 색상 팔레트',
  render: () => (
    <div>
      <p style={{ fontSize: '12px', color: '#5538B6', marginBottom: '16px', padding: '8px 12px', background: '#F3F0FA', borderRadius: '6px', borderLeft: '3px solid #5538B6' }}>
        SPEC-DS-009: 신규 표준 토큰 <code>--huni-color-*</code>과 기존 Primitive 팔레트 <code>--huni-purple-*</code>, <code>--huni-gray-*</code>를 모두 표시합니다.
      </p>
      <ColorGroup
        title="신규 표준: Brand Colors (--huni-color-primary-*)"
        swatches={[
          { name: 'color-primary', variable: '--huni-color-primary', value: '#5538B6' },
          { name: 'color-primary-dark', variable: '--huni-color-primary-dark', value: '#3B2573' },
          { name: 'color-primary-secondary', variable: '--huni-color-primary-secondary', value: '#9580D9' },
          { name: 'color-primary-light-1', variable: '--huni-color-primary-light-1', value: '#C9C2DF' },
          { name: 'color-primary-light-2', variable: '--huni-color-primary-light-2', value: '#DED7F4' },
          { name: 'color-primary-light-3', variable: '--huni-color-primary-light-3', value: '#EEEBF9' },
        ]}
      />
      <ColorGroup
        title="Purple Scale (--huni-purple-*)"
        swatches={[
          { name: 'purple-50', variable: '--huni-purple-50', value: '#F3F0FA' },
          { name: 'purple-100', variable: '--huni-purple-100', value: '#E0D9F2' },
          { name: 'purple-200', variable: '--huni-purple-200', value: '#C9C2DF' },
          { name: 'purple-300', variable: '--huni-purple-300', value: '#9580D9' },
          { name: 'purple-400', variable: '--huni-purple-400', value: '#7A5FCC' },
          { name: 'purple-500', variable: '--huni-purple-500', value: '#5538B6' },
          { name: 'purple-600', variable: '--huni-purple-600', value: '#3B2573' },
          { name: 'purple-700', variable: '--huni-purple-700', value: '#2A1A52' },
        ]}
      />
      <ColorGroup
        title="Gray Scale (--huni-gray-*)"
        swatches={[
          { name: 'gray-0', variable: '--huni-gray-0', value: '#FFFFFF' },
          { name: 'gray-50', variable: '--huni-gray-50', value: '#F9FAFB' },
          { name: 'gray-100', variable: '--huni-gray-100', value: '#F6F6F6' },
          { name: 'gray-200', variable: '--huni-gray-200', value: '#E9E9E9' },
          { name: 'gray-300', variable: '--huni-gray-300', value: '#DCDEE3' },
          { name: 'gray-400', variable: '--huni-gray-400', value: '#CACACA' },
          { name: 'gray-500', variable: '--huni-gray-500', value: '#B0B3BA' },
          { name: 'gray-600', variable: '--huni-gray-600', value: '#979797' },
          { name: 'gray-700', variable: '--huni-gray-700', value: '#868B94' },
          { name: 'gray-800', variable: '--huni-gray-800', value: '#565656' },
          { name: 'gray-900', variable: '--huni-gray-900', value: '#424242' },
        ]}
      />
      <ColorGroup
        title="Accent Colors (--huni-*-500)"
        swatches={[
          { name: 'red-500', variable: '--huni-red-500', value: '#EF4444' },
          { name: 'green-500', variable: '--huni-green-500', value: '#22C55E' },
          { name: 'blue-500', variable: '--huni-blue-500', value: '#3B82F6' },
          { name: 'yellow-500', variable: '--huni-yellow-500', value: '#EAB308' },
          { name: 'orange-500', variable: '--huni-orange-500', value: '#F97316' },
          { name: 'gold-500', variable: '--huni-gold-500', value: '#E6B93F' },
          { name: 'teal-500', variable: '--huni-teal-500', value: '#7AC8C4' },
        ]}
      />
    </div>
  ),
};
