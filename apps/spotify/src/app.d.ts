// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import 'unplugin-icons/types/svelte';

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface LayoutData {
    //   user: SpotifyApi.CurrentUsersProfileResponse;
    //   // user: object | null;
    // }
    interface PageData {
      user: SpotifyApi.CurrentUsersProfileResponse;
      // user: object | null;
    }
    // interface Platform {}
  }
}

export {};
