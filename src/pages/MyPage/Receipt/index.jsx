// @MX:NOTE: 증빙서류발급 신규 페이지 (SPEC-SKIN-002, A-3-14)
// @MX:SPEC: SPEC-SKIN-002 REQ-MIG-002-012
import { useState } from 'react';

import { Button } from '@shopby/react-components';

import useLayoutChanger from '../../../hooks/useLayoutChanger';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Chip,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Field,
  FieldLabel,
  TextField,
  Skeleton,
} from '../../../components/ui';

// 발급 상태별 Chip variant 매핑
const RECEIPT_STATUS_VARIANT = {
  AVAILABLE: 'primary',
  ISSUED: 'success',
  UNAVAILABLE: 'default',
  CREDIT_CARD: 'outline',
};

const RECEIPT_STATUS_LABEL = {
  AVAILABLE: '신청가능',
  ISSUED: '발급완료',
  UNAVAILABLE: '신청불가',
  CREDIT_CARD: '신용카드',
};

// 스켈레톤 목록
const ReceiptListSkeleton = () => (
  <div className="receipt-list__skeleton">
    {Array(5)
      .fill(null)
      .map((_, idx) => (
        <Skeleton key={idx} variant="card" className="h-20 w-full mb-3" />
      ))}
  </div>
);

// 개별 발급 항목
const ReceiptItem = ({ order, onApply }) => (
  <article className="receipt-item">
    <div className="receipt-item__info">
      <p className="receipt-item__order-no">{order.orderNo}</p>
      <p className="receipt-item__date">{order.orderYmd}</p>
      <p className="receipt-item__amount">{order.amount?.toLocaleString()}원</p>
    </div>
    <div className="receipt-item__actions">
      <Chip variant={RECEIPT_STATUS_VARIANT[order.status] ?? 'default'} size="sm">
        {RECEIPT_STATUS_LABEL[order.status] ?? order.status}
      </Chip>
      {order.status === 'AVAILABLE' && (
        <Button
          className="receipt-item__apply-btn"
          label="신청하기"
          onClick={() => onApply(order)}
        />
      )}
    </div>
  </article>
);

// 신청 다이얼로그
const ReceiptApplyDialog = ({ open, onOpenChange, order, type }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // 실제 API 연동 시 구현 필요
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="receipt-apply-dialog">
        <DialogHeader>
          <DialogTitle>
            {type === 'cash' ? '현금영수증' : '세금계산서'} 신청
          </DialogTitle>
        </DialogHeader>
        <div className="receipt-apply-dialog__body">
          <p className="receipt-apply-dialog__order-info">
            주문번호: {order?.orderNo}
          </p>
          {type === 'cash' ? (
            <Field>
              <FieldLabel htmlFor="phone-number">휴대전화 번호</FieldLabel>
              <TextField
                id="phone-number"
                type="tel"
                placeholder="010-0000-0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Field>
          ) : (
            <Field>
              <FieldLabel htmlFor="tax-email">세금계산서 수신 이메일</FieldLabel>
              <TextField
                id="tax-email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
          )}
        </div>
        <DialogFooter>
          <Button label="취소" onClick={() => onOpenChange(false)} />
          <Button label="신청" theme="dark" onClick={handleSubmit} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 메인 컴포넌트
const Receipt = () => {
  const [activeTab, setActiveTab] = useState('cash');
  const [isLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useLayoutChanger({
    title: '증빙서류발급',
    hasBackBtnOnHeader: true,
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
  });

  // 예시 데이터 (실제 API 연동 시 대체 필요)
  const cashOrders = [];
  const taxOrders = [];

  const handleApply = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const currentOrders = activeTab === 'cash' ? cashOrders : taxOrders;

  return (
    <div className="receipt-page">
      {/* @MX:NOTE: Huni Tabs 2탭 구조 (SPEC-SKIN-002) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="receipt-page__tabs">
        <TabsList>
          <TabsTrigger value="cash">현금영수증</TabsTrigger>
          <TabsTrigger value="tax">세금계산서</TabsTrigger>
        </TabsList>

        <TabsContent value="cash" className="receipt-page__content">
          {isLoading ? (
            <ReceiptListSkeleton />
          ) : currentOrders.length === 0 ? (
            <p className="receipt-page__empty">현금영수증 신청 가능한 주문이 없습니다.</p>
          ) : (
            currentOrders.map((order) => (
              <ReceiptItem key={order.orderNo} order={order} onApply={handleApply} />
            ))
          )}
        </TabsContent>

        <TabsContent value="tax" className="receipt-page__content">
          {isLoading ? (
            <ReceiptListSkeleton />
          ) : currentOrders.length === 0 ? (
            <p className="receipt-page__empty">세금계산서 신청 가능한 주문이 없습니다.</p>
          ) : (
            currentOrders.map((order) => (
              <ReceiptItem key={order.orderNo} order={order} onApply={handleApply} />
            ))
          )}
        </TabsContent>
      </Tabs>

      <ReceiptApplyDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        order={selectedOrder}
        type={activeTab}
      />
    </div>
  );
};

export default Receipt;
