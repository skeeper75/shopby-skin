# Figma REST API Reference — Huni Design System

Figma REST API를 통해 디자인 토큰을 재확인하거나 새 컴포넌트를 추가할 때 사용하는 가이드.

---

## 연결 정보

| 항목 | 값 |
|---|---|
| File Key | `gEJhQRtmKI66BPhOpqoW3j` |
| File Name | `huni_product_option` |
| Page | `option_New` |
| Page Node | `1647:128` |
| OVERVIEW Section | `1661:132` |
| Auth Token Env | `FIGMA_ACCESS_TOKEN` |

---

## 핵심 API 엔드포인트

### 1. 특정 노드 조회 (토큰 검증용)

```bash
# OVERVIEW 섹션 전체 조회 (depth=2)
curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/files/gEJhQRtmKI66BPhOpqoW3j/nodes?ids=1661:132&depth=2"

# 특정 컴포넌트 노드 조회
curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/files/gEJhQRtmKI66BPhOpqoW3j/nodes?ids=1661:141"
```

### 2. 색상 토큰 추출

```bash
# 색상 정보 추출 (jq 필요)
curl -s -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/files/gEJhQRtmKI66BPhOpqoW3j/nodes?ids=1661:114,1661:127,1661:141" \
  | jq '.nodes | to_entries[] | {
      id: .key,
      fills: .value.document.fills,
      strokes: .value.document.strokes,
      absoluteBoundingBox: .value.document.absoluteBoundingBox
    }'
```

### 3. 치수 검증

```bash
# 컴포넌트 치수 확인
curl -s -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/files/gEJhQRtmKI66BPhOpqoW3j/nodes?ids=1661:141" \
  | jq '.nodes."1661:141".document.absoluteBoundingBox'
# 출력: {"x": ..., "y": ..., "width": 348, "height": 50}
```

---

## 핵심 노드 맵

### OptionGroupButtonType (OptionButton)
| Node ID | 설명 | 크기 |
|---|---|---|
| `1661:114` | 기본 버튼 배경 | 155×50 |
| `1661:120` | 기본 버튼 텍스트 | — |
| `1661:127` | 선택됨 배경 | 155×50 |
| `1661:128` | 선택됨 텍스트 | — |
| `1661:126` | 섹션 라벨 "사이즈" | 172×40 |

### OptionGroupSelectBoxType (PaperDropdown)
| Node ID | 설명 | 크기 |
|---|---|---|
| `1661:141` | 드롭다운 컨테이너 | 348×50 |
| `1661:142` | 선택된 텍스트 | — |
| `1661:143` | 캐럿 ▼ | — |
| `1661:288` | 추천 badge 배경 | 32×14 |
| `1661:290` | 추천 badge 텍스트 | — |

### OptionGroupCountInputType (CounterInput)
| Node ID | 설명 | 크기 |
|---|---|---|
| `1661:209` | 중앙 영역 | 155×50 |
| `1661:211` | 좌측 minus 영역 | 34×50 |
| `1661:213` | 우측 plus 영역 | 34×50 |
| `1661:215` | 값 텍스트 "20" | — |
| `1661:199` | 섹션 라벨 "제작수량" | 172×40 |

### OptionGroupFinishTitleBar (FinishTitleBar)
| Node ID | 설명 | 크기 |
|---|---|---|
| `1661:337` | "후가공" 타이틀 | — |
| `1661:338` | divider | 466×1 |
| `1661:522` | "열기" 텍스트 | — |
| `1661:523` | "닫기" 텍스트 | — |

### OptionGroupFinishButtonType (FinishButton)
| Node ID | 설명 | 크기 |
|---|---|---|
| `1661:359` | 선택됨 배경 | 116×50 |
| `1661:361` | 기본 배경 | 116×50 |
| `1661:360` | 선택됨 텍스트 "둥근모서리" | — |
| `1661:362` | 기본 텍스트 "직각모서리" | — |
| `1661:358` | 섹션 라벨 "귀돌이" | 172×50 |

### OptionGroupFinishInputType (FinishInput)
| Node ID | 설명 | 크기 |
|---|---|---|
| `1661:428` | 섹션 라벨 "박(앞면) 크기" | — |
| `1661:430` | 가로 입력 필드 | 140×50 |
| `1661:432` | 세로 입력 필드 | 140×50 |
| `1661:434` | 가로 placeholder | — |
| `1661:438` | 세로 placeholder | — |
| `1661:426` | 도움말 텍스트 | — |

### OptionGroupFinishColorChipType (ColorChip)
| Node ID | 설명 | 크기 |
|---|---|---|
| `1661:400` | 선택됨 chip (white + stroke) | 50×50 |
| `1661:553` | 기본 chip | 50×50 |
| `1661:440` | opt_박_금유광 그룹 | — |
| `1661:482` | opt_박_동박 그룹 | — |
| `1661:402` | 섹션 라벨 "박(앞면) 칼라" | 172×40 |

### OptionGroupFinishSelectBoxType (FinishSelect)
| Node ID | 설명 | 크기 |
|---|---|---|
| `1661:505` | 드롭다운 컨테이너 | 461×50 |
| `1661:511` | 선택된 텍스트 "없음" | — |
| `1661:518` | 캐럿 ▼ | — |
| `1661:515` | 옵션 목록 | — |
| `1661:547` | 섹션 라벨 "엽서봉투" | 172×40 |

### OptionGroupUpload (OrderCTA)
| Node ID | 설명 | 크기 |
|---|---|---|
| `1661:221` | PDF 업로드 버튼 | 465×50 |
| `1661:222` | 디자인 에디터 버튼 | 465×50 |
| `1661:543` | 장바구니 버튼 | 465×50 |
| `1661:223` | PDF 텍스트 | — |
| `1661:224` | 디자인 텍스트 | — |
| `1661:544` | 장바구니 텍스트 | — |

---

## RGB → Hex 변환 공식

Figma API는 RGB를 0~1 범위로 반환:

```javascript
// Figma API 색상 → Hex 변환
function figmaColorToHex({ r, g, b }) {
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// 예시
figmaColorToHex({ r: 0.333, g: 0.220, b: 0.525 }); // → #553886
figmaColorToHex({ r: 0.792, g: 0.792, b: 0.792 }); // → #CACACA
```

---

## MCP Figma 도구 사용

프로젝트에 Figma MCP 서버가 설정되어 있음 (`.mcp.json`):

```bash
# 환경 변수 확인
echo $FIGMA_ACCESS_TOKEN
echo $FIGMA_API_KEY
```

MCP 도구로 노드 직접 조회:
```
mcp__figma__view_node(fileKey: "gEJhQRtmKI66BPhOpqoW3j", nodeId: "1661:132")
```

> **주의**: MCP에서 노드 ID는 `:` 사용 (`1661:132`), env 파일에서는 `-` 사용 (`1661-132`)

---

## 토큰 재검증 절차

Figma 디자인이 업데이트될 경우:

1. OVERVIEW 섹션 전체 조회: `depth=2`로 `1661:132` 노드 조회
2. 색상 비교: `fills[0].color` → Hex 변환 후 `tailwind-tokens.md`와 대조
3. 치수 비교: `absoluteBoundingBox.width/height` → Tailwind 클래스와 대조
4. 차이 발견 시: `tailwind-tokens.md`, `SKILL.md` Gap Analysis 업데이트
5. 코드 변경: 해당 컴포넌트 파일 수정 후 테스트

---

Version: 2.0.0 | Updated: 2026-03-05
