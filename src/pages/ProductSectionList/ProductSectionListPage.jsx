import { ProductSectionListProvider } from '@shopby/react-components';

import { PageShell } from '../../components/Layout';

import ProductSectionListWrap from './ProductSectionListWrap';

export const ProductSectionListPage = () => (
  <PageShell maxWidth="7xl">
    <ProductSectionListProvider>
      <ProductSectionListWrap />
    </ProductSectionListProvider>
  </PageShell>
);
