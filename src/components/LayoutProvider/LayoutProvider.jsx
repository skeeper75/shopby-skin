import { useContext, useMemo, useState, createContext } from 'react';

import { oneOfType, node, element } from 'prop-types';

import useResponsive from '../../hooks/useResponsive';

export const LAYOUT_DEFAULT_STATE = {
  isMain: false,
  hasBackBtnOnHeader: false,
  hasHomeBtnOnHeader: false,
  hasCartBtnOnHeader: false,
  hasSearchKeywordHeader: false,
  hasCancelBtnOnHeader: false,
  hasBottomNav: false,
  title: '',
};

const LayoutActionContext = createContext(null);
const LayoutValueContext = createContext(null);

const LayoutProvider = ({ children }) => {
  const [layoutStatus, setLayoutStatus] = useState(LAYOUT_DEFAULT_STATE);
  const responsive = useResponsive();

  const action = useMemo(
    () => ({
      changeLayoutStatus: (layoutStatus) =>
        setLayoutStatus({
          ...LAYOUT_DEFAULT_STATE,
          ...layoutStatus,
        }),
    }),
    [setLayoutStatus]
  );

  // 레이아웃 상태와 반응형 상태를 합쳐서 context에 제공
  const value = useMemo(
    () => ({
      ...layoutStatus,
      ...responsive,
    }),
    [layoutStatus, responsive]
  );

  return (
    <LayoutActionContext.Provider value={action}>
      <LayoutValueContext.Provider value={value}>{children}</LayoutValueContext.Provider>
    </LayoutActionContext.Provider>
  );
};

export const useLayoutActionContext = () => {
  const context = useContext(LayoutActionContext);
  if (!context) throw new Error('INVALID_LayoutActionContext');

  return context;
};

export const useLayoutValueContext = () => {
  const context = useContext(LayoutValueContext);
  if (!context) throw new Error('INVALID_LayoutValueContext');

  return context;
};

export default LayoutProvider;

LayoutProvider.propTypes = {
  children: oneOfType([node, element]).isRequired,
};
