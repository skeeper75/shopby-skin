import React from 'react';

// @MX:NOTE: [AUTO] SPEC-DS-009 토큰 표준화 마이그레이션 - --huni-radius-* 표준 네이밍 확인

export default {
  title: 'Tokens/Radius',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

// 표준 모서리 반경 토큰 (--huni-radius-*) - SPEC-DS-009 표준 준수
const radiusTokens = [
  { name: 'radius-0', variable: '--huni-radius-0', value: '0px', description: '모서리 없음' },
  { name: 'radius-0_5', variable: '--huni-radius-0_5', value: '2px', description: '매우 작은 둥글기' },
  { name: 'radius-1', variable: '--huni-radius-1', value: '4px', description: '작은 둥글기 (뱃지 등)' },
  { name: 'radius-1_5', variable: '--huni-radius-1_5', value: '6px', description: '중간-소 둥글기' },
  { name: 'radius-2', variable: '--huni-radius-2', value: '8px', description: '중간 둥글기 (버튼 등)' },
  { name: 'radius-3', variable: '--huni-radius-3', value: '12px', description: '큰 둥글기' },
  { name: 'radius-4', variable: '--huni-radius-4', value: '16px', description: '더 큰 둥글기' },
  { name: 'radius-full', variable: '--huni-radius-full', value: '9999px', description: '완전 원형 (칩 등)' },
];

export const RadiusScale = {
  name: '모서리 반경 스케일',
  render: () => (
    <div style={{ fontFamily: 'var(--huni-typo-family)' }}>
      <p style={{ fontSize: '12px', color: '#5538B6', marginBottom: '16px', padding: '8px 12px', background: '#F3F0FA', borderRadius: '6px', borderLeft: '3px solid #5538B6' }}>
        SPEC-DS-009 표준 준수: <code>--huni-radius-*</code> 네이밍 (카테고리: <strong>radius</strong>)
      </p>
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#424242', marginBottom: '8px' }}>
        Border Radius Scale (--huni-radius-*)
      </h3>
      <p style={{ fontSize: '12px', color: '#979797', marginBottom: '24px' }}>
        컴포넌트 모서리 둥글기 토큰.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {radiusTokens.map((token) => (
          <div key={token.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                background: 'var(--huni-bg-brand-solid)',
                borderRadius: `var(${token.variable})`,
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#424242' }}>{token.name}</div>
              <div style={{ fontSize: '10px', color: '#979797' }}>{token.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const RadiusTable = {
  name: '모서리 반경 테이블',
  render: () => (
    <div style={{ fontFamily: 'var(--huni-typo-family)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F6F6F6' }}>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#979797', border: '1px solid #E9E9E9' }}>토큰</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#979797', border: '1px solid #E9E9E9' }}>값</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#979797', border: '1px solid #E9E9E9' }}>설명</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#979797', border: '1px solid #E9E9E9' }}>미리보기</th>
          </tr>
        </thead>
        <tbody>
          {radiusTokens.map((token) => (
            <tr key={token.name} style={{ borderBottom: '1px solid #E9E9E9' }}>
              <td style={{ padding: '8px 12px', border: '1px solid #E9E9E9' }}>
                <code style={{ fontSize: '11px', background: '#F6F6F6', padding: '2px 6px', borderRadius: '3px', color: '#5538B6' }}>
                  {`var(${token.variable})`}
                </code>
              </td>
              <td style={{ padding: '8px 12px', fontSize: '12px', color: '#565656', border: '1px solid #E9E9E9' }}>
                {token.value}
              </td>
              <td style={{ padding: '8px 12px', fontSize: '12px', color: '#979797', border: '1px solid #E9E9E9' }}>
                {token.description}
              </td>
              <td style={{ padding: '8px 12px', border: '1px solid #E9E9E9' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--huni-bg-brand-solid)',
                    borderRadius: `var(${token.variable})`,
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const RadiusInComponents = {
  name: '컴포넌트 적용 예시',
  render: () => (
    <div style={{ fontFamily: 'var(--huni-typo-family)' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#424242', marginBottom: '16px' }}>
        컴포넌트별 Radius 적용 예시 (--huni-radius-*)
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#979797', minWidth: '120px' }}>뱃지 (radius-1, 4px)</span>
          <span style={{
            background: '#5538B6',
            color: 'white',
            fontSize: '9px',
            fontWeight: 'bold',
            padding: '2px 6px',
            borderRadius: 'var(--huni-radius-1)',
          }}>
            추천
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#979797', minWidth: '120px' }}>버튼 (radius-1_5, 6px)</span>
          <button style={{
            background: '#5538B6',
            color: 'white',
            fontSize: '13px',
            fontWeight: 'bold',
            padding: '8px 20px',
            borderRadius: 'var(--huni-radius-1_5)',
            border: 'none',
            cursor: 'pointer',
          }}>
            장바구니 담기
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#979797', minWidth: '120px' }}>카드 (radius-2, 8px)</span>
          <div style={{
            background: 'white',
            border: '1px solid #DCDEE3',
            borderRadius: 'var(--huni-radius-2)',
            padding: '12px 16px',
            fontSize: '12px',
            color: '#424242',
          }}>
            카드 컴포넌트
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#979797', minWidth: '120px' }}>칩 (radius-full, 9999px)</span>
          <span style={{
            background: '#F3F0FA',
            color: '#5538B6',
            fontSize: '12px',
            padding: '4px 12px',
            borderRadius: 'var(--huni-radius-full)',
            border: '1px solid #C9C2DF',
          }}>
            옵션 칩
          </span>
        </div>
      </div>
    </div>
  ),
};
