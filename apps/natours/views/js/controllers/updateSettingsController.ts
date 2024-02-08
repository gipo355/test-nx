/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { renderAlertModule } from '../alert';
import type {
  UserData,
  // UserDataNameEmail,
  // UserDataPassword,
} from '../models/updateSettingsModel';
import { updateSettingsQuery } from '../models/updateSettingsModel';
import {
  EL_UPDATE_PASSWORD_FORM,
  EL_UPDATE_SETTINGS_FORM,
  EL_USER_VIEW_CONTENT,
} from '../utils/elements';

/**
 * ## this should be in the view without the direct function call but with the callback instead
 * because it renders the alert
 */
const updateAndRenderSettings = async function updateSettings(
  // type,
  // data,
  userData: UserData
) {
  try {
    // if (!name || !email) throw new Error('Please provide name and email!');
    /**
     * ## get the data from the element on submit
     */
    // const userData = {
    //   name: 'Jonas',
    //   email: 'ciao',
    // };
    /**
     * ## make the request to the api
     */
    // const response = await updateSettingsQuery({
    //   type,
    //   data,
    // });
    const response = await updateSettingsQuery(userData);
    // console.log(res);
    // const response = await res;

    if (response.status !== 'success') throw new Error(response.message);

    /**
     * ## render the success
     */
    renderAlertModule(
      'success',
      `updated ${userData.type} successfully!`,
      document.body
    );

    // create a fibonacci sequence that logs to console the last number
    // const fibonacci = function (n: number): number {
    //   if (n <= 1) return 1;
    //   return fibonacci(n - 1) + fibonacci(n - 2);
    // };
    // console.log(fibonacci(40), 'fibonacci');
  } catch (error) {
    if (error instanceof Error) {
      renderAlertModule('error', error.message, document.body);
    }
  }
};

const updateSettingsController = function updateSettingsController() {
  if (!EL_UPDATE_SETTINGS_FORM || !EL_UPDATE_PASSWORD_FORM) return;

  /**
   * ## using event delegation
   */
  EL_USER_VIEW_CONTENT?.addEventListener('click', (event) => {
    (async () => {
      /**
       * ## CAN'T PREVENT DEFAULT HERE, FILE PICKER WON'T WORK
       */
      // event.preventDefault();

      /**
       * ## Listener on update password
       * BUG: this will log out the user because the token is not valid anymore
       * TODO: prevent the log out, sanitize the input
       */
      if (
        (event.target as HTMLElement)
          .closest('button')
          ?.classList.contains('btn--save-password')
      ) {
        event.preventDefault();

        // eslint-disable-next-line no-param-reassign
        (event.target as HTMLElement).closest('button')!.textContent =
          'updating...';
        const currentPassword = (
          document.querySelector('#password-current') as HTMLInputElement
        ).value;
        const newPassword = (
          document.querySelector('#password') as HTMLInputElement
        ).value;
        const newPasswordConfirm = (
          document.querySelector('#password-confirm') as HTMLInputElement
        ).value;

        await updateAndRenderSettings({
          type: 'password',
          data: { newPassword, newPasswordConfirm, currentPassword },
        });
        // eslint-disable-next-line no-param-reassign
        (event.target as HTMLElement).closest('button')!.textContent =
          'Save Password';

        /**
         * ## reset the form
         */
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        // (event.target as HTMLFormElement)?.closest('form')?.reset();
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        // (document.activeElement as HTMLElement)?.blur();
        // setTimeout(() => {
        return window.location.reload();
        // }, 1000);
      }

      /**
       * ## forcing the file picker to show
       */

      // let photos: undefined | FileList | null;

      // function importData() {
      //   const input = document.createElement('input');
      //   input.type = 'file';
      //   input.addEventListener('change', (_) => {
      //     // you can use this method to get file and perform respective operations
      //     // const files = [...input.files];
      //     photos = input.files;
      //     /**
      //      * ## add file to the form
      //      */
      //     // if (photos && photos.length > 0)
      //     //   form.append('photo', photos.item(0) as File);
      //   });

      //   input.click();
      // }

      // const importPhotoButton = document.querySelector(
      //   'label[for="photo"]'
      // ) as HTMLInputElement;

      // if (
      //   (event.target as HTMLElement)
      //     .closest('label')
      //     ?.classList.contains('import-photo-label')
      // )
      //   importData();

      /**
       * ## listener on update settings
       */

      if (
        (event.target as HTMLElement)
          .closest('button')
          ?.classList.contains('btn--save-settings')
      ) {
        event.preventDefault();

        // eslint-disable-next-line no-param-reassign
        (event.target as HTMLElement).closest('button')!.textContent =
          'updating...';

        /**
         * ## we need to send the form data as a multipart form data
         * updating the fields selector to include the picture
         */
        // const form = new FormData(
        //   document.querySelector('.form-user-data') as HTMLFormElement
        // );
        const form = new FormData();

        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        const name = (document.querySelector('#name') as HTMLInputElement)
          .value;
        // // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        const email = (document.querySelector('#email') as HTMLInputElement)
          .value;

        /**
         * ## forced file picker above
         */
        const photos = (document.querySelector('#photo') as HTMLInputElement)
          .files;

        form.append('name', name);

        form.append('email', email);

        // form.append('photo', photos?.item(0) as File);

        if (photos && photos.length > 0)
          form.append('photo', photos.item(0) as File);

        /**
         * ## we need async to make sure the cookie is sent back before the page reloads
         */
        // console.log('update settings');
        void updateAndRenderSettings({
          type: 'data',
          // data: { name, email },
          data: form,
        });
        // console.log('post update settings');

        // eslint-disable-next-line no-param-reassign
        (event.target as HTMLElement).closest('button')!.textContent =
          'Save settings';

        /**
         * ## WRONG: we need to rerender, not reset. the reset enters the previous value (unchanged data)
         */

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        // (event.target as HTMLFormElement)?.closest('form')?.reset();
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        // (document.activeElement as HTMLElement)?.blur();
        setTimeout(
          () =>
            // return console.log('reload');
            window.location.reload(),
          1000
        );
      }
    })().catch(() => {});
  });

  // global timeout

  // EL_UPDATE_SETTINGS_FORM.addEventListener('submit', (event) => {
  //   event.preventDefault();

  //   // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  //   const name = (document.querySelector('#name') as HTMLInputElement).value;
  //   // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  //   const email = (document.querySelector('#email') as HTMLInputElement).value;

  //   // eslint-disable-next-line no-void
  //   void updateAndRenderSettings({ type: 'data', data: { name, email } });

  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 1000);
  // });

  // EL_UPDATE_PASSWORD_FORM.addEventListener('submit', (event) => {
  //   event.preventDefault();

  //   const currentPassword = (
  //     document.querySelector('#password-current') as HTMLInputElement
  //   ).value;
  //   const newPassword = (
  //     document.querySelector('#password') as HTMLInputElement
  //   ).value;
  //   const newPasswordConfirm = (
  //     document.querySelector('#password-confirm') as HTMLInputElement
  //   ).value;

  //   // eslint-disable-next-line no-void
  //   void updateAndRenderSettings({
  //     type: 'password',
  //     data: { newPassword, newPasswordConfirm, currentPassword },
  //   });

  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 1000);
  // });
};

export { updateSettingsController };
