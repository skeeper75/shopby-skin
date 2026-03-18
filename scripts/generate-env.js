'use strict';

// @MX:ANCHOR: Vercel 배포 시 필수 환경 파일 생성 진입점 — public/environment.json, config/.env.production 생성
// @MX:REASON: webpack.common.js 라인 8에서 config/.env.${NODE_ENV}를 필수로 읽음. 파일 없으면 빌드 크래시
// @MX:SPEC: SPEC-INFRA-001 TAG-003

const fs = require('fs');
const path = require('path');

// 프로젝트 루트 경로 (scripts/ 상위)
const ROOT_DIR = path.resolve(__dirname, '..');

// ─────────────────────────────────────────────
// 필수 환경변수 검증
// ─────────────────────────────────────────────

// @MX:NOTE: SHOPBY_CLIENT_ID, SHOPBY_PROFILE, SHOPBY_TC 는 Vercel 프로젝트 설정에서 주입되어야 함
const REQUIRED_VARS = ['SHOPBY_CLIENT_ID', 'SHOPBY_PROFILE', 'SHOPBY_TC'];

let hasError = false;

for (const varName of REQUIRED_VARS) {
  if (!process.env[varName]) {
    console.error(`[generate-env] ERROR: 필수 환경변수 ${varName} 가 설정되지 않았습니다.`);
    console.error(`[generate-env]        Vercel 프로젝트 설정 → Environment Variables 에서 ${varName} 를 추가하세요.`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

// ─────────────────────────────────────────────
// 환경변수 읽기
// ─────────────────────────────────────────────

const SHOPBY_CLIENT_ID = process.env.SHOPBY_CLIENT_ID;
const SHOPBY_PROFILE = process.env.SHOPBY_PROFILE;
// SHOPBY_TC 는 vercel.json rewrites destination 에 사용되므로 여기서는 로그만 출력
const SHOPBY_TC = process.env.SHOPBY_TC;

// 선택적 환경변수 — 기본값 설정
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';
const NAVER_PAY_BUTTON_SCRIPT = process.env.NAVER_PAY_BUTTON_SCRIPT || '';
const VERCEL_ENV = process.env.VERCEL_ENV || '';

// ─────────────────────────────────────────────
// public/environment.json 생성
// ─────────────────────────────────────────────

// @MX:NOTE: tc 는 상대경로 "/api/shopby" 고정 — Vercel Rewrites 가 실제 SHOPBY_TC URL 로 프록시
const environmentJson = {
  clientId: SHOPBY_CLIENT_ID,
  profile: SHOPBY_PROFILE,
  tc: '/api/shopby',
};

const publicDir = path.join(ROOT_DIR, 'public');
const environmentJsonPath = path.join(publicDir, 'environment.json');

fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(environmentJsonPath, JSON.stringify(environmentJson, null, 2) + '\n', 'utf8');
console.log(`[generate-env] public/environment.json 생성 완료`);
console.log(`[generate-env]   clientId: ${SHOPBY_CLIENT_ID}`);
console.log(`[generate-env]   profile:  ${SHOPBY_PROFILE}`);
console.log(`[generate-env]   tc:       /api/shopby (Vercel Rewrites → ${SHOPBY_TC})`);

// ─────────────────────────────────────────────
// config/.env.production 생성
// ─────────────────────────────────────────────

// @MX:WARN: 이 파일이 없으면 webpack.common.js 라인 8에서 dotenv.config() 가 실패해 빌드가 크래시됨
// @MX:REASON: dotenv.config({ path: resolve(__dirname, '../config/.env.production') }) 참조
const envProductionContent = [
  `# [AUTO] Vercel 배포 시 generate-env.js 가 자동 생성하는 파일`,
  `# VERCEL_ENV: ${VERCEL_ENV || '(로컬)'}`,
  `PUBLIC_PATH=${PUBLIC_PATH}`,
  `NAVER_PAY_BUTTON_SCRIPT=${NAVER_PAY_BUTTON_SCRIPT}`,
  '',
].join('\n');

const configDir = path.join(ROOT_DIR, 'config');
const envProductionPath = path.join(configDir, '.env.production');

fs.mkdirSync(configDir, { recursive: true });

fs.writeFileSync(envProductionPath, envProductionContent, 'utf8');
console.log(`[generate-env] config/.env.production 생성 완료`);
console.log(`[generate-env]   PUBLIC_PATH:              ${PUBLIC_PATH}`);
console.log(`[generate-env]   NAVER_PAY_BUTTON_SCRIPT:  ${NAVER_PAY_BUTTON_SCRIPT || '(비어있음)'}`);

console.log(`[generate-env] 모든 환경 파일 생성 완료. 빌드를 진행합니다.`);
