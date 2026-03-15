/**
 * A4 인쇄용 주문서 레이아웃 컴포넌트
 * - 인쇄 최적화 CSS (@media print) 적용
 * - 후니프린팅 회사 헤더 포함
 *
 * @param {Object} props
 * @param {Array} props.orders - 출력할 주문 목록
 */
const PrintSheet = ({ orders = [] }) => {
  if (orders.length === 0) return null;

  return (
    <div className="print-sheet">
      {/* 인쇄 전용 스타일 */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-sheet,
          .print-sheet * {
            visibility: visible;
          }
          .print-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-order {
            page-break-after: always;
          }
          .print-order:last-child {
            page-break-after: auto;
          }
          .no-print {
            display: none !important;
          }
        }

        @media screen {
          .print-sheet {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
          }
        }

        .print-order {
          font-family: 'Noto Sans KR', sans-serif;
          padding: 20mm;
          box-sizing: border-box;
        }

        .print-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }

        .print-table th,
        .print-table td {
          border: 1px solid #424242;
          padding: 8px 12px;
          font-size: 12px;
          text-align: left;
        }

        .print-table th {
          background-color: #F6F6F6;
          font-weight: 600;
          width: 100px;
        }
      `}</style>

      {orders.map((order, idx) => (
        <div key={order.orderNo || idx} className="print-order">
          {/* 회사 헤더 */}
          <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid #424242', paddingBottom: '16px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#5538B6', margin: '0 0 4px 0' }}>
              후니프린팅
            </h1>
            <p style={{ fontSize: '11px', color: '#979797', margin: 0 }}>
              주문서
            </p>
          </div>

          {/* 주문 기본정보 */}
          <table className="print-table">
            <tbody>
              <tr>
                <th>주문번호</th>
                <td>{order.orderNo}</td>
                <th>주문일시</th>
                <td>{order.orderDate}</td>
              </tr>
              <tr>
                <th>주문자</th>
                <td>{order.customerName}</td>
                <th>연락처</th>
                <td>{order.phone}</td>
              </tr>
            </tbody>
          </table>

          {/* 상품정보 */}
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: 'auto' }}>상품명</th>
                <th style={{ width: '120px' }}>옵션</th>
                <th style={{ width: '60px', textAlign: 'center' }}>수량</th>
                <th style={{ width: '100px', textAlign: 'right' }}>금액</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{order.productName}</td>
                <td>{order.option || '-'}</td>
                <td style={{ textAlign: 'center' }}>{order.quantity}</td>
                <td style={{ textAlign: 'right' }}>
                  {Number(order.totalPrice).toLocaleString()}원
                </td>
              </tr>
            </tbody>
          </table>

          {/* 배송정보 */}
          <table className="print-table">
            <tbody>
              <tr>
                <th>수령인</th>
                <td>{order.receiverName}</td>
                <th>연락처</th>
                <td>{order.receiverPhone}</td>
              </tr>
              <tr>
                <th>배송지</th>
                <td colSpan={3}>{order.address}</td>
              </tr>
              {order.deliveryMemo && (
                <tr>
                  <th>배송메모</th>
                  <td colSpan={3}>{order.deliveryMemo}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 하단 정보 */}
          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '10px', color: '#979797' }}>
            <p>후니프린팅 | 본 주문서는 내부 관리용 문서입니다.</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrintSheet;
