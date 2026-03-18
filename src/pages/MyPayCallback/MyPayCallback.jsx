import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const MyPayCallback = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const { resultCode, resultMsg } = params;

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ ...params, isSuccess: !resultCode });
      setTimeout(() => {
        window.close();
      }, 500);
    }
  }, []);

  return (
    <div className="my-pay-callback-popup">
      <section className="l-panel my-pay-callback__message">{resultMsg}</section>
    </div>
  );
};

export default MyPayCallback;
