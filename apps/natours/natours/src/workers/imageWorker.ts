import { worker } from 'workerpool';

import { resizeImage } from '../helpers/imageManipulation';
import { Logger } from '../loggers';

const resizeImageWorker = async (
  buffer: Buffer,
  name: string,
  resizeOptions: any
) => {
  Logger.info('resizeImageWorker');
  await resizeImage(buffer, name, resizeOptions);
};

worker({
  resizeImageWorker,
});
