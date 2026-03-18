import { useOutletContext } from 'react-router-dom';

import { ProductSectionProvider } from '@shopby/react-components';

import { PageShell } from '../../components/Layout';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import MainContents from './MainContents';

const Main = () => {
  const platformType = useOutletContext();

  useLayoutChanger({ isMain: true, hasBottomNav: true });

  return (
    <PageShell maxWidth="7xl">
      <ProductSectionProvider>
        <MainContents platformType={platformType} />
      </ProductSectionProvider>
    </PageShell>
  );
};

export default Main;
