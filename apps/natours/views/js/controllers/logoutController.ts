import { renderAlertModule } from '../alert';
import { logout } from '../models/logout';
import { EL_LOGOUT_BUTTON } from '../utils/elements';

const logoutController = function logoutController() {
  if (!EL_LOGOUT_BUTTON) return;

  EL_LOGOUT_BUTTON.addEventListener('click', (element) => {
    element.preventDefault();
    // eslint-disable-next-line no-void
    void logout();
    renderAlertModule('success', 'Logged out successfully', document.body);
    window.setTimeout(() => {
      window.location.reload();
    }, 1500);
  });
};

export { logoutController };
