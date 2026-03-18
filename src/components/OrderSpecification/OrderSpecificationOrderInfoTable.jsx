import { object } from 'prop-types';

const OrderSpecificationOrderInfoTable = ({ orderSpecifications }) => (
  <div className="order-specification-content-top">
    <table className="order-specification-info">
      <colgroup>
        <col width="4%" />
        <col width="10%" />
        <col width="13%" />
        <col width="10%" />
        <col width="13%" />

        <col width="4%" />
        <col width="10%" />
        <col width="13%" />
        <col width="10%" />
        <col width="13%" />
      </colgroup>
      <tbody>
        <tr>
          <th className="thead-point" scope="row" rowSpan={5}>
            공급자
          </th>
          <th scope="row">사업자등록번호</th>
          <td colSpan={3}>{orderSpecifications.business?.registrationNo}</td>
          <th className="thead-point" scope="row" colSpan={2}>
            출력일자
          </th>
          <td colSpan={3}>{orderSpecifications.printYmd}</td>
        </tr>
        <tr>
          <th scope="row">회사명</th>
          <td>{orderSpecifications.companyName}</td>
          <th scope="row">대표자</th>
          <td className="align-left">{orderSpecifications.representative?.name}</td>
          <th className="thead-point" scope="row" rowSpan={4}>
            수령자/주문자
          </th>
          <th scope="row">수령자명</th>
          <td className="align-left">{orderSpecifications.receiverAddress?.name}</td>
          <th scope="row">주문자명</th>
          <td className="align-left">{orderSpecifications.ordererName}</td>
        </tr>
        <tr>
          <th scope="row">주소</th>
          <td className="align-left" colSpan={3}>
            {orderSpecifications.office?.address} {orderSpecifications.office?.detailAddress}
          </td>
          <th scope="row">수령자 주소</th>
          <td className="align-left" colSpan={3}>
            {orderSpecifications.receiverAddress?.address} {orderSpecifications.receiverAddress?.detailAddress}
          </td>
        </tr>
        <tr>
          <th scope="row">업태</th>
          <td className="align-left">{orderSpecifications.business?.condition}</td>
          <th scope="row">종목</th>
          <td className="align-left">{orderSpecifications.business?.type}</td>
          <th scope="row">수령자 연락처1</th>
          <td>{orderSpecifications.receiverAddress?.contact1}</td>
          <th scope="row">수령자 연락처2</th>
          <td>{orderSpecifications.receiverAddress?.contact2}</td>
        </tr>
        <tr>
          <th scope="row">전화번호</th>
          <td colSpan={3}>{orderSpecifications.representative?.phoneNo}</td>
          <th scope="row">비고</th>
          <td colSpan={3}></td>
        </tr>
        <tr>
          <th scope="row" colSpan={2}>
            주문메모
          </th>
          <td colSpan={3}>{orderSpecifications.orderMemo}</td>
          <th scope="row" colSpan={2}>
            배송메모
          </th>
          <td colSpan={3}>{orderSpecifications.shippingMemo}</td>
        </tr>
      </tbody>
    </table>
  </div>
);
export default OrderSpecificationOrderInfoTable;

OrderSpecificationOrderInfoTable.propTypes = {
  orderSpecifications: object,
};
