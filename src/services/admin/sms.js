// @MX:NOTE: [AUTO] SMS 발송 API 서비스 레이어 - SMS 페이지, SMSDialog에서 사용
// @MX:SPEC: SPEC-SKIN-005
// @MX:TODO: [AUTO] NHN Cloud SMS API 키 미설정 - 실제 연동 전 환경변수 설정 필요

/**
 * SMS 발송 API 서비스 레이어
 * - NHN Cloud Notification Service 기반
 * - API 키 미설정 상태에서는 Mock으로 동작
 *
 * 실제 연동 시:
 * 1. NHN Cloud 콘솔에서 SMS 서비스 활성화
 * 2. VITE_NHN_SMS_APP_KEY 환경변수 설정
 * 3. TODO 주석 해제
 */

const ADMIN_API_BASE = '/api/admin'; // TODO: 실제 관리자 API 베이스 URL로 교체

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * SMS 발송
 * @param {Object} smsData
 * @param {string} smsData.recipientNo - 수신자 번호 (01012345678 형식)
 * @param {string} smsData.content - SMS 내용 (90바이트 이하: SMS, 초과: LMS)
 * @param {string|number} [smsData.orderNo] - 연관 주문 번호 (선택)
 * @returns {Promise<{ requestId: string, statusCode: string, statusName: string }>}
 */
export const sendSms = async (smsData) => {
  // TODO: 실제 NHN Cloud API 연동 시 아래 주석 해제
  // const response = await fetch(`${ADMIN_API_BASE}/sms/send`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(smsData),
  // });
  // if (!response.ok) {
  //   const error = await response.json();
  //   throw new Error(error.message ?? 'SMS 발송 실패');
  // }
  // return response.json();

  // Mock 응답 (API 키 미설정 시)
  console.info('[SMS Mock] 발송 요청:', smsData);
  return {
    requestId: 'mock_sms_' + Date.now(),
    statusCode: '200',
    statusName: 'success',
  };
};

/**
 * SMS 발송 이력 조회
 * @param {string|number} orderNo - 주문 번호
 * @returns {Promise<Array>}
 */
export const getSmsHistory = async (orderNo) => {
  // TODO: 실제 API 연동 시 아래 주석 해제
  // const response = await fetch(`${ADMIN_API_BASE}/sms/history/${orderNo}`, {
  //   headers: getAuthHeaders(),
  // });
  // if (!response.ok) throw new Error('SMS 이력 조회 실패');
  // return response.json();

  return [];
};
