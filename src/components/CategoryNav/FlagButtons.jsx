import { IconBtn, useMallStateContext } from '@shopby/react-components';

import useResponsive from '../../hooks/useResponsive';

const flagInfoMap = {
  KRW: 'flag-kr',
  USD: 'flag-us',
  JPY: 'flag-jp',
};

const FlagButtons = () => {
  const {
    mall: { globalSubMallSummaries },
  } = useMallStateContext();
  const { isMobile } = useResponsive();

  const subMallSummaries =
    globalSubMallSummaries?.map(({ i18nConfig, url }) => ({
      i18nConfig,
      url,
    })) || [];

  // @MX:NOTE: [AUTO] 원본 로직이 isMobile일 때 url.pc를 사용 (의도적 반전인지 버그인지 확인 필요)
  const onClickFlagButton = (url) => {
    location.href = isMobile ? url.pc : url.mobile;
  };

  return (
    <div className="flag-wrapper">
      {subMallSummaries.map(({ i18nConfig, url }) => {
        const { exchangeTo } = i18nConfig.currencies[0] ?? { exchangeTo: 'KRW' };

        return (
          <IconBtn
            iconType={flagInfoMap[exchangeTo]}
            key={exchangeTo}
            className="flag-btn"
            onClick={() => onClickFlagButton(url)}
          />
        );
      })}
    </div>
  );
};

export default FlagButtons;
