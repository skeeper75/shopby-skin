// @MX:NOTE: [AUTO] SPEC-DS-009 스토리 작성
import React, { useState } from 'react';
import { Tabs } from '../../components/molecules/Tabs/Tabs';

export default {
  title: 'Molecules/Tabs',
  component: Tabs.Root,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['line', 'chip'],
      description: '탭 스타일 variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md'],
      description: '탭 크기',
    },
    layout: {
      control: { type: 'select' },
      options: ['fill', 'hug'],
      description: '탭 레이아웃',
    },
    chipStyle: {
      control: { type: 'select' },
      options: ['solid', 'outline'],
      description: 'chip variant 스타일 (chip variant에서만 적용)',
    },
  },
};

export const Default = {
  name: '기본 탭 (Line)',
  render: () => (
    <Tabs.Root defaultValue="overview" variant="line">
      <Tabs.List>
        <Tabs.Trigger value="overview">주문 개요</Tabs.Trigger>
        <Tabs.Trigger value="detail">상세 정보</Tabs.Trigger>
        <Tabs.Trigger value="delivery">배송 현황</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="overview" style={{ padding: '16px 0' }}>
        <p style={{ fontSize: '14px', color: '#555' }}>주문 개요 내용이 표시됩니다.</p>
      </Tabs.Content>
      <Tabs.Content value="detail" style={{ padding: '16px 0' }}>
        <p style={{ fontSize: '14px', color: '#555' }}>상세 정보 내용이 표시됩니다.</p>
      </Tabs.Content>
      <Tabs.Content value="delivery" style={{ padding: '16px 0' }}>
        <p style={{ fontSize: '14px', color: '#555' }}>배송 현황 내용이 표시됩니다.</p>
      </Tabs.Content>
    </Tabs.Root>
  ),
};

export const ChipSolid = {
  name: 'Chip 탭 - Solid',
  render: () => (
    <Tabs.Root defaultValue="all" variant="chip" chipStyle="solid">
      <Tabs.List>
        <Tabs.Trigger value="all">전체</Tabs.Trigger>
        <Tabs.Trigger value="inprogress">진행중</Tabs.Trigger>
        <Tabs.Trigger value="completed">완료</Tabs.Trigger>
        <Tabs.Trigger value="cancelled">취소</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="all" style={{ padding: '16px 0' }}>
        <p style={{ fontSize: '14px', color: '#555' }}>전체 주문 목록</p>
      </Tabs.Content>
      <Tabs.Content value="inprogress" style={{ padding: '16px 0' }}>
        <p style={{ fontSize: '14px', color: '#555' }}>진행중인 주문 목록</p>
      </Tabs.Content>
      <Tabs.Content value="completed" style={{ padding: '16px 0' }}>
        <p style={{ fontSize: '14px', color: '#555' }}>완료된 주문 목록</p>
      </Tabs.Content>
      <Tabs.Content value="cancelled" style={{ padding: '16px 0' }}>
        <p style={{ fontSize: '14px', color: '#555' }}>취소된 주문 목록</p>
      </Tabs.Content>
    </Tabs.Root>
  ),
};

export const ChipOutline = {
  name: 'Chip 탭 - Outline',
  render: () => (
    <Tabs.Root defaultValue="monthly" variant="chip" chipStyle="outline">
      <Tabs.List>
        <Tabs.Trigger value="weekly">주간</Tabs.Trigger>
        <Tabs.Trigger value="monthly">월간</Tabs.Trigger>
        <Tabs.Trigger value="yearly">연간</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="weekly" style={{ padding: '16px 0' }}>
        <p style={{ fontSize: '14px', color: '#555' }}>주간 통계 데이터</p>
      </Tabs.Content>
      <Tabs.Content value="monthly" style={{ padding: '16px 0' }}>
        <p style={{ fontSize: '14px', color: '#555' }}>월간 통계 데이터</p>
      </Tabs.Content>
      <Tabs.Content value="yearly" style={{ padding: '16px 0' }}>
        <p style={{ fontSize: '14px', color: '#555' }}>연간 통계 데이터</p>
      </Tabs.Content>
    </Tabs.Root>
  ),
};

export const ManyTabs = {
  name: '탭 많은 경우 (가로 스크롤)',
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <Tabs.Root defaultValue="tab1" variant="line">
        <Tabs.List>
          {['전단지', '명함', '브로셔', '포스터', '봉투', '스티커', '현수막', '배너'].map((item, i) => (
            <Tabs.Trigger key={item} value={`tab${i + 1}`}>
              {item}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        {['전단지', '명함', '브로셔', '포스터', '봉투', '스티커', '현수막', '배너'].map((item, i) => (
          <Tabs.Content key={item} value={`tab${i + 1}`} style={{ padding: '16px 0' }}>
            <p style={{ fontSize: '14px', color: '#555' }}>{item} 상품 목록</p>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  ),
};

export const AllVariants = {
  name: '모든 Variant',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>Line Variant</p>
        <Tabs.Root defaultValue="tab1" variant="line">
          <Tabs.List>
            <Tabs.Trigger value="tab1">주문 관리</Tabs.Trigger>
            <Tabs.Trigger value="tab2">거래처 관리</Tabs.Trigger>
            <Tabs.Trigger value="tab3">통계</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content value="tab1" style={{ padding: '16px 0' }}>주문 관리 콘텐츠</Tabs.Content>
          <Tabs.Content value="tab2" style={{ padding: '16px 0' }}>거래처 관리 콘텐츠</Tabs.Content>
          <Tabs.Content value="tab3" style={{ padding: '16px 0' }}>통계 콘텐츠</Tabs.Content>
        </Tabs.Root>
      </div>

      <div>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>Chip Variant - Solid</p>
        <Tabs.Root defaultValue="all" variant="chip" chipStyle="solid">
          <Tabs.List>
            <Tabs.Trigger value="all">전체</Tabs.Trigger>
            <Tabs.Trigger value="active">진행중</Tabs.Trigger>
            <Tabs.Trigger value="done">완료</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="all" style={{ padding: '16px 0' }}>전체 목록</Tabs.Content>
          <Tabs.Content value="active" style={{ padding: '16px 0' }}>진행중 목록</Tabs.Content>
          <Tabs.Content value="done" style={{ padding: '16px 0' }}>완료 목록</Tabs.Content>
        </Tabs.Root>
      </div>

      <div>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>Chip Variant - Outline</p>
        <Tabs.Root defaultValue="week" variant="chip" chipStyle="outline">
          <Tabs.List>
            <Tabs.Trigger value="week">주간</Tabs.Trigger>
            <Tabs.Trigger value="month">월간</Tabs.Trigger>
            <Tabs.Trigger value="year">연간</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="week" style={{ padding: '16px 0' }}>주간 데이터</Tabs.Content>
          <Tabs.Content value="month" style={{ padding: '16px 0' }}>월간 데이터</Tabs.Content>
          <Tabs.Content value="year" style={{ padding: '16px 0' }}>연간 데이터</Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  ),
};
