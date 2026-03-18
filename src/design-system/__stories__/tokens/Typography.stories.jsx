import React from 'react';

// @MX:NOTE: [AUTO] SPEC-DS-009 토큰 표준화 마이그레이션 - --huni-typo-* 신규 표준 네이밍 반영

export default {
  title: 'Tokens/Typography',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

// 신규 표준 폰트 사이즈 스케일 (--huni-typo-size-*)
const fontSizeScale = [
  { name: 't1', variable: '--huni-typo-size-t1', legacyVariable: '--huni-text-t1', value: '11px', description: 'text-xs' },
  { name: 't2', variable: '--huni-typo-size-t2', legacyVariable: '--huni-text-t2', value: '12px', description: 'text-sm' },
  { name: 't3', variable: '--huni-typo-size-t3', legacyVariable: '--huni-text-t3', value: '13px', description: 'text-base (기본)' },
  { name: 't4', variable: '--huni-typo-size-t4', legacyVariable: '--huni-text-t4', value: '14px', description: 'text-md' },
  { name: 't5', variable: '--huni-typo-size-t5', legacyVariable: '--huni-text-t5', value: '16px', description: 'text-lg' },
  { name: 't6', variable: '--huni-typo-size-t6', legacyVariable: '--huni-text-t6', value: '18px', description: 'text-xl' },
  { name: 't7', variable: '--huni-typo-size-t7', legacyVariable: '--huni-text-t7', value: '20px', description: 'text-2xl' },
  { name: 't8', variable: '--huni-typo-size-t8', legacyVariable: '--huni-text-t8', value: '22px', description: '' },
  { name: 't9', variable: '--huni-typo-size-t9', legacyVariable: '--huni-text-t9', value: '24px', description: '' },
  { name: 't10', variable: '--huni-typo-size-t10', legacyVariable: '--huni-text-t10', value: '26px', description: '' },
];

// 신규 표준 폰트 굵기 (--huni-typo-weight-*)
const fontWeights = [
  { name: 'normal', variable: '--huni-typo-weight-normal', legacyVariable: '--huni-font-weight-normal', value: '400', cssValue: 'normal' },
  { name: 'medium', variable: '--huni-typo-weight-medium', legacyVariable: '--huni-font-weight-medium', value: '500', cssValue: 'medium' },
  { name: 'bold', variable: '--huni-typo-weight-bold', legacyVariable: '--huni-font-weight-bold', value: '700', cssValue: 'bold' },
];

// 신규 표준 라인 높이 (--huni-typo-leading-*)
const lineHeights = [
  { name: 'tight', variable: '--huni-typo-leading-tight', legacyVariable: '--huni-leading-tight', value: '1.2' },
  { name: 'normal', variable: '--huni-typo-leading-normal', legacyVariable: '--huni-leading-normal', value: '1.5' },
  { name: 'relaxed', variable: '--huni-typo-leading-relaxed', legacyVariable: '--huni-leading-relaxed', value: '1.75' },
];

export const FontSizeScale = {
  name: '폰트 크기 스케일',
  render: () => (
    <div style={{ fontFamily: 'var(--huni-typo-family)' }}>
      <p style={{ fontSize: '12px', color: '#5538B6', marginBottom: '16px', padding: '8px 12px', background: '#F3F0FA', borderRadius: '6px', borderLeft: '3px solid #5538B6' }}>
        SPEC-DS-009 신규 표준: <code>--huni-typo-size-*</code> 네이밍을 사용하세요.
        기존 <code>--huni-text-t*</code>는 deprecated alias로 유지됩니다.
      </p>
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#424242', marginBottom: '16px', borderBottom: '1px solid #E9E9E9', paddingBottom: '8px' }}>
        Font Size Scale (t1 ~ t10)
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F6F6F6' }}>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#979797', border: '1px solid #E9E9E9' }}>신규 표준 토큰</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#979797', border: '1px solid #E9E9E9' }}>값</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#979797', border: '1px solid #E9E9E9' }}>미리보기</th>
          </tr>
        </thead>
        <tbody>
          {fontSizeScale.map((item) => (
            <tr key={item.name} style={{ borderBottom: '1px solid #E9E9E9' }}>
              <td style={{ padding: '8px 12px', border: '1px solid #E9E9E9' }}>
                <code style={{ fontSize: '11px', background: '#F6F6F6', padding: '2px 6px', borderRadius: '3px', color: '#5538B6' }}>
                  {`var(${item.variable})`}
                </code>
              </td>
              <td style={{ padding: '8px 12px', fontSize: '12px', color: '#565656', border: '1px solid #E9E9E9' }}>
                {item.value} {item.description && <span style={{ color: '#979797' }}>({item.description})</span>}
              </td>
              <td style={{ padding: '8px 12px', border: '1px solid #E9E9E9' }}>
                <span style={{ fontSize: `var(${item.variable})`, color: '#424242' }}>
                  Aa 가나다 123
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const FontWeights = {
  name: '폰트 굵기',
  render: () => (
    <div style={{ fontFamily: 'var(--huni-typo-family)' }}>
      <p style={{ fontSize: '12px', color: '#5538B6', marginBottom: '16px', padding: '8px 12px', background: '#F3F0FA', borderRadius: '6px', borderLeft: '3px solid #5538B6' }}>
        SPEC-DS-009 신규 표준: <code>--huni-typo-weight-*</code> 네이밍을 사용하세요.
        기존 <code>--huni-font-weight-*</code>는 deprecated alias로 유지됩니다.
      </p>
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#424242', marginBottom: '16px', borderBottom: '1px solid #E9E9E9', paddingBottom: '8px' }}>
        Font Weights (--huni-typo-weight-*)
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {fontWeights.map((item) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '12px', border: '1px solid #E9E9E9', borderRadius: '6px' }}>
            <div style={{ minWidth: '240px' }}>
              <code style={{ fontSize: '11px', background: '#F6F6F6', padding: '2px 6px', borderRadius: '3px', color: '#5538B6' }}>
                {`var(${item.variable})`}
              </code>
              <div style={{ fontSize: '11px', color: '#979797', marginTop: '4px' }}>값: {item.value}</div>
            </div>
            <span style={{ fontSize: '18px', fontWeight: `var(${item.variable})`, color: '#424242' }}>
              {item.name}: 인쇄 옵션 디자인 시스템
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const LineHeights = {
  name: '라인 높이',
  render: () => (
    <div style={{ fontFamily: 'var(--huni-typo-family)' }}>
      <p style={{ fontSize: '12px', color: '#5538B6', marginBottom: '16px', padding: '8px 12px', background: '#F3F0FA', borderRadius: '6px', borderLeft: '3px solid #5538B6' }}>
        SPEC-DS-009 신규 표준: <code>--huni-typo-leading-*</code> 네이밍을 사용하세요.
        기존 <code>--huni-leading-*</code>는 deprecated alias로 유지됩니다.
      </p>
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#424242', marginBottom: '16px', borderBottom: '1px solid #E9E9E9', paddingBottom: '8px' }}>
        Line Heights (--huni-typo-leading-*)
      </h3>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {lineHeights.map((item) => (
          <div key={item.name} style={{ padding: '16px', border: '1px solid #E9E9E9', borderRadius: '6px', maxWidth: '240px' }}>
            <code style={{ fontSize: '11px', background: '#F6F6F6', padding: '2px 6px', borderRadius: '3px', color: '#5538B6', display: 'block', marginBottom: '8px' }}>
              {`var(${item.variable})`}
            </code>
            <div style={{ fontSize: '11px', color: '#979797', marginBottom: '12px' }}>값: {item.value}</div>
            <p style={{
              fontSize: '13px',
              lineHeight: `var(${item.variable})`,
              color: '#424242',
              margin: 0,
              background: '#F9FAFB',
              padding: '8px',
              borderRadius: '4px',
            }}>
              인쇄 옵션 디자인 시스템에서 사용하는 {item.name} 라인 높이 예시 텍스트입니다. 여러 줄이 표시됩니다.
            </p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const FontFamily = {
  name: '폰트 패밀리',
  render: () => (
    <div>
      <p style={{ fontSize: '12px', color: '#5538B6', marginBottom: '16px', padding: '8px 12px', background: '#F3F0FA', borderRadius: '6px', borderLeft: '3px solid #5538B6' }}>
        SPEC-DS-009 신규 표준: <code>--huni-typo-family</code> 네이밍을 사용하세요.
        기존 <code>--huni-font-family</code>는 deprecated alias로 유지됩니다.
      </p>
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#424242', marginBottom: '16px', borderBottom: '1px solid #E9E9E9', paddingBottom: '8px' }}>
        Font Family (--huni-typo-family)
      </h3>
      <div style={{ padding: '16px', border: '1px solid #E9E9E9', borderRadius: '6px' }}>
        <code style={{ fontSize: '11px', background: '#F6F6F6', padding: '2px 6px', borderRadius: '3px', color: '#5538B6', display: 'block', marginBottom: '12px' }}>
          var(--huni-typo-family)
        </code>
        <div style={{ fontSize: '11px', color: '#979797', marginBottom: '16px' }}>
          값: 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif
        </div>
        <div style={{ fontFamily: 'var(--huni-typo-family)' }}>
          <p style={{ fontSize: '22px', marginBottom: '8px', color: '#424242' }}>가나다라마바사아자차카타파하</p>
          <p style={{ fontSize: '18px', marginBottom: '8px', color: '#424242' }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
          <p style={{ fontSize: '18px', marginBottom: '8px', color: '#424242' }}>abcdefghijklmnopqrstuvwxyz</p>
          <p style={{ fontSize: '18px', marginBottom: '0', color: '#424242' }}>0123456789 !@#$%^&*()</p>
        </div>
      </div>
    </div>
  ),
};
