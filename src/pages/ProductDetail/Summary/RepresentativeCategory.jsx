import { array } from 'prop-types';

const RepresentativeCategory = ({ categories }) => {
  const representativeCategory = categories?.find(({ representativeYn }) => representativeYn === 'Y');

  if (!representativeCategory) return null;

  const { categories: representativeCategories } = representativeCategory;

  return (
    <div className="product-summary__main-category">
      {representativeCategories.map(({ label, categoryNo, depth }, index) => (
        <>
          <a href={`/products?categoryNo=${categoryNo}&depth=${depth}`} key={categoryNo}>
            {label}
          </a>
          {representativeCategories.length - 1 !== index && <span>&gt;</span>}
        </>
      ))}
    </div>
  );
};

RepresentativeCategory.propTypes = {
  categories: array,
};

export default RepresentativeCategory;
