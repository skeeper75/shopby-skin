// @MX:NOTE: OrderSheet 페이지 - Huni DS v2로 마이그레이션
// SPEC-SKIN-003 TAG-006 (파일 업로드), TAG-008 (배송정보), TAG-009 (결제)

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { TextField, Field, FieldLabel } from '../../components/ui/TextField';
import { RadioGroup, RadioGroupItem } from '../../components/ui/RadioGroup';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/Dialog';
import { ToastProvider, Toast, ToastDescription, ToastClose, ToastViewport } from '../../components/ui/Snackbar';
import { Divider } from '../../components/ui/Divider';
import { Checkbox } from '../../components/ui/Checkbox';
import PrintFileUpload from '../../components/product/PrintFileUpload';
import { Chip } from '../../components/ui/Chip';

/**
 * 결제 수단 옵션
 */
const PAYMENT_METHODS = [
  { value: 'card', label: '신용카드', icon: '💳' },
  { value: 'naverpay', label: '네이버페이', icon: 'N' },
  { value: 'kakaopay', label: '카카오페이', icon: 'K' },
  { value: 'tosspay', label: '토스페이', icon: 'T' },
  { value: 'transfer', label: '실시간 계좌이체', icon: '🏦' },
  { value: 'virtual', label: '가상계좌', icon: '📝' },
];

/**
 * OrderSheet 컴포넌트
 */
const OrderSheet = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 주문 정보 상태
  const [orderData, setOrderData] = useState({
    // 배송정보
    recipientName: '',
    recipientPhone: '',
    recipientZipcode: '',
    recipientAddress: '',
    recipientAddressDetail: '',
    deliveryMemo: '',

    // 비회원 주문 정보
    guestName: '',
    guestPhone: '',
    guestEmail: '',

    // 결제 정보
    paymentMethod: 'card',
    usePrintingMoney: false,
    printingMoneyAmount: 0,
    couponCode: '',

    // 파일 업로드
    files: [],
    sendLater: false,

    // 약관 동의
    agreePayment: false,
    agreePrivacy: false,
  });

  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [calculatedPrice, setCalculatedPrice] = useState({ total: 0, shipping: 0, discount: 0 });

  // 토스트 알림 표시
  const showToast = (message, variant = 'default') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, variant, open: true }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // 주문서 데이터 로드
  useEffect(() => {
    const loadOrderSheet = async () => {
      setLoading(true);
      try {
        // 실제 API 호출: GET /order-sheets/{orderSheetNo}
        // const cartNos = searchParams.get('cartNos');
        // const response = await fetch(`/api/order-sheets?cartNos=${cartNos}`);
        // const data = await response.json();

        // 목업 데이터
        setCalculatedPrice({
          total: 50000,
          shipping: 3000,
          discount: 0,
        });
      } catch (error) {
        showToast('주문서를 불러오는데 실패했습니다.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadOrderSheet();
  }, [searchParams]);

  /**
   * 필드 변경 핸들러
   */
  const handleFieldChange = (field: string, value: any) => {
    setOrderData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * 주문하기 버튼 클릭
   */
  const handleOrderClick = () => {
    // 필수 필드 검증
    if (!orderData.recipientName || !orderData.recipientPhone || !orderData.recipientAddress) {
      showToast('필수 배송정보를 입력해주세요.', 'error');
      return;
    }

    if (!orderData.agreePayment || !orderData.agreePrivacy) {
      showToast('필수 약관에 동의해주세요.', 'error');
      return;
    }

    // 파일 없이 "나중에 보내기" 미선택 시 확인
    if (orderData.files.length === 0 && !orderData.sendLater) {
      showToast('파일을 업로드하거나 "나중에 보내기"를 선택해주세요.', 'error');
      return;
    }

    setShowConfirmDialog(true);
  };

  /**
   * 결제 실행
   */
  const handlePayment = async () => {
    setShowConfirmDialog(false);
    setLoading(true);

    try {
      // 실제 결제 API 연동
      // const response = await fetch('/api/payments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData),
      // });

      // 목업: 3초 후 결제 완료
      await new Promise((resolve) => setTimeout(resolve, 3000));

      showToast('결제가 완료되었습니다.', 'success');

      // 주문 완료 페이지로 이동
      setTimeout(() => {
        navigate('/order-complete');
      }, 1000);
    } catch (error) {
      showToast('결제에 실패했습니다. 다시 시도해주세요.', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 배송비 계산 (도서산간)
   */
  const calculateShippingFee = () => {
    // 실제 구현 시 도서산간 배송비 계산 로직
    return 3000;
  };

  /**
   * 쿠폰 적용
   */
  const applyCoupon = async () => {
    if (!orderData.couponCode) {
      showToast('쿠폰 코드를 입력해주세요.', 'error');
      return;
    }

    try {
      // 실제 API 호출: POST /order-sheets/coupons
      // const response = await fetch('/api/order-sheets/coupons', {
      //   method: 'POST',
      //   body: JSON.stringify({ couponCode: orderData.couponCode }),
      // });

      setCalculatedPrice((prev) => ({
        ...prev,
        discount: 5000, // 목업 할인 금액
      }));

      showToast('쿠폰이 적용되었습니다.', 'success');
    } catch (error) {
      showToast('쿠폰 적용에 실패했습니다.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <ToastProvider>
    <div className="min-h-screen bg-[--huni-bg-default]">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">주문서 작성</h1>

        <div className="space-y-8">
          {/* 1. 배송정보 */}
          <section>
            <h2 className="text-lg font-semibold mb-4">배송정보</h2>
            <div className="bg-white p-6 rounded-lg border border-[--huni-stroke-default] space-y-4">
              <Field>
                <FieldLabel required>받는 분 성함</FieldLabel>
                <TextField
                  value={orderData.recipientName}
                  onChange={(e) => handleFieldChange('recipientName', e.target.value)}
                  placeholder="홍길동"
                />
              </Field>

              <Field>
                <FieldLabel required>휴대전화</FieldLabel>
                <TextField
                  value={orderData.recipientPhone}
                  onChange={(e) => handleFieldChange('recipientPhone', e.target.value)}
                  placeholder="010-0000-0000"
                />
              </Field>

              <div className="flex gap-2">
                <Field className="flex-1">
                  <FieldLabel required>우편번호</FieldLabel>
                  <TextField
                    value={orderData.recipientZipcode}
                    onChange={(e) => handleFieldChange('recipientZipcode', e.target.value)}
                    placeholder="우편번호 찾기"
                    readOnly
                  />
                </Field>
                <button className="mt-6 px-4 h-[42px] bg-[--huni-bg-muted] border border-[--huni-stroke-default] rounded-md hover:bg-[--huni-bg-muted]">
                  주소찾기
                </button>
              </div>

              <Field>
                <FieldLabel required>기본 주소</FieldLabel>
                <TextField
                  value={orderData.recipientAddress}
                  onChange={(e) => handleFieldChange('recipientAddress', e.target.value)}
                  placeholder="기본 주소"
                  readOnly
                />
              </Field>

              <Field>
                <FieldLabel required>상세 주소</FieldLabel>
                <TextField
                  value={orderData.recipientAddressDetail}
                  onChange={(e) => handleFieldChange('recipientAddressDetail', e.target.value)}
                  placeholder="상세 주소를 입력해주세요"
                />
              </Field>

              <Field>
                <FieldLabel>배송 메시지</FieldLabel>
                <TextField
                  value={orderData.deliveryMemo}
                  onChange={(e) => handleFieldChange('deliveryMemo', e.target.value)}
                  placeholder="배송 시 요청사항을 입력해주세요"
                />
              </Field>
            </div>
          </section>

          {/* 2. 파일 업로드 */}
          <section>
            <h2 className="text-lg font-semibold mb-4">인쇄 파일 업로드</h2>
            <PrintFileUpload
              files={orderData.files}
              onFilesChange={(files) => handleFieldChange('files', files)}
              sendLater={orderData.sendLater}
              onSendLaterChange={(checked) => handleFieldChange('sendLater', checked)}
            />
          </section>

          <Divider />

          {/* 3. 결제 수단 선택 */}
          <section>
            <h2 className="text-lg font-semibold mb-4">결제 수단</h2>
            <div className="bg-white p-6 rounded-lg border border-[--huni-stroke-default]">
              <RadioGroup value={orderData.paymentMethod} onValueChange={(value) => handleFieldChange('paymentMethod', value)}>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <div key={method.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={method.value} id={`payment-${method.value}`} />
                      <label
                        htmlFor={`payment-${method.value}`}
                        className={`flex-1 cursor-pointer rounded-md border p-3 text-center ${
                          orderData.paymentMethod === method.value
                            ? 'border-[--huni-stroke-brand] bg-[--huni-bg-brand-subtle]'
                            : 'border-[--huni-stroke-default]'
                        }`}
                      >
                        <span className="text-lg mr-1">{method.icon}</span>
                        <span className="text-sm font-medium">{method.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {/* 프린팅머니 */}
              <div className="mt-6 p-4 bg-[--huni-bg-muted] rounded-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">프린팅머니 사용</span>
                  <Checkbox
                    checked={orderData.usePrintingMoney}
                    onCheckedChange={(checked) => handleFieldChange('usePrintingMoney', checked)}
                  />
                </div>
                {orderData.usePrintingMoney && (
                  <Field>
                    <TextField
                      type="number"
                      value={orderData.printingMoneyAmount}
                      onChange={(e) => handleFieldChange('printingMoneyAmount', parseInt(e.target.value))}
                      placeholder="사용할 금액 입력"
                    />
                    <p className="text-xs text-[--huni-fg-muted] mt-1">
                      보유 머니: 15,000원
                    </p>
                  </Field>
                )}
              </div>

              {/* 쿠폰 */}
              <div className="mt-6 flex gap-2">
                <Field className="flex-1">
                  <TextField
                    value={orderData.couponCode}
                    onChange={(e) => handleFieldChange('couponCode', e.target.value)}
                    placeholder="쿠폰 코드 입력"
                  />
                </Field>
                <button
                  onClick={applyCoupon}
                  className="mt-6 px-4 h-[42px] bg-[--huni-bg-brand] text-white rounded-md hover:bg-[--huni-bg-brand-bold]"
                >
                  적용
                </button>
              </div>
            </div>
          </section>

          <Divider />

          {/* 4. 주문 동의 및 결제 */}
          <section>
            <div className="bg-white p-6 rounded-lg border border-[--huni-stroke-default] space-y-4">
              {/* 약관 동의 */}
              <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <Checkbox
                    checked={orderData.agreePayment}
                    onCheckedChange={(checked) => handleFieldChange('agreePayment', checked)}
                  />
                  <span className="text-sm">
                    <span className="text-[--huni-fg-error] mr-1">*</span>
                    결제 정보 확인에 동의합니다.
                  </span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <Checkbox
                    checked={orderData.agreePrivacy}
                    onCheckedChange={(checked) => handleFieldChange('agreePrivacy', checked)}
                  />
                  <span className="text-sm">
                    <span className="text-[--huni-fg-error] mr-1">*</span>
                    개인정보 제3자 제공에 동의합니다.
                  </span>
                </label>
              </div>

              <Divider />

              {/* 금액 요약 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>상품 금액</span>
                  <span>{calculatedPrice.total.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>배송비</span>
                  <span>+{calculateShippingFee().toLocaleString()}원</span>
                </div>
                {calculatedPrice.discount > 0 && (
                  <div className="flex justify-between text-sm text-[--huni-fg-brand]">
                    <span>할인</span>
                    <span>-{calculatedPrice.discount.toLocaleString()}원</span>
                  </div>
                )}
                <Divider />
                <div className="flex justify-between text-lg font-bold">
                  <span>총 결제금액</span>
                  <span className="text-[--huni-fg-brand]">
                    {(calculatedPrice.total + calculateShippingFee() - calculatedPrice.discount).toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 결제 버튼 */}
              <button
                onClick={handleOrderClick}
                disabled={loading}
                className="w-full h-[50px] bg-[--huni-bg-brand-bold] text-white rounded-md font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '결제 처리 중...' : '결제하기'}
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* 결제 확인 다이얼로그 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>결제 확인</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-2">
            <p>선택하신 결제 수단으로 결제를 진행하시겠습니까?</p>
            <div className="bg-[--huni-bg-muted] p-3 rounded-md">
              <p className="text-sm">결제 수단: {PAYMENT_METHODS.find(m => m.value === orderData.paymentMethod)?.label}</p>
              <p className="text-lg font-bold text-[--huni-fg-brand] mt-1">
                총 금액: {(calculatedPrice.total + calculateShippingFee() - calculatedPrice.discount).toLocaleString()}원
              </p>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setShowConfirmDialog(false)}
              className="px-4 py-2 border border-[--huni-stroke-default] rounded-md hover:bg-[--huni-bg-muted]"
            >
              취소
            </button>
            <button
              onClick={handlePayment}
              className="px-4 py-2 bg-[--huni-bg-brand] text-white rounded-md hover:bg-[--huni-bg-brand-bold]"
            >
              결제하기
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast 알림 */}
      {toasts.map((toast) => (
        <Toast key={toast.id} open={toast.open} variant={toast.variant}>
          <ToastDescription>{toast.message}</ToastDescription>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </div>
    </ToastProvider>
  );
};

export default OrderSheet;
