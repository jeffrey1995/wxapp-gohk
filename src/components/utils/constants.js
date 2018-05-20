
/* global _WEBPACK_API_DOMAIN _WEBPACK_URL_DOMAIN _WEBPACK_URL_DOMAIN
_WEBPACK_BUILD_MODE _WEBPACK_CHANNEL _WEBPACK_APPID */
export const mode = _WEBPACK_BUILD_MODE;
export const apiHost = _WEBPACK_API_DOMAIN;
export const urlDomain = _WEBPACK_URL_DOMAIN;
export const cfgDomain = _WEBPACK_URL_DOMAIN.replace('m-zl', 'cfg');
export const channel = _WEBPACK_CHANNEL;
export const appid = _WEBPACK_APPID;
export const mApiHost = {
  weather: 'https://www.sojson.com/',
  rate: 'https://sapi.k780.com/'
};
