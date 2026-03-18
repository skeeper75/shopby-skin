import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button, MyOrderProvider } from '@shopby/react-components';

import SimpleReceiptDetail from './SimpleReceiptDetail';

const SimpleReceipt = () => {
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
      <div className={`simple-receipt${isPrint ? ' print' : ''}`}>
        <div className="simple-receipt-title">
          <span>간이영수증</span>
          {!isPrint && <Button className="simple-receipt__print-btn" label="출력" onClick={handlePrintButton} />}
        </div>
        <SimpleReceiptDetail orderNo={orderNo} />
      </div>
    </MyOrderProvider>
  );
};

export default SimpleReceipt;
