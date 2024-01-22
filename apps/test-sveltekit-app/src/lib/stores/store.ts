// import { writable } from 'svelte/store';
// import { persisted } from 'svelte-persisted-store';

// import { browser } from '$app/environment';

// import { writable } from 'svelte/store';

// export const Store = writable();

console.log('store.ts, bad practice');

/**
 * TODO:
 *
 * !IMP: STORES MUST NOT BE PUT INSIDE GLOBAL VARIABLES
 * global variables are shared between all users and can leak state
 *
 * solutions to share a store between components:
 * 1: create a store in the handle and pass as local
 * 2: create a store in single component
 * 3: create a context in parent and set the store (recommended)
 * 4: create a store inside a load function
 * 5: $page.data
 *
 * the below way was fine when doing normal svelte without ssr.
 * with ssr introduced, the store is shared between all users
 */

// const defaultValue = 'summer';
// const initialValue = browser
//   ? window.localStorage.getItem('theme') ?? defaultValue
//   : defaultValue;

// export const Store = writable<string>(initialValue);

// Store.subscribe((value) => {
//   if (browser) {
//     window.localStorage.setItem('theme', value);
//   }
// });

// First param `preferences` is the local storage key.
// Second param is the initial value.
// export const preferences = persisted('preferences', {
//   theme: 'dark',
//   pane: '50%',
// });
// import { get } from 'svelte/store'
// import { preferences } from './stores'

// preferences.subscribe(...) // subscribe to changes
// preferences.update(...) // update value
// preferences.set(...) // set value
// get(preferences) // read value
// $preferences // read value with automatic subscription
