import { useState, useCallback, useMemo } from 'react';

// @MX:NOTE: [AUTO] SMS/LMS 바이트 계산 - 한글 2바이트, 영숫자 1바이트 기준
// SMS 90바이트, LMS 2000바이트 제한

/**
 * SMS 템플릿 메시지 목록
 */
const SMS_TEMPLATES = [
  {
    key: 'order_received',
    label: '주문접수',
    message: '[후니프린팅] 주문이 접수되었습니다. 주문번호: {orderNo}. 빠른 시일 내 제작을 시작하겠습니다. 감사합니다.',
  },
  {
    key: 'production_start',
    label: '제작시작',
    message: '[후니프린팅] 주문번호 {orderNo} 상품의 제작이 시작되었습니다. 완료되면 다시 안내드리겠습니다.',
  },
  {
    key: 'production_complete',
    label: '제작완료',
    message: '[후니프린팅] 주문번호 {orderNo} 상품의 제작이 완료되었습니다. 곧 배송이 시작됩니다.',
  },
  {
    key: 'shipping_start',
    label: '배송시작',
    message: '[후니프린팅] 주문번호 {orderNo} 상품이 발송되었습니다. 배송 조회는 홈페이지에서 확인 가능합니다.',
  },
  {
    key: 'reupload_request',
    label: '재업로드요청',
    message: '[후니프린팅] 주문번호 {orderNo} 업로드 파일 확인 결과, 재업로드가 필요합니다. 홈페이지에서 파일을 다시 업로드해주세요.',
  },
];

/**
 * 바이트 수 계산 (한글 2바이트, 영숫자 1바이트)
 */
const calculateBytes = (str) => {
  let bytes = 0;
  for (let i = 0; i < str.length; i++) {
    bytes += str.charCodeAt(i) > 127 ? 2 : 1;
  }
  return bytes;
};

/**
 * SMS 발송 모달 컴포넌트
 * - 수신자 선택, 템플릿 메시지, 커스텀 입력
 * - SMS (90바이트) / LMS (2000바이트) 자동 분류
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 열림 상태
 * @param {Array} props.recipients - 수신자 목록 [{ name, phone }]
 * @param {Function} props.onClose - 닫기 콜백
 * @param {Function} props.onSend - 발송 콜백 ({ recipients, message, type })
 */
const SMSDialog = ({
  isOpen = false,
  recipients = [],
  onClose,
  onSend,
}) => {
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // 바이트 수 및 메시지 타입 계산
  const byteCount = useMemo(() => calculateBytes(message), [message]);
  const messageType = byteCount > 90 ? 'LMS' : 'SMS';
  const maxBytes = messageType === 'LMS' ? 2000 : 90;

  // 템플릿 선택 핸들러
  const handleTemplateChange = useCallback((e) => {
    const templateKey = e.target.value;
    setSelectedTemplate(templateKey);

    if (templateKey) {
      const template = SMS_TEMPLATES.find((t) => t.key === templateKey);
      if (template) {
        setMessage(template.message);
      }
    }
  }, []);

  // 발송 핸들러
  const handleSend = useCallback(() => {
    if (!message.trim()) {
      alert('메시지를 입력해주세요.');
      return;
    }
    if (recipients.length === 0) {
      alert('수신자를 선택해주세요.');
      return;
    }
    if (byteCount > 2000) {
      alert('메시지가 LMS 최대 길이(2000바이트)를 초과합니다.');
      return;
    }

    onSend?.({
      recipients,
      message,
      type: messageType,
    });

    // 초기화
    setMessage('');
    setSelectedTemplate('');
  }, [message, recipients, byteCount, messageType, onSend]);

  // 배경 클릭 시 닫기
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose?.();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-[500px] max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#CACACA]">
          <h3 className="text-lg font-semibold text-[#424242]">SMS 발송</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#979797] hover:text-[#424242] text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {/* 수신자 목록 */}
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              수신자 ({recipients.length}명)
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 border border-[#CACACA] rounded bg-[#F6F6F6] max-h-[80px] overflow-y-auto">
              {recipients.map((r, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 bg-[#EEEBF9] text-[#5538B6] text-xs rounded"
                >
                  {r.name} ({r.phone})
                </span>
              ))}
              {recipients.length === 0 && (
                <span className="text-[#979797] text-sm">수신자가 없습니다.</span>
              )}
            </div>
          </div>

          {/* 템플릿 선택 */}
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              템플릿 메시지
            </label>
            <select
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="w-full h-[36px] px-3 text-sm border border-[#CACACA] rounded focus:outline-none focus:border-[#5538B6] text-[#424242]"
            >
              <option value="">직접 입력</option>
              {SMS_TEMPLATES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* 메시지 입력 */}
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-2">
              메시지 내용
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setSelectedTemplate('');
              }}
              rows={5}
              maxLength={1000}
              placeholder="메시지를 입력하세요"
              className="w-full px-3 py-2 text-sm border border-[#CACACA] rounded resize-none focus:outline-none focus:border-[#5538B6] text-[#424242] placeholder:text-[#979797]"
            />
            <div className="flex items-center justify-between mt-1">
              <span
                className={`text-xs font-medium ${
                  byteCount > maxBytes ? 'text-red-500' : 'text-[#979797]'
                }`}
              >
                {byteCount} / {maxBytes} bytes ({messageType})
              </span>
              {byteCount > 90 && (
                <span className="text-xs text-[#E6B93F]">
                  LMS로 발송됩니다
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#CACACA]">
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] px-5 border border-[#CACACA] text-[#424242] text-sm rounded hover:bg-[#F6F6F6] transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim() || recipients.length === 0}
            className="h-[36px] px-5 bg-[#5538B6] text-white text-sm rounded hover:bg-[#4530A0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            발송하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMSDialog;
