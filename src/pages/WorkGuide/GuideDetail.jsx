import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { cn } from '../../lib/utils';

// @MX:NOTE: [AUTO] [GUIDE_CONTENT] 가이드 상세 콘텐츠 맵 - 11개 가이드 항목의 제목/내용 정의
const GUIDE_CONTENT = {
  'monitor-color': {
    title: '모니터 색상 보정',
    sections: [
      {
        heading: '모니터 색상과 인쇄 색상의 차이',
        content:
          '모니터는 RGB(빛의 삼원색) 방식으로 색상을 표현하고, 인쇄는 CMYK(잉크의 4원색) 방식으로 색상을 표현합니다. ' +
          '이 두 방식의 색역(Color Gamut)이 다르기 때문에 모니터에서 보이는 색상과 인쇄된 색상에는 차이가 발생할 수 있습니다.',
      },
      {
        heading: '모니터 캘리브레이션 권장',
        content:
          '정확한 색상 작업을 위해서는 모니터 캘리브레이션이 필요합니다. ' +
          '하드웨어 캘리브레이터를 사용하여 모니터를 D65 색온도, 감마 2.2로 설정하는 것을 권장합니다.',
      },
      {
        heading: '작업 시 주의사항',
        content: '작업 파일은 반드시 CMYK 색상 모드로 저장하세요. RGB 모드로 저장된 파일은 인쇄 시 색상 변환 과정에서 예상치 못한 색상 변화가 발생할 수 있습니다.',
        tips: [
          'Adobe Photoshop: 이미지 > 모드 > CMYK 색상으로 변환',
          'Adobe Illustrator: 파일 > 문서 색상 모드 > CMYK 색상',
          '검정색은 반드시 C:0 M:0 Y:0 K:100으로 설정',
        ],
      },
    ],
  },
  'color-settings': {
    title: '색상 설정 방법',
    sections: [
      {
        heading: 'CMYK 색상 모드',
        content: '인쇄 파일은 반드시 CMYK 색상 모드로 작업해야 합니다. CMYK는 Cyan(청록), Magenta(자홍), Yellow(노랑), Key/Black(검정)의 4가지 잉크를 혼합하여 색상을 표현합니다.',
      },
      {
        heading: '색상 프로파일 설정',
        content: '작업 시 Japan Color 2001 Coated 또는 ISO Coated v2 300% 프로파일을 사용하는 것을 권장합니다.',
        tips: [
          'Photoshop: 편집 > 색상 설정에서 프로파일 지정',
          'Illustrator: 편집 > 색상 설정에서 프로파일 지정',
          'InDesign: 편집 > 색상 설정에서 프로파일 지정',
        ],
      },
      {
        heading: '검정 설정',
        content: '텍스트 등 순수한 검정은 K:100 단색으로 설정하고, 배경 등 넓은 면적의 검정은 리치블랙(C:40 M:30 Y:30 K:100)을 사용하면 더 진한 검정을 표현할 수 있습니다.',
      },
    ],
  },
  'cutting-line': {
    title: '재단선 설정',
    sections: [
      {
        heading: '도련(Bleed)이란?',
        content: '도련은 인쇄물을 재단할 때 흰 여백이 생기지 않도록 재단선 밖으로 배경을 연장하는 영역입니다. 일반적으로 재단선 외곽으로 3mm의 도련 영역을 설정합니다.',
      },
      {
        heading: '안전 영역',
        content: '중요한 텍스트나 이미지는 재단선으로부터 3mm 이상 안쪽에 배치하세요. 재단 시 약간의 오차가 발생할 수 있으므로 안전 영역 밖에 중요 내용이 들어가지 않도록 주의하세요.',
        tips: [
          '도련 영역: 재단선 외곽 3mm',
          '안전 영역: 재단선 내곽 3mm',
          '실제 작업 사이즈: 도련 포함 사이즈로 설정',
        ],
      },
    ],
  },
  'paper-selection': {
    title: '용지 선택 가이드',
    sections: [
      {
        heading: '아트지',
        content: '표면이 매끄럽고 인쇄 발색이 뛰어난 용지입니다. 전단지, 카탈로그, 포스터 등에 주로 사용됩니다. 80g, 100g, 150g, 200g, 250g 등 다양한 평량이 있습니다.',
      },
      {
        heading: '스노우화이트지',
        content: '아트지보다 약간 두껍고 고급스러운 느낌을 주는 용지입니다. 명함, 카드류, 팜플렛 등에 적합합니다.',
      },
      {
        heading: '모조지',
        content: '표면이 거칠고 자연스러운 느낌의 비코팅지입니다. 복사용지와 유사한 느낌으로 메모지, 노트, 서류 등에 적합합니다.',
        tips: [
          '팜플렛/전단지: 아트지 80~100g 권장',
          '명함: 스노우화이트 250~350g 권장',
          '책자 표지: 아트지 200g 이상 권장',
          '내지: 아트지 80~100g 권장',
        ],
      },
    ],
  },
  'coating-guide': {
    title: '코팅 종류 안내',
    sections: [
      {
        heading: '유광 코팅',
        content: '표면에 광택이 나는 코팅으로 선명하고 화려한 느낌을 연출합니다. 색상 발색이 좋고 내구성이 높습니다. 전단지, 포스터, 카탈로그에 많이 사용됩니다.',
      },
      {
        heading: '무광(매트) 코팅',
        content: '표면에 광택이 없는 코팅으로 고급스럽고 차분한 느낌을 연출합니다. 글씨가 선명하게 보이며 눈의 피로가 적습니다. 명함, 브로셔, 책자에 많이 사용됩니다.',
      },
      {
        heading: '소프트터치 코팅',
        content: '벨벳처럼 부드러운 촉감의 프리미엄 코팅입니다. 고급 패키지, 명함, 브랜드 홍보물 등에 사용됩니다.',
        tips: [
          '유광: 선명하고 화려한 표현에 적합',
          '무광: 고급스럽고 차분한 표현에 적합',
          '소프트터치: 최고급 질감 표현에 적합',
        ],
      },
    ],
  },
  'finishing-guide': {
    title: '후가공 안내',
    sections: [
      {
        heading: '박(Foil Stamping)',
        content: '금속성 광택 필름을 열과 압력으로 인쇄물에 전사하는 기법입니다. 금박, 은박, 홀로그램박 등 다양한 종류가 있으며 고급스러운 느낌을 연출합니다.',
      },
      {
        heading: '형압(Embossing/Debossing)',
        content: '금형으로 종이를 눌러 입체적인 효과를 주는 기법입니다. 볼록(엠보싱)과 오목(디보싱) 두 가지 방식이 있습니다.',
      },
      {
        heading: '오시(Creasing)',
        content: '종이를 접기 쉽도록 접지선에 홈을 내는 가공입니다. 두꺼운 용지의 브로셔, 패키지 등에 적용합니다.',
        tips: [
          '박 가공: 파일에서 별도 별색 레이어로 분리',
          '형압: 양각/음각 형태를 별도 레이어로 표시',
          '오시: 접지 위치를 별도 레이어로 표시',
        ],
      },
    ],
  },
  'file-format': {
    title: '파일 형식 안내',
    sections: [
      {
        heading: 'PDF (권장)',
        content: '인쇄용 파일의 표준 형식입니다. 저장 시 PDF/X-1a 또는 PDF/X-4 규격으로 저장하면 폰트, 색상 프로파일 등이 올바르게 포함됩니다.',
        tips: [
          'Acrobat 5 이상 호환',
          '폰트 임베드 필수',
          '컬러 공간: CMYK',
          '해상도: 300dpi 이상',
        ],
      },
      {
        heading: 'AI (Adobe Illustrator)',
        content: 'AI 파일 제출 시 사용된 모든 폰트를 아웃라인 처리하거나 폰트 파일을 함께 제출해야 합니다.',
      },
      {
        heading: 'PSD (Adobe Photoshop)',
        content: 'PSD 파일 제출 시 레이어를 병합하거나 TIFF 형식으로 변환하여 제출하는 것을 권장합니다.',
      },
    ],
  },
  'resolution': {
    title: '해상도 설정',
    sections: [
      {
        heading: '인쇄 권장 해상도',
        content: '고품질 인쇄를 위해서는 최소 300dpi(dots per inch) 이상의 해상도가 필요합니다. 저해상도 이미지를 사용하면 인쇄물이 흐릿하거나 픽셀이 보일 수 있습니다.',
        tips: [
          '일반 인쇄물: 300dpi',
          '대형 현수막(근거리): 150dpi',
          '대형 현수막(원거리): 72~100dpi',
          '세밀한 인쇄물: 600dpi 이상',
        ],
      },
      {
        heading: '해상도 확인 방법',
        content: 'Photoshop에서 이미지 > 이미지 크기에서 해상도를 확인할 수 있습니다. 실제 인쇄 크기에서의 해상도를 반드시 확인하세요.',
      },
      {
        heading: '주의사항',
        content: '저해상도 이미지를 억지로 고해상도로 변경(업샘플링)하면 화질이 개선되지 않습니다. 처음부터 원본 고해상도 이미지를 사용하는 것이 중요합니다.',
      },
    ],
  },
  'overprint': {
    title: '중복 인쇄(오버프린트)',
    sections: [
      {
        heading: '오버프린트란?',
        content: '오버프린트는 위에 인쇄되는 색상이 아래 색상을 가리지 않고 겹쳐서 인쇄되는 설정입니다. 잘못 설정하면 예상치 못한 색상 변화가 발생할 수 있습니다.',
      },
      {
        heading: '오버프린트 주의사항',
        content: '검정 텍스트의 경우 기본적으로 오버프린트가 적용되어 있어 배경색과 혼합됩니다. 흰색 객체에 오버프린트가 설정되면 흰색이 사라져 보이지 않을 수 있습니다.',
        tips: [
          '흰색 객체: 오버프린트 비활성화 필수',
          '검정 텍스트: K:100 단색으로 설정하면 오버프린트 자동 적용',
          'Illustrator: 속성 패널에서 오버프린트 설정 확인',
        ],
      },
    ],
  },
  'spot-color': {
    title: '별색(스팟 컬러)',
    sections: [
      {
        heading: '별색이란?',
        content: '일반 CMYK 4색 인쇄로 표현하기 어려운 특수 색상을 미리 혼합된 잉크로 인쇄하는 방식입니다. PANTONE 등의 별색 시스템이 대표적입니다.',
      },
      {
        heading: '별색을 CMYK로 변환',
        content: '별색은 인쇄 시 별도의 판이 필요하므로 추가 비용이 발생합니다. 일반 4색 인쇄에서는 별색을 CMYK 동등값으로 변환하여 사용합니다.',
        tips: [
          'Illustrator: 편집 > 색상 편집 > 특별 색상 변환',
          'InDesign: 스와치 패널에서 별색 선택 후 변환',
          '변환 후 색상 차이를 반드시 교정지로 확인',
        ],
      },
    ],
  },
  'folding': {
    title: '접지 방식 안내',
    sections: [
      {
        heading: '2단 접지(반접기)',
        content: '종이를 반으로 접는 방식입니다. A4 크기를 반으로 접으면 A5 크기가 됩니다. 소책자, 메뉴판 등에 많이 사용됩니다.',
      },
      {
        heading: '3단 접지(병풍접기/Z접기)',
        content: '종이를 3등분으로 접는 방식입니다. 팜플렛, 리플렛 등에 가장 많이 사용되는 방식입니다.',
        tips: [
          '안으로 들어가는 면은 약 2~3mm 작게 설계',
          '접지선 위치를 별도 레이어로 표시',
          '접지 방향에 따라 면의 순서 확인',
        ],
      },
      {
        heading: '4단 접지(십자접기)',
        content: '종이를 4등분으로 접는 방식입니다. 지도, 대형 리플렛 등에 사용됩니다.',
      },
    ],
  },
};

// 작업 가이드 상세 페이지
const GuideDetail = () => {
  const { guideId } = useParams();
  const guide = GUIDE_CONTENT[guideId];

  // 가이드 목록으로 돌아가는 breadcrumb
  if (!guide) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-12 text-center">
        <p className="text-[#888]">가이드를 찾을 수 없습니다.</p>
        <Link to="/guide/work" className="text-[#5538B6] hover:underline mt-4 inline-block">
          가이드 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-4 py-12">
      {/* 브레드크럼 */}
      <nav className="flex items-center gap-2 text-[13px] text-[#888] mb-6" aria-label="브레드크럼">
        <Link to="/" className="hover:text-[#5538B6]">홈</Link>
        <span>/</span>
        <Link to="/guide/work" className="hover:text-[#5538B6]">작업 가이드</Link>
        <span>/</span>
        <span className="text-[#424242]">{guide.title}</span>
      </nav>

      {/* 페이지 제목 */}
      <h1 className="text-[28px] font-[700] text-[#424242] mb-8 pb-4 border-b border-[#CACACA]">
        {guide.title}
      </h1>

      {/* 가이드 섹션 목록 */}
      <div className="space-y-8">
        {guide.sections.map((section, idx) => (
          <GuideSection key={idx} section={section} />
        ))}
      </div>

      {/* 가이드 목록으로 이동 */}
      <div className="mt-12 pt-6 border-t border-[#CACACA]">
        <Link
          to="/guide/work"
          className="inline-flex items-center gap-2 text-[14px] text-[#5538B6] hover:underline"
        >
          ← 작업 가이드 목록으로
        </Link>
      </div>
    </div>
  );
};

// 가이드 섹션 단위 컴포넌트
const GuideSection = ({ section }) => (
  <div className="bg-white border border-[#CACACA] rounded-[8px] p-6">
    <h2 className="text-[18px] font-[700] text-[#424242] mb-3">{section.heading}</h2>
    <p className="text-[14px] text-[#424242] leading-relaxed">{section.content}</p>

    {/* 팁/주의사항 목록 */}
    {section.tips && (
      <ul className="mt-4 space-y-2 bg-[#F6F6F6] rounded-[6px] p-4">
        {section.tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px] text-[#424242]">
            <span className="text-[#5538B6] mt-0.5 shrink-0">•</span>
            {tip}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default GuideDetail;
