import { useOutletContext } from 'react-router-dom';

import { ProductSectionProvider } from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';

import MainContents from './MainContents';

const Main = () => {
  const platformType = useOutletContext();

  useLayoutChanger({ isMain: true, hasBottomNav: true });

  return (
    <ProductSectionProvider>
      <MainContents platformType={platformType} />
    </ProductSectionProvider>
  );
};

export default Main;
