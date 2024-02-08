import { renderAlertModule } from './alert';
import { EL_LOGIN_BUTTON } from './utils/elements';

const loginModule = function loginModule() {
  /**
   * need to be more specific for the page
   */
  // const LOGIN_FORM = document.querySelector('.form');
  const LOGIN_FORM = document.querySelector('#login-form');
  // const LOGIN_FORM = document.getElementById('login-form')

  // console.log(LOGIN_FORM, typeof LOGIN_FORM)

  // Login function
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(`${data.message} (${res.status})`);

      return data;

      // console.log('try block');
      // console.log(data);
      // eslint-disable-next-line no-useless-catch
    } finally {
      // catch (error) {
      //   // console.log('catch block');
      //   // console.error(error);
      //   throw error;
      // }
      // console.log('finally block');
    }
  };

  /*
   * TODO:
   * BAD PRACTICE, NOT CLEAN CODE
   * this code is for a different page.
   * either make a sapearate chunk in webpack for this page or make a better conditional
   * reduce js loaded on landing page
   */
  if (LOGIN_FORM)
    LOGIN_FORM.addEventListener('submit', (event) => {
      void (async () => {
        try {
          /**
           * ## here we can render the spinner
           */
          event.preventDefault();

          if (EL_LOGIN_BUTTON) EL_LOGIN_BUTTON.textContent = 'Logging in...';

          const email = (document.querySelector('#email') as HTMLInputElement)
            .value;
          const password = (
            document.querySelector('#password') as HTMLInputElement
          ).value;

          const data = await login(email, password);

          if (data.status !== 'success') {
            throw new Error(data.message);
          }

          // alert('Logged in successfully!');

          /**
           * ## We now can do anything with the data we have
           * status: "success"
           * x-csrf-token: "b2f0d8e0-2b9e-4b9e-9b0a-9b0a9b0a9b0a"
           *
           * can render the text, redirect, render the error
           */

          // console.log(data);

          renderAlertModule('success', 'Logged in successfully', document.body);

          // console.log('logged in successfully');

          // console.log('try block event listener');
          setTimeout(() => {
            // window.location = '/';
            // or
            // window.location.assign('/');
            // or go back in history
            window.location.assign('/me');
          }, 3000);
        } catch (error: any) {
          /**
           * ## here we can render the error
           */
          renderAlertModule('error', error.message, document.body);
          // console.error(error);
          // throw new Error(error)
        } finally {
          /**
           * ## here we remove the spinner
           */
          // console.log('finally block event listener');

          /**
           * ## remember this and event.target point to the same element
           */
          (event.target as HTMLFormElement).reset();
        }
      })();
    });
};

export { loginModule };
