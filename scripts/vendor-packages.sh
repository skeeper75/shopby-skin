#!/usr/bin/env bash
# =============================================================================
# @MX:ANCHOR vendor-packages.sh
# @MX:NOTE @shopby 내부 패키지를 .vendors/ 디렉토리에 .tgz로 벤더링하는 스크립트
# Vercel 빌드 서버는 사내 GitLab에 접근할 수 없으므로
# 로컬에서 미리 패키지를 압축하여 저장소에 커밋해야 한다.
#
# 사용법:
#   npm run vendor (또는 직접 실행: bash scripts/vendor-packages.sh)
#
# 전제 조건:
#   - node_modules/@shopby/react-components 가 설치되어 있어야 함
#   - node_modules/@shopby/shared 가 설치되어 있어야 함
#   - npm 이 PATH 에 있어야 함
# =============================================================================

set -euo pipefail

# 프로젝트 루트 디렉토리 (스크립트 위치 기준 상위)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VENDORS_DIR="$PROJECT_ROOT/.vendors"
NODE_MODULES="$PROJECT_ROOT/node_modules"

# 벤더링 대상 패키지 목록
# @MX:NOTE 패키지 버전은 package.json의 의존성 버전과 일치해야 한다
PACKAGES=(
  "@shopby/react-components"
  "@shopby/shared"
)

# 색상 출력 헬퍼
log_info()    { echo "[INFO]  $*"; }
log_success() { echo "[OK]    $*"; }
log_error()   { echo "[ERROR] $*" >&2; }

# -------------------------------------------
# 사전 조건 확인
# -------------------------------------------
check_prerequisites() {
  log_info "사전 조건 확인 중..."

  # npm 명령어 존재 확인
  if ! command -v npm &>/dev/null; then
    log_error "npm 이 PATH 에 없습니다. Node.js를 먼저 설치하세요."
    exit 1
  fi

  # .vendors 디렉토리 생성 (없을 경우)
  mkdir -p "$VENDORS_DIR"

  # 각 @shopby 패키지 설치 여부 확인
  for pkg in "${PACKAGES[@]}"; do
    local pkg_dir="$NODE_MODULES/$pkg"
    if [[ ! -d "$pkg_dir" ]]; then
      log_error "패키지 '$pkg' 가 설치되어 있지 않습니다."
      log_error "다음 명령어로 먼저 의존성을 설치하세요:"
      log_error "  npm install  (또는 yarn install)"
      log_error ""
      log_error "주의: @shopby 패키지는 사내 GitLab 네트워크 접근이 필요합니다."
      exit 1
    fi
    log_success "패키지 '$pkg' 설치 확인 완료"
  done
}

# -------------------------------------------
# 패키지를 .tgz 로 압축하고 .vendors/ 로 이동
# @MX:NOTE npm pack 은 package.json 의 "files" 또는 .npmignore 기준으로
#           파일을 선택하므로 민감한 파일은 기본적으로 제외된다.
# -------------------------------------------
pack_packages() {
  log_info ".tgz 아카이브 생성 중..."

  for pkg in "${PACKAGES[@]}"; do
    local pkg_dir="$NODE_MODULES/$pkg"

    # package.json 에서 버전 읽기
    local version
    version=$(node -e "console.log(require('$pkg_dir/package.json').version)")

    # 패키지명에서 스코프(@)와 슬래시를 제거하여 파일명 정규화
    # 예: @shopby/react-components -> shopby-react-components
    local safe_name
    safe_name=$(echo "$pkg" | sed 's|@||g; s|/|-|g')

    local expected_tgz="$VENDORS_DIR/${safe_name}-${version}.tgz"

    log_info "  '$pkg@$version' 압축 중..."

    # npm pack 은 현재 디렉토리에 .tgz 를 생성하므로
    # 임시 디렉토리에서 실행 후 이동
    local tmp_dir
    tmp_dir=$(mktemp -d)

    # npm pack 실행 (--pack-destination 으로 바로 출력 경로 지정)
    npm pack "$pkg_dir" --pack-destination "$tmp_dir" --quiet

    # 생성된 .tgz 파일 경로 탐색
    local packed_file
    packed_file=$(find "$tmp_dir" -name "*.tgz" | head -n 1)

    if [[ -z "$packed_file" ]]; then
      log_error "  '$pkg' 압축 실패: .tgz 파일이 생성되지 않았습니다."
      rm -rf "$tmp_dir"
      exit 1
    fi

    # .vendors/ 로 정규화된 이름으로 이동
    mv "$packed_file" "$expected_tgz"
    rm -rf "$tmp_dir"

    log_success "  생성 완료: .vendors/${safe_name}-${version}.tgz"
  done
}

# -------------------------------------------
# .tgz 파일 내 민감 정보 검사
# @MX:WARN 빌드 실패를 유발할 수 있는 보안 검사 단계
# @MX:REASON .npmrc 나 인증 토큰이 포함된 경우 저장소 커밋 금지
# -------------------------------------------
verify_no_sensitive_info() {
  log_info "보안 검사: .tgz 내 민감 정보 확인 중..."

  # 검사할 위험 파일 패턴 목록
  local sensitive_patterns=(
    ".npmrc"
    ".env"
    "*.pem"
    "*.key"
    "*secret*"
    "*token*"
    "*credential*"
  )

  local found_issues=0

  for tgz_file in "$VENDORS_DIR"/*.tgz; do
    [[ -f "$tgz_file" ]] || continue

    local filename
    filename=$(basename "$tgz_file")

    for pattern in "${sensitive_patterns[@]}"; do
      # tar 목록에서 패턴 검색 (대소문자 무시)
      local matches
      matches=$(tar -tzf "$tgz_file" 2>/dev/null | grep -i "$pattern" || true)

      if [[ -n "$matches" ]]; then
        log_error "  보안 경고: '$filename' 에 민감할 수 있는 파일이 포함됨:"
        log_error "    패턴 '$pattern' 매칭:"
        echo "$matches" | while read -r line; do
          log_error "      - $line"
        done
        found_issues=$((found_issues + 1))
      fi
    done

    log_success "  '$filename' 검사 완료"
  done

  if [[ $found_issues -gt 0 ]]; then
    log_error ""
    log_error "민감 정보가 포함된 파일이 발견되었습니다."
    log_error "해당 파일들을 저장소에 커밋하지 마세요."
    log_error "패키지의 .npmignore 또는 package.json 'files' 필드를 수정 후 재실행하세요."
    exit 1
  fi
}

# -------------------------------------------
# package.json 업데이트 안내 출력
# -------------------------------------------
print_next_steps() {
  log_info ""
  log_info "다음 단계:"
  log_info "  1. package.json 의 @shopby 의존성을 file: 프로토콜로 변경하세요:"

  for pkg in "${PACKAGES[@]}"; do
    local pkg_dir="$NODE_MODULES/$pkg"
    local version
    version=$(node -e "console.log(require('$pkg_dir/package.json').version)")
    local safe_name
    safe_name=$(echo "$pkg" | sed 's|@||g; s|/|-|g')

    log_info "    \"$pkg\": \"file:.vendors/${safe_name}-${version}.tgz\""
  done

  log_info ""
  log_info "  2. .vendors/ 디렉토리를 git 에 커밋하세요:"
  log_info "     git add .vendors/"
  log_info "     git commit -m '벤더링: @shopby 패키지 .tgz 아카이브 추가'"
  log_info ""
  log_info "  3. npm install 로 file: 의존성을 테스트하세요."
}

# -------------------------------------------
# 메인 실행
# -------------------------------------------
main() {
  log_info "=== @shopby 패키지 벤더링 시작 ==="
  log_info "대상 디렉토리: $VENDORS_DIR"
  log_info ""

  check_prerequisites
  pack_packages
  verify_no_sensitive_info
  print_next_steps

  log_info ""
  log_success "=== 벤더링 완료 ==="
}

main "$@"
