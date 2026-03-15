import React from 'react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { cn } from '../../lib/utils';

// 이용약관 + 개인정보처리방침 탭 전환 페이지
const Terms = () => {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-12">
      {/* 페이지 제목 */}
      <h1 className="text-[24px] font-[700] text-[#424242] mb-8 text-center">약관 및 정책</h1>

      <Tabs defaultValue="terms">
        {/* 탭 목록 */}
        <TabsList className="w-full mb-8 bg-[#F6F6F6] border border-[#CACACA] rounded-[8px] h-12 p-1">
          <TabsTrigger
            value="terms"
            className="flex-1 h-10 text-[14px] font-[600] data-[state=active]:bg-white data-[state=active]:text-[#5538B6] data-[state=active]:shadow-sm rounded-[6px]"
          >
            이용약관
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="flex-1 h-10 text-[14px] font-[600] data-[state=active]:bg-white data-[state=active]:text-[#5538B6] data-[state=active]:shadow-sm rounded-[6px]"
          >
            개인정보처리방침
          </TabsTrigger>
        </TabsList>

        {/* 이용약관 내용 */}
        <TabsContent value="terms">
          <TermsContent />
        </TabsContent>

        {/* 개인정보처리방침 내용 */}
        <TabsContent value="privacy">
          <PrivacyContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// 이용약관 본문
const TermsContent = () => (
  <div className="bg-white border border-[#CACACA] rounded-[8px] p-8">
    <PolicySection title="제1조 (목적)">
      본 약관은 주식회사 샵바이(이하 "회사")가 운영하는 인쇄 전문 쇼핑몰(이하 "쇼핑몰")에서 제공하는
      서비스(이하 "서비스")의 이용 조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
    </PolicySection>

    <PolicySection title="제2조 (용어의 정의)">
      <ol className="list-decimal list-inside space-y-2 text-[14px] text-[#424242] leading-relaxed">
        <li>"쇼핑몰"이란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 운영하는 가상의 영업장을 말합니다.</li>
        <li>"이용자"란 쇼핑몰에 접속하여 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
        <li>"회원"이란 쇼핑몰에 개인정보를 제공하여 회원 등록을 한 자로서, 쇼핑몰의 정보를 지속적으로 제공받으며 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
        <li>"비회원"이란 회원에 가입하지 않고 쇼핑몰이 제공하는 서비스를 이용하는 자를 말합니다.</li>
      </ol>
    </PolicySection>

    <PolicySection title="제3조 (약관의 효력 및 변경)">
      <p className="text-[14px] text-[#424242] leading-relaxed">
        본 약관은 쇼핑몰 서비스를 이용하고자 하는 모든 이용자에 대해 그 효력을 발생합니다.
        회사는 불합리한 이유가 있을 경우, 관련 법령의 범위 안에서 약관을 개정할 수 있으며,
        개정 시 적용일자 및 개정 사유를 명시하여 현행 약관과 함께 쇼핑몰 초기화면에 7일 이전부터 공지합니다.
      </p>
    </PolicySection>

    <PolicySection title="제4조 (서비스의 제공)">
      <p className="text-[14px] text-[#424242] leading-relaxed mb-3">
        회사는 다음과 같은 서비스를 제공합니다.
      </p>
      <ul className="list-disc list-inside space-y-1 text-[14px] text-[#424242]">
        <li>인쇄물 제작 및 판매 서비스</li>
        <li>디자인 템플릿 제공 서비스</li>
        <li>주문 제작 및 배송 서비스</li>
        <li>기타 회사가 정하는 서비스</li>
      </ul>
    </PolicySection>

    <PolicySection title="제5조 (회원 가입)" isLast>
      <p className="text-[14px] text-[#424242] leading-relaxed">
        이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
        회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
      </p>
    </PolicySection>
  </div>
);

// 개인정보처리방침 본문
const PrivacyContent = () => (
  <div className="bg-white border border-[#CACACA] rounded-[8px] p-8">
    <p className="text-[13px] text-[#888] mb-6">
      시행일자: 2024년 01월 01일 | 최종 수정일: 2025년 01월 01일
    </p>

    <PolicySection title="1. 개인정보의 처리 목적">
      <p className="text-[14px] text-[#424242] leading-relaxed">
        회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
        이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
      </p>
      <ul className="list-disc list-inside mt-3 space-y-1 text-[14px] text-[#424242]">
        <li>회원 가입 및 관리</li>
        <li>재화 또는 서비스 제공</li>
        <li>고충처리</li>
      </ul>
    </PolicySection>

    <PolicySection title="2. 개인정보의 처리 및 보유 기간">
      <p className="text-[14px] text-[#424242] leading-relaxed">
        회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
      </p>
    </PolicySection>

    <PolicySection title="3. 개인정보의 제3자 제공">
      <p className="text-[14px] text-[#424242] leading-relaxed">
        회사는 정보주체의 개인정보를 개인정보의 처리 목적에서 명시한 범위 내에서만 처리하며,
        정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
      </p>
    </PolicySection>

    <PolicySection title="4. 개인정보의 파기" isLast>
      <p className="text-[14px] text-[#424242] leading-relaxed">
        회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
      </p>
    </PolicySection>
  </div>
);

// 섹션 공통 컴포넌트
const PolicySection = ({ title, children, isLast = false }) => (
  <div className={cn('pb-6', !isLast && 'mb-6 border-b border-[#F0F0F0]')}>
    <h2 className="text-[16px] font-[700] text-[#424242] mb-3">{title}</h2>
    {children}
  </div>
);

export default Terms;
