import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { oneOfType, string, number, func, bool, array } from 'prop-types';

import {
  Button,
  useClaimActionContext,
  useModalActionContext,
  useMyOrderActionContext,
  VisibleComponent,
  ProductReviewFormProvider,
  ProductReviewProvider,
  useNextActionActionContext,
  useProductReviewActionContext,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import FullModal from '../../components/FullModal/FullModal';
import ReviewForm from '../../components/ReviewForm';
import { convertBooleanToYorN } from '../../utils';

const ReviewFormModal = ({ isOpen, onClose, ...props }) => {
  const { fetchConfiguration: fetchProductReviewConfiguration } = useProductReviewActionContext();
  const handleSubmit = () => {
    onClose();
  };

  useEffect(() => {
    fetchProductReviewConfiguration({
      cacheOption: {
        type: 'MEMORY',
        timeBySeconds: 180,
      },
    });
  }, []);

  return (
    <VisibleComponent
      shows={isOpen}
      TruthyComponent={
        <FullModal title="상품후기">
          <ReviewForm isRegisterMode={true} onSubmit={handleSubmit} onCancel={onClose} {...props} />
        </FullModal>
      }
    />
  );
};

ReviewFormModal.propTypes = {
  isOpen: bool,
  onClose: func,
};

const CLAIM_NOTICE_FOR_ESCROW = {
  CANCEL_ALL: '에스크로 결제 건은 전체 취소만 가능합니다. 취소하시겠습니까?',
  CANCEL:
    '에스크로 결제 건은 모든 상품이 결제완료 상태에서만 취소 신청이 가능합니다. 취소신청은 1:1문의를 통해 문의해주세요.',
  RETURN: '에스크로 결제 건에 대한 클레임이 불가능합니다. 고객센터를 통해 확인해주세요.',
  EXCHANGE: '에스크로 결제 건은 교환 신청이 불가합니다. 취소/반품 후 재주문으로 처리해 주세요.',
  CONFIRM_ORDER: '에스크로 주문은 구매확정으로 변경할 수 없습니다.',
  WRITE_REVIEW: '에스크로 결제 건은 구매확정 이후 후기작성이 가능합니다.',
};

const getEscrowInfo = ({ isEscrow, nextAction, orderStatus }) => {
  if (!isEscrow) {
    return {
      next: true,
      message: '',
    };
  }

  if (orderStatus === 'DEPOSIT_WAIT') {
    const message = CLAIM_NOTICE_FOR_ESCROW[nextAction];

    return {
      next: true,
      message,
    };
  }

  if (['PAY_DONE', 'PRODUCT_PREPARE', 'DELIVERY_PREPARE'].includes(orderStatus)) {
    const message = CLAIM_NOTICE_FOR_ESCROW[nextAction];
    if (message) {
      return {
        next: false,
        message,
      };
    }
  }

  const message = CLAIM_NOTICE_FOR_ESCROW[nextAction];

  if (message) {
    return {
      next: false,
      message,
    };
  }

  return {
    next: true,
    message: '',
  };
};

const NextActionButton = ({
  orderStatusType,
  nextActionType,
  trackingDeliveryUri,
  productNo,
  optionNo,
  orderOptionNo,
  orderNo,
  className,
  productName,
  productImageUrl,
  optionName,
  optionValue,
  deliverable = true,
  pgType = null,
  claimStatusType = null,
  deliveryType = null,
  flattenedOrderOptions = [],
  payType = null,
}) => {
  const navigate = useNavigate();
  const { openAlert, openConfirm } = useModalActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const { withdrawClaimByOrderOptionNo, cancelOrder } = useClaimActionContext();
  const { confirmOrder, fetchOrderDetail } = useMyOrderActionContext();
  const { checkNextActionStatus } = useNextActionActionContext();

  const [isOpen, setIsOpen] = useState(false);

  const isEscrow = payType?.includes('ESCROW');

  const nextAction = {
    CANCEL_ALL: {
      label: '전체 주문 취소',
      execute: () => {
        const { message } = getEscrowInfo({
          isEscrow,
          nextAction,
          orderStatus: orderStatusType,
        });

        openConfirm({
          message: message ? message : '전체 주문을 취소하시겠습니까?',
          onConfirm: async () => {
            try {
              await cancelOrder(orderNo);
              openAlert({
                message: '전체 주문 취소가 완료되었습니다.',
                onClose: () => fetchOrderDetail(orderNo),
              });
            } catch (error) {
              catchError(error);
            }
          },
        });
      },
    },
    CANCEL: {
      label: '취소 신청',
      execute: () => {
        const { next, message } = getEscrowInfo({
          isEscrow,
          nextAction,
          orderStatus: orderStatusType,
        });

        if (message) {
          openAlert({
            message,
          });
        }

        next && navigate(`/claim/${orderOptionNo}?claimType=CANCEL`);
      },
    },
    EXCHANGE: {
      label: '교환 신청',
      execute: () => {
        const { next, message } = getEscrowInfo({
          isEscrow,
          nextAction,
          orderStatus: orderStatusType,
        });

        if (message) {
          openAlert({
            message,
          });
        }

        next && navigate(`/claim/${orderOptionNo}?claimType=EXCHANGE`);
      },
    },
    RETURN: {
      label: '반품 신청',
      execute: () => {
        const { next, message } = getEscrowInfo({
          isEscrow,
          nextAction,
          orderStatus: orderStatusType,
        });

        if (message) {
          openAlert({
            message,
          });
        }

        next && navigate(`/claim/${orderOptionNo}?claimType=RETURN&deliverable=${convertBooleanToYorN(deliverable)}`);
      },
    },
    WITHDRAW_CANCEL: {
      label: '취소신청 철회',
      execute: () => {
        openConfirm({
          message: '취소 신청을 철회하시겠습니까?',
          onConfirm: async () => {
            try {
              await withdrawClaimByOrderOptionNo(orderOptionNo.toString());
              openAlert({
                message: '취소신청 철회가 완료되었습니다.',
                onClose: () => fetchOrderDetail(orderNo),
              });
            } catch (error) {
              catchError(error);
            }
          },
        });
      },
    },
    WITHDRAW_EXCHANGE: {
      label: '교환 취소',
      execute: () => {
        openConfirm({
          message: '교환 신청을 철회하시겠습니까?',
          onConfirm: async () => {
            try {
              await withdrawClaimByOrderOptionNo(orderOptionNo.toString());
              openAlert({
                message: '교환 신청 철회가 완료되었습니다.',
                onClose: () => fetchOrderDetail(orderNo),
              });
            } catch (error) {
              catchError(error);
            }
          },
        });
      },
    },
    WITHDRAW_RETURN: {
      label: '반품 취소',
      execute: () => {
        openConfirm({
          message: '반품 신청을 철회하시겠습니까?',
          onConfirm: async () => {
            try {
              await withdrawClaimByOrderOptionNo(orderOptionNo.toString());
              openAlert({
                message: '반품 신청 철회가 완료되었습니다.',
                onClose: () => fetchOrderDetail(orderNo),
              });
            } catch (error) {
              catchError(error);
            }
          },
        });
      },
    },
    VIEW_DELIVERY: {
      label: '배송 조회',
      execute: () => {
        window.open(trackingDeliveryUri, '_blank');
      },
    },
    CONFIRM_ORDER: {
      label: '구매 확정',
      execute: async () => {
        try {
          await confirmOrder(orderOptionNo.toString());
          openAlert({
            message: '구매확정 처리되었습니다.',
            onClose: () => fetchOrderDetail(orderNo),
          });
        } catch (e) {
          catchError(e);
        }
      },
    },
    WRITE_REVIEW: {
      label: '후기 작성',
      execute: () => {
        setIsOpen(true);
      },
    },
    // 현 스펙 제외
    // CHANGE_ADDRESS: {
    //   label: '',
    //   execute: () => {

    //   }
    // VIEW_CLAIM: {
    //   label: '',
    //   execute: () => {

    //   }
    // },
    // },
    // ISSUE_CASH_RECEIPT: {
    //   label: '',
    //   execute: () => {

    //   }
    // },
    // VIEW_RECEIPT: {
    //   label: '',
    //   execute: () => {

    //   }
    // },
    // DELIVERY_DONE: {
    //   label: '',
    //   execute: () => {

    //   }
    // },
  };

  return (
    <>
      <Button
        className={`${className} btn--${nextActionType?.toLowerCase?.()}`}
        onClick={() => {
          const { data } = checkNextActionStatus({
            pgType,
            orderStatusType,
            claimStatusType,
            deliveryType,
            flattenedOrderOptions,
            nextActionType,
          });

          if (data?.canDoNextAction) {
            nextAction[nextActionType]?.execute();
          } else {
            data?.reason &&
              openAlert({
                message: data.reason,
              });
          }
        }}
      >
        {nextAction[nextActionType].label}
      </Button>
      <ProductReviewFormProvider>
        <ProductReviewProvider productNo={productNo}>
          <ReviewFormModal
            isOpen={isOpen}
            productNo={productNo}
            productName={productName}
            productImageUrl={productImageUrl}
            optionNo={optionNo}
            orderOptionNo={orderOptionNo}
            orderProductOptionNo={optionNo}
            optionName={optionName}
            optionValue={optionValue}
            orderStatusType={orderStatusType}
            onClose={() => {
              setIsOpen(false);
              fetchOrderDetail(orderNo);
            }}
          />
        </ProductReviewProvider>
      </ProductReviewFormProvider>
    </>
  );
};

export default NextActionButton;

NextActionButton.propTypes = {
  nextActionType: oneOfType([
    'CANCEL_ALL',
    'CANCEL',
    'EXCHANGE',
    'RETURN',
    'WITHDRAW_CANCEL',
    'WITHDRAW_EXCHANGE',
    'WITHDRAW_RETURN',
    'VIEW_DELIVERY',
    'CONFIRM_ORDER',
    'WRITE_REVIEW',
    // 현 스펙 제외
    // 'VIEW_CLAIM',
    // 'DELIVERY_DONE',
    // 'CHANGE_ADDRESS',
    // 'ISSUE_CASH_RECEIPT',
    // 'VIEW_RECEIPT'
  ]),
  orderStatusType: string,
  trackingDeliveryUri: string,
  productNo: number,
  orderOptionNo: number,
  orderNo: string,
  className: string,
  productName: string,
  productImageUrl: string,
  optionNo: number,
  optionName: string,
  optionValue: string,
  deliverable: bool,
  pgType: string,
  payType: string,
  claimStatusType: string,
  deliveryType: string,
  flattenedOrderOptions: array,
};
