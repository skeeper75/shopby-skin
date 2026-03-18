import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { string } from 'prop-types';

import { useAuthStateContext } from '@shopby/react-components';

import { platformType } from '../../utils';
import TitleModal from '../TitleModal';

/**
 * @description 특정 경로(notice, faq)에서만 외부 스크립트가 실행되도록 처리된 모달 컴포넌트입니다.
 * @modification 추가 페이지에서 외부 스크립트 실행이 필요한 경우 EXTERNAL_SCRIPT_PATHS에 경로를 추가하세요.
 */
const EXTERNAL_SCRIPT_PATHS = ['notice', 'faq'];

const checkShouldUseExternalScript = (location) => {
  if (!location?.pathname) return false;

  return EXTERNAL_SCRIPT_PATHS.some((path) => location.pathname.includes(path));
};

const FullModal = ({ className, ...props }) => {
  const { profile } = useAuthStateContext();

  const location = useLocation();

  const shouldUseExternalScript = useMemo(() => checkShouldUseExternalScript(location), [location]);

  useEffect(() => {
    if (shouldUseExternalScript) {
      // 외부스크립트, sb객체 등록 기능. 삭제금지
      ShopbyExternalScript?.setPageScriptType();
    }
  }, [location]);

  useEffect(() => {
    if (shouldUseExternalScript) {
      // 외부스크립트, sb객체 등록 기능. 삭제금지
      ShopbyExternalScript?.setGlobalObjectSb({
        getPlatform: () => platformType,
        profile,
      });
    }
  }, []);

  return <TitleModal className={`full-modal ${className ?? ''}`} {...props} isFull={true} />;
};

FullModal.propTypes = {
  className: string,
};

export default FullModal;
