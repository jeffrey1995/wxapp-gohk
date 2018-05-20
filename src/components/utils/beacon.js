import { mode, channel } from './constants';
import { request } from './wx';

const h2oApi = mode === 'prod' ? 'https://p.api.mucfc.com/h5.json' : 'https://st.p.api.cfcmu.cn/h5.json';

const sendEvent = (ec = '', ea = '', el = '', ev = '') => {
  const beaconData = {
    ca: [{
      tm: (new Date()).getTime(),
      ec,
      ea,
      el,
      ev
    }],
    le: 'UTF-8',
    ch: channel
  };
  return request({
    url: h2oApi,
    method: 'post',
    data: beaconData
  });
};

export default sendEvent;
