import { sanitizeHTMLToNoTags, unescapeHTML } from '@shopby/shared';

import { META_TAG_KEY } from '../../constants/common';
import { getIsMobile } from '../../utils/common';

const META_PATTERN = /<meta\s+[^>]*\/?>/g;
const TITLE_PATTERN = /<title[^>]*>[^<]*<\/title>/g;

let pageScriptTitleTag = null;

const scheme = `${location.origin.split('://').at(0)}`;
const addScheme = (url) => (url ? `${scheme}:${url}` : '');

const metaTagCreatorMap = {
  [META_TAG_KEY.PRODUCT]: ({ imageUrls, unescapedProductName }) => ({
    type: 'product',
    title: unescapeHTML(sanitizeHTMLToNoTags(unescapedProductName)),
    image: addScheme(imageUrls?.at(0)),
    url: location.href,
  }),
  [META_TAG_KEY.COMMON]: ({ mallName, bannerMap }) => {
    const banner = bannerMap.get('LOGO') ?? {};
    return {
      type: 'website',
      title: mallName,
      image: addScheme(banner?.banners?.[0].bannerImages?.[0].imageUrl),
      url: location.origin,
    };
  },
  [META_TAG_KEY.EVENT]: ({ eventInfo, mallName, bannerMap }) => {
    const title = eventInfo?.label ? eventInfo.label : mallName;
    const imageUrl = getIsMobile() ? eventInfo?.mobileImageUrl : eventInfo?.pcImageUrl;
    const banner = bannerMap.get('LOGO') ?? {};

    return {
      type: 'product',
      title,
      image: imageUrl ? addScheme(imageUrl) : addScheme(banner?.banners?.[0].bannerImages?.[0].imageUrl),
      url: location.href,
    };
  },
};

const getMetaTagKey = ({ isProductDetailPage, isEventPage }) => {
  if (isProductDetailPage) {
    return META_TAG_KEY.PRODUCT;
  }

  if (isEventPage) {
    return META_TAG_KEY.EVENT;
  }

  return META_TAG_KEY.COMMON;
};

const createMetaTagBy = ({ product, mallName, url, bannerMap, eventInfo, isProductDetailPage, isEventPage } = {}) => {
  const metaTagKey = getMetaTagKey({
    isProductDetailPage,
    isEventPage,
  });

  return metaTagCreatorMap[metaTagKey]({
    ...product,
    mallName,
    bannerMap,
    url,
    eventInfo,
  });
};

const getMetaMap = ({ mallName, title, image, type, url, productDetail }) => {
  const metaMap = {
    author: {
      attr: 'name',
      content: mallName,
    },
    description: {
      attr: 'name',
      content: mallName,
    },
    keywords: {
      attr: 'name',
      content: mallName,
    },
    'twitter:card': {
      attr: 'name',
      content: 'summary',
    },
    'twitter:title': {
      attr: 'name',
      content: title,
    },
    'twitter:description': {
      attr: 'name',
      content: '여기를 눌러 링크를 확인하세요.',
    },
    'twitter:image': {
      attr: 'name',
      content: image,
    },
    'og:site_name': {
      attr: 'property',
      content: mallName,
    },
    'og:type': {
      attr: 'property',
      content: type,
    },
    'og:title': {
      attr: 'property',
      content: title,
    },
    'og:image': {
      attr: 'property',
      content: image,
    },
    'og:url': {
      attr: 'property',
      content: url,
    },
    'og:description': {
      attr: 'property',
      content: '여기를 눌러 링크를 확인하세요.',
    },
    'og:image:width': {
      attr: 'property',
      content: '436',
    },
    'og:image:height': {
      attr: 'property',
      content: '134',
    },
  };

  // 상품 상세페이지일 때 robots 메타태그 추가
  if (productDetail?.baseInfo?.urlDirectDisplayYn === 'Y') {
    metaMap.robots = {
      attr: 'name',
      content: 'noindex,nofollow',
    };
  }

  return metaMap;
};

const convertStrToTag = (str) => {
  const range = document.createRange();
  return range.createContextualFragment(str).children[0];
};

const getMetaTags = (pageScripts) =>
  pageScripts.reduce((acc, { pageType, content }) => {
    if (pageType !== 'COMMON_HEAD') {
      return acc;
    }

    const parsed = content.match(META_PATTERN)?.map(convertStrToTag) ?? [];
    pageScriptTitleTag = content.match(TITLE_PATTERN)?.map(convertStrToTag)?.at(0);

    return [...acc, ...parsed];
  }, []);

const getMetaAttributes = (metatags) =>
  metatags.flatMap((tag) => {
    const name = tag.getAttribute('name');
    const property = tag.getAttribute('property');

    return [name, property].filter(Boolean);
  });

const getAdminMetaAttributes = (pageScripts) => {
  if (!pageScripts?.length) {
    return [];
  }

  return getMetaAttributes(getMetaTags(pageScripts));
};

export const removedDuplicateMetas = ({
  productDetail,
  bannerMap,
  mallName,
  mallUrl,
  pageScripts,
  eventInfo,
  isProductDetailPage,
  isEventPage,
}) => {
  const customMetaInfo = createMetaTagBy({
    product: { ...productDetail?.baseInfo, unescapedProductName: productDetail?.unescapedProductName },
    bannerMap,
    mallName,
    url: mallUrl,
    isProductDetailPage,
    isEventPage,
    eventInfo,
  });

  const metaInfo = getMetaMap({
    ...customMetaInfo,
    mallName,
    eventInfo,
    productDetail,
  });

  const adminMetaAttributes = getAdminMetaAttributes(pageScripts);

  return {
    metas: Object.entries(metaInfo).reduce((acc, [value, { attr, ...info }]) => {
      if (!adminMetaAttributes.includes(value)) {
        acc.push({
          ...info,
          [attr]: value,
        });
      }

      return acc;
    }, []),
    titleContent: customMetaInfo.title,
  };
};

export const getPageScriptTitleTag = () => pageScriptTitleTag;
