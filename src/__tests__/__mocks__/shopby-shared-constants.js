export const BOARD_PERMISSION_CONFIG_TYPE = {
  READ_PERMISSION: 'READ',
  WRITE_PERMISSION: 'WRITE',
};

export const API_TYPE = {
  SHOP: 'SHOP',
  STORAGE: 'STORAGE',
};

export const API_BASE_URL_MAP = {
  SHOP: { real: 'https://shop-api.test.com', alpha: 'https://shop-api-alpha.test.com' },
  STORAGE: { real: 'https://storage-api.test.com', alpha: 'https://storage-api-alpha.test.com' },
};

export const HTTP_REQUEST_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

export const AUTHORIZATION_HEADER = 'accessToken';
