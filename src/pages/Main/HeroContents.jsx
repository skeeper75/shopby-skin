import { useEffect, useState } from 'react';

import { bool, oneOf, arrayOf, number, string, shape } from 'prop-types';

import CustomSlider from '../../components/CustomSlider/CustomSlider';

const setColor = (customVariable, color) => document.documentElement.style.setProperty(customVariable, color);

const HeroContents = ({ config, bannerImages, imageSize }) => {
  const [autoPlay, setAutoPlay] = useState(true);
  const [pagination, setPagination] = useState(false);
  const [navigation, setNavigation] = useState(false);
  const [slideOptions, setSlideOptions] = useState({
    effect: config?.slideEffectType.toLowerCase(),
    navigation,
    pagination,
    autoplay: autoPlay,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    fadeEffect: {
      crossFade: true,
    },
  });

  useEffect(() => {
    if (config?.slideEffectType) {
      setSlideOptions((prev) => ({
        ...prev,
        effect: config.slideEffectType.toLowerCase(),
      }));
    }

    if (config?.slideNavigationType !== 'VISIBLE') return;
    setPagination({
      theme: {
        inActive: '--swiper-theme-color',
        active: '--swiper-pagination-bullet-inactive-color',
      },
      el: '.swiper-pagination',
      clickable: true,

      renderBullet: (index, className) =>
        `<span class="${className} ${config.slideNavigationInfo?.buttonSizeType.toLowerCase()} ${config.slideNavigationInfo?.buttonBorderType.toLowerCase()}">
        </span>`,
    });
  }, [config]);

  useEffect(() => {
    if (!config?.slideTime) return;

    setAutoPlay({
      delay: config.slideTime * 1000 || 2500,
      disableOnInteraction: true,
    });
  }, []);

  useEffect(() => {
    if (!config?.usableSlideButton) return;

    setNavigation({
      prevEl: '.slide-prev',
      nextEl: '.slide-next',
    });
  }, []);

  useEffect(() => {
    setSlideOptions((prev) => ({ ...prev, pagination, navigation, autoplay: autoPlay }));

    if (pagination) {
      setColor(pagination.theme.inActive, config?.slideNavigationInfo?.activeButtonColor);
      setColor(pagination.theme.active, config?.slideNavigationInfo?.inactiveButtonColor);
    }

    if (navigation) {
      setColor('--swiper-navigation-color', config.slideButtonColor);
    }
  }, [pagination, navigation, autoPlay]);

  return (
    <article className="hero">
      <CustomSlider
        slideOption={slideOptions}
        bannerImages={bannerImages}
        width={imageSize.width}
        height={imageSize.height}
      />
      {config.usableSlideButton && (
        <>
          <button className="slide-prev swiper-button-prev"></button>
          <button className="slide-next swiper-button-next"></button>
        </>
      )}
    </article>
  );
};

export default HeroContents;

HeroContents.propTypes = {
  config: shape({
    slideEffectType: oneOf(['SLIDE', 'FADE']),
    slideNavigationType: string,
    slideSpeedType: string,
    slideTime: number,
    usableSlideButton: bool,
  }),
  imageSize: shape({
    width: string,
    height: string,
  }),
  bannerImages: arrayOf(
    shape({
      description: string,
      displayOrder: number,
      displayValue: shape({ displayPeriodType: string }),
      imageNo: number,
      imageUrl: string,
      landingUrl: string,
      openLocationType: oneOf(['NEW', 'SELF']),
    })
  ),
};
