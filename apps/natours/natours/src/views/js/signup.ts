import { renderAlertModule } from './alert';
import { EL_SIGNUP_FORM } from './utils/elements';

const signUpModule = function signUpModule() {
  if (!EL_SIGNUP_FORM) return;
  EL_SIGNUP_FORM?.addEventListener('submit', (event) => {
    void (async () => {
      try {
        event.preventDefault();

        const name = (document.querySelector('#name') as HTMLInputElement)
          .value;
        const email = (document.querySelector('#email') as HTMLInputElement)
          .value;
        const password = (
          document.querySelector('#password') as HTMLInputElement
        ).value;
        const passwordConfirm = (
          document.querySelector('#password-confirm') as HTMLInputElement
        ).value;

        /**
         * ## WE CAN'T USER FORMDATA WITHOUT USING MULTER
         * SENDING FORMDATA MEANS USING ENCYPE: MULTIPART/FORM-DATA
         * which can't be parsed by express.urlencoded({ extended: true })
         * and requires instead multer middleware
         *
         * we could manually create a urlencoded string if we wanted urlencoded
         * middleware to work
         */
        // const urlencoded = new URLSearchParams();
        // urlencoded.append('name', name);
        // urlencoded.append('email', email);
        // urlencoded.append('password', password);
        // urlencoded.append('passwordConfirm', passwordConfirm);
        // const response = await fetch('/api/v1/users/signup', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     body: urlencoded,
        //
        // });

        const response = await fetch('/api/v1/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            passwordConfirm,
          }),
        });

        const data = await response.json();

        if (data.status !== 'success') throw new Error(data.message);

        renderAlertModule('success', data.message, document.body, 10);

        // setTimeout(() => {
        //     window.location.assign('/me');
        // }, 1500);
      } catch (error) {
        if (error instanceof Error)
          renderAlertModule('error', error.message, document.body);
      }
    })();
  });
};

export { signUpModule };
