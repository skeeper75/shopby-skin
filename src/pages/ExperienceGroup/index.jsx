import React, { useState, useEffect } from 'react';

import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { fetchHttpRequest } from '../../utils/api';
import { cn } from '../../lib/utils';

// 체험단 상태 배지 스타일 매핑
const STATUS_MAP = {
  recruiting: { label: '체험단 모집중', className: 'bg-[#5538B6] text-white hover:bg-[#5538B6]' },
  review: { label: '후기 작성중', className: 'bg-[#FFB800] text-white hover:bg-[#FFB800]' },
  closed: { label: '모집 마감', className: 'bg-[#CACACA] text-white hover:bg-[#CACACA]' },
};

// 체험단 목록 페이지
// @MX:NOTE: [AUTO] [ExperienceGroup] 체험단 목록 - GET /custom/experience-group, POST /custom/experience-group/apply
const ExperienceGroup = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // 체험단 목록 로드
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setIsLoading(true);
        const data = await fetchHttpRequest({
          url: 'custom/experience-group',
        });
        if (data?.items) {
          setGroups(data.items);
        }
      } catch {
        // API 미연동 시 빈 목록
        setGroups([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGroups();
  }, []);

  // 신청 폼 제출
  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedGroup) return;

    try {
      setIsSubmitting(true);
      await fetchHttpRequest({
        url: 'custom/experience-group/apply',
        method: 'POST',
        requestBody: { groupId: selectedGroup.id, ...applyForm },
      });
      setSubmitResult('success');
      setApplyForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setSubmitResult('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      {/* 페이지 제목 */}
      <div className="text-center mb-10">
        <h1 className="text-[28px] font-[700] text-[#424242] mb-3">체험단</h1>
        <p className="text-[15px] text-[#888]">체험단에 참여하고 무료로 상품을 체험해 보세요.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 체험단 목록 */}
        <div className="flex-1">
          {isLoading ? (
            <GroupListSkeleton />
          ) : groups.length > 0 ? (
            <div className="space-y-4">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  isSelected={selectedGroup?.id === group.id}
                  onSelect={setSelectedGroup}
                />
              ))}
            </div>
          ) : (
            <GroupPlaceholderList onSelect={setSelectedGroup} selectedGroup={selectedGroup} />
          )}
        </div>

        {/* 신청 폼 - 선택된 체험단이 있을 때 표시 */}
        {selectedGroup && (
          <div className="lg:w-[360px] shrink-0">
            <div className="bg-white border border-[#CACACA] rounded-[8px] p-6 sticky top-4">
              <h2 className="text-[18px] font-[700] text-[#424242] mb-2">체험단 신청</h2>
              <p className="text-[13px] text-[#5538B6] font-[600] mb-4">{selectedGroup.title}</p>

              {submitResult === 'success' ? (
                <div className="text-center py-8">
                  <p className="text-[16px] text-[#424242] font-[600] mb-2">신청이 완료되었습니다!</p>
                  <p className="text-[13px] text-[#888]">선정 결과는 이메일로 안내드립니다.</p>
                  <Button
                    className="mt-4 bg-[#5538B6] hover:bg-[#4429A0]"
                    onClick={() => { setSubmitResult(null); setSelectedGroup(null); }}
                  >
                    확인
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-[600] text-[#424242] mb-1">이름 *</label>
                    <Input
                      required
                      value={applyForm.name}
                      onChange={(e) => setApplyForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-[600] text-[#424242] mb-1">이메일 *</label>
                    <Input
                      required
                      type="email"
                      value={applyForm.email}
                      onChange={(e) => setApplyForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="이메일을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-[600] text-[#424242] mb-1">연락처 *</label>
                    <Input
                      required
                      type="tel"
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="010-0000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-[600] text-[#424242] mb-1">신청 메시지</label>
                    <textarea
                      value={applyForm.message}
                      onChange={(e) => setApplyForm((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="체험단 신청 메시지를 입력하세요 (선택)"
                      className="w-full min-h-[100px] px-3 py-2 border border-[#CACACA] rounded-[6px] text-[14px] text-[#424242] resize-none focus:outline-none focus:border-[#5538B6]"
                    />
                  </div>

                  {submitResult === 'error' && (
                    <p className="text-[13px] text-red-500">신청 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[48px] bg-[#5538B6] hover:bg-[#4429A0] text-[15px] font-[600]"
                  >
                    {isSubmitting ? '신청 중...' : '체험단 신청하기'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 체험단 카드
const GroupCard = ({ group, isSelected, onSelect }) => {
  const status = STATUS_MAP[group.status] ?? STATUS_MAP.closed;
  const isRecruiting = group.status === 'recruiting';

  return (
    <div
      className={cn(
        'bg-white border rounded-[8px] p-6 transition-all duration-200',
        isSelected ? 'border-[#5538B6] border-2' : 'border-[#CACACA]',
        isRecruiting && 'cursor-pointer hover:border-[#5538B6]'
      )}
      onClick={() => isRecruiting && onSelect(group)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Badge className={cn('mb-3 text-[12px]', status.className)}>{status.label}</Badge>
          <h3 className="text-[16px] font-[700] text-[#424242] mb-2">{group.title}</h3>
          <p className="text-[13px] text-[#888] leading-relaxed">{group.description}</p>
          {group.deadline && (
            <p className="text-[12px] text-[#AAAAAA] mt-2">모집 기간: {group.deadline}</p>
          )}
        </div>
        {group.image && (
          <img src={group.image} alt={group.title} className="w-20 h-20 object-cover rounded-[6px] shrink-0" />
        )}
      </div>
      {isRecruiting && (
        <div className="mt-4 pt-4 border-t border-[#F0F0F0]">
          <Button
            size="sm"
            className="bg-[#5538B6] hover:bg-[#4429A0] text-[13px]"
            onClick={(e) => { e.stopPropagation(); onSelect(group); }}
          >
            신청하기
          </Button>
        </div>
      )}
    </div>
  );
};

// 플레이스홀더 목록 (API 미연동 시)
const GroupPlaceholderList = ({ onSelect, selectedGroup }) => {
  const placeholders = [
    { id: 1, title: '명함 100매 체험단 모집', description: '프리미엄 명함 100매를 무료로 체험하고 리뷰를 작성해 주세요.', status: 'recruiting', deadline: '2025.04.30 ~ 2025.05.15' },
    { id: 2, title: '스티커 세트 체험단', description: '다양한 소재의 스티커 세트를 체험단으로 만나보세요.', status: 'review', deadline: '2025.03.01 ~ 2025.03.15' },
    { id: 3, title: '봄맞이 달력 체험단', description: '2025년 봄 에디션 탁상 달력 체험단을 마감합니다.', status: 'closed', deadline: '2025.01.01 ~ 2025.01.15' },
  ];

  return (
    <div className="space-y-4">
      {placeholders.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          isSelected={selectedGroup?.id === group.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

// 로딩 스켈레톤
const GroupListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="bg-white border border-[#CACACA] rounded-[8px] p-6 animate-pulse">
        <div className="h-5 bg-[#F0F0F0] rounded w-24 mb-3" />
        <div className="h-5 bg-[#F0F0F0] rounded w-3/4 mb-2" />
        <div className="h-4 bg-[#F0F0F0] rounded w-full mb-1" />
        <div className="h-4 bg-[#F0F0F0] rounded w-2/3" />
      </div>
    ))}
  </div>
);

export default ExperienceGroup;
