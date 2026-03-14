import { object } from 'prop-types';

const SimpleReceiptInfoTable = ({ orderSimpleReceipt }) => (
  <table className="simple-receipt-info">
    <colgroup>
      <col width="8%" />
      <col width="25%" />
      <col width="20%" />
      <col width="15%" />
      <col width="32%" />
    </colgroup>
    <tbody>
      <tr>
        <td className="align-center simple-receipt-info-title" colSpan="5">
          영 수 증<span>( 공급받는자용 )</span>
        </td>
      </tr>
      <tr>
        <td colSpan="2">no.</td>
        <td className="align-right" colSpan="3">
          <span>{orderSimpleReceipt.ordererName}</span>
          <span>&nbsp;귀하</span>
        </td>
      </tr>
      <tr>
        <td rowSpan="4" className="simple-receipt-info__provider-title">
          공<br />
          <br />급<br />
          <br />자
        </td>
        <td className="align-center">
          사 업 자<br />
          등록번호
        </td>
        <td className="align-left simple-receipt-info__business-no" colSpan="3">
          <p size="3">{orderSimpleReceipt.business?.registrationNo}</p>
        </td>
      </tr>
      <tr className="align-center">
        <td className="align-center">상 호</td>
        <td>{orderSimpleReceipt.companyName}</td>
        <td>성명</td>
        <td className="align-left">{orderSimpleReceipt.representative?.name}</td>
      </tr>
      <tr className="align-center">
        <td>
          사 업 장<br />소 재 지
        </td>
        <td colSpan="3">
          {orderSimpleReceipt.office?.address} {orderSimpleReceipt.office?.detailAddress}
        </td>
      </tr>
      <tr className="align-center">
        <td>업태</td>
        <td>{orderSimpleReceipt.business?.condition}</td>
        <td>종목</td>
        <td>{orderSimpleReceipt.business?.type}</td>
      </tr>
    </tbody>
  </table>
);

export default SimpleReceiptInfoTable;

SimpleReceiptInfoTable.propTypes = {
  orderSimpleReceipt: object,
};
