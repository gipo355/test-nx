import '../css/style.css';
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-import
import '@stripe/stripe-js'; // import in root to avoid tree shaking

import { renderAlertModule } from './alert';
import { errorController } from './controllers/errorHandler';
import { logoutController } from './controllers/logoutController';
import { stripeController } from './controllers/stripeController';
import { updateSettingsController } from './controllers/updateSettingsController';
import { loginModule } from './login';
import { mapboxModule } from './mapbox';
import { setRatingsModule } from './setRatings';
import { signUpModule } from './signup';

/**
 * ## we should separete business logic from views and controllers
 * the controller should fetch the data from the html
 * business logic should fetch data from backend
 * views should render the html ( components )
 */

const main = async function main() {
  const alertMessage = (document.querySelector('body') as HTMLElement).dataset
    .alert;
  if (alertMessage) {
    /**
     * ## remove query string from url
     */
    const url = window.location.href.split('?')[0];
    // eslint-disable-next-line unicorn/no-null
    window.history.replaceState(null, '', url);
    renderAlertModule(
      'success',
      alertMessage,
      document.querySelector('body') as HTMLElement,
      8
    );
    // remove query string from url
    // window.history.pushState(null, '', '/');
    // console.log(window.location.href);
  }
  loginModule();
  signUpModule();
  mapboxModule();
  setRatingsModule();
  logoutController();
  updateSettingsController();
  await errorController();
  stripeController();
};

// eslint-disable-next-line unicorn/prefer-top-level-await
void main().catch();

// main().catch((error) => {
//     console.error(error);
// });
