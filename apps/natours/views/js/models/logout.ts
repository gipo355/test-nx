import { renderAlertModule } from '../alert';

const logout = async function logout() {
  try {
    const res = await fetch('/api/v1/users/logout', {
      method: 'GET',
    });
    if (!res.ok) {
      throw new Error('Could not log out!');
    }

    setTimeout(() => {
      window.location.assign('/');
    }, 1000);
  } catch (error: any) {
    renderAlertModule('error', error.message, document.body);
  }
};

export { logout };
