import { useEffect } from 'react';

import { func } from 'prop-types';

import { useSignUpStateContext, useSignUpActionContext } from '@shopby/react-components';

import Sanitized from '../../components/Sanitized';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/Dialog';

// @MX:NOTE: [AUTO] 약관 전체보기 모달 - Huni Dialog 컴포넌트 사용
// @MX:SPEC: SPEC-SKIN-001
const TermsModal = ({ onClose }) => {
  const { getTerms, setTermsModalInfo } = useSignUpActionContext();
  const { termsModalInfo } = useSignUpStateContext();
  useEffect(() => {
    getTerms({
      termsTypes: termsModalInfo.termsType,
    });

    return () => {
      setTermsModalInfo(null);
    };
  }, []);

  if (!termsModalInfo.contents) return <></>;

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-[90vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{termsModalInfo.title}</DialogTitle>
        </DialogHeader>
        <Sanitized html={termsModalInfo.contents} />
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;

TermsModal.propTypes = {
  onClose: func,
};
