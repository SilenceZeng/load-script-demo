import loadScript from 'awesome-load-script';

export const loadWxScript = () =>
  loadScript('https://res2.wx.qq.com/open/js/jweixin-1.6.0.js', {
    noRepeat: true,
    autoRemove: false,
    throwError: true,
    exposeGlobalName: 'wx',
    cleanGlobal: true,
  })
    .catch((error) => {
      console.log(error);
      return loadScript('/js/jweixin-1.6.0.js?', {
        noRepeat: true,
      });
    })
    .then((res) => {
      return res;
    });
