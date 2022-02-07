import loadScript from './dom';

export function loadWxScript(): Promise<typeof window.wx> {
  return new Promise((re) => {
    if (window.wx) {
      re(window.wx);
    } else {
      console.log('init');
      loadScript('https://res2.wx.qq.com/open/js/jweixin-1.6.0.js', {
        noRepeat: true,
        autoRemove: false,
        throwError: true,
        exposeGlobalName: 'wx',
        cleanGlobal: true,
      })
        .catch((error) => {
          console.log('error');
          console.log(error);
          return loadScript('/3rd/jweixin-1.4.0.js?_age=999999', {
            noRepeat: true,
          });
        })
        .then((res) => {
          console.log(res);
          console.log('1');
          re(window.wx);
        });
    }
  });
}
