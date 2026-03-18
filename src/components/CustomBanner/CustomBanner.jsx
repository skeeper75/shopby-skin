import { useMemo, useState } from 'react';

import { oneOf, string } from 'prop-types';

import { Skeleton } from '@shopby/react-components';

const CustomBanner = ({ className, href, target, src, alt, width, height }) => {
  const [isLoading, setIsLoading] = useState(true);

  const imgStyle = useMemo(() => ({ visibility: isLoading ? 'hidden' : 'visible' }), [isLoading]);

  return (
    <>
      <Skeleton type="SQUARE" style={{ display: isLoading ? 'block' : 'none' }} />
      {href ? (
        <a className={className} href={href} rel="noreferrer" target={target}>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            width={width}
            height={height}
            style={imgStyle}
            onLoad={() => {
              setIsLoading(false);
            }}
          />
        </a>
      ) : (
        <img
          className={className}
          src={src}
          alt={alt}
          loading="lazy"
          width={width}
          height={height}
          style={imgStyle}
          onLoad={() => {
            setIsLoading(false);
          }}
        />
      )}
    </>
  );
};

export default CustomBanner;

CustomBanner.propTypes = {
  className: string,
  href: string,
  target: oneOf(['_blank', '_self']),
  src: string,
  alt: string,
  width: string,
  height: string,
};
