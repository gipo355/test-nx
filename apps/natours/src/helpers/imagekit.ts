import ImageKit from 'imagekit';

import { Logger } from '../loggers';

const initImageKit = () => {
  const {
    NATOUR_IMAGEKIT_PUBLIC_KEY,
    NATOUR_IMAGEKIT_PRIVATE_KEY,
    NATOUR_IMAGEKIT_URL_ENDPOINT,
  } = process.env;

  if (
    !NATOUR_IMAGEKIT_PUBLIC_KEY ||
    !NATOUR_IMAGEKIT_PRIVATE_KEY ||
    !NATOUR_IMAGEKIT_URL_ENDPOINT
  ) {
    Logger.error('imagekit env vars not set correctly');
    return;
  }

  const imagekit = new ImageKit({
    publicKey: NATOUR_IMAGEKIT_PUBLIC_KEY,
    privateKey: NATOUR_IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: NATOUR_IMAGEKIT_URL_ENDPOINT,
  });

  Logger.info('imagekit initialized');

  return imagekit;
};

const imagekit = initImageKit();

export { imagekit };
