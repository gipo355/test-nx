import { EL_ERROR } from '../utils/elements';

const errorController = async function errorHandler() {
  if (EL_ERROR) {
    const redirectTo = async (path: string) =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          window.location.assign(path);
          resolve();
        }, 1500);
      });

    const pageCases: Record<string, () => any> = {
      '/me': async () => redirectTo('/login'),
    };

    const page = window.location.pathname;

    if (!Object.keys(pageCases).includes(page)) return;

    // eslint-disable-next-line security/detect-object-injection -- input type is controlled
    await pageCases[page]();
  }
};

export { errorController };
