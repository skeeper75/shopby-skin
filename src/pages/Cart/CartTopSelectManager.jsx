import { useMemo } from 'react';

import { Checkbox, useCartActionContext, useCartStateContext, useModalActionContext } from '@shopby/react-components';

const CartTopSelectManager = () => {
  const { openConfirm, openAlert } = useModalActionContext();
  const { isAllChecked, checkedCartNos, checkingStatusPerCartNo } = useCartStateContext();
  const { updateIsAllChecked, deleteCartNos, getDeletableRequiredOption } = useCartActionContext();

  const allCartNosLength = useMemo(() => Object.keys(checkingStatusPerCartNo).length, [checkingStatusPerCartNo]);
  const handleAllSelectCheckboxChange = ({ currentTarget }) => {
    const isChecked = currentTarget.checked;
    updateIsAllChecked(isChecked);
  };

  const handleDeleteSelectedItemBtnClick = () => {
    if (!checkedCartNos.length) {
      openAlert({
        message: '먼저 삭제할 상품들을 선택해주세요.',
      });

      return;
    }

    const { data } = getDeletableRequiredOption();

    if (!data) {
      openAlert({
        message:
          '선택옵션은 단독 주문이 불가합니다. 필수옵션 취소 필요 시 선택옵션을 먼저 취소해주시거나, 함께 취소해주세요.',
      });

      return;
    }

    openConfirm({
      message: '선택된 상품들을 삭제하시겠습니까?',
      confirmLabel: '삭제',
      onConfirm: () => {
        deleteCartNos(checkedCartNos);
      },
    });
  };

  return (
    <section className="l-panel cart__select-manager">
      <span className="cart__check-all-btn">
        <Checkbox label="전체 선택" isRounded={true} onChange={handleAllSelectCheckboxChange} checked={isAllChecked} />
        <span className="cart__checked-amt">
          ({checkedCartNos.length}/{allCartNosLength})
        </span>
      </span>
      <span className="cart__delete-selected-btn">
        <label htmlFor="delete-btn">선택삭제</label>
        <button id="delete-btn" className="cart__delete-btn" onClick={handleDeleteSelectedItemBtnClick} />
      </span>
    </section>
  );
};

export default CartTopSelectManager;
