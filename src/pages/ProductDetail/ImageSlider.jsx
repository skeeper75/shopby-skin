import { useMemo } from 'react';

import {
  Slider,
  Slide,
  ThumbItem,
  useProductDetailStateContext,
  Skeleton,
  VisibleComponent,
} from '@shopby/react-components';

import { cn } from '../../lib/utils';

// 상품 이미지 슬라이더 (반응형 이미지 갤러리)
const ImageSlider = () => {
  const {
    productDetail: { baseInfo },
  } = useProductDetailStateContext();

  const images = baseInfo?.imageUrlInfo || [];

  const sliderConfig = useMemo(
    () => ({
      pagination: {
        clickable: true,
      },
      navigation: false,
      loop: false,
      slidesPerView: 'auto',
    }),
    [images]
  );

  return (
    <div className={cn('w-full overflow-hidden rounded-lg lg:sticky lg:top-4')}>
      <VisibleComponent
        shows={images.length > 0}
        TruthyComponent={
          <Slider className={cn('product-image-slider', 'aspect-square w-full')} {...sliderConfig}>
            {images.map((imageInfo, idx) => (
              <Slide key={idx}>
                <ThumbItem
                  className="thumb-DETAIL"
                  src={imageInfo?.url}
                  imageUrlType={imageInfo?.type}
                  iframeCover={false}
                  href={`/product-detail?productNo=${baseInfo?.productNo}`}
                  productNo={baseInfo?.productNo}
                  resize="500x500"
                />
              </Slide>
            ))}
          </Slider>
        }
        FalsyComponent={
          <div className="aspect-square w-full">
            <Skeleton type="SQUARE" />
          </div>
        }
      />
    </div>
  );
};

export default ImageSlider;
