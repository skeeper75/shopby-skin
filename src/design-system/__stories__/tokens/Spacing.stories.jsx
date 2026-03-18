import React from 'react';

// @MX:NOTE: [AUTO] SPEC-DS-009 토큰 표준화 마이그레이션 - --huni-space-* 표준 네이밍 확인

export default {
  title: 'Tokens/Spacing',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

// 표준 간격 토큰 (--huni-space-*) - SPEC-DS-009 표준 준수
const spacingTokens = [
  { name: 'space-0_5', variable: '--huni-space-0_5', value: '2px' },
  { name: 'space-1', variable: '--huni-space-1', value: '4px' },
  { name: 'space-1_5', variable: '--huni-space-1_5', value: '6px' },
  { name: 'space-2', variable: '--huni-space-2', value: '8px' },
  { name: 'space-2_5', variable: '--huni-space-2_5', value: '10px' },
  { name: 'space-3', variable: '--huni-space-3', value: '12px' },
  { name: 'space-3_5', variable: '--huni-space-3_5', value: '14px' },
  { name: 'space-4', variable: '--huni-space-4', value: '16px' },
  { name: 'space-4_5', variable: '--huni-space-4_5', value: '18px' },
  { name: 'space-5', variable: '--huni-space-5', value: '20px' },
  { name: 'space-6', variable: '--huni-space-6', value: '24px' },
  { name: 'space-7', variable: '--huni-space-7', value: '28px' },
  { name: 'space-8', variable: '--huni-space-8', value: '32px' },
  { name: 'space-9', variable: '--huni-space-9', value: '36px' },
  { name: 'space-10', variable: '--huni-space-10', value: '40px' },
  { name: 'space-12', variable: '--huni-space-12', value: '48px' },
  { name: 'space-16', variable: '--huni-space-16', value: '64px' },
];

export const SpacingScale = {
  name: '간격 스케일',
  render: () => (
    <div style={{ fontFamily: 'var(--huni-typo-family)' }}>
      <p style={{ fontSize: '12px', color: '#5538B6', marginBottom: '16px', padding: '8px 12px', background: '#F3F0FA', borderRadius: '6px', borderLeft: '3px solid #5538B6' }}>
        SPEC-DS-009 표준 준수: <code>--huni-space-*</code> 네이밍 (카테고리: <strong>space</strong>)
      </p>
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#424242', marginBottom: '8px' }}>
        Spacing Scale (4px 기반)
      </h3>
      <p style={{ fontSize: '12px', color: '#979797', marginBottom: '24px' }}>
        모든 간격은 4px 기준으로 정의됩니다.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {spacingTokens.map((token) => (
          <div key={token.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ minWidth: '220px' }}>
              <code style={{ fontSize: '11px', background: '#F6F6F6', padding: '2px 6px', borderRadius: '3px', color: '#5538B6' }}>
                {`var(${token.variable})`}
              </code>
            </div>
            <span style={{ fontSize: '11px', color: '#979797', minWidth: '40px' }}>{token.value}</span>
            <div
              style={{
                height: '16px',
                width: `var(${token.variable})`,
                background: 'var(--huni-bg-brand-solid)',
                borderRadius: '2px',
                minWidth: '2px',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const SpacingTable = {
  name: '간격 테이블',
  render: () => (
    <div style={{ fontFamily: 'var(--huni-typo-family)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F6F6F6' }}>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#979797', border: '1px solid #E9E9E9' }}>토큰 이름</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#979797', border: '1px solid #E9E9E9' }}>CSS 변수</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#979797', border: '1px solid #E9E9E9' }}>값</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#979797', border: '1px solid #E9E9E9' }}>시각적 표현</th>
          </tr>
        </thead>
        <tbody>
          {spacingTokens.map((token) => (
            <tr key={token.name} style={{ borderBottom: '1px solid #E9E9E9' }}>
              <td style={{ padding: '6px 12px', fontSize: '12px', color: '#424242', border: '1px solid #E9E9E9', fontWeight: '500' }}>
                {token.name}
              </td>
              <td style={{ padding: '6px 12px', border: '1px solid #E9E9E9' }}>
                <code style={{ fontSize: '11px', background: '#F6F6F6', padding: '2px 6px', borderRadius: '3px', color: '#5538B6' }}>
                  {`var(${token.variable})`}
                </code>
              </td>
              <td style={{ padding: '6px 12px', fontSize: '12px', color: '#565656', border: '1px solid #E9E9E9' }}>
                {token.value}
              </td>
              <td style={{ padding: '6px 12px', border: '1px solid #E9E9E9' }}>
                <div
                  style={{
                    height: '12px',
                    width: `var(${token.variable})`,
                    background: '#5538B6',
                    borderRadius: '2px',
                    minWidth: '2px',
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

export const SpacingUsage = {
  name: '간격 사용 예시',
  render: () => (
    <div style={{ fontFamily: 'var(--huni-typo-family)' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#424242', marginBottom: '16px' }}>
        간격 사용 예시
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#979797', marginBottom: '8px' }}>
            <code style={{ background: '#F6F6F6', padding: '2px 4px', borderRadius: '3px' }}>padding: var(--huni-space-3)</code> (12px)
          </p>
          <div style={{ display: 'inline-flex', padding: 'var(--huni-space-3)', border: '2px dashed #CACACA', borderRadius: '4px' }}>
            <div style={{ background: '#5538B6', color: 'white', fontSize: '12px', padding: '4px 8px', borderRadius: '4px' }}>
              내용
            </div>
          </div>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#979797', marginBottom: '8px' }}>
            <code style={{ background: '#F6F6F6', padding: '2px 4px', borderRadius: '3px' }}>padding: var(--huni-space-5)</code> (20px)
          </p>
          <div style={{ display: 'inline-flex', padding: 'var(--huni-space-5)', border: '2px dashed #CACACA', borderRadius: '4px' }}>
            <div style={{ background: '#5538B6', color: 'white', fontSize: '12px', padding: '4px 8px', borderRadius: '4px' }}>
              내용
            </div>
          </div>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#979797', marginBottom: '8px' }}>
            <code style={{ background: '#F6F6F6', padding: '2px 4px', borderRadius: '3px' }}>gap: var(--huni-space-2)</code> (8px)
          </p>
          <div style={{ display: 'flex', gap: 'var(--huni-space-2)' }}>
            {['아이템 1', '아이템 2', '아이템 3'].map((item) => (
              <div key={item} style={{ background: '#F3F0FA', border: '1px solid #9580D9', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', color: '#5538B6' }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};
