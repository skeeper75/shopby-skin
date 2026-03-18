import { OffCanvas } from '@shopby/react-components';

import CategoryNavLinks from './CategoryNavLinks';
import Cs from './Cs';
import FlagButtons from './FlagButtons';
import SignInButton from './SignInButton';

const CategoryNav = () => (
  <OffCanvas className="category-nav">
    <SignInButton />
    <CategoryNavLinks />
    <FlagButtons />
    <Cs />
  </OffCanvas>
);

export default CategoryNav;
