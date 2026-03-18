// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useState } from 'react';
import Pagination from '../../components/molecules/Pagination';

export default {
  title: 'Molecules/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['numbered', 'loadMore'],
      description: '페이지네이션 모드',
    },
    currentPage: {
      control: { type: 'number', min: 1 },
      description: '현재 페이지 번호',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: '전체 페이지 수',
    },
    siblingCount: {
      control: { type: 'number', min: 0, max: 3 },
      description: '현재 페이지 양쪽에 표시할 페이지 수',
    },
    onPageChange: { action: 'pageChanged' },
  },
};

export const Default = {
  name: '기본 페이지네이션',
  args: {
    variant: 'numbered',
    currentPage: 1,
    totalPages: 10,
    siblingCount: 1,
  },
};

export const Interactive = {
  name: '인터랙티브 - 번호형',
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <Pagination
          variant="numbered"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <p style={{ fontSize: '13px', color: '#666' }}>
          {currentPage} / {totalPages} 페이지
        </p>
      </div>
    );
  },
};

export const LoadMore = {
  name: '더 보기 버튼형',
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Array.from({ length: currentPage * 5 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#555'
              }}
            >
              주문 #{String(i + 1).padStart(4, '0')} - 전단지 인쇄
            </div>
          ))}
        </div>
        <Pagination
          variant="loadMore"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <p style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
          {currentPage >= totalPages ? '모든 주문을 불러왔습니다' : `${currentPage * 5}개 / 총 ${totalPages * 5}개`}
        </p>
      </div>
    );
  },
};

export const ManyPages = {
  name: '많은 페이지 (말줄임 표시)',
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <Pagination
          variant="numbered"
          currentPage={currentPage}
          totalPages={50}
          siblingCount={1}
          onPageChange={setCurrentPage}
        />
        <p style={{ fontSize: '13px', color: '#666' }}>현재 페이지: {currentPage}</p>
      </div>
    );
  },
};

export const FirstPage = {
  name: '첫 페이지 (이전 버튼 비활성화)',
  args: {
    currentPage: 1,
    totalPages: 10,
  },
};

export const LastPage = {
  name: '마지막 페이지 (다음 버튼 비활성화)',
  args: {
    currentPage: 10,
    totalPages: 10,
  },
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => {
    const [page1, setPage1] = useState(3);
    const [page2, setPage2] = useState(1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>번호형 (numbered) - 현재 페이지: {page1}</p>
          <Pagination
            variant="numbered"
            currentPage={page1}
            totalPages={15}
            siblingCount={1}
            onPageChange={setPage1}
          />
        </div>

        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>더 보기형 (loadMore) - 페이지: {page2}/5</p>
          <div style={{ maxWidth: '360px' }}>
            <Pagination
              variant="loadMore"
              currentPage={page2}
              totalPages={5}
              onPageChange={setPage2}
            />
          </div>
        </div>

        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>번호형 - 첫 페이지 (이전 비활성)</p>
          <Pagination variant="numbered" currentPage={1} totalPages={10} onPageChange={() => {}} />
        </div>

        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>번호형 - 마지막 페이지 (다음 비활성)</p>
          <Pagination variant="numbered" currentPage={10} totalPages={10} onPageChange={() => {}} />
        </div>

        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>더 보기형 - 마지막 페이지 (비활성)</p>
          <div style={{ maxWidth: '360px' }}>
            <Pagination variant="loadMore" currentPage={5} totalPages={5} onPageChange={() => {}} />
          </div>
        </div>
      </div>
    );
  },
};
