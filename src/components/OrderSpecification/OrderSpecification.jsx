import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MyOrderProvider } from '@shopby/react-components';

import OrderSpecificationDetail from './OrderSpecificationDetail';

const OrderSpecification = () => {
  const [isPrint, setIsPrint] = useState(false);
  const { orderNo } = useParams();

  const handlePrintButton = () => {
    setIsPrint(true);
  };

  useEffect(() => {
    if (isPrint) {
      window.print();
    }
  }, [isPrint]);

  useEffect(() => {
    window.addEventListener('beforeprint', () => {
      setIsPrint(true);
    });
    window.addEventListener('afterprint', () => {
      setIsPrint(false);
    });
  }, []);

  return (
    <MyOrderProvider>
      <div className={`order-specification-wrapper${isPrint ? ' print' : ''}`}>
        <OrderSpecificationDetail orderNo={orderNo} isPrint={isPrint} />

        {!isPrint && (
          <div className="order-specification-controller-bottom">
            <button className="btn" onClick={() => window.close()}>
              닫기
            </button>
            <button className="btn order-specification-controller-bottom__print-btn" onClick={handlePrintButton}>
              출력
            </button>
          </div>
        )}
      </div>
    </MyOrderProvider>
  );
};

export default OrderSpecification;
