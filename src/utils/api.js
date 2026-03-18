import { apiCreator, PLATFORM_TYPE } from '@shopby/shared';
import { API_TYPE, API_BASE_URL_MAP, HTTP_REQUEST_METHOD, AUTHORIZATION_HEADER } from '@shopby/shared/constants';
import { memberAuth } from '@shopby/shared/utils';

import { getIsMobile } from './common';

let clientId = '';
let profile = 'real';
let tc = {};

const fetchEnvironment = async () => {
  const result = await fetch('/environment.json');
  const { clientId: _clientId, profile: _profile, tc: _tc } = await result.json();

  clientId = _clientId;
  profile = _profile;
  tc = _tc;
};

/**
 * shop sdk 에서 제공하는 api 사용을 위해 초기 세팅을 합니다.
 * @returns { clientId: string, profile: 'alpha' | 'real' }
 */
export const initializeShopApi = async ({ platform = getIsMobile() ? PLATFORM_TYPE.MOBILE_WEB : PLATFORM_TYPE.PC } = {}) => {
  if (!clientId) {
    await fetchEnvironment();
  }

  await apiCreator({
    baseURL: API_BASE_URL_MAP.SHOP[profile],
    storageURL: API_BASE_URL_MAP.STORAGE[profile],
    headerOption: {
      clientId,
      platform,
    },
    tokenConfig: {
      keepDefaultTokenTime: true,
    },
  });

  return { clientId, profile, tc };
};

const makeApiUrl = ({ isFormData, url, baseURL, query }) => {
  const urlMapKey = isFormData ? API_TYPE.STORAGE : API_TYPE.SHOP;
  const _baseUrl = baseURL ?? API_BASE_URL_MAP[urlMapKey][profile];

  const uri = new URL(`${_baseUrl}/${url}`);

  Object.entries(query).forEach(([key, value]) => {
    uri.searchParams.set(key, value);
  });

  return uri.toString();
};

const makeHeaderOption = (headers, isFormData, baseURL) => {
  const _headers = {
    'Content-Type': 'application/json',
    clientId,
    version: '1.0',
    platform: getIsMobile() ? PLATFORM_TYPE.MOBILE_WEB : PLATFORM_TYPE.PC,
    ...headers,
  };

  const accessToken = memberAuth.get();
  const urlMapKey = isFormData ? API_TYPE.STORAGE : API_TYPE.SHOP;
  const isShopApiRequest = baseURL === API_BASE_URL_MAP[urlMapKey][profile];

  if (accessToken && isShopApiRequest) {
    _headers[AUTHORIZATION_HEADER] = accessToken;
  }

  return _headers;
};

const makeRequestBody = ({ isFormData, request }) => {
  if (!isFormData && request?.requestBody) {
    request.body = JSON.stringify(request.requestBody);
  }

  return request;
};

const reRequestShopApi = async (uri, request) => {
  const response = await fetch(uri, request);

  const data = response?.url.includes('/kcp') ? await response.text() : await response.json()['catch'](() => null);

  return data;
};

const checkIsUnAuthorizedShopApi = (request, url, response) => {
  const accessToken = memberAuth.get();
  const isRenewAccessTokenRequest = request?.method === 'PUT' && url === 'oauth2';
  const isShopApiRequest = request?.baseURL === API_BASE_URL_MAP[API_TYPE.SHOP][profile];

  const isUnAuthorizedShopApiRequest =
    response.status === 401 && !isRenewAccessTokenRequest && accessToken && isShopApiRequest;

  return isUnAuthorizedShopApiRequest;
};

/**
 * fetch 를 사용해 shop api 를 호출할 수 있습니다.
 *
 * @param {string} url required shop-api url 을 입력하세요.
 * 예) `products/${상품번호}/product-reviews/${리뷰번호}`
 * @param {string} baseURL 워크스페이스에서 제공하는 shop api 이외 다른 api 를 호출할 때 baseURL 을 따로 설정할 수 있습니다.
 * 예) `https://external-api.test.com`
 * @param {GET | POST | PUT | DELETE | PATCH } method
 * shared/constants 에서 제공하는 HTTP_REQUEST_METHOD를 사용하세요.
 * @param {Object} query
 * @param {Object | FormData} requestBody
 * @param {Object} headers
 * @returns
 */
export const fetchHttpRequest = async ({
  url,
  baseURL,
  method = HTTP_REQUEST_METHOD.GET,
  query = {},
  requestBody = '',
  headers = {},
}) => {
  const isFormData = requestBody instanceof FormData;

  const uri = makeApiUrl({
    isFormData,
    url,
    baseURL,
    query,
  });

  const request = makeRequestBody({
    isFormData,
    request: {
      method,
      headers: makeHeaderOption(headers, baseURL),
      requestBody,
      baseURL: baseURL ?? API_BASE_URL_MAP.SHOP[profile],
    },
  });

  const response = await fetch(uri, request);

  if (response.status === 204) return null;

  const data = response?.url.includes('/kcp') ? await response.text() : await response.json()['catch'](() => null);

  const isUnAuthorizedShopApiRequest = checkIsUnAuthorizedShopApi(request, url, response);

  if (isUnAuthorizedShopApiRequest) {
    const data = await reRequestShopApi(uri, request);

    return data;
  }

  if (!response.ok) {
    throw data;
  }

  return data;
};
