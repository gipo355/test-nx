import { WORKER_POOL_ENABLED } from '../config';
import { imagePoolProxy } from '../workers';
import type { ResizeOptions } from './imageManipulation';
// import { imagePoolProxy } from '../workers';
import { resizeImage } from './imageManipulation';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
// const autoResizeImage = await (WORKER_POOL_ENABLED === '1'
//   ? imagePoolProxy.resizeImageWorker
//   : resizeImage);
// BUG: worker not working
// const autoResizeImage = await imagePoolProxy;

/**
 * ## IMP: be careful about the return function and when it's called
 * the above wouldn't work
 */
// const autoResizeImage = () => imagePoolProxy.resizeImageWorker();
const autoResizeImage = async function autoResizeImage(
  buffer: Buffer,
  name: string,
  // resizeOptions?: Partial<ResizeOptions>
  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  resizeOptions: ResizeOptions = {
    width: 500,
    height: 500,
  }
  // { width = 500, height = 500, ...others }?: ResizeOptions // resizeOptions = { //   width: 500, //   height: 500, // } // { width = 500, height = 500, ...others }: { width?: number; height?: number } // {width = 500, height = 500}: ResizeOptions = { //   width: 500, //   height: 500, // } // { width = 500, height = 500, ...others }: Partial<ResizeOptions> // {width = 500, height = 500}: ResizeOptions = { //   width: 500, //   height: 500, // }
) {
  const { width, height, ...others } = resizeOptions;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const resizedImage = await (WORKER_POOL_ENABLED === '1'
    ? // ? imagePoolProxy.resizeImageWorker(buffer, name, resizeOptions)
      imagePoolProxy.resizeImageWorker(buffer, name, {
        width,
        height,
        ...others,
      })
    : // resizeImage(buffer, name, resizeOptions));
      resizeImage(buffer, name, { width, height, ...others }));

  return resizedImage;
};

export { autoResizeImage };
