// interface UserDataNameEmail {
//   name: string;
//   email: string;
// }
// interface UserDataPassword {
//   password: string;
//   newPasswordConfirm: string;
//   currentPassword: string;
// }
export interface UserDataNameEmail {
  name: string;
  email: string;
}
export interface UserDataPassword {
  newPassword: string;
  newPasswordConfirm: string;
  currentPassword: string;
}
export type UserData =
  | {
      type: 'data';
      // data: UserDataNameEmail;
      data: UserDataNameEmail | FormData;
    }
  | {
      type: 'password';
      data: UserDataPassword;
    };

/**
 * function to update either the password or the name and email fetching the API
 *
 * @async
 * @param userData - type of UserData
 * @returns {Promise<any>} returns the response from the api
 */
const updateSettingsQuery = async function updateSettingsQuery(
  // userData: UserDataNameEmail | UserDataPassword,
  // type: 'password' | 'data'
  userData: UserData
) {
  /**
   * ## NOTE: now to make a fetch with multipart/form-data we need to use FormData?
   */

  const res = await fetch(
    `/api/v1/users/update-${userData.type === 'password' ? 'password' : 'me'}`,
    {
      method: 'PATCH',
      // headers: {
      //   // 'Content-Type': 'application/json',
      //   'Content-Type':
      //     userData.type === 'password'
      //       ? 'application/json'
      //       : 'multipart/form-data',
      // },
      ...(userData.type === 'password' && {
        headers: { 'Content-Type': 'application/json' },
      }),
      // body: JSON.stringify(userData.data),
      body:
        userData.type === 'password'
          ? JSON.stringify(userData.data)
          : (userData.data as FormData),
    }
  );

  // if (!res.ok) throw new Error('There was an error, please try again!');

  // const data = await res.json();
  return res.json();
  // return data;

  /**
   * ## render the success
   * we want this in the controller
   */
  // renderAlertModule('success', `updated successfully!`, document.body);

  // how to rerender the page withot reloading without lit-html or react?
  // } catch (error) {
  //   // if (error instanceof Error) {
  //   //   renderAlertModule('error', error.message, document.body);
  //   // }
  //   throw error;
  // }
};

export { updateSettingsQuery };
