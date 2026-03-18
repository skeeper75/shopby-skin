import { number } from 'prop-types';

const WeightInformation = ({ productWeight }) => {
  if (!productWeight) return null;

  return (
    <dl className="product-summary__weight">
      <dt>
        <span className="ico ico--weight"></span>
      </dt>
      <dd className="product-summary__display-label">상품중량 {productWeight}kg</dd>
    </dl>
  );
};

WeightInformation.propTypes = {
  productWeight: number,
};

export default WeightInformation;
