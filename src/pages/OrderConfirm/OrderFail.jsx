import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { string } from 'prop-types';

import { Button, useMallStateContext } from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';

// @MX:NOTE: [AUTO] Huni 결제 실패 페이지 - 개선된 에러 UI, 오류 코드/설명 분리 표시
const OrderFail = ({ message }) => {
  const { mall } = useMallStateContext();
  const navigate = useNavigate();

  const {
    failCode = '',
    summary = '',
    description = '',
  } = useMemo(() => {
    if (!message) return {};

    const failCodeWithBrackets = message.match(/\[(.*?)\]/)?.[0];
    const failCode = failCodeWithBrackets?.slice(1, -1) ?? '';

    const failMessageWithoutCode = message.slice(message.indexOf(']') + 1);
    const [summary, description] = failMessageWithoutCode.split(':');

    return { failCode, summary, description };
  }, [message]);

  useLayoutChanger({ title: '결제실패' });

  const handleGoCartBtnClick = () => navigate('/cart');
  const handleGoHomeBtnClick = () => navigate('/');

  return (
    <div className="order-confirm">
      <section className="l-panel order-confirm__message">
        <div className="flex flex-col items-center gap-3 py-4">
          {/* 실패 아이콘 */}
          <div className="w-16 h-16 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-bold text-[#424242] tracking-[-0.05em]">결제에 실패했습니다</h2>
            {failCode && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-[#EF4444]/10 text-[#EF4444] text-xs font-semibold rounded tracking-[-0.05em]">
                오류 코드: {failCode}
              </span>
            )}
          </div>

          {/* 오류 내용 */}
          {(summary || description) && (
            <div className="w-full max-w-sm bg-[#F6F6F6] rounded-[5px] px-4 py-3 text-center">
              {summary && (
                <p className="text-sm font-semibold text-[#424242] tracking-[-0.05em]">{summary.trim()}</p>
              )}
              {description && (
                <p className="text-xs text-[#979797] mt-1 tracking-[-0.05em]">{description.trim()}</p>
              )}
            </div>
          )}

          {/* 안내 메시지 */}
          <p className="text-xs text-[#979797] text-center max-w-xs leading-relaxed tracking-[-0.05em]">
            실패 사유를 확인하신 후 다시 시도해주세요.
            계속 실패하는 경우{' '}
            <a
              href={`tel:${mall?.serviceCenter?.phoneNo}`}
              className="text-[#5538B6] font-semibold underline"
            >
              {mall?.serviceCenter?.phoneNo ?? '고객센터'}
            </a>
            로 문의주시기 바랍니다.
          </p>
        </div>
      </section>

      <section className="order-confirm__btn-group flex gap-2 p-4">
        <Button
          className="flex-1"
          theme="dark"
          label="장바구니 가기"
          onClick={handleGoCartBtnClick}
        />
        <Button
          className="flex-1 order-confirm__go-home-btn"
          label="홈으로 가기"
          onClick={handleGoHomeBtnClick}
        />
      </section>
    </div>
  );
};

export default OrderFail;

OrderFail.propTypes = {
  message: string,
};
