/* eslint-disable node/no-missing-import */
import sharp from 'sharp';

import { Logger } from '../loggers';

export interface ResizeOptions {
  width: number;
  height: number;
  [resizeOptionName: string]: any;
}

const resizeImage = async function resizeImage(
  buffer: Buffer,
  name: string,
  // resizeOptions?: Partial<ResizeOptions>
  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  { width = 500, height = 500, ...others }: ResizeOptions = {
    width: 500,
    height: 500,
  }
  // resizeOptions: ResizeOptions = {
  //   width: 500,
  //   height: 500,
  // }
  // resizeOptions: Record<string, any>
  // { width = 500, height = 500, ...others }: { width?: number; height?: number }
  // { width = 500, height = 500, ...others }?: ResizeOptions // resizeOptions = { //   width: 500, //   height: 500, // }
) {
  Logger.info('hello from resizeImage');

  // const { width = 500, height = 500, ...others } = resizeOptions;
  // const { width, height, ...others } = resizeOptions;

  /**
   * ## cropping the image
   */
  const resizedImg = await sharp(buffer)
    // .resize({
    //   width: 500,
    //   height: 500,
    //   fit: sharp.fit.cover,
    // })
    .resize({
      fit: sharp.fit.cover,
      width,
      height,
      ...others,
    })
    /**
     * ## convert to jpeg
     */
    .toFormat('jpeg')
    /**
     * ## set quality
     */
    .jpeg({ quality: 90 })
    /**
     * ## save to file
     */
    .toFile(`public/img/${name}`);

  return resizedImg;
};

export { resizeImage };
