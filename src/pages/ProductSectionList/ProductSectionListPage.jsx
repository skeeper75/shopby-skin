import { ProductSectionListProvider } from '@shopby/react-components';

import ProductSectionListWrap from './ProductSectionListWrap';

export const ProductSectionListPage = () => (
  <ProductSectionListProvider>
    <ProductSectionListWrap />
  </ProductSectionListProvider>
);
