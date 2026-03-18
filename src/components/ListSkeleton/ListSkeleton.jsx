import { number, node, oneOf, element, string, bool } from 'prop-types';

import { Skeleton } from '../ui';

// @MX:NOTE: Huni Skeleton으로 마이그레이션 (SPEC-SKIN-002)
const ListSkeleton = ({ size = 4, children, className, isLoading }) => {
  if (isLoading) {
    return (
      <div className={className}>
        {Array(size)
          .fill(null)
          .map((_, idx) => (
            <Skeleton key={idx} variant="card" className="h-16 w-full mb-2" />
          ))}
      </div>
    );
  }

  return children;
};

export default ListSkeleton;

ListSkeleton.propTypes = {
  className: string,
  size: number,
  children: oneOf([node, element]),
  isLoading: bool,
};
