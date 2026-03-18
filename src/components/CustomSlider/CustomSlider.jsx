import { oneOf, number, string, object, arrayOf, shape } from 'prop-types';

import { Slide, Slider } from '@shopby/react-components';
import { getUrlWithAdditionalSearchParams } from '@shopby/shared/utils';

import CustomBanner from '../../components/CustomBanner';

const DefaultSliderOption = {
  effect: 'slide', // 'slide' | 'fade'
  navigation: false,
  pagination: false,
  autoplay: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  loop: true,
  fadeEffect: {
    crossFade: true,
  },
};

const CustomSlider = ({ slideOption = {}, bannerImages = [], width = 'auto', height = 'auto' }) => {
  if (!bannerImages.length) return <></>;

  return (
    <>
      <Slider {...DefaultSliderOption} {...slideOption}>
        {bannerImages.map(({ description, imageNo, imageUrl, landingUrl, openLocationType }) => (
          <Slide key={imageNo}>
            <CustomBanner
              href={landingUrl}
              target={openLocationType === 'NEW' ? '_blank' : '_self'}
              src={getUrlWithAdditionalSearchParams({ url: imageUrl, additionalSearchParams: '500x500' })}
              alt={description}
              width={width}
              height={height}
            />
          </Slide>
        ))}
        <div className="swiper-pagination"></div>
      </Slider>
    </>
  );
};

export default CustomSlider;

CustomSlider.propTypes = {
  slideOption: object,
  bannerImages: arrayOf(
    shape({
      description: string,
      imageNo: number,
      imageUrl: string,
      landingUrl: string,
      openLocationType: oneOf(['NEW', 'SELF']),
    })
  ),
  width: string,
  height: string,
};
